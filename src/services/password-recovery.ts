import { api } from "@/lib/api-client";
import type { MessageResponse } from "./auth";

export type { MessageResponse };

export type VerifyResetCodeResponse = {
  reset_token: string;
  token_type: string;
  expires_in: number;
};

/** Request a 6-digit OTP code via e-mail. Always resolves (anti-enumeration). */
export function forgotPassword(email: string) {
  return api<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

/**
 * Validate the 6-digit OTP. On success the API destroys the code and returns
 * a short-lived JWT `reset_token` (10 min) that is the only credential
 * accepted by `/auth/reset-password`.
 */
export function verifyResetCode(email: string, code: string) {
  return api<VerifyResetCodeResponse>("/auth/verify-reset-code", {
    method: "POST",
    body: { email, code },
  });
}

/**
 * Set a new password. Requires the `reset_token` JWT issued by
 * `/auth/verify-reset-code` — NOT the raw OTP code.
 * On success all active sessions are revoked.
 */
export function resetPassword(resetToken: string, newPassword: string) {
  return api<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: { reset_token: resetToken, new_password: newPassword },
  });
}

export const passwordRecoveryService = {
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
