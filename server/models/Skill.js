const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    },
    icon: {
      type: String, // e.g. icon class name (Font Awesome / Devicon) or image URL
      required: [true, 'Skill icon is required'],
      trim: true,
    },
    level: {
      type: Number,
      required: [true, 'Skill level is required'],
      min: [0, 'Level cannot be below 0'],
      max: [100, 'Level cannot exceed 100'],
    },
    category: {
      type: String,
      trim: true,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'],
      default: 'Other',
    },
    order: {
      type: Number,
      default: 0, // used to control display order on the frontend
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting by category/order when fetching skills
skillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);