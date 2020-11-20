const Project = require("../models/projects");
const User = require("../models/User");

async function getAllProjects(req, res) {
  const projects = await Project.find().sort({ createdAt: -1 });
  if (!projects) {
    return res.status(404);
  }
  res.send(projects);
}

async function getProjectsForUser(req, res) {
  const projects = await User.find({ _id: req.params.userId })
    .select({ username: 1 })
    .populate("projects", "title");

  if (!projects) {
    return res.status(404);
  }
  res.status(200).send(projects);
}

async function createProjectForUser(req, res) {
  try {
    // Create new project for this user
    const project = new Project({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      location: req.body.location,
      fundingGoal: req.body.fundingGoal,
      industry: req.body.industry,
      images: req.body.images,
      owner: req.id,
    });
    try {
      const result = await project.save();
      res.status(201).send(result);

      // Add new project id to User
      await User.updateOne(
        { _id: req.id },
        { $push: { projects: result._id } }
      );
    } catch (ex) {
      console.log(ex);
      res.status(500).send("Unable to create project");
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}

module.exports = { getAllProjects, getProjectsForUser, createProjectForUser };
