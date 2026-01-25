import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens, clearTokens, API_BASE_URL, API_VERSION } from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
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
      return { success: false, error: "Login failed. Please check your credentials." };
    }
  };

  const logout = () => {
    clearTokens();
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

  return {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
  };
}
