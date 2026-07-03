// Load environment variables FIRST, before anything else touches process.env
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');
const { verifyMailer } = require('./config/mailer');

const PORT = process.env.PORT || 5000;

/**
 * Bootstraps the application:
 * 1. Connect to MongoDB (fatal if it fails — see db.js)
 * 2. Verify email transporter (non-fatal warning if it fails)
 * 3. Start listening for HTTP requests
 */
const startServer = async () => {
  await connectDB();
  await verifyMailer();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Catch unhandled promise rejections (e.g. a DB query that slipped through
  // without proper try/catch) so the process fails loudly instead of
  // continuing in a broken, unpredictable state.
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Catch synchronous errors that weren't caught anywhere
  process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

startServer();