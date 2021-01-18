#!/bin/bash

# get vars from config file
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../config/.env.production"

# checkout repo
cd "${MASTER_DIR}/webapp/"
git checkout master
git pull

# get npm packages
echo 'npm start'
npm install
npm audit fix

# pm2 setup
pm2 delete webapp
pm2 start npm --name webapp -- start

# update pm2 startup script to ensure apps are restarted after a reboot
pm2 save
pm2 unstartup
pm2 startup