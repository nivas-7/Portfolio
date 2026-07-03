const { transporter } = require('../config/mailer');

/**
 * Escapes HTML special characters to prevent injection into the
 * email template, since name/subject/message originate from public user input.
 */
const escapeHtml = (str = '') =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Builds the HTML email body for a contact form notification.
 */
const buildContactEmailHtml = ({ name, email, subject, message }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9fafb;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="color: #111827; margin-top: 0;">New Portfolio Contact Message</h2>
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
        You received a new message from your portfolio contact form.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr>
          <td style="padding: 8px 0; color: #374151; font-weight: bold; width: 90px;">Name:</td>
          <td style="padding: 8px 0; color: #111827;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #374151; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0; color: #111827;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #374151; font-weight: bold;">Subject:</td>
          <td style="padding: 8px 0; color: #111827;">${escapeHtml(subject)}</td>
        </tr>
      </table>

      <div style="margin-top: 16px;">
        <p style="color: #374151; font-weight: bold; margin-bottom: 8px;">Message:</p>
        <p style="color: #111827; background-color: #f3f4f6; padding: 16px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        This message was sent via your portfolio website's contact form.
      </p>
    </div>
  </div>
`;

/**
 * Sends the contact form notification email to the site owner.
 * Throws on failure — the caller (contactController) decides how to handle it.
 */
const sendContactNotification = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    replyTo: email, // lets you hit "Reply" and respond directly to the visitor
    subject: `New Contact Message: ${subject}`,
    html: buildContactEmailHtml({ name, email, subject, message }),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactNotification };