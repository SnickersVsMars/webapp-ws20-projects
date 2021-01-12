const express = require('express');
const path = require('path');
const fileService = require('./projects/fileService.js');
const router = express.Router();

router.use('/', require('./projects/projectRouter'));
router.use('/', require('./test/testRouter'));

router.get('/throw', (req, res) => {
    throw 'Error Test';
});

router.post('/upload', (req, res) => {
	if(req.body.theFile !== "") {
		let content = req.body.content;
		let filename = req.body.name;
		let project_id = req.body.project_id;
		console.log(req);
		
		var fs = require('fs');
		var dataUrlRegExp = /^data:.*base64,/;
		var base64Data = content.replace(dataUrlRegExp, "");
		// var buffer =  Buffer.from(base64Data, "base64");
		// fs.writeFile(appRoot+"/uploads/"+filename, buffer,  "binary",function(err) {
		// 	if(err) {
		// 		console.log(err);
		// 	} else {
		// 		console.log("The file was saved!");
		// 	}
		// });

		let success = (error, result) => {
            if (error) {
                res.status(500).json(error);
            }

            res.status(200).json('UPLOADED');
		};
		
		let file = {
			project_id: project_id,
			filename: filename,
			content: base64Data
		};

        fileService.insert(file, success);
	}
});

router.get('/', (req, res) => {
    res.redirect('/projects');
});

module.exports = router;
