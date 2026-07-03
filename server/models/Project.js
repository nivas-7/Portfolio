const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    image: {
      type: String, // URL/path to project screenshot
      required: [true, 'Project image is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology must be listed'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Technologies array cannot be empty',
      },
    },
    githubLink: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^$|^https?:\/\/.+/,
        'GitHub link must be a valid URL',
      ],
    },
    liveDemo: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^$|^https?:\/\/.+/,
        'Live demo link must be a valid URL',
      ],
    },
    featured: {
      type: Boolean,
      default: false, // used to highlight top projects on the frontend
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting of featured projects
projectSchema.index({ featured: -1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);