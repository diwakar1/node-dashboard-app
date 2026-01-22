/**
 * index.js
 * Main entry point for the Node.js backend application.
 * Sets up Express, middleware, and mounts API routes.
 */

require('dotenv').config();

const express = require("express");
require("./db/config");
const cors = require("cors");
const logger = require("./middleware/logger");

const app = express();
app.use(express.json());
app.use(logger);

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

// Mount versioned routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});

