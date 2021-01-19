#!/bin/bash

# get vars from config file
source /var/config/.env.ci

# checkout repo
cd "${MASTER_DIR}"
git checkout master
git pull

# get npm packages
echo 'npm start'
npm install
npm audit fix

# copy the config file needed to run the webapp
cp /var/config/default.json "${MASTER_DIR}/config/"

# pm2 setup
pm2 delete webapp
pm2 start npm --name live -- start

# update pm2 startup script to ensure apps are restarted after a reboot
pm2 save
pm2 unstartup
pm2 startup
