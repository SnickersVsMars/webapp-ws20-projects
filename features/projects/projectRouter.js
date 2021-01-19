const express = require('express');
const { decorateRouter } = require('@awaitjs/express');
const path = require('path');

const projectService = require('./projectService');
const projectValidationService = require('./projectValidationService');
const fileService = require('./fileService.js');
const pdfGenerator = require('../pdf-generator');

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
    // createPdfResponse(req, res, next, req.params.id);
    throw 'An error happend';
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

apiRouter.postAsync('/upload', async (req, res) => {
    if (req.body.theFile !== '') {
        let content = req.body.content;
        let filename = req.body.name;
        let project_id = req.body.project_id;

        let base64ContentArray = content.split(',');
        let mimeType = base64ContentArray[0].match(
            /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/
        )[0];
        let base64Data = base64ContentArray[1];

        let file = {
            project_id: project_id,
            filename: filename,
            content: base64Data,
            mimeType: mimeType,
        };

        let file_id = await fileService.insert(file).catch((error) => {
            res.status(550).json(error);
        });

        if (file_id) {
            res.json(file_id);
        } else {
            res.status(550).json('Fehler beim Upload');
        }
    }
});

apiRouter.deleteAsync('/deleteFile/:id', async (req, res) => {
    await fileService.delete(req.params.id).catch(() => {
        res.status(404).sendFile(path.join(__dirname, '../errors/404.html'));
    });

    res.end();
});

apiRouter.getAsync('/download/:id', async (req, res) => {
    let file = await fileService.find(req.params.id);

    if (file) {
        const download = Buffer.from(file.content.toString('utf-8'), 'base64');
        res.writeHead(200, {
            'Content-Type': file.mimeType,
            'Content-Disposition':
                'attachment; filename="' + file.filename + '"',
        });
        res.end(download);
    } else {
        res.status(404).sendFile(path.join(__dirname, '../errors/404.html'));
    }
});

// define project router
const projectRouter = express.Router();
projectRouter.use('/api/projects', apiRouter);
projectRouter.use('/projects', viewRouter);

module.exports = projectRouter;
