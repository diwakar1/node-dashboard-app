# Full-Stack Dashboard Application

Modern full-stack product management application with secure JWT authentication. Built with React, Express, and MongoDB.

## Overview

A complete dashboard solution that enables users to securely sign up, log in, and manage products with real-time operations. Features automatic token refresh, protected routes, and a clean, responsive interface.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM v7
- Context API
- LocalStorage

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication
- Swagger UI

## Key Features

- **Secure Authentication** - JWT-based signup/login with bcrypt password hashing
- **Token Management** - Auto-refresh with access & refresh tokens
- **Product CRUD** - Create, read, update, delete, and search products
- **Protected Routes** - Authentication-based access control
- **API Documentation** - Interactive Swagger UI
- **Responsive Design** - Works seamlessly on all devices

## Project Structure

```
node-dashboard-app/
├── backend/           # Express REST API server
│   ├── controllers/   # Request handlers
│   ├── services/      # Business logic
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Validation & auth
│   └── tests/         # Unit tests
│
└── frontend/          # React application
    ├── src/
    │   ├── api/       # API communication
    │   ├── features/  # Auth, Product, Profile
    │   ├── context/   # Global state
    │   ├── hooks/     # Custom hooks
    │   └── routes/    # Route config
    └── public/        # Static assets
```

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB running locally or cloud instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-dashboard-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file with your config
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - API Docs: `http://localhost:5000/api-docs`

## Documentation

For detailed documentation on each part of the application:

- **[Frontend Documentation](./frontend/README.md)** - React app architecture, components, and setup
- **[Backend Documentation](./backend/README.md)** - API endpoints, authentication flow, and configuration

## Environment Setup

**Backend (.env)**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/database-name
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend**
- Configure API endpoint in `src/constants/apiEndpoints.js`

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Architecture Highlights

- **MVC Pattern** - Separation of concerns with service layer
- **Feature-Based Frontend** - Organized by business features
- **JWT Strategy** - Access tokens (15m) + Refresh tokens (7d)
- **Auto Token Refresh** - Seamless session management
- **Input Validation** - Express validator + client-side validation
- **Error Handling** - Consistent error responses

## API Endpoints

**Authentication**
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh

**Products** (Protected)
- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/search/:key` - Search products

