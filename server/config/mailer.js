const nodemailer = require('nodemailer');

/**
 * Creates and configures the Nodemailer transporter.
 * Uses SMTP settings from environment variables so credentials
 * are never hardcoded and can differ between dev/production.
 */
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for port 465, false for 587/25
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

const transporter = createTransporter();

/**
 * Verifies the SMTP connection on startup so misconfigured credentials
 * fail loudly and immediately, rather than silently at first contact form submission.
 */
const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('Email transporter is ready to send messages.');
  } catch (error) {
    console.warn(
      `Email transporter verification failed: ${error.message}. ` +
        'Contact form submissions will still be saved to the DB, but email notifications may not work.'
    );
  }
};

module.exports = { transporter, verifyMailer };