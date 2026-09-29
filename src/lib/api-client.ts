import { apiUrl } from "@/lib/env";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let inMemoryAccessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

/**
 * Access token is kept strictly in-memory (RAM) to eliminate XSS persistence risks.
 * Never written to localStorage or sessionStorage.
 */
export function getStoredToken(): string | null {
  return inMemoryAccessToken;
}

export function setStoredToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function clearStoredToken(): void {
  inMemoryAccessToken = null;
}

export type RefreshResponse = {
  access_token: string;
  token_type: string;
};

/**
 * Silently renews the access token using the backend's HttpOnly refresh_token cookie.
 * Uses a singleton promise to avoid multiple simultaneous refresh calls (thundering herd).
 * The backend preserves active tenant scope in the rotated refresh token, eliminating
 * the need for client-side storage or manual re-scoping.
 */
export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const data = (await response.json()) as RefreshResponse;
      setStoredToken(data.access_token);
      return data.access_token;
    } catch (err) {
      clearStoredToken();
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  _isRetry?: boolean;
  skipAuthRefresh?: boolean;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers = {}, _isRetry, skipAuthRefresh, ...rest } = options;

  const requestHeaders = new Headers(headers as HeadersInit);
  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }
  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const isAuthRoute =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/refresh") ||
    path.startsWith("/auth/forgot-password") ||
    path.startsWith("/auth/verify-reset-code") ||
    path.startsWith("/auth/reset-password");

  // Automatically attach in-memory Bearer token if present.
  // If memory is empty on page load, attempt silent refresh via HttpOnly cookie.
  if (!requestHeaders.has("Authorization") && !isAuthRoute) {
    let token = getStoredToken();
    if (!token && typeof window !== "undefined" && !skipAuthRefresh) {
      try {
        token = await refreshAccessToken();
      } catch {
        // Not authenticated or refresh cookie expired
      }
    }
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...rest,
    credentials: "include",
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Handle 401 Unauthorized with silent refresh (unless already retried or an auth route)
  if (response.status === 401 && !_isRetry && !skipAuthRefresh && !isAuthRoute) {
    try {
      const newToken = await refreshAccessToken();
      const retryHeaders = new Headers(headers as HeadersInit);
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
      return api<T>(path, {
        ...options,
        headers: retryHeaders,
        _isRetry: true,
      });
    } catch {
      clearStoredToken();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
      throw new ApiError(401, "Sessão expirada. Faça login novamente.");
    }
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string | { msg?: string }[];
    } | null;

    const detail = payload?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? (detail[0]?.msg ?? response.statusText)
          : response.statusText;

    // Handle missing tenant context according to tenant-context-routing.md
    if (
      response.status === 403 &&
      typeof window !== "undefined" &&
      typeof detail === "string" &&
      detail.toLowerCase().includes("nenhuma tenant selecionada")
    ) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/tenants";
    }

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
