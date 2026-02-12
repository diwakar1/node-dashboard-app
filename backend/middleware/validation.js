/**
 * validation.js
 * Contains express-validator middleware for validating user registration and login requests.
 * Exports reusable validation arrays for use in route definitions.
 */
import { body } from 'express-validator';

const registrationValidation = [
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .trim()
        .isEmail()
        .withMessage("Email is invalid"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
    body("email").notEmpty().withMessage("Email is required").trim(),
    body("password").notEmpty().withMessage("Password is required").trim(),
];

export {
    registrationValidation,
    loginValidation
};
