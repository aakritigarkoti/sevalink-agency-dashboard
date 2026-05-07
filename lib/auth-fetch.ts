import { clearAuthSession, getStoredToken, getStoredUser, setAuthSession } from "@/lib/local-auth";
import { API_BASE_URL } from "@/lib/api-config";

type RefreshResponse = {
  accessToken?: string;
  user?: {
    [key: string]: unknown;
  };
};

async function refreshAccessToken() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as RefreshResponse;

  if (!data.accessToken) {
    return null;
  }

  setAuthSession(data.accessToken, data.user ?? getStoredUser() ?? {});
  return data.accessToken;
}

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = "/login";
}

export async function fetchWithAuth(input: string, init: RequestInit = {}) {
  const token = getStoredToken();
  const headers = new Headers(init.headers ?? {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshedToken = await refreshAccessToken();

  if (!refreshedToken) {
    clearAuthSession();
    redirectToLogin();
    return response;
  }

  const retryHeaders = new Headers(init.headers ?? {});
  retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);

  return fetch(input, {
    ...init,
    credentials: "include",
    headers: retryHeaders,
  });
}
