const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { contactValidationRules, validate } = require('../middleware/validators');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact
// Middleware chain order matters:
// 1. contactLimiter  -> reject if this IP has submitted too often
// 2. contactValidationRules -> define what "valid" means for each field
// 3. validate         -> check the results of those rules, reject if invalid
// 4. submitContact    -> only reached if the request passed both checks
router.post('/', contactLimiter, contactValidationRules, validate, submitContact);

module.exports = router;