const Profile = require('../models/Profile');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Get the portfolio owner's profile
 * @route   GET /api/profile
 * @access  Public
 */
const getProfile = async (req, res, next) => {
  try {
    // The portfolio only ever has ONE profile document —
    // fetch the most recently created one, in case duplicates exist.
    const profile = await Profile.findOne().sort({ createdAt: -1 });

    if (!profile) {
      return next(new AppError('Profile not found. Please seed the database.', 404));
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile };