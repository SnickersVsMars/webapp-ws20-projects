#!/bin/bash

# get vars from config file
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../config/.env.production"

# branchname for usage with git operations
branch=$1

# branchname without Jira prefix (if one is being used) for file operations
# if no prefix exists, trimmed_branch and branch are equal
trimmed_branch=$branch

# use regex comparison to remove Jira prefix (WAD-xx_branchname)
if [[ $branch =~ ^WAD\d* ]]; then
    # Jira prefix always ends with _
    substr="_"
    trimmed_branch=${t#*$substr}; echo $rest;
fi

route="/${trimmed_branch}"

# get port from the hosting table
port=$(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "SELECT port FROM HostingTable WHERE route ='${route}'")

# check whether the branch was already hosted or if a new entry needs to be added to the hosting table
if  [ -z "$port" -o "$port" = "NULL" ]
then
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
if [ ! -d "${STAGING_MASTER_DIR}/${trimmed_branch}/webapp/.git" ]
then
	echo 'clone'
    git clone $GIT_PATH "${STAGING_MASTER_DIR}/${branch}/webapp/"
else
	echo 'pull'
    cd "${STAGING_MASTER_DIR}/${branch}/webapp/"
    git pull $GIT_PATH
fi

echo 'switch branch'
cd "${STAGING_MASTER_DIR}/${trimmed_branch}/webapp/"
git checkout $branch
git pull

echo 'npm start'
# get npm packages
npm install
npm audit fix

# pm2 setup
pm2 delete $branch
PORT=$port pm2 start npm --name $branch -- start

# update pm2 startup script to ensure apps are restarted after a reboot
pm2 save
pm2 unstartup
pm2 startup