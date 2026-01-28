# Dashboard Application - Frontend Side

Modern React application for product management with JWT authentication and auto token refresh.

## Tech Stack

- React 19 + Vite-Fast
- React Router DOM v7
- ES Modules - Modern JavaScript module system
- Context API - Global state management
- LocalStorage - Token persistence

## Architecture

```
src/
├── api/           # API layer with auto token refresh (auth.js, product.js)
├── context/       # AuthContext for global auth state
├── features/      # Feature modules (auth, product, profile)
├── hooks/         # Custom hooks (useProducts, useForm)
├── routes/        # Route configuration
├── shared/        # PrivateComponent, Nav, Footer
└── constants/     # Config, endpoints, error messages
```

## Design Pattern

Feature-based architecture with separation of concerns. Custom hooks handle business logic, Context API manages auth, and `authFetch()` automatically refreshes expired tokens.

## Features

- Authentication - JWT login/signup with persistent sessions and auto token refresh
- Product CRUD - Create, read, update, delete products with search
- Protected Routes - Automatic authentication checks via PrivateComponent
- Error Handling - Loading states and user-friendly error messages

## Quick Start

```bash
cd frontend
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run test     # Run tests
```

## Routes

- `/login`, `/signup` - Public
- `/`, `/add`, `/update/:id`, `/profile` - Protected (requires auth)

---

**Prerequisites:** Node.js 16+, Backend server running | [Backend Docs](../backend/README.md)



