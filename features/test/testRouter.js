const express = require('express');
const path = require('path');
const testService = require('./testService');

// creation of 3 routers, because of 2 different route prefixes:
// - /projects
// - /api/projects
// We don't want to write the prefix '/tests/' and '/api/tests/' multiple times so
// we create 2 routers:
// - viewRouter
// - apiRouter
// After appending the routes to this routers be append them to the main router testsRouter
// There we define the prefix.

// Define the routes for view files. In our case html files.
const viewRouter = express.Router();
viewRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

// Define the routes for the api. The api routes always return data as JSON
const apiRouter = express.Router();
apiRouter.get('/', (req, res) => {
    testService.get((result) => {
        res.json(result);
    });
});

apiRouter.get('/:id', (req, res) => {
    res.json(testService.find(req.params.id));
});

apiRouter.post('/', (req, res) => {
    res.json(testService.insert(req.body));
});

let testsRouter = express.Router();
testsRouter.use('/api/tests', apiRouter);
testsRouter.use('/tests', viewRouter);

module.exports = testsRouter;
