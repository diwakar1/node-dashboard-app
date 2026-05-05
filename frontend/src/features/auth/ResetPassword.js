import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AUTH_ENDPOINTS } from "../../constants/apiEndpoints";
import "../../styles/login.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!token) return;
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // Missing or clearly invalid token
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <i className="fas fa-store" />
            </div>
            <span className="auth-logo-name">ShopDash</span>
          </div>
          <div style={{ textAlign: "center", margin: "24px 0 8px" }}>
            <i
              className="fas fa-triangle-exclamation"
              style={{ fontSize: "48px", color: "#dc2626" }}
            />
          </div>
          <h1 className="auth-heading">Invalid link</h1>
          <p className="auth-subheading">
            This password reset link is missing a token. Please request a new
            one.
          </p>
          <Link to="/forgot-password" className="auth-btn-primary" style={{ display: "block", textAlign: "center" }}>
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <i className="fas fa-store" />
            </div>
            <span className="auth-logo-name">ShopDash</span>
          </div>
          <div style={{ textAlign: "center", margin: "24px 0 8px" }}>
            <i
              className="fas fa-circle-check"
              style={{ fontSize: "48px", color: "#16a34a" }}
            />
          </div>
          <h1 className="auth-heading">Password reset!</h1>
          <p className="auth-subheading">
            Your password has been updated successfully. You can now sign in
            with your new password.
          </p>
          <button
            type="button"
            className="auth-btn-primary"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="fas fa-store" />
          </div>
          <span className="auth-logo-name">ShopDash</span>
        </div>

        <h1 className="auth-heading">Create new password</h1>
        <p className="auth-subheading">
          Your new password must be at least 8 characters.
        </p>

        {serverError && (
          <div className="auth-server-error">
            <i className="fas fa-circle-exclamation" />
            {serverError}{" "}
            {serverError.toLowerCase().includes("expired") && (
              <Link to="/forgot-password" style={{ color: "inherit", fontWeight: 600 }}>
                Request a new link.
              </Link>
            )}
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">
            New password
          </label>
          <div className="auth-input-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              autoFocus
              className={`auth-input auth-input-pw${errors.password ? " auth-input-error" : ""}`}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {errors.password && (
            <span className="auth-field-error">{errors.password}</span>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <div className="auth-input-wrap">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              className={`auth-input auth-input-pw${errors.confirmPassword ? " auth-input-error" : ""}`}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="auth-pw-toggle"
              onClick={() => setShowConfirm((p) => !p)}
              tabIndex={-1}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="auth-field-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="button"
          className="auth-btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>

        <p className="auth-footer">
          <Link to="/login">&larr; Back to Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
