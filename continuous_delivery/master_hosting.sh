#!/bin/sh
MASTER_DIR="/var/www/html/projects/webapp-ws20-projects/"
GIT_PATH="https://github.com/SnickersVsMars/webapp-ws20-projects.git"

cd "${MASTER_DIR}/webapp/"
git checkout master
git pull

echo 'npm start'
npm install
npm audit fix
pm2 delete webapp
pm2 start npm --name webapp -- start
