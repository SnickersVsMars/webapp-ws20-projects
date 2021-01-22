#!/bin/bash

# get vars from config file
source /var/config/.env.ci

# checkout repo
cd "${MASTER_DIR}"
git checkout master
git fetch origin
git reset --hard origin/master
git pull

# get npm packages
echo 'npm start'
npm install
npm audit fix

# copy the config file needed to run the webapp
cp /var/config/default.json "${MASTER_DIR}/config/"

# pm2 setup
pm2 delete live
pm2 start npm --name live -- start

# update pm2 startup script to ensure apps are restarted after a reboot
pm2 save
pm2 unstartup
pm2 startup

# notfiy commit creator
# note: we have to use pyhton3 here since bash does not pick up on the python alias
# params: branch, route, is_deploy
python3 ${MAIL_CLIENT} "master" "/" true
