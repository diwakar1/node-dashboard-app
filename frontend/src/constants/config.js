// App Configuration
export const APP_CONFIG = {
  APP_NAME: "Dashboard App",
  VERSION: "1.0.0",
  ENVIRONMENT: import.meta.env.MODE || "development",
};

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: "accessToken",
  REFRESH_TOKEN_KEY: "refreshToken",
  USER_KEY: "user",
  ACCESS_TOKEN_EXPIRY: 30 * 60 * 1000, // 30 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// UI Constants
export const UI_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_DURATION: 3000,
  REDIRECT_DELAY: 1500,
};
