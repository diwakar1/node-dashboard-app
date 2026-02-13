/**
 * orderValidation.js
 * Validation rules for order-related API requests using express-validator
 */
import { body, param } from 'express-validator';

/**
 * Validation for creating an order
 */
export const orderValidation = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must have at least one item'),
    
    body('items.*.productId')
        .isMongoId()
        .withMessage('Invalid product ID'),
    
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    
    body('shippingAddress.fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    
    body('shippingAddress.address')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),
    
    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    
    body('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    
    body('shippingAddress.zipCode')
        .trim()
        .notEmpty()
        .withMessage('Zip code is required')
        .matches(/^\d{5,6}$/)
        .withMessage('Invalid zip code format'),
    
    body('shippingAddress.phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    
    body('paymentMethod')
        .optional()
        .isIn(['cod', 'card', 'upi'])
        .withMessage('Invalid payment method'),
    
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must be less than 500 characters')
];

/**
 * Validation for order ID parameter
 */
export const orderIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid order ID')
];

/**
 * Validation for updating order status
 */
export const orderStatusValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid order ID'),
    
    body('status')
        .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status')
];
