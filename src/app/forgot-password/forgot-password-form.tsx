"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, forgotPassword } from "@/lib/api";
import { buttonClass, fieldClass, textLinkClass } from "@/components/ui/interactive";

export function ForgotPasswordForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Informe o e-mail institucional cadastrado.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(cleanEmail);
      router.push(`/forgot-password/verify?email=${encodeURIComponent(cleanEmail)}`);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError(
          "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        );
      }
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-label/caption text-ink">
          E-mail institucional
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "forgot-error" : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@instituicao.edu.br"
          disabled={loading}
          className={fieldClass({ invalid: Boolean(error) })}
        />
      </label>

      {/* How-it-works notice — inline, between field and CTA */}
      <div className="flex items-start gap-3 rounded-sm border border-border bg-surface px-4 py-3.5">
        {/* Envelope icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-px size-4 shrink-0 text-muted"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <p className="text-label/caption text-muted">
          Enviaremos um código de 6 dígitos válido por{" "}
          <strong className="font-semibold text-ink">15 minutos</strong>. Após confirmar o
          código, você poderá criar uma nova senha imediatamente.
        </p>
      </div>

      <div aria-live="polite">
        {error && (
          <p
            id="forgot-error"
            className="rounded-sm border border-danger bg-danger-surface px-4 py-3 text-label leading-[18px] text-ink"
          >
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !email.trim()}
        aria-busy={loading}
        className={buttonClass({
          variant: "ink",
          className: "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink",
        })}
      >
        {loading ? "Enviando código…" : "Enviar código de verificação"}
      </button>

      <div className="flex items-center justify-between border-t border-border pt-5 text-label/caption text-muted">
        <span>Lembrou sua senha?</span>
        <Link
          href="/login"
          className={textLinkClass({
            className: "font-semibold text-ink underline underline-offset-4",
          })}
        >
          Voltar para o login
        </Link>
      </div>
    </form>
  );
}
