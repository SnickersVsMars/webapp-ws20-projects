#!/bin/sh
MYUSER="user" MYPASS="IleXTrUegYPhopECTAL" MYDB="hosting" route="/${1}" branch=$1
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

mkdir -p "/var/www/html/projects/staging/webapp-ws20-projects/${branch}"
cd "/var/www/html/projects/staging/webapp-ws20-projects/${branch}"

if [ ! -d "/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/.git" ]
then
	echo 'clone'
    git clone "https://github.com/SnickersVsMars/webapp-ws20-projects.git" "/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/"
else
	echo 'pull'
    cd "/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/"
    git pull 'https://github.com/SnickersVsMars/webapp-ws20-projects.git'
fi

echo 'switch branch'
cd "/var/www/html/projects/staging/webapp-ws20-projects/${branch}/webapp/"
git checkout ci
git pull

echo 'npm start'
npm install
pm2 delete $branch
PORT=$port pm2 start npm --name $branch -- start