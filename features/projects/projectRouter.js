const express = require('express');
const path = require('path');
const projectService = require('./projectService');
const projectValidationService = require('./projectValidationService');
const fileService = require('./fileService.js');

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

apiRouter.post('/upload', (req, res) => {
	if(req.body.theFile !== "") {
		let content = req.body.content;
		let filename = req.body.name;
		let project_id = req.body.project_id;

		let base64ContentArray = content.split(",");
		let mimeType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
		let base64Data = base64ContentArray[1];
		let success = (error, result) => {
            if (error) {
                res.status(500).json(error);
			}
			else
			{
				res.status(200).json(result);
			}            
		};
		
		let file = {
			project_id: project_id,
			filename: filename,
			content: base64Data,
			mimeType: mimeType
		};

        fileService.insert(file, success);
	}
});

apiRouter.delete('/deleteFile/:id', (req, res) => {
    let success = (error, result) => {
        if (error) {
            res.status(404).sendFile(path.join(__dirname, '../errors/404.html'));
        }
		else
		{
			res.status(200).end();
		}
    };

	fileService.delete(req.params.id, success);
});

apiRouter.get('/download/:id', (req, res) => {
    let success = (error, result) => {
        if (error) {
            res.status(404).sendFile(path.join(__dirname, '../errors/404.html'));
        }
		else
		{
			const download = Buffer.from(result.content.toString('utf-8'), 'base64');
			res.writeHead(200, {
				'Content-Type': result.mimeType,
				'Content-Disposition': 'attachment; filename="'+result.filename+'"'
			  });	
			  res.end(download);
		}
    };

	var result = fileService.find(req.params.id, success);

    if (result === null) {
        res.status(404).sendFile(path.join(__dirname, '../errors/404.html'));
    }
});

// define project router
const projectRouter = express.Router();
projectRouter.use('/api/projects', apiRouter);
projectRouter.use('/projects', viewRouter);

module.exports = projectRouter;
