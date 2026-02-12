/**
 * logger.js
 * Express middleware for logging HTTP requests and responses.
 */

import morgan from 'morgan';

// Use 'combined' for detailed logs or 'dev' for concise logs
const logger = morgan('dev');

export default logger;
