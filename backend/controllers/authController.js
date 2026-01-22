
/**
 * authController.js
 * Handles user authentication logic: signup and login.
 * Validates input, manages password hashing, and issues JWT tokens.
 */

const { validationResult } = require('express-validator');
const userService = require('../services/userService');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const existingUser = await userService.findUserByEmail(req.body.email);
    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }
    try {
        let user = await userService.createUser(req.body);
        user = user.toObject();
        delete user.password;
        res.send({ user });
    } catch (e) {
        res.status(500).send({ error: "registration failed", detail: e.message });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let user = await userService.findUserByEmail(req.body.email);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials: Email" });
    }
    if (!user.password.startsWith("$2b$")) {
        if (req.body.password === user.password) {
            user.password = await userService.hashPassword(req.body.password);
            await user.save();
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    } else {
        const passwordMatch = await userService.comparePassword(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials: password" });
        }
    }
    user = user.toObject();
    delete user.password;
    try {
        const token = userService.generateToken(user);
        res.send({ user, auth: token });
    } catch (err) {
        res.status(500).send({ error: "something wrong in security" });
    }
};
