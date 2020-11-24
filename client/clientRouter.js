const express = require('express')
const router = express.Router()
const path = require('path');

// define the home page route
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'/projects/list.html'));
})

router.get('/project/:id', function (req, res) {
    res.sendFile(path.join(__dirname,'/projects/detail.html'));
})

module.exports = router