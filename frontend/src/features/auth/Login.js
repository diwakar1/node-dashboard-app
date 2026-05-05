import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";
import { VALIDATION_RULES } from "../../constants/config";
import { AUTH_ERRORS } from "../../constants/errorMessages";
import { AUTH_ENDPOINTS } from "../../constants/apiEndpoints";
import "../../styles/login.css";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const { values, errors, handleChange, validate, setFieldError } = useForm({
    initialValues: { email: "", password: "" },
    validationRules: {
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
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Show error if OAuth redirect failed
  const oauthError = searchParams.get('error');

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await login(values.email, values.password);
    setLoading(false);
    if (!result.success) {
      setFieldError("server", result.error);
    } else {
      navigate(result.redirectPath || "/");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
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

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your account to continue</p>

        {errors.server && (
          <div className="auth-server-error">
            <i className="fas fa-circle-exclamation" />
            {errors.server}
          </div>
        )}

        {oauthError && (
          <div className="auth-server-error">
            <i className="fas fa-circle-exclamation" />
            Sign-in with Google/GitHub failed. Please try again.
          </div>
        )}

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
            onKeyDown={handleKeyDown}
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
              autoComplete="current-password"
              className={`auth-input auth-input-pw${errors.password ? " auth-input-error" : ""}`}
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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

        <Link
          to="/forgot-password"
          className="auth-forgot"
        >
          Forgot password?
        </Link>

        <button
          type="button"
          className="auth-btn-primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="auth-divider">or continue with</div>

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
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
