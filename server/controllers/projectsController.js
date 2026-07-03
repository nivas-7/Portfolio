const Project = require('../models/Project');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res, next) => {
  try {
    // Featured projects appear first (featured: true sorts before false
    // when using -1 descending), then by manual 'order' within each group.
    const projects = await Project.find().sort({ featured: -1, order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects };