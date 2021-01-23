#!/bin/bash

# get vars from config file
source /var/config/.env.ci

# branchname for usage with git operations
branch=$1

# branchname without Jira prefix (if one is being used) for file operations
# if no prefix exists, trimmed_branch and branch are equal
trimmed_branch=$branch

# use regex comparison to remove Jira prefix (WAD-xx_branchname)
if [[ $branch =~ ^WAD\d* ]]; then
    # Jira prefix always ends with _
    substr="_"
    trimmed_branch=${branch#*$substr}; echo $rest;
fi

route="/${trimmed_branch}"

# get port from the hosting table
port=$(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "SELECT port FROM HostingTable WHERE route ='${route}'")

# check whether the branch was already hosted or if a new entry needs to be added to the hosting table
if  [ -z "$port" -o "$port" = "NULL" ]; then
    port=$(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "SELECT MAX(port)+1 FROM HostingTable")
    if  [ -z "$port" -o "$port" = "NULL" ]
    then
        echo 'default port'
        port=3001
    fi
    echo 'insert port into routing table'
    $(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "INSERT INTO HostingTable VALUES('${route}',$port,now())")
fi

# create file structure for the staging repo
mkdir -p "${STAGING_MASTER_DIR}/${trimmed_branch}"
cd "${STAGING_MASTER_DIR}/${trimmed_branch}"

# check if a new branch is being hosted and the repo needs to be cloned
# or if a new version needs to be pulled from an existing branch
if [ ! -d "${STAGING_MASTER_DIR}/${trimmed_branch}/.git" ]; then
    echo 'clone'
    git clone $GIT_PATH "${STAGING_MASTER_DIR}/${trimmed_branch}/"
    cd "${STAGING_MASTER_DIR}/${trimmed_branch}/"
    git checkout $branch
    git pull
else
    echo 'switch branch and pull'
    cd "${STAGING_MASTER_DIR}/${trimmed_branch}/"
    git checkout $branch
    # clean up local changes
    git fetch origin
    git reset --hard origin/$branch
    git clean -fd
    git pull
fi

# copy the config file needed to run the webapp
cp /var/config/default.json "${STAGING_MASTER_DIR}/${trimmed_branch}/config/"

# change db name in sql scripts
sed -i "s/--DB-NAME--/webapp_${trimmed_branch}/g" "${STAGING_MASTER_DIR}/${trimmed_branch}/db-scripts/database-create.sql"
sed -i "s/--DB-NAME--/webapp_${trimmed_branch}/g" "${STAGING_MASTER_DIR}/${trimmed_branch}/db-scripts/database-populate.sql"
# change db name in app settings
sed -i "s/--DB-NAME--/webapp_${trimmed_branch}/g" "${STAGING_MASTER_DIR}/${trimmed_branch}/config/default.json"
# create and populate database for the tests
$(mysql -u$MYUSER -p$MYPASS < "${STAGING_MASTER_DIR}/${trimmed_branch}/db-scripts/database-create.sql")

# get npm packages
echo 'npm start'
npm install
npm audit fix

# run tests
# run webapp locally on port 8080 for tests
# it is registered with pm2 so it can be stopped later
PORT=8080 pm2 start npm --name cypress -- start
npm run test:record
test_result=$?

pm2 delete cypress

failed_test="false"

# return code = 0 => all tests passed
# return code != 0 => at least one test failed
if [ $test_result -ne 0 ]; then
  echo 'tests failed'
  failed_test="true"
  # for hosting a staging branch, the hosting process
  # is not cancelled, the user should rather check what
  # failed during the tests on github actions
fi

if [ $failed_test = "false" ]; then
  echo 'deleting test videos and screenshots'
  # all tests passed, cypress videos and screenshots can be deleted
  rm -r "${STAGING_MASTER_DIR}/${trimmed_branch}/cypress/screenshots" "${STAGING_MASTER_DIR}/${trimmed_branch}/cypress/videos"
fi

# remove test data from data base and populate with base data
$(mysql -u$MYUSER -p$MYPASS < "${STAGING_MASTER_DIR}/${trimmed_branch}/db-scripts/database-create.sql")

# pm2 setup
pm2 delete $trimmed_branch
PORT=$port pm2 start npm --name $trimmed_branch -- start

# update pm2 startup script to ensure apps are restarted after a reboot
pm2 save
pm2 unstartup
pm2 startup

# name of the person that started the workflow, either
# by pushing or manually
mail_recipient=$2

# see if there was an email address provided by the github
# workflow, if yes use that, otherwise keep the name of the
# person that started the workflow
if [ ! -z $3 ]; then
    mail_recipient=$3
fi

# notfiy commit creator
# note: we have to use pyhton3 here since bash does not pick up on the python alias
# params: branch, route, is_deploy, failed_test, recipient
python3 ${MAIL_CLIENT} $branch $route false $failed_test $mail_recipient 
