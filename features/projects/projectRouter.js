const express = require("express");
const path = require("path");

const viewRouter = express.Router();
const apiRouter = express.Router();

function buildPath(fileName) {
    return path.join(__dirname, fileName);
}

// define view routes
viewRouter.get("/", (req, res) => {
    res.sendFile(buildPath("list.html"));
});

viewRouter.get("/:id", (req, res) => {
    res.sendFile(buildPath("detail.html"));
});

// Todo: define api routes

// define project router
const projectRouter = express.Router();
projectRouter.use("/api/projects", apiRouter);
projectRouter.use("/projects", viewRouter);

module.exports = projectRouter;