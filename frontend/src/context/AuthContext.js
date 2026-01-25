import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens, clearTokens, API_BASE_URL, API_VERSION } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    
    if (userData && accessToken) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_VERSION}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      
      if (result.accessToken && result.refreshToken) {
        localStorage.setItem("user", JSON.stringify(result.user));
        setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error || "Login failed. Please check your credentials." };
      }
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    clearTokens();
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_VERSION}/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: result.error || "Registration failed. Please try again." };
      }
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
