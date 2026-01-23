// utils/auth.js
// Utility for handling access and refresh tokens, and authenticated fetch

export const API_BASE_URL = "http://localhost:5000";
export const API_VERSION = "/api/v1";

export function getAccessToken() {
  return JSON.parse(localStorage.getItem("token"));
}

export function getRefreshToken() {
  return JSON.parse(localStorage.getItem("refreshToken"));
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("token", JSON.stringify(accessToken));
  if (refreshToken) localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
}

export function clearTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

// Authenticated fetch with automatic token refresh
export async function authFetch(url, options = {}) {
  let token = getAccessToken();
  let refreshToken = getRefreshToken();
  if (!options.headers) options.headers = {};
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  options.headers["Content-Type"] = "application/json";

  let response = await fetch(url, options);
  if (response.status === 401) {
    if (refreshToken) {
      // Try to refresh token
      const refreshRes = await fetch(`${API_BASE_URL}${API_VERSION}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        // Retry original request with new token
        options.headers["Authorization"] = `Bearer ${data.accessToken}`;
        response = await fetch(url, options);
      } else {
        clearTokens();
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
    } else {
      // No refresh token, force logout and redirect
      clearTokens();
      window.location.href = "/login";
      throw new Error("Unauthorized. Please login again.");
    }
  }
  return response;
}
