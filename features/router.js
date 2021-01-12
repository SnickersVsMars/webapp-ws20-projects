const express = require('express');
const path = require('path');
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
		
		var fs = require('fs');
		var dataUrlRegExp = /^data:.*base64,/;
		var base64Data = content.replace(dataUrlRegExp, "");
		var buffer = new Buffer(base64Data, "base64");
		fs.writeFile(appRoot+"/uploads/"+filename, buffer,  "binary",function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("The file was saved!");
			}
		});
	}

	res.send('UPLOADED');
});

router.get('/', (req, res) => {
    res.redirect('/projects');
});

module.exports = router;
