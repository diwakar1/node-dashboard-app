// Email Validator
export const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// Password Validator
export const isValidPassword = (password, minLength = 8) => {
  return password && password.length >= minLength;
};

// Required Field Validator
export const isRequired = (value) => {
  return value && value.trim().length > 0;
};

// Length Validator
export const isValidLength = (value, minLength, maxLength) => {
  const length = value?.length || 0;
  if (minLength && length < minLength) return false;
  if (maxLength && length > maxLength) return false;
  return true;
};

// Number Validator
export const isValidNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

// URL Validator
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Phone Number Validator (basic)
export const isValidPhone = (phone) => {
  const phonePattern = /^\+?[\d\s-()]{10,}$/;
  return phonePattern.test(phone);
};
