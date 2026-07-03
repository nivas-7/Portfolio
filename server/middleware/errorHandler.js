/**
 * Custom error class for operational errors (expected, handled errors)
 * as opposed to programming errors (bugs).
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handles requests to routes that don't exist.
 * Should be mounted AFTER all valid routes, BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Translates known Mongoose error types into clean AppError instances.
 */
const handleMongooseErrors = (err) => {
  // Invalid ObjectId format
  if (err.name === 'CastError') {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Schema validation failed
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(`Duplicate value for field: ${field}`, 409);
  }

  return err;
};

/**
 * Central error-handling middleware.
 * Must be registered LAST, after all other app.use() and routes.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Normalize known Mongoose errors into AppError
  if (['CastError', 'ValidationError'].includes(err.name) || err.code === 11000) {
    error = handleMongooseErrors(err);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong on the server';

  // Log full error details server-side (never send stack traces to the client)
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', err);
  } else if (!error.isOperational) {
    console.error('UNEXPECTED ERROR 💥:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, notFound, errorHandler };