const express = require('express');
const fileUpload = require('express-fileupload');

const port = process.env.PORT || require('config').get('port');
const path = require('path');

const router = require('./features/router');
const dbConnection = require('./features/dbConnection');

const logger = require('./features/logger');

const server = express();

global.appRoot = path.resolve(__dirname);
server.set('port', port);
server.use(express.static('public'));

server.use(express.json({ limit: '10mb' })); // parse application/json
server.use(express.urlencoded({ extended: true, limit: '10mb' })); // for parsing application/x-www-form-urlencoded

server.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
);

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
    logger.error(err);
});

// Binding to a port
server.listen(port, () => {
    logger.info(
        '\n\n------------------------------SERVER STARTING------------------------------'
    );
    logger.info('Express server listening on port ' + port);
    logger.info('http://localhost:' + port);
});

// Handle server shutdown
server.on('close', function () {
    dbConnection.close();
    logger.info(
        '\n------------------------------SERVER CLOSED------------------------------'
    );
});

process.on('SIGINT', function () {
    dbConnection.close();
    logger.info(
        '\n------------------------------SERVER CLOSED------------------------------'
    );
    process.exit(0);
});
