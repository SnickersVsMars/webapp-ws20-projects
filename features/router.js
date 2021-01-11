const express = require('express');
const path = require('path');
const router = express.Router();

router.use('/', require('./projects/projectRouter'));
router.use('/', require('./test/testRouter'));

router.get('/throw', (req, res) => {
    throw 'Error Test';
});

router.post('/upload', (req, res) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let targetFile = req.files.target_file;

    targetFile.mv(path.join(appRoot, 'uploads', targetFile.name), (err) => {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
  
});

router.get('/', (req, res) => {
    res.redirect('/projects');
});

module.exports = router;
