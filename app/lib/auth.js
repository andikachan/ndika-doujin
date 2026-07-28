const TOKEN_KEY = "ndichan_token";
const AUTH_FLAG_COOKIE = "ndichan_auth";

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (_) {
    return null;
  }
}

// Middleware (edge runtime) can't read localStorage, so we mirror a lightweight
// non-sensitive flag cookie purely to gate /profile at the routing layer.
// The real auth token used for API calls always stays in localStorage.
export function setToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      document.cookie = `${AUTH_FLAG_COOKIE}=1; path=/; max-age=2592000; samesite=lax`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      document.cookie = `${AUTH_FLAG_COOKIE}=; path=/; max-age=0`;
    }
  } catch (_) {
    // ignore storage errors (e.g. private mode)
  }
}

export function clearToken() {
  setToken(null);
}
