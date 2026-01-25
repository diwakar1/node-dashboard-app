// Authentication Error Messages
export const AUTH_ERRORS = {
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  SIGNUP_FAILED: "Registration failed. Please try again.",
  UNAUTHORIZED: "Session expired. Please login again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PASSWORD: "Password must be at least 8 characters.",
  REQUIRED_FIELD: "This field is required.",
};

// Product Error Messages
export const PRODUCT_ERRORS = {
  FETCH_FAILED: "Failed to load products.",
  CREATE_FAILED: "Failed to create product.",
  UPDATE_FAILED: "Failed to update product.",
  DELETE_FAILED: "Failed to delete product.",
  SEARCH_FAILED: "Search failed. Please try again.",
};

// Validation Error Messages
export const VALIDATION_ERRORS = {
  REQUIRED: (field) => `${field} is required.`,
  MIN_LENGTH: (field, length) => `${field} must be at least ${length} characters.`,
  MAX_LENGTH: (field, length) => `${field} must not exceed ${length} characters.`,
  INVALID_FORMAT: (field) => `Invalid ${field} format.`,
};
