/**
 * index.js
 * Main entry point for the Node.js backend application.
 * Sets up Express, middleware, and mounts API routes.
 * Swagger UI integration
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES6 modules (needed for dotenv path)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import './db/config.js';
import cors from 'cors';
import logger from './middleware/logger.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import refreshRoutes from './routes/refresh.js';
import categoryRoutes from './routes/category.js';
import dashboardRoutes from './routes/dashboard.js';
import orderRoutes from './routes/order.js';


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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount versioned routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth/refresh", refreshRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/orders", orderRoutes);

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

