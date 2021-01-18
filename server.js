const express = require('express');
const fileUpload = require('express-fileupload');
const { expressValidator } = require('express-validator');
const bodyParser = require('body-parser');

const port = process.env.PORT || require('config').get('port');
const path = require('path');

const router = require('./features/router');
const dbConnection = require('./features/dbConnection');

const server = express();

global.appRoot = path.resolve(__dirname);
server.set('port', port);

server.use(express.static('public'));

// parse application/json
server.use(express.json());

server.use(fileUpload({
	useTempFiles : true,
	tempFileDir : '/tmp/'
}));

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

server.use('/', router);

// Not Found Error
server.use('*', (request, response) => {
    response
        .status(404)
        .sendFile(path.join(__dirname, 'features/errors/404.html'));
});

// Server Error
server.use(function (err, req, res, next) {
    res.status(500).sendFile(path.join(__dirname, 'features/errors/500.html'));
    console.log(err);
});

// Binding to a port
server.listen(port, () => {
    console.log('Express server listening on port ' + port);
    console.log('http://localhost:' + port);
});

// Handle server shutdown
server.on('close', function () {
    dbConnection.close();
});

process.on('SIGINT', function () {
    dbConnection.close();
    process.exit(0);
});