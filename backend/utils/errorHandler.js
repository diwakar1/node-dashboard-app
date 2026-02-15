/**
 * errorHandler.js
 * Utility functions for formatting Mongoose and MongoDB errors
 * Provides consistent error responses similar to express-validator format
 */

/**
 * Format Mongoose validation errors to match express-validator format
 * @param {Error} error - Mongoose or MongoDB error object
 * @returns {Object} Formatted error response
 */
export const formatMongooseError = (error) => {
    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
        return {
            errors: Object.values(error.errors).map(err => ({
                msg: err.message,
                param: err.path,
                value: err.value,
                type: err.kind
            }))
        };
    }
    
    // MongoDB Duplicate Key Error (E11000)
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[field];
        return {
            errors: [{
                msg: `${field} '${value}' already exists`,
                param: field,
                value: value,
                type: 'duplicate'
            }]
        };
    }
    
    // Mongoose Cast Error (invalid ObjectId, type mismatch, etc.)
    if (error.name === 'CastError') {
        return {
            errors: [{
                msg: `Invalid ${error.kind} format`,
                param: error.path,
                value: error.value,
                type: 'cast'
            }]
        };
    }
    
    // Generic error
    return { error: error.message };
};

/**
 * Handle errors in controller and send appropriate response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 */
export const handleControllerError = (res, error, defaultMessage = 'Operation failed') => {
    // Mongoose ValidationError
    if (error.name === 'ValidationError') {
        const formattedError = formatMongooseError(error);
        return res.status(400).json(formattedError);
    }
    
    // MongoDB Duplicate Key Error
    if (error.code === 11000) {
        const formattedError = formatMongooseError(error);
        return res.status(409).json(formattedError);
    }
    
    // Mongoose Cast Error
    if (error.name === 'CastError') {
        const formattedError = formatMongooseError(error);
        return res.status(400).json(formattedError);
    }
    
    // Not Found errors
    if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
    }
    
    // Business logic errors (already exists, cannot delete, etc.)
    if (error.message.includes('already exists') || 
        error.message.includes('Cannot delete') ||
        error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
    }
    
    // Generic server error
    res.status(500).json({ 
        error: defaultMessage, 
        detail: error.message 
    });
};
