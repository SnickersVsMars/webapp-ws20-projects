const express = require('express');
const port = require('config').get('port');
const path = require('path');

const router = require('./features/router');
const dbConnection = require('./features/dbConnection');

const server = express();

server.set('port', port);

server.use(express.static('public'));

// parse application/json
server.use(express.json());

server.use('/', router);

// Not Found Error
server.use((request, response) => {
    response.sendFile(path.join(__dirname, 'features/errors/404.html'));
});

// Server Error
server.use(function (err, req, res, next) {
    res.sendFile(path.join(__dirname, 'features/errors/500.html'));
    console.log(err);
});

// Binding to a port
server.listen(port, () => {
    console.log('Express server listening on port ' + port);
    console.log('http://localhost:3000');
});

// Handle server shutdown
server.on('close', function () {
    dbConnection.close();
});

process.on('SIGINT', function () {
    dbConnection.close();
    process.exit(0);
});
