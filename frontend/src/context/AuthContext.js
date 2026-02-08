import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens, clearTokens, API_BASE_URL } from "../api/auth";
import { AUTH_ENDPOINTS } from "../constants/apiEndpoints";
import { TOKEN_CONFIG } from "../constants/config";
import { AUTH_ERRORS } from "../constants/errorMessages";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem(TOKEN_CONFIG.USER_KEY);
    const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    
    if (userData && accessToken) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      
      if (result.accessToken && result.refreshToken) {
        localStorage.setItem(TOKEN_CONFIG.USER_KEY, JSON.stringify(result.user));
        setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error || AUTH_ERRORS.LOGIN_FAILED };
      }
    } catch (err) {
      return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
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
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.SIGNUP}`, {
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
        return { success: false, error: result.error || AUTH_ERRORS.SIGNUP_FAILED };
      }
    } catch (err) {
      return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
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
