import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.js";
import { useCart } from "../../../context/CartContext.js";
import "./nav.css";

const Nav = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* ── Left: Logo + Brand ── */}
        <Link to={isAuthenticated ? "/products" : "/"} className="navbar-brand">
          <span className="navbar-logo-icon">
            <i className="fas fa-store" />
          </span>
          <span className="navbar-brand-name">ShopDash</span>
        </Link>

        {/* ── Center: Nav Links ── */}
        {isAuthenticated ? (
          <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
            {isAdmin() && (
              <>
                <li>
                  <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                    <i className="fa-solid fa-gauge-high"></i> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/add" className={`nav-link ${isActive("/add") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                    <i className="fa-solid fa-plus"></i> Add Product
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/products" className={`nav-link ${isActive("/products") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                <i className="fa-solid fa-store"></i> Products
              </Link>
            </li>
            <li>
              <Link to="/orders" className={`nav-link ${isActive("/orders") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                <i className="fa-solid fa-bag-shopping"></i>
                {isAdmin() ? " All Orders" : " My Orders"}
              </Link>
            </li>
          </ul>
        ) : (
          /* spacer so brand stays left and auth buttons go right */
          <div className="navbar-spacer" />
        )}

        {/* ── Right: Actions ── */}
        {!isAuthenticated && (
          <div className={`navbar-actions navbar-guest-actions ${menuOpen ? "open" : ""}`}>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="nav-link nav-link-signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </div>
        )}
        {isAuthenticated && (
          <div className="navbar-actions">
            {/* Cart – user only */}
            {!isAdmin() && (
              <Link to="/cart" className={`nav-action-btn nav-cart ${isActive("/cart") ? "active" : ""}`}>
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                <span className="nav-action-label">Cart</span>
              </Link>
            )}

            {/* Profile */}
            <Link to="/profile" className={`nav-action-btn nav-profile ${isActive("/profile") ? "active" : ""}`}>
              <i className="fa-solid fa-circle-user"></i>
              <span className="nav-action-label">{user?.name?.split(" ")[0] || "Profile"}</span>
            </Link>

            {/* Logout */}
            <button
              className="nav-logout-btn"
              onClick={logout}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="nav-action-label">Logout</span>
            </button>
          </div>
        )}

        {/* ── Hamburger (mobile) ── */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Nav;