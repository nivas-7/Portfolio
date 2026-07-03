const { body, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Validation rules for the contact form submission.
 * Runs BEFORE the controller, as middleware in the route chain.
 */
const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name contains invalid characters')
    .escape(), // sanitizes HTML special characters to prevent XSS

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Subject must be between 3 and 150 characters')
    .escape(),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .escape(),
];

/**
 * Middleware that checks the results of the validation rules above.
 * If validation failed, short-circuits with a 400 and clear error messages.
 * If it passed, calls next() to proceed to the controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new AppError(`Validation failed: ${messages.join('. ')}`, 400));
  }

  next();
};

module.exports = { contactValidationRules, validate };