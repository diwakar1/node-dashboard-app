// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const API_VERSION = "/api/v1";

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_VERSION}/auth/login`,
  SIGNUP: `${API_VERSION}/auth/signup`,
  REFRESH: `${API_VERSION}/auth/refresh`,
  LOGOUT: `${API_VERSION}/auth/logout`,
};

// Product Endpoints
export const PRODUCT_ENDPOINTS = {
  GET_ALL: `${API_VERSION}/products`,
  GET_BY_ID: (id) => `${API_VERSION}/products/${id}`,
  CREATE: `${API_VERSION}/products`,
  UPDATE: (id) => `${API_VERSION}/products/${id}`,
  DELETE: (id) => `${API_VERSION}/products/${id}`,
  SEARCH: (key) => `${API_VERSION}/products/search/${key}`,
};
