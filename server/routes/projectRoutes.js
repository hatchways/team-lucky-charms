const express = require('express');
const router = express();
const {
  getAllProjects,
  getProjectsForUser,
  createProjectForUser,
} = require('../controllers/projectController');

const auth = require('../middleware/authMiddleware');

router.get('/', getAllProjects); // Get all projects (public)
router.get('/:userId/', getProjectsForUser); // Get all projects for a specific user
router.post('/', auth, createProjectForUser); // Authenticate user and create a new project

module.exports = router;
