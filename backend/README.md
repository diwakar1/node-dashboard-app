# Dashboard Application - Backend Side

RESTful API server for product management with JWT authentication, token refresh, and Swagger documentation.

## Tech Stack

- Node.js + Express 5
- MongoDB + Mongoose
- JWT - Authentication with access/refresh tokens
- bcryptjs - Password hashing
- Express Validator - Input validation
- Swagger UI - API documentation
- Morgan - HTTP request logging
- Jest + Supertest - Testing

## Architecture

```
backend/
├── controllers/   # Request handlers (auth, product, refresh)
├── services/      # Business logic (userService, productService)
├── models/        # Mongoose schemas (User, Product, refreshToken)
├── routes/        # Route definitions (auth, product, refresh)
├── middleware/    # Validators, auth, logging
├── config/        # Swagger configuration
├── db/            # MongoDB connection
└── tests/         # Unit tests
```

## Design Pattern

MVC architecture with service layer. Controllers handle requests, services contain business logic, models define schemas. Middleware handles validation and authentication.

## Features

- Authentication - JWT-based signup/login with bcrypt password hashing
- Token Management - Access tokens (15m) + refresh tokens (7d) with auto-refresh
- Product CRUD - Create, read, update, delete products with search
- Protected Routes - JWT verification middleware
- Input Validation - Express validator for all endpoints
- API Documentation - Interactive Swagger UI at `/api-docs`

## Quick Start

```bash
cd backend
npm install
npm start        # Start server with nodemon
npm test         # Run tests
```

## Environment Variables

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dashboard
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

**Auth**
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token

**Products** (Protected)
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/search/:key` - Search products
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

**Documentation**
- `GET /api-docs` - Swagger UI

---

**Prerequisites:** Node.js 16+, MongoDB running | [Frontend Docs](../frontend/README.md)
