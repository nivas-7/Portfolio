const express = require('express');
const router = express.Router();
const { getProjects } = require('../controllers/projectsController');

// GET /api/projects
router.get('/', getProjects);

module.exports = router;