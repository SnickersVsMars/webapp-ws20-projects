const express = require('express')
const projectRouter = require('./projects/projectRouter')
const testRouter = require('./test/testRouter')

const router = express.Router()

router.use('/api/projects', projectRouter.apiRouter);
router.use('/api/tests', testRouter.apiRouter);


router.use('/projects', projectRouter.viewRouter);
router.use('/tests', testRouter.viewRouter);

router.get('/', (req, res) => {
    res.redirect("/projects");
})

module.exports = router;