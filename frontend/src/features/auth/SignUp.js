import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";
import { VALIDATION_RULES, UI_CONSTANTS } from "../../constants/config";
import { AUTH_ERRORS, VALIDATION_ERRORS } from "../../constants/errorMessages";

const SignUp = () => {
  const { signup } = useAuth();
  const { values, errors, handleChange, handleBlur, validate, setFieldError } = useForm({
    initialValues: { name: "", email: "", password: "" },
    validationRules: {
      name: {
        required: true,
        minLength: VALIDATION_RULES.NAME_MIN_LENGTH,
        message: VALIDATION_ERRORS.MIN_LENGTH("Name", VALIDATION_RULES.NAME_MIN_LENGTH),
      },
      email: {
        required: true,
        pattern: VALIDATION_RULES.EMAIL_PATTERN,
        message: AUTH_ERRORS.INVALID_EMAIL,
      },
      password: {
        required: true,
        minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
        message: AUTH_ERRORS.INVALID_PASSWORD,
      },
    }
  });
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const collectData = async () => {
    if (!validate()) {
      return;
    }

    const result = await signup(values.name, values.email, values.password);
    if (result.success) {
      setSuccessMsg("Sign up successful! Redirecting to login...");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/login");
      }, UI_CONSTANTS.REDIRECT_DELAY);
    } else {
      setSuccessMsg("");
      setFieldError("server", result.error);
    }
  };

  return (
    <div className="login-bg" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login">
        <h1>Sign Up</h1>
        {successMsg && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{successMsg}</div>}
        <input
          className="inputBox"
          type="text"
          name="name"
          placeholder="Enter Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <input
          className="inputBox"
          type="text"
          name="email"
          placeholder="Enter Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <input
          className="inputBox"
          type="password"
          name="password"
          placeholder="Enter Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && <span className="error">{errors.password}</span>}
        {errors.server && <span className="error">{errors.server}</span>}
        <button className="loginButton" type="button" onClick={collectData}>
          Sign Up
        </button>
      </div>
    </div>
  );
};
export default SignUp;
