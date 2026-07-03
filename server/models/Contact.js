const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters'],
      maxlength: [150, 'Subject cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false, // lets you (the site owner) track which messages you've reviewed
    },
    ipAddress: {
      type: String, // stored for spam auditing / rate-limit correlation
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt doubles as the submission date required by spec
  }
);

// Index for quickly listing most recent, unread messages first
contactSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);