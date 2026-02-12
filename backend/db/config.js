/**
 * config.js
 * Sets up and manages the MongoDB connection using Mongoose.
 */
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/e-comm";
mongoose.connect(MONGO_URI);