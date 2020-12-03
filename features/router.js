const express = require("express");
const router = express.Router();

router.use("/", require("./projects/projectRouter"));
router.use("/", require("./test/testRouter"));

router.get("/", (req, res) => {
    res.redirect("/projects");
});

module.exports = router;