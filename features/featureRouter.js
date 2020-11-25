const express = require('express')
const router = express.Router()
const path = require('path');
const detailServiceClass = require('./projects/detail/detailService')
const detailService = new detailServiceClass()


// define the home page route
router.get('/', function (req, res) {
    res.redirect("/projects");
})

router.get('/projects', function (req, res) {
    res.sendFile(path.join(__dirname,'/projects/list.html'));
})

router.get('/projects/:id', function (req, res) {
    res.sendFile(path.join(__dirname,'/projects/detail.html'));
})

router.get('/api/projects', function (req,res){
    detailService.getProjects();
});

router.get('/api/projects/:id', function (req,res){
    detailService.findProject(req.id);
});

module.exports = router