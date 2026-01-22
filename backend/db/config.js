/**
 * config.js
 * Sets up and manages the MongoDB connection using Mongoose.
 */
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/e-comm")