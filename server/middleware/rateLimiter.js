const rateLimit = require('express-rate-limit');
const { AppError } = require('./errorHandler');

/**
 * Rate limiter specifically for the contact form endpoint.
 * Restricts how many submissions a single IP can make within a time window,
 * preventing spam bots and abusive scripts from flooding the mailbox/DB.
 */
const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 5, // default: 5 requests per window
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false, // disable deprecated X-RateLimit-* headers
  handler: (req, res, next) => {
    next(
      new AppError(
        'Too many contact form submissions from this IP. Please try again later.',
        429
      )
    );
  },
  skipSuccessfulRequests: false, // count all requests, success or fail, toward the limit
});

/**
 * General-purpose, lighter rate limiter for all other API routes.
 * Protects GET endpoints (profile, skills, projects) from scraping/DoS
 * without being restrictive enough to interfere with normal browsing.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP. Please try again later.', 429));
  },
});

module.exports = { contactLimiter, generalLimiter };