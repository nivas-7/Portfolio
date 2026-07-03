const express = require('express');
const router = express.Router();
const { getSkills } = require('../controllers/skillsController');

// GET /api/skills
router.get('/', getSkills);

module.exports = router;