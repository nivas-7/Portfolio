const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const { notFound, errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const profileRoutes = require('./routes/profileRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const projectsRoutes = require('./routes/projectsRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// ==============================
// SECURITY MIDDLEWARE
// ==============================
app.use(helmet()); // sets secure HTTP headers (XSS protection, no-sniff, etc.)

// CORS: only allow requests from origins explicitly listed in .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ==============================
// GENERAL MIDDLEWARE
// ==============================
app.use(express.json({ limit: '10kb' })); // parse JSON bodies, cap size to prevent abuse
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression()); // gzip responses

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // concise request logging in dev
} else {
  app.use(morgan('combined')); // detailed Apache-style logs in production
}

app.use(generalLimiter); // apply general rate limit to all routes

// ==============================
// HEALTH CHECK
// ==============================
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// ==============================
// API ROUTES
// ==============================
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);

// ==============================
// ERROR HANDLING (must be LAST)
// ==============================
app.use(notFound);
app.use(errorHandler);

module.exports = app;