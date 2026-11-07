"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ApiError, resetPassword } from "@/lib/api";
import { buttonClass, fieldClass, textLinkClass } from "@/components/ui/interactive";
import { clearResetSessionToken, getResetSessionToken } from "@/lib/reset-session";

type ResetPasswordFormProps = {
  resetToken?: string;
};

/** Password strength level and label. */
function getPasswordStrength(password: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
  color: string;
} {
  if (password.length === 0) return { level: 0, label: "", color: "" };
  if (password.length < 6) return { level: 1, label: "Muito curta", color: "bg-danger" };
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const extras = [hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  if (password.length >= 12 && extras >= 2)
    return { level: 3, label: "Forte", color: "bg-success" };
  if (password.length >= 8 && extras >= 1)
    return { level: 2, label: "Média", color: "bg-warn" };
  return { level: 1, label: "Fraca", color: "bg-danger" };
}

export function ResetPasswordForm({ resetToken = "" }: ResetPasswordFormProps) {
  const [token] = useState(() => resetToken || getResetSessionToken() || "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Se o token veio via query string (fallback direto), limpa imediatamente a URL
  // para evitar persistência no histórico de navegação e headers Referer (CWE-598).
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("reset_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Missing or obviously malformed token — send user back to start the flow
  if (!token) {
    return (
      <div className="mt-8 flex flex-col gap-5 rounded-sm border border-border bg-surface px-6 py-6">
        {/* Warning icon */}
        <div className="flex size-10 items-center justify-center rounded-full border border-border bg-paper text-muted">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-5"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-label/caption text-ink">Sessão expirada ou não encontrada</p>
          <p className="text-label/caption text-muted">
            Inicie o processo novamente para receber um novo código de verificação.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className={buttonClass({ variant: "ink", size: "md", className: "self-start" })}
        >
          Iniciar recuperação de senha
        </Link>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas digitadas não coincidem. Verifique e tente novamente.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      clearResetSessionToken();
      setSuccess(true);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError(
          "Não foi possível redefinir sua senha. Verifique sua conexão e tente novamente.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS STATE
  // ─────────────────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="mt-12 flex flex-col items-center text-center">
        {/* Success icon */}
        <div className="flex size-16 items-center justify-center rounded-full bg-success-surface">
          <svg
            className="size-8 text-success"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="mt-6 text-[28px] leading-8 font-black tracking-tight text-ink sm:text-[34px] sm:leading-10">
          Senha alterada!
        </h2>

        <p className="mt-3 max-w-[42ch] text-body/body text-muted">
          Sua nova senha foi salva. Por segurança, todas as outras sessões foram
          encerradas. Você já pode entrar com a nova senha.
        </p>

        <div className="mt-8 w-full max-w-xs">
          <Link
            href="/login"
            className={buttonClass({
              variant: "ink",
              size: "lg",
              className: "w-full",
            })}
          >
            Acessar conta
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FORM STATE
  // ─────────────────────────────────────────────────────────────────────────────

  // Detect whether the error relates to the reset token itself (expired / already used)
  const isTokenError =
    error?.toLowerCase().includes("token") ||
    error?.toLowerCase().includes("expirado") ||
    error?.toLowerCase().includes("utilizado") ||
    error?.toLowerCase().includes("inválido");

  const strength = getPasswordStrength(newPassword);
  const passwordMismatch =
    confirmPassword.length > 0 && confirmPassword !== newPassword;

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
      {/* New Password */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="new-password"
            className="font-semibold text-label/caption text-ink"
          >
            Nova senha
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-label/caption text-muted transition-colors hover:text-ink"
            aria-pressed={showPassword}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <input
          id="new-password"
          type={showPassword ? "text" : "password"}
          name="newPassword"
          autoComplete="new-password"
          required
          autoFocus
          minLength={6}
          disabled={loading}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Pelo menos 6 caracteres"
          className={fieldClass({ invalid: Boolean(error && newPassword.length < 6) })}
        />

        {/* Password strength meter */}
        {newPassword.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1" aria-hidden="true">
              {[1, 2, 3].map((bar) => (
                <div
                  key={bar}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    strength.level >= bar ? strength.color : "bg-border"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-caption/caption font-medium ${
                strength.level === 3
                  ? "text-success"
                  : strength.level === 2
                    ? "text-warn"
                    : "text-danger"
              }`}
            >
              Força: {strength.label}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="confirm-password"
            className="font-semibold text-label/caption text-ink"
          >
            Confirmar nova senha
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-label/caption text-muted transition-colors hover:text-ink"
            aria-pressed={showConfirmPassword}
          >
            {showConfirmPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <input
          id="confirm-password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          autoComplete="new-password"
          required
          disabled={loading}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Digite a senha novamente"
          className={fieldClass({
            invalid: passwordMismatch,
          })}
        />
        {passwordMismatch && (
          <p className="text-caption/caption text-danger">
            As senhas não coincidem.
          </p>
        )}
        {confirmPassword.length > 0 && !passwordMismatch && newPassword.length >= 6 && (
          <p className="flex items-center gap-1 text-caption/caption font-medium text-success">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Senhas coincidem
          </p>
        )}
      </div>

      {/* Error Banner */}
      <div aria-live="polite">
        {error && (
          <div className="flex flex-col gap-2 rounded-sm border border-danger bg-danger-surface px-4 py-3 text-label leading-[18px] text-ink">
            <p>{error}</p>
            {isTokenError && (
              <Link
                href="/forgot-password"
                className="self-start font-semibold text-ink underline underline-offset-4 hover:opacity-80"
              >
                Solicitar novo código
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
        aria-busy={loading}
        className={buttonClass({
          variant: "ink",
          className: "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink",
        })}
      >
        {loading ? "Redefinindo senha…" : "Redefinir senha"}
      </button>

      <div className="text-center">
        <Link
          href="/login"
          className={textLinkClass({
            className: "text-label/caption text-muted hover:text-ink",
          })}
        >
          Cancelar e voltar para o login
        </Link>
      </div>
    </form>
  );
}
