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
apiRouter.get('/', (req, res, next) => {
    let success = (error, result) => {
        if (error) {
            return next(error);
        }

        res.json(result);
    };

    projectService.get(success, next);
});

apiRouter.get('/:id', (req, res, next) => {
    let success = (error, result) => {
        if (error) {
            return next(error);
        }

        res.json(result);
    };

    var result = projectService.find(req.params.id, success, next);

    if (result === null) {
        res.status(404).sendFile(path.join(__dirname, '../errors/404.html'));
    }
});

apiRouter.post(
    '/',
    projectValidationService.validationArray,
    (req, res, next) => {
        let result = projectValidationService.validate(req, res);
        if (result) {
            return result;
        }

        let success = (error, result) => {
            if (error) {
                return next(error);
            }

            res.status(201).json(result);
        };

        projectService.insert(req.body, success);
    }
);

// define project router
const projectRouter = express.Router();
projectRouter.use('/api/projects', apiRouter);
projectRouter.use('/projects', viewRouter);

module.exports = projectRouter;
