#!/bin/sh
MYUSER="user" MYPASS="IleXTrUegYPhopECTAL" MYDB="hosting" route="/${1}" branch=$1
STAGING_MASTER_DIR="/var/www/html/projects/staging/webapp-ws20-projects/"
GIT_PATH="https://github.com/SnickersVsMars/webapp-ws20-projects.git"
echo $route
echo $branch

port=$(mysql -D$MYDB -u$MYUSER -p$MYPASS -se "SELECT port FROM HostingTable WHERE route ='${route}'")

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
echo $port

mkdir -p "${STAGING_MASTER_DIR}/${branch}"
cd "${STAGING_MASTER_DIR}/${branch}"

if [ ! -d "${STAGING_MASTER_DIR}/${branch}/webapp/.git" ]
then
	echo 'clone'
    git clone $GIT_PATH "${STAGING_MASTER_DIR}/${branch}/webapp/"
else
	echo 'pull'
    cd "${STAGING_MASTER_DIR}/${branch}/webapp/"
    git pull $GIT_PATH
fi

echo 'switch branch'
cd "${STAGING_MASTER_DIR}/${branch}/webapp/"
git checkout $branch
git pull

echo 'npm start'
npm install
npm audit fix
pm2 delete $branch
PORT=$port pm2 start npm --name $branch -- start
