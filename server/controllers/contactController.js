const Contact = require('../models/Contact');
const { sendContactNotification } = require('../services/emailService');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Submit a contact form message
 * @route   POST /api/contact
 * @access  Public
 *
 * NOTE: By the time this runs, `contactValidationRules` + `validate`
 * middleware (server/middleware/validators.js) have already confirmed
 * the request body is well-formed. This controller assumes clean data.
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Save to MongoDB first — the message is preserved even if
    //    the email step fails later (email is a notification, not the source of truth).
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    // 2. Attempt to send an email notification.
    //    If email sending fails, we log it but do NOT fail the whole request —
    //    the message is already safely stored in MongoDB either way.
    try {
      await sendContactNotification({ name, email, subject, message });
    } catch (emailError) {
      console.error('Email notification failed (message still saved):', emailError.message);
    }

    // 3. Return success response regardless of email outcome,
    //    since the user's core action (submitting the message) succeeded.
    res.status(201).json({
      success: true,
      message: 'Your message has been received. Thank you for reaching out!',
      data: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact };