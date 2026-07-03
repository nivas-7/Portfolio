const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role/title is required'],
      trim: true,
      maxlength: [150, 'Role cannot exceed 150 characters'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    resume: {
      type: String, // URL/path to resume PDF
      trim: true,
      default: '',
    },
    profileImage: {
      type: String, // URL/path to profile image
      trim: true,
      default: '',
    },
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        year: { type: String, trim: true },
      },
    ],
    experience: [
      {
        title: { type: String, trim: true },
        company: { type: String, trim: true },
        duration: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

module.exports = mongoose.model('Profile', profileSchema);