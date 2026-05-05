import { useState } from "react";
import { Link } from "react-router-dom";
import { AUTH_ENDPOINTS } from "../../constants/apiEndpoints";
import "../../styles/login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    if (!email.trim()) {
      setEmailError("Email address is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
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

  if (submitted) {
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
              className="fas fa-envelope-circle-check"
              style={{ fontSize: "48px", color: "#2563eb" }}
            />
          </div>
          <h1 className="auth-heading">Check your email</h1>
          <p className="auth-subheading">
            If <strong>{email}</strong> is linked to an account, we've sent a
            password reset link. Check your inbox and spam folder.
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            The link expires in <strong>1 hour</strong>.
          </p>

          <p className="auth-footer" style={{ marginTop: "32px" }}>
            <Link to="/login">&larr; Back to Sign in</Link>
          </p>
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

        <h1 className="auth-heading">Forgot your password?</h1>
        <p className="auth-subheading">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password.
        </p>

        {serverError && (
          <div className="auth-server-error">
            <i className="fas fa-circle-exclamation" />
            {serverError}
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus
            className={`auth-input${emailError ? " auth-input-error" : ""}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {emailError && (
            <span className="auth-field-error">{emailError}</span>
          )}
        </div>

        <button
          type="button"
          className="auth-btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <p className="auth-footer">
          <Link to="/login">&larr; Back to Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
