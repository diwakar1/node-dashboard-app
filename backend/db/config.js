/**
 * config.js
 * Sets up and manages the MongoDB connection using Mongoose.
 */
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/e-comm";
mongoose.connect(MONGO_URI);