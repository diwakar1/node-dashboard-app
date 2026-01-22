/**
 * logger.js
 * Express middleware for logging HTTP requests and responses.
 */

const morgan = require('morgan');

// Use 'combined' for detailed logs or 'dev' for concise logs
const logger = morgan('dev');

module.exports = logger;
