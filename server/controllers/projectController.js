const Project = require('../models/projects');
const User = require('../models/User');

async function getProject(req, res) {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
    }).populate('owner', 'name');
    if (!project) {
      return res.status(400);
    }
    return res.send(project);
  } catch (error) {
    return res.status(400);
  }
}

async function getAllProjects(req, res) {
  const projects = await Project.find().sort({ name: 1 });
  if (!projects) {
    return res.status(404);
  }
  res.send(projects);
}

async function filteredProjects(req, res) {
  console.log(req.body.id);
  const pagination = req.body.pagination ? req.body.pagination : 2;
  const page = req.body.page ? req.body.page : 1;
  const projects = await Project.find({
    $and: [
      { owner: { $ne: req.body.id } },
      {
        industry: { $regex: req.body.industry, $options: 'i' },
        location: { $regex: req.body.location, $options: 'i' },
        deadline: { $gte: req.body.deadline },
      },
    ],
  })
    .sort({
      createdAt: 1,
    })
    .skip((page - 1) * pagination)
    .limit(pagination);
  if (!projects) {
    return res.status(404);
  }
  res.send({ total: projects.length, projects });
}

async function getProjectsForUser(req, res) {
  const projects = await Project.find({ owner: req.params.userId });

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
      deadline: req.body.deadline,
      owner: req.id,
    });
    try {
      const result = await project.save();
      res.status(201).send(result);

      // Add new project id to User
      await User.updateOne(
        { _id: req.id },
        { $push: { projects: result._id } },
      );
    } catch (ex) {
      console.log(ex);
      res.status(500).send('Unable to create project');
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}

async function updateProject(req, res) {
  const { projectId } = req.params;
  const userId = req.id;

  try {
    if (req.body.owner !== userId) {
      return res.status(403).json({ errors: { message: 'Not authorized' } });
    }

    const updates = { ...req.body };
    const updatedProject = await Project.findByIdAndUpdate(projectId, updates, {
      new: true,
      useFindAndModify: false,
    });
    return res.status(200).json(updatedProject);
  } catch (error) {
    return res.status(500);
  }
}

module.exports = {
  createProjectForUser,
  filteredProjects,
  getAllProjects,
  getProjectsForUser,
  getProject,
  updateProject,
};
