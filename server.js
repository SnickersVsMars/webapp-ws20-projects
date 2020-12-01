const express = require('express');
const bodyParser = require('body-parser');
const port = require('config').get('port');

const router = require('./features/router');
const dbConnection = require('./features/dbConnection');

const server = express();

server.set('port', port);

server.use(express.static('public'));

// parse application/json
server.use(bodyParser.json());

server.use('/', router);

// Express error handling middleware
server.use((request, response) => {
    response.type('text/plain');
    response.status(505);
    response.send('Error page');
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
