#!/bin/sh

mkdir -p /var/www/html/projects/staging/webapp-ws20-projects/branch
cd /var/www/html/projects/staging/webapp-ws20-projects/branch

if [ ! -d '/var/www/html/projects/staging/webapp-ws20-projects/branch/webapp/.git' ]
then
    git clone 'https://github.com/SnickersVsMars/webapp-ws20-projects.git' '/var/www/html/projects/staging/webapp-ws20-projects/branch/webapp/'
else
    cd '/var/www/html/projects/staging/webapp-ws20-projects/branch/webapp/'
    git pull 'https://github.com/SnickersVsMars/webapp-ws20-projects.git'
fi

cd '/var/www/html/projects/staging/webapp-ws20-projects/branch/webapp/'
git checkout ci
git pull