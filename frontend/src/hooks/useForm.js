import { useState } from "react";

export function useForm({ initialValues = {}, validationRules = {} }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return "";

    // Check if required
    if (rules.required?.value && !value.trim()) {
      setErrors((prev) => ({ ...prev, [fieldName]: rules.required.message || `${fieldName[0].toUpperCase() + fieldName.slice(1)} is required`}));
      return rules.required.message || `${fieldName[0].toUpperCase() + fieldName.slice(1)} is required`;
    }
    // Check min length
    if (rules.minLength?.value && value.length < rules.minLength.value) {
      setErrors((prev) => ({ ...prev, [fieldName]: rules.minLength.message || `${fieldName[0].toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength.value} characters`}));
      return rules.minLength.message || `${fieldName[0].toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength.value} characters`;
    }
    // Check pattern (e.g., email)
    if (rules.pattern?.value && !rules.pattern.value.test(value)) {
      setErrors((prev) => ({ ...prev, [fieldName]: rules.pattern.message || `Invalid ${fieldName}`}));
      return rules.pattern.message || `Invalid ${fieldName}`;
    }
    // Clear error if valid
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    return "";
  };

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    if (!e || !e.target) return;
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
