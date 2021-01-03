#!/bin/sh
MYUSER="user" MYPASS="IleXTrUegYPhopECTAL" MYDB="hosting" route="/${1}" branch=$1
echo route
echo branch

port=$(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "SELECT port FROM HostingTable WHERE route ='${route}'")

if  [ -z $port -o $port = "NULL" ] #port is not set
then
	port=$(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "SELECT MAX(port)+1 FROM HostingTable")
	if  [ -z $port -o $port = "NULL" ] #port is not set
	then
		port=3001
	fi	
	$(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "INSERT INTO HostingTable VALUES('${route}',$port,now())")	
else
fi


mkdir -p "/var/www/html/projects/staging/webapp-ws20-projects/${branch}"
cd "/var/www/html/projects/staging/webapp-ws20-projects/${branch}"

if [ ! -d "/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/.git" ]
then
    git clone 'https://github.com/SnickersVsMars/webapp-ws20-projects.git' '/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/'
else
    cd "/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/"
    git pull 'https://github.com/SnickersVsMars/webapp-ws20-projects.git'
fi

cd "/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/"
git checkout ci
git pull

npm install
PORT=$port npm start 