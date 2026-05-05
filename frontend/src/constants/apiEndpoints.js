// API Configuration
// In development with proxy: uses relative URLs (e.g., /api/v1/...)
// In production: uses full URL from environment variable
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? (import.meta.env.VITE_API_URL || "http://localhost:5000")
  : "";
export const API_VERSION = "/api/v1";

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}${API_VERSION}/auth/login`,
  SIGNUP: `${API_BASE_URL}${API_VERSION}/auth/signup`,
  REFRESH: `${API_BASE_URL}${API_VERSION}/auth/refresh`,
  LOGOUT: `${API_BASE_URL}${API_VERSION}/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}${API_VERSION}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}${API_VERSION}/auth/reset-password`,
  // OAuth SSO — these trigger a full browser redirect (not fetch), so we need
  // the actual backend URL even in dev (Vite proxy doesn't handle redirects).
  GOOGLE_SSO: `http://localhost:5000${API_VERSION}/auth/google`,
  GITHUB_SSO: `http://localhost:5000${API_VERSION}/auth/github`,
};

// Product Endpoints
export const PRODUCT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}${API_VERSION}/products`,
  GET_BY_ID: (id) => `${API_BASE_URL}${API_VERSION}/products/${id}`,
  CREATE: `${API_BASE_URL}${API_VERSION}/products/add`,
  UPDATE: (id) => `${API_BASE_URL}${API_VERSION}/products/${id}`,
  DELETE: (id) => `${API_BASE_URL}${API_VERSION}/products/${id}`,
  SEARCH: (key) => `${API_BASE_URL}${API_VERSION}/products/search/${key}`,
};

// Order Endpoints
export const ORDER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}${API_VERSION}/orders`,
  GET_BY_ID: (id) => `${API_BASE_URL}${API_VERSION}/orders/${id}`,
  CREATE: `${API_BASE_URL}${API_VERSION}/orders`,
  UPDATE_STATUS: (id) => `${API_BASE_URL}${API_VERSION}/orders/${id}/status`,
  CANCEL: (id) => `${API_BASE_URL}${API_VERSION}/orders/${id}/cancel`,
};

// User / Profile Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE:            `${API_BASE_URL}${API_VERSION}/auth/profile`,
  UPDATE_PROFILE:         `${API_BASE_URL}${API_VERSION}/auth/profile`,
  CHANGE_PASSWORD:        `${API_BASE_URL}${API_VERSION}/auth/change-password`,
  VERIFY_EMAIL:           (token) => `${API_BASE_URL}${API_VERSION}/auth/verify-email?token=${token}`,
  RESEND_VERIFICATION:    `${API_BASE_URL}${API_VERSION}/auth/resend-verification`,
};

