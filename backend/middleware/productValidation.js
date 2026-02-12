/**
 * productValidation.js
 * Contains express-validator middleware for validating product requests (add, update).
 */

import { body, param, query } from 'express-validator';

const productValidation = [
    body('name').notEmpty().withMessage('Product name is required').trim(),
    body('price').notEmpty().withMessage('Price is required').trim(),
    body('categoryId').notEmpty().withMessage('Category is required').trim(),
    body('company').notEmpty().withMessage('Company is required').trim(), 
];

const idParamValidation = [
    param('id')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format')
];

const searchKeyValidation = [
    param('key')
        .notEmpty()
        .withMessage('Search keyword is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Search keyword must be at least 1 character')
];

const searchQueryValidation = [
    query('q')
        .notEmpty()
        .withMessage('Search query is required')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters')
];

export {
    productValidation,
    idParamValidation,
    searchKeyValidation,
    searchQueryValidation
};
