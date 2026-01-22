/**
 * User.js
 * Defines the User model schema for MongoDB using Mongoose.
 * Represents application users.
 */
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
module.exports = mongoose.model("users", userSchema);
