const express = require('express');
const router = express();
const {
  createProjectForUser,
  filteredProjects,
  getProject,
  getAllProjects,
  getProjectsForUser,
  updateProject,
} = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

router.get('/', getAllProjects); // Get all projects (public)
router.get('/:projectId', getProject);
router.get('/all/:userId/', getProjectsForUser); // Get all projects for a specific user
router.post('/', auth, createProjectForUser); // Authenticate user and create a new project
router.post('/filteredProjects', auth, filteredProjects); // Returns projects based on filters
router.put('/update/:projectId', auth, updateProject);

module.exports = router;