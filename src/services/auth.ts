import { api, clearStoredToken, getStoredToken } from "@/lib/api-client";

export type LoginWebResponse = {
  access_token: string;
  token_type: string;
};

export type MessageResponse = {
  message: string;
};

export function login(email: string, password: string) {
  return api<LoginWebResponse>("/auth/login", {
    method: "POST",
    body: { email, password, client_type: "web" },
    skipAuthRefresh: true,
  });
}

/**
 * Log out user: revokes the access token on backend (Redis blacklist) and
 * instructs the backend to delete the HttpOnly refresh token cookie,
 * then clears all client-side storage and memory.
 */
export async function logout(): Promise<void> {
  try {
    const token = getStoredToken();
    await api<MessageResponse>("/auth/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      skipAuthRefresh: true,
    });
  } catch {
    // Network errors during logout are non-blocking
  } finally {
    clearStoredToken();
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
  }
}

export const authService = {
  login,
  logout,
};
