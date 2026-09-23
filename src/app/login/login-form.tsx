"use client";

import { FormEvent, useState } from "react";
import { ApiError, login } from "@/lib/api";
import { buttonClass, fieldClass } from "@/components/ui/interactive";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setPending(true);

    try {
      const result = await login(email, password);
      sessionStorage.setItem("access_token", result.access_token);
      setSuccess(true);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError(
          "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.",
        );
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-label/caption text-ink">E-mail</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass({ invalid: Boolean(error) })}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-semibold text-label/caption text-ink">Senha</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldClass({ invalid: Boolean(error) })}
        />
      </label>

      <div aria-live="polite">
        {error ? (
          <p
            id="login-error"
            className="rounded-sm border border-danger bg-danger-surface px-4 py-3 text-label leading-[18px] text-ink"
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-sm border border-success bg-success-surface px-4 py-3 text-label leading-[18px] text-ink">
            Autenticado. A sessão ficou neste navegador; o painel das turmas vem a
            seguir.
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className={buttonClass({
          variant: "ink",
          className: "mt-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink",
        })}
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
