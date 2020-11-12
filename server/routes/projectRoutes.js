const express = require("express");
const router = express();
const Project = require("../models/projects");
const User = require("../models/User");

// Get all projects (public)
router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ name: 1 });
  if (!projects) {
    return res.status(404);
  }
  res.send(projects);
});

// Get all projects for a specific user
router.get("/:userId/", async (req, res) => {
  const projects = await User.find({ _id: req.params.userId })
    .select({ username: 1 })
    .populate("projects", "title");

  if (!projects) {
    return res.status(404);
  }
  res.send(projects);
});

// Create a new Project (Page 1)

// TODO: access token to authenticate user before project creation
router.post("/", async (req, res) => {
  const project = new Project({
    title: req.body.title,
    subTitle: req.body.subtitle,
    description: req.body.description,
    location: req.body.location,
    industry: req.body.industry,
  });
  const result = await project.save();
  res.send(result);
});

module.exports = router;
