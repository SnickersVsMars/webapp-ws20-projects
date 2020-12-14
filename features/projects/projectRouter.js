const express = require('express');
const path = require('path');
const projectService = require('./projectService');
const projectValidationService = require('./projectValidationService');

function buildPath(fileName) {
    return path.join(__dirname, fileName);
}

// define view routes
const viewRouter = express.Router();

viewRouter.get('/add', (req, res) => {
    res.sendFile(buildPath('add.html'));
});

viewRouter.get('/', (req, res) => {
    res.sendFile(buildPath('list.html'));
});

viewRouter.get('/:id', (req, res) => {
    res.sendFile(buildPath('detail.html'));
});

const apiRouter = express.Router();
apiRouter.get('/', (req, res) => {
    projectService.get((result) => {
        res.json(result);
    });
});

apiRouter.get('/:id', (req, res) => {
    projectService.find(req.params.id, (result) => {
        res.json(result);
    });
});

// apiRouter.post('/add', projectValidationService.validationArray, (req, res) => {
apiRouter.post('/add', (req, res) => {
    // let result = projectValidationService.validate(req, res);
    console.log(req.body);
    // if (result) {
    //     return result;
    // }

    projectService.insert(req.body, (result) => {
        res.json(result);
    });
});

// define project router
const projectRouter = express.Router();
projectRouter.use('/api/projects', apiRouter);
projectRouter.use('/projects', viewRouter);

module.exports = projectRouter;
