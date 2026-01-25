import { API_BASE_URL, API_VERSION, AUTH_ENDPOINTS } from "../constants/apiEndpoints";
import { TOKEN_CONFIG } from "../constants/config";
import { AUTH_ERRORS } from "../constants/errorMessages";

// Utility for handling access and refresh tokens, and authenticated fetch
export { API_BASE_URL, API_VERSION };

export function getAccessToken() {
	return JSON.parse(localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY));
}

export function getRefreshToken() {
	return JSON.parse(localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY));
}

export function setTokens({ accessToken, refreshToken }) {
	if (accessToken) localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, JSON.stringify(accessToken));
	if (refreshToken) localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, JSON.stringify(refreshToken));
}

export function clearTokens() {
	localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
	localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
	localStorage.removeItem(TOKEN_CONFIG.USER_KEY);
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
			const refreshRes = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
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
				throw new Error(AUTH_ERRORS.UNAUTHORIZED);
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
