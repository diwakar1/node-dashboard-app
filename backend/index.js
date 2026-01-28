/**
 * index.js
 * Main entry point for the Node.js backend application.
 * Sets up Express, middleware, and mounts API routes.
 * Swagger UI integration
 */

require('dotenv').config();

const express = require("express");
require("./db/config");
const cors = require("cors");
const logger = require("./middleware/logger");
const path = require("path");


const app = express();
app.use(express.json());
app.use(logger);

const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Swagger UI integration
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const refreshRoutes = require("./routes/refresh");
const categoryRoutes = require("./routes/category");
const dashboardRoutes = require("./routes/dashboard");

// Mount versioned routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth/refresh", refreshRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  
  // Handle React routing - return index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

