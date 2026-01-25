import { useState } from "react";

export function useForm({ initialValues = {}, validationRules = {} }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return "";

    let message = "";
    
    // Check if required
    if (rules.required && !value.trim()) {
      message = rules.message || `${fieldName[0].toUpperCase() + fieldName.slice(1)} is required`;
      setErrors((prev) => ({ ...prev, [fieldName]: message }));
      return message;
    }

    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
      message = rules.message || `${fieldName[0].toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`;
      setErrors((prev) => ({ ...prev, [fieldName]: message }));
      return message;
    }

    // Check pattern (e.g., email)
    if (rules.pattern && !rules.pattern.test(value)) {
      message = rules.message || `Invalid ${fieldName}`;
      setErrors((prev) => ({ ...prev, [fieldName]: message }));
      return message;
    }

    // Clear error if valid
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName] || "");
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldError = (fieldName, error) => {
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFieldError,
    setValues,
  };
}
