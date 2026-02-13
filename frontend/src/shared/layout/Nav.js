import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Nav = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <div style={{ width: "100%" }}>
      {isAuthenticated ? (
        <ul
          className="nav-ul"
          style={{
            padding: "10px",
            margin: "0px",
            background: "skyblue",
            width: "100%",
            listStyle: "none",
          }}
        >
          <img
            alt="logo"
            className="logo"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0gPJykZBs1LuZ6nlqACM_Mn6nub1n_cKtfA&s"
          />
          
          {/* Admin-only navigation */}
          {isAdmin() && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/add">Add Product</Link>
              </li>
            </>
          )}
          
          {/* Common navigation for all authenticated users */}
          <li>
            <Link to="/products">Products</Link>
          </li>
          
          {/* Cart - User-only */}
          {!isAdmin() && (
            <li style={{ position: 'relative' }}>
              <Link to="/cart" style={{ position: 'relative' }}>
                <i className="fa-solid fa-shopping-cart"></i> Cart
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          )}
          
          {/* User-only navigation */}
          {!isAdmin() && (
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
          )}
          
          {/* Admin can see all orders */}
          {isAdmin() && (
            <li>
              <Link to="/orders">All Orders</Link>
            </li>
          )}

          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link onClick={logout} to="/login" className="nav-logout-link">
              Logout ({user.name ? user.name : ""}) {isAdmin() ? '👑' : ''}
            </Link>
          </li>
        </ul>
      ) : (
          <div className="nav-bar">
            <div className="nav-left">
              <img
                alt="logo"
                className="logo"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0gPJykZBs1LuZ6nlqACM_Mn6nub1n_cKtfA&s"
              />
            </div>
            <div className="nav-right">
              <Link to="/signup" className="nav-auth-link">Sign Up</Link>
              <Link to="/login" className="nav-auth-link">Login</Link>
            </div>
          </div>
      )}
    </div>
  );
};
export default Nav;
