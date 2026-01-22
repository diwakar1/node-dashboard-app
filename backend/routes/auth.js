/**
 * auth.js
 * Defines authentication-related API routes (signup, login).
 * Uses validation middleware and controller logic.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registrationValidation, loginValidation } = require('../middleware/validation');

router.post('/signup', registrationValidation, authController.signup);
router.post('/login', loginValidation, authController.login);

module.exports = router;
