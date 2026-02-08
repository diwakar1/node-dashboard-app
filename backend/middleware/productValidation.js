/**
 * productValidation.js
 * Contains express-validator middleware for validating product requests (add, update).
 */

const { body } = require('express-validator');

const productValidation = [
    body('name').notEmpty().withMessage('Product name is required').trim(),
    body('price').notEmpty().withMessage('Price is required').trim(),
    body('categoryId').notEmpty().withMessage('Category is required').trim(),
    body('company').notEmpty().withMessage('Company is required').trim(), 
];

module.exports = {
    productValidation
};
