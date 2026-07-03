const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB using Mongoose.
 * Exits the process if connection fails, since the app
 * cannot function without a database connection.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8+ no longer needs useNewUrlParser / useUnifiedTopology,
      // but explicit options are kept here for clarity and future-proofing.
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Connection event listeners for better observability in production
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB runtime error: ${err.message}`);
});

// Graceful shutdown on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination.');
  process.exit(0);
});

module.exports = connectDB;