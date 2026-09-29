"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  listMyTenants,
  setStoredToken,
  switchTenant,
  type MyTenantResponse,
} from "@/lib/api";
import { buttonClass } from "@/components/ui/interactive";

const roleLabels: Record<MyTenantResponse["role"], string> = {
  admin: "Admin",
  professor: "Professor",
  aluno: "Aluno",
  coordenador: "Coordenador",
};

export function TenantPicker() {
  const router = useRouter();
  const [tenants, setTenants] = useState<MyTenantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchTenants() {
      try {
        const fetched = await listMyTenants();
        if (!isMounted) return;
        const active = fetched.filter((t) => t.active && !t.deleted);
        if (active.length === 0) {
          router.replace("/login");
          return;
        }
        setTenants(active);
      } catch {
        if (isMounted) {
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTenants();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSelect(tenant: MyTenantResponse) {
    if (!tenant.active || switchingId) return;

    setError(null);
    setSwitchingId(tenant.id);

    try {
      const result = await switchTenant(tenant.id);
      setStoredToken(result.access_token);
      setSuccess(true);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError(
          "Não foi possível conectar à instituição. Verifique sua conexão e tente de novo.",
        );
      }
      setSwitchingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mt-9 flex items-center justify-center py-12">
        <p className="text-label/caption text-muted">Carregando suas instituições…</p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return null;
  }

  return (
    <div className="mt-9 flex flex-col gap-3">
      {tenants.map((tenant) => {
        const isActive = tenant.active;
        const isSwitching = switchingId === tenant.id;
        const isDisabled = !isActive || (switchingId !== null && !isSwitching);

        return (
          <button
            key={tenant.id}
            type="button"
            disabled={isDisabled}
            aria-busy={isSwitching}
            onClick={() => handleSelect(tenant)}
            className={`
              group relative flex w-full flex-col items-start gap-3 rounded-sm border
              px-6 py-5 text-left transition-all duration-150 ease-out
              ${
                isActive
                  ? "border-control-border bg-paper hover:border-ink hover:bg-surface focus-visible:border-ink"
                  : "cursor-not-allowed border-border bg-surface opacity-60"
              }
              ${isSwitching ? "border-ink bg-surface" : ""}
              ${isDisabled && isActive ? "pointer-events-none opacity-50" : ""}
            `}
          >
            {/* Top row: name + role badge */}
            <div className="flex w-full items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-heading/heading font-bold tracking-tight text-ink">
                  {tenant.name}
                </span>
                <span className="font-mono text-caption/caption text-muted">
                  {tenant.slug}
                </span>
              </div>

              <span
                className={`
                  mt-0.5 shrink-0 rounded-sm px-2.5 py-1 font-mono text-caption/caption font-bold uppercase tracking-caps
                  ${isActive ? "bg-accent text-ink" : "bg-border text-muted"}
                `}
              >
                {roleLabels[tenant.role]}
              </span>
            </div>

            {/* Inactive notice */}
            {!isActive ? (
              <span className="text-label/caption text-warn font-medium">
                Instituição inativa
              </span>
            ) : null}

            {/* Switching indicator */}
            {isSwitching ? (
              <span className="text-label/caption text-muted font-medium">
                Entrando…
              </span>
            ) : null}
          </button>
        );
      })}

      {/* Feedback area */}
      <div aria-live="polite" className="mt-1">
        {error ? (
          <p className="rounded-sm border border-danger bg-danger-surface px-4 py-3 text-label leading-[18px] text-ink">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-sm border border-success bg-success-surface px-4 py-3 text-label leading-[18px] text-ink">
            Conectado à instituição. O painel das turmas vem a seguir.
          </p>
        ) : null}
      </div>

      {/* Back to login */}
      <a
        href="/login"
        className={buttonClass({
          variant: "outline",
          size: "md",
          className: "mt-3 self-start",
        })}
      >
        Voltar ao login
      </a>
    </div>
  );
}
