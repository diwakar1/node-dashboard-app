import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";
import { VALIDATION_RULES, UI_CONSTANTS } from "../../constants/config";
import { AUTH_ERRORS, VALIDATION_ERRORS } from "../../constants/errorMessages";
import { AUTH_ENDPOINTS } from "../../constants/apiEndpoints";
import "../../styles/login.css";

const SignUp = () => {
  const { signup } = useAuth();
  const { values, errors, handleChange, handleBlur, validate, setFieldError } = useForm({
    initialValues: { name: "", email: "", password: "" },
    validationRules: {
      name: {
        required: { value: true, message: VALIDATION_ERRORS.REQUIRED("Name") },
        minLength: { value: VALIDATION_RULES.NAME_MIN_LENGTH, message: VALIDATION_ERRORS.MIN_LENGTH("Name", VALIDATION_RULES.NAME_MIN_LENGTH) },
      },
      email: {
        required: { value: true, message: VALIDATION_ERRORS.REQUIRED("Email") },
        pattern: { value: VALIDATION_RULES.EMAIL_PATTERN, message: AUTH_ERRORS.INVALID_EMAIL },
      },
      password: {
        required: { value: true, message: VALIDATION_ERRORS.REQUIRED("Password") },
        minLength: { value: VALIDATION_RULES.PASSWORD_MIN_LENGTH, message: AUTH_ERRORS.INVALID_PASSWORD },
      },
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await signup(values.name, values.email, values.password);
    setLoading(false);
    if (result.success) {
      setSuccessMsg("Account created! Redirecting to sign in…");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/login");
      }, UI_CONSTANTS.REDIRECT_DELAY);
    } else {
      setFieldError("server", result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="fas fa-store" />
          </div>
          <span className="auth-logo-name">ShopDash</span>
        </div>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-subheading">Start shopping today — it&apos;s free</p>

        {successMsg && (
          <div className="auth-success">
            <i className="fas fa-circle-check" />
            {successMsg}
          </div>
        )}
        {errors.server && (
          <div className="auth-server-error">
            <i className="fas fa-circle-exclamation" />
            {errors.server}
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            className={`auth-input${errors.name ? " auth-input-error" : ""}`}
            placeholder="John Doe"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && <span className="auth-field-error">{errors.name}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            className={`auth-input${errors.email ? " auth-input-error" : ""}`}
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <span className="auth-field-error">{errors.email}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">Password</label>
          <div className="auth-input-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              className={`auth-input auth-input-pw${errors.password ? " auth-input-error" : ""}`}
              placeholder="Min. 6 characters"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              className="auth-pw-toggle"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="auth-field-error">{errors.password}</span>}
        </div>

        <button
          type="button"
          className="auth-btn-primary"
          onClick={handleSignUp}
          disabled={loading}
          style={{ marginTop: "8px" }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="auth-terms">
          By creating an account you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>

        <div className="auth-divider">or sign up with</div>

        <div className="auth-sso-row">
          <button
            type="button"
            className="auth-sso-btn"
            onClick={() => { window.location.href = AUTH_ENDPOINTS.GOOGLE_SSO; }}
          >
            <i className="fab fa-google" />
            Google
          </button>
          <button
            type="button"
            className="auth-sso-btn"
            onClick={() => { window.location.href = AUTH_ENDPOINTS.GITHUB_SSO; }}
          >
            <i className="fab fa-github" />
            GitHub
          </button>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
