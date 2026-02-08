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
