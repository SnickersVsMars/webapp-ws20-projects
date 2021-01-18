const express = require('express');
const { decorateRouter } = require('@awaitjs/express');
const path = require('path');

const projectService = require('./projectService');
const projectValidationService = require('./projectValidationService');
const pdfGenerator = require('./pdf/pdf-generator');

function buildPath(fileName) {
    return path.join(__dirname, fileName);
}

const createPdfResponse = (req, res, next, id) => {
    let url = req.protocol + '://' + req.get('host') + '/projects';

    if (id) {
        url = url + '/' + id;
    }

    pdfGenerator
        .generatePdf(url)
        .catch(next)
        .then((pdfBuffer) => {
            let header = {
                'Content-Type': 'application/pdf',
                'Content-Length': pdfBuffer.length,
            };
            res.set(header);
            res.send(pdfBuffer);
        });
};

// define view routes
const viewRouter = express.Router();

viewRouter.get('/:id/export', (req, res, next) => {
    createPdfResponse(req, res, next, req.params.id);
});

viewRouter.get('/export', (req, res, next) => {
    createPdfResponse(req, res, next);
});

viewRouter.get('/add', (req, res) => {
    res.sendFile(buildPath('add.html'));
});

viewRouter.get('/:id/edit', (req, res) => {
    res.sendFile(buildPath('edit.html'));
});

viewRouter.get('/', (req, res) => {
    res.sendFile(buildPath('list.html'));
});

viewRouter.get('/:id', (req, res) => {
    res.sendFile(buildPath('detail.html'));
});

const apiRouter = decorateRouter(express.Router());

apiRouter.getAsync('/', async (req, res) => {
    let projects = await projectService.get();
    res.send(projects);
});

apiRouter.getAsync('/:id', async (req, res) => {
    let project = await projectService.find(req.params.id);

    if (project) {
        res.json(project);
    } else {
        res.status(404).sendFile(path.join(__dirname, '../errors/404.html'));
    }
});

apiRouter.postAsync(
    '/',
    projectValidationService.validationArray,
    async (req, res) => {
        let validationResult = projectValidationService.validate(req, res);
        if (validationResult) return validationResult;

        let projectId = await projectService.insert(req.body);
        res.status(201).json(projectId);
    }
);

apiRouter.putAsync(
    '/:id',
    projectValidationService.validationArray,
    async (req, res) => {
        let result = projectValidationService.validate(req, res);
        if (result) {
            return result;
        }

        let projectId = await projectService.update(req.params.id, req.body);
        res.json(projectId);
    }
);

// define project router
const projectRouter = express.Router();
projectRouter.use('/api/projects', apiRouter);
projectRouter.use('/projects', viewRouter);

module.exports = projectRouter;
