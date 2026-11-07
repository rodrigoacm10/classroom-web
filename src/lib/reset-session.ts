/**
 * Transient in-memory store for the password reset ticket (JWT).
 * Prevents exposing the reset_token in URL query parameters (CWE-598 / OWASP Top 10),
 * avoiding persistence in browser history, proxy/access logs, and Referer headers.
 */

let inMemoryResetToken: string | null = null;

export function setResetSessionToken(token: string | null): void {
  inMemoryResetToken = token;
}

export function getResetSessionToken(): string | null {
  return inMemoryResetToken;
}

export function clearResetSessionToken(): void {
  inMemoryResetToken = null;
}
