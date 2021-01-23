#!/bin/bash

# get vars from config file
source /var/config/.env.ci

# checkout repo
cd "${MASTER_DIR}"
git checkout master
git fetch origin
git reset --hard origin/master
git pull

# copy the config file needed to run the webapp
cp /var/config/default.json "${MASTER_DIR}/config/"

# change db name in app settings to testing db
sed -i "s/--DB-NAME--/webapp_unit/g" "${MASTER_DIR}/config/default.json" 

# get npm packages
echo 'npm start'
npm install
npm audit fix

# run tests
# run webapp locally on port 8080 for tests
# it is registered with pm2 so it can be stopped later
PORT=8080 pm2 start npm --name ci-automatic-test -- start
npm run test:ci
test_result=$?

# stop testing server after running the tests
pm2 delete ci-automatic-test

# change db name in app settings to production db after running the tests
sed -i "s/webapp_unit/webapp_prod/g" "${MASTER_DIR}/config/default.json" 

failed_test="false"

# return code = 0 => all tests passed
# return code != 0 => at least one test failed
if [ $test_result -ne 0 ]; then
  echo 'tests failed, exiting the script'
  failed_test="true"
  # send mail with test failed info
  python3 ${MAIL_CLIENT} "master" "/" true $failed_test
  exit 1
fi

# all tests passed, cypress videos and screenshots can be deleted
rm -r "${MASTER_DIR}/cypress/screenshots" "${MASTER_DIR}/cypress/videos"

# pm2 delete
pm2 delete live

# clear live folder and move new data
mkdir -p ../live
rm -rf ../live/
cp -va ./. ../live/

# change to live folder
cd ../live


# pm2 setup
pm2 start npm --name live -- start

# update pm2 startup script to ensure apps are restarted after a reboot
pm2 save
pm2 unstartup
pm2 startup

# notfiy the project contributors on their github mails
# note: we have to use pyhton3 here since bash does not pick up on the python alias
# since the script is exited on failed tests, it's safe to tell the mail client
# that all tests passed
# params: branch, route, is_deploy, failed_test
python3 ${MAIL_CLIENT} "master" "/" true false
