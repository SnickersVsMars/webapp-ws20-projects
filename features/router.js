const express = require("express");
const path = require("path");
const router = express.Router();

router.use("/", require("./projects/projectRouter"));
router.use("/", require("./test/testRouter"));

router.get("/404", (req, res) => {
    res.sendFile(path.join(__dirname, "/errors/404.html"));
});

router.get("/500", (req, res) => {
    res.sendFile(path.join(__dirname, "/errors/500.html"));
});

router.get("/", (req, res) => {
    res.redirect("/projects");
});

module.exports = router;
