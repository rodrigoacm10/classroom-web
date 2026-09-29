"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  login,
  listMyTenants,
  setStoredToken,
  switchTenant,
} from "@/lib/api";
import { buttonClass, fieldClass } from "@/components/ui/interactive";

type Phase = "credentials" | "resolving" | "switching";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [phase, setPhase] = useState<Phase>("credentials");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setPending(true);
    setPhase("credentials");

    try {
      // 1. Authenticate (base token, no tenant)
      const result = await login(email, password);
      const baseToken = result.access_token;
      setStoredToken(baseToken);

      // 2. Resolve tenants
      setPhase("resolving");
      const tenants = await listMyTenants(baseToken);

      // Filter: only active + not deleted
      const activeTenants = tenants.filter((t) => t.active && !t.deleted);

      if (activeTenants.length === 0) {
        setError(
          "Sua conta não está vinculada a nenhuma instituição ativa. Verifique com a coordenação.",
        );
        setPending(false);
        return;
      }

      if (activeTenants.length === 1) {
        // Auto-switch
        setPhase("switching");
        const switched = await switchTenant(activeTenants[0].id, baseToken);
        setStoredToken(switched.access_token);
        setSuccess(true);
        setPending(false);
        return;
      }

      // Multiple tenants — base token kept in memory, redirect to picker
      router.push("/tenants");
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError(
          "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.",
        );
      }
      setPending(false);
    }
  }

  const buttonLabel =
    phase === "resolving"
      ? "Verificando instituições…"
      : phase === "switching"
        ? "Entrando na instituição…"
        : pending
          ? "Entrando…"
          : "Entrar";

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

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="font-semibold text-label/caption text-ink">
            Senha
          </label>
          <Link
            href="/forgot-password"
            className="text-label/caption text-muted transition-colors hover:text-ink hover:underline underline-offset-4"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <input
          id="login-password"
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
      </div>

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
        {buttonLabel}
      </button>
    </form>
  );
}
