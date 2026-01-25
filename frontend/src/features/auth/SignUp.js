import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";

const SignUp = () => {
  const { signup } = useAuth();
  const { values, errors, handleChange, handleBlur, validate, setFieldError } = useForm(
    { name: "", email: "", password: "" },
    {
      name: {
        required: true,
        minLength: 2,
        requiredMessage: "Name is required",
        minLengthMessage: "Name must be at least two characters",
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        requiredMessage: "Email is required",
        patternMessage: "Invalid email address",
      },
      password: {
        required: true,
        minLength: 8,
        requiredMessage: "Password is required",
        minLengthMessage: "Password should be at least 8 characters",
      },
    }
  );
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
      }, 1500);
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
          placeholder="Enter Name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <input
          className="inputBox"
          type="text"
          placeholder="Enter Email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <input
          className="inputBox"
          type="password"
          placeholder="Enter Password"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
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
