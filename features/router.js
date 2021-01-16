const express = require('express');
const path = require('path');
const fileService = require('./projects/fileService.js');
const router = express.Router();

router.use('/', require('./projects/projectRouter'));
router.use('/', require('./test/testRouter'));

router.get('/throw', (req, res) => {
    throw 'Error Test';
});

router.get('/', (req, res) => {
    res.redirect('/projects');
});

router.post('/upload', (req, res) => {
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

router.delete('/deleteFile/:id', (req, res) => {
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

router.get('/download/:id', (req, res) => {
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

module.exports = router;
