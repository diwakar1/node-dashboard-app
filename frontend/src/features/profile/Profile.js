import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authFetch } from "../../api/auth";
import { USER_ENDPOINTS } from "../../constants/apiEndpoints";
import "./Profile.css";

const AVATAR = "https://www.w3schools.com/w3images/avatar2.png";

/* ─── small helpers ─── */
function PasswordField({ id, label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="profile-form__group">
      <label htmlFor={id} className="profile-form__label">{label}</label>
      <div className="profile-form__password-wrap">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="profile-form__input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          className="profile-form__eye-btn"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}

function Alert({ type, msg }) {
  if (!msg) return null;
  return <div className={`profile-alert profile-alert--${type}`}>{msg}</div>;
}

/* ─── main component ─── */
const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // ── profile data from server ──
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ── edit name ──
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameStatus, setNameStatus] = useState({ type: "", msg: "" });

  // ── change password ──
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwStatus, setPwStatus] = useState({ type: "", msg: "" });

  // ── email verification ──
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState({ type: "", msg: "" });

  /* fetch fresh profile on mount */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch(USER_ENDPOINTS.GET_PROFILE);
        const data = await res.json();
        if (!cancelled) {
          setProfile(data.user);
          setNameValue(data.user?.name || "");
        }
      } catch {
        // fall back to localStorage user
        if (!cancelled && user) {
          setProfile(user);
          setNameValue(user.name || "");
        }
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── save name ── */
  const handleSaveName = async (e) => {
    e.preventDefault();
    setNameStatus({ type: "", msg: "" });
    if (!nameValue.trim() || nameValue.trim().length < 2) {
      setNameStatus({ type: "error", msg: "Name must be at least 2 characters." });
      return;
    }
    setNameLoading(true);
    try {
      const res = await authFetch(USER_ENDPOINTS.UPDATE_PROFILE, {
        method: "PUT",
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        updateUser(data.user);
        setNameStatus({ type: "success", msg: "Name updated successfully." });
        setEditingName(false);
      } else {
        setNameStatus({ type: "error", msg: data.error || "Failed to update name." });
      }
    } catch {
      setNameStatus({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setNameLoading(false);
    }
  };

  /* ── resend verification email ── */
  const handleResendVerification = async () => {
    setResendStatus({ type: "", msg: "" });
    setResendLoading(true);
    try {
      const res = await authFetch(USER_ENDPOINTS.RESEND_VERIFICATION, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResendStatus({ type: "success", msg: data.message || "Verification email sent. Please check your inbox." });
      } else {
        setResendStatus({ type: "error", msg: data.error || "Failed to send verification email." });
      }
    } catch {
      setResendStatus({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setResendLoading(false);
    }
  };

  /* ── change password ── */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus({ type: "", msg: "" });
    const { current, next, confirm } = pwForm;
    if (!current || !next || !confirm) {
      setPwStatus({ type: "error", msg: "All password fields are required." });
      return;
    }
    if (next.length < 6) {
      setPwStatus({ type: "error", msg: "New password must be at least 6 characters." });
      return;
    }
    if (next !== confirm) {
      setPwStatus({ type: "error", msg: "New passwords do not match." });
      return;
    }
    setPwLoading(true);
    try {
      const res = await authFetch(USER_ENDPOINTS.CHANGE_PASSWORD, {
        method: "PUT",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwStatus({ type: "success", msg: "Password changed successfully. Please log in again." });
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => logout(), 2500);
      } else {
        setPwStatus({ type: "error", msg: data.error || "Failed to change password." });
      }
    } catch {
      setPwStatus({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setPwLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="profile-page">
        <div className="profile-page__inner">
          <p style={{ color: "#555" }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-page__inner">
          <p style={{ color: "#c00" }}>Could not load profile. Please log in again.</p>
        </div>
      </div>
    );
  }

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="profile-page">
      <div className="profile-page__inner">
        <h1 className="profile-page__title">Your Account</h1>

        {/* ── Hero Card ── */}
        <div className="profile-hero">
          <img src={AVATAR} alt="Avatar" className="profile-hero__avatar" />
          <div className="profile-hero__info">
            <h2 className="profile-hero__name">{profile.name}</h2>
            <p className="profile-hero__email">{profile.email}</p>
            <span className={`profile-hero__badge profile-hero__badge--${profile.role}`}>
              {profile.role}
            </span>
          </div>
        </div>

        {/* ── Top Grid: Account Info + Edit Name ── */}
        <div className="profile-grid">

          {/* Account Info */}
          <div className="profile-card">
            <div className="profile-card__header">
              <span className="profile-card__icon">👤</span>
              <h3 className="profile-card__title">Account Information</h3>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-row__label">Full Name</span>
              <span className="profile-info-row__value">{profile.name}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-row__label">Email</span>
              <span className="profile-info-row__value">{profile.email}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-row__label">Email Status</span>
              <span className="profile-info-row__value" style={{ color: profile.isEmailVerified ? "#16a34a" : "#d97706", fontWeight: 600 }}>
                {profile.isEmailVerified ? "Verified ✓" : "Not Verified"}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-row__label">Role</span>
              <span className="profile-info-row__value" style={{ textTransform: "capitalize" }}>{profile.role}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-row__label">Member Since</span>
              <span className="profile-info-row__value">{memberSince}</span>
            </div>
          </div>

          {/* Edit Name */}
          <div className="profile-card">
            <div className="profile-card__header">
              <span className="profile-card__icon">✏️</span>
              <h3 className="profile-card__title">Edit Name</h3>
            </div>
            {!editingName ? (
              <>
                <p style={{ fontSize: 14, color: "#555", marginBottom: 14 }}>
                  Your display name: <strong>{profile.name}</strong>
                </p>
                <button
                  className="profile-btn profile-btn--primary"
                  onClick={() => { setEditingName(true); setNameStatus({ type: "", msg: "" }); }}
                >
                  Change Name
                </button>
              </>
            ) : (
              <form onSubmit={handleSaveName}>
                <div className="profile-form__group">
                  <label htmlFor="edit-name" className="profile-form__label">New Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    className="profile-form__input"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={50}
                    autoFocus
                  />
                </div>
                <Alert type={nameStatus.type} msg={nameStatus.msg} />
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button type="submit" className="profile-btn profile-btn--primary" disabled={nameLoading}>
                    {nameLoading && <span className="profile-spinner" />}
                    Save
                  </button>
                  <button
                    type="button"
                    className="profile-btn profile-btn--secondary"
                    onClick={() => { setEditingName(false); setNameValue(profile.name); setNameStatus({ type: "", msg: "" }); }}
                    disabled={nameLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Email Verification ── */}
        <div className="profile-grid">
          <div className="profile-card profile-card--full">
            <div className="profile-card__header">
              <span className="profile-card__icon">✉️</span>
              <h3 className="profile-card__title">Email Verification</h3>
            </div>
            {profile.isEmailVerified ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#16a34a", fontSize: 20 }}>&#10003;</span>
                <span style={{ color: "#16a34a", fontWeight: 600 }}>
                  Your email is verified. You will receive order confirmation emails.
                </span>
              </div>
            ) : (
              <>
                <div style={{
                  background: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 14,
                  color: "#92400e",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}>
                  <strong>Your email is not verified.</strong> Verify your email to receive
                  order confirmation emails after placing an order. Check your inbox for the
                  verification link sent at signup, or request a new one below.
                </div>
                <Alert type={resendStatus.type} msg={resendStatus.msg} />
                <button
                  className="profile-btn profile-btn--primary"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                >
                  {resendLoading && <span className="profile-spinner" />}
                  Resend Verification Email
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Change Password (full width) ── */}
        <div className="profile-grid">
          <div className="profile-card profile-card--full">
            <div className="profile-card__header">
              <span className="profile-card__icon">🔒</span>
              <h3 className="profile-card__title">Change Password</h3>
            </div>
            <form onSubmit={handleChangePassword} style={{ maxWidth: 400 }}>
              <PasswordField
                id="pw-current"
                label="Current Password"
                value={pwForm.current}
                onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                placeholder="Enter current password"
              />
              <PasswordField
                id="pw-new"
                label="New Password"
                value={pwForm.next}
                onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                placeholder="At least 6 characters"
              />
              <PasswordField
                id="pw-confirm"
                label="Confirm New Password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat new password"
              />
              <Alert type={pwStatus.type} msg={pwStatus.msg} />
              <button
                type="submit"
                className="profile-btn profile-btn--primary"
                style={{ marginTop: 12 }}
                disabled={pwLoading}
              >
                {pwLoading && <span className="profile-spinner" />}
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-card__header">
              <span className="profile-card__icon">📦</span>
              <h3 className="profile-card__title">Orders</h3>
            </div>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 14 }}>
              View and manage your past orders.
            </p>
            <button
              className="profile-btn profile-btn--primary"
              onClick={() => navigate("/orders")}
            >
              View Orders
            </button>
          </div>

          <div className="profile-card">
            <div className="profile-card__header">
              <span className="profile-card__icon">🛒</span>
              <h3 className="profile-card__title">Cart &amp; Checkout</h3>
            </div>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 14 }}>
              Review items in your cart or continue shopping.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="profile-btn profile-btn--primary"
                onClick={() => navigate("/cart")}
              >
                View Cart
              </button>
              <button
                className="profile-btn profile-btn--secondary"
                onClick={() => navigate("/products")}
              >
                Shop
              </button>
            </div>
          </div>
        </div>

        {/* ── Sign Out ── */}
        <div className="profile-grid">
          <div className="profile-card profile-card--full">
            <div className="profile-card__header">
              <span className="profile-card__icon">🚪</span>
              <h3 className="profile-card__title">Sign Out</h3>
            </div>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 14 }}>
              Sign out of your account on this device.
            </p>
            <button className="profile-btn profile-btn--danger" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
