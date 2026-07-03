const Skill = require('../models/Skill');

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Public
 */
const getSkills = async (req, res, next) => {
  try {
    // Sort by category first (groups related skills together),
    // then by the manual 'order' field for fine-tuned display sequence.
    const skills = await Skill.find().sort({ category: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkills };