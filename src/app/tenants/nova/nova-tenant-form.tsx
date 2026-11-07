"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, createTenant, switchTenant, setStoredToken } from "@/lib/api";
import { buttonClass, fieldClass, textLinkClass } from "@/components/ui/interactive";

function generateSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Espaços para hífen
    .replace(/-+/g, "-"); // Hífens duplicados
}

export function NovaTenantForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"form" | "creating" | "switching">("form");

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();

    if (trimmedName.length < 3) {
      setError("O nome da instituição deve ter no mínimo 3 caracteres.");
      return;
    }

    if (!trimmedSlug || trimmedSlug.length < 2) {
      setError("O identificador (slug) deve ter no mínimo 2 caracteres.");
      return;
    }

    setPending(true);
    setPhase("creating");

    try {
      // 1. Criar instituição
      const newTenant = await createTenant({
        name: trimmedName,
        slug: trimmedSlug,
      });

      // 2. Conectar à nova instituição como ADMIN
      setPhase("switching");
      const switchRes = await switchTenant(newTenant.id);
      setStoredToken(switchRes.access_token);

      // 3. Redirecionar para o dashboard
      router.replace("/dashboard");
    } catch (cause) {
      setPending(false);
      setPhase("form");

      if (cause instanceof ApiError) {
        if (cause.status === 409 || cause.message?.toLowerCase().includes("já existe")) {
          setError(
            "Já existe uma instituição com este identificador (slug). Escolha um identificador diferente.",
          );
        } else if (cause.status === 401) {
          setError("Sua sessão expirou. Redirecionando para o login…");
          setTimeout(() => router.replace("/login"), 1500);
        } else {
          setError(cause.message);
        }
      } else {
        setError(
          "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        );
      }
    }
  }

  const buttonLabel =
    phase === "creating"
      ? "Criando instituição…"
      : phase === "switching"
        ? "Conectando ao painel…"
        : "Criar instituição e continuar";

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
      {/* Nome */}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-label/caption text-ink">Nome da instituição</span>
        <input
          type="text"
          name="name"
          required
          disabled={pending}
          placeholder="Ex: Faculdade de Tecnologia de São Paulo"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className={fieldClass()}
        />
        <span className="text-caption/caption text-muted">
          Nome oficial do campus, faculdade ou escola que será exibido no sistema.
        </span>
      </label>

      {/* Slug */}
      <label className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-label/caption text-ink">Identificador (slug)</span>
          <span className="font-mono text-caption/caption text-muted">letras minúsculas e hífens</span>
        </div>
        <input
          type="text"
          name="slug"
          required
          disabled={pending}
          placeholder="fatec-sp"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className={fieldClass({ invalid: Boolean(error && error.includes("identificador")) })}
        />
        <span className="text-caption/caption text-muted">
          Identificador exclusivo utilizado nas chamadas e configurações da instituição.
        </span>
      </label>

      {/* Info Notice */}
      <div className="rounded-sm border border-border bg-surface p-4 text-label leading-[18px] text-ink">
        <p className="font-semibold">Papel de Administrador</p>
        <p className="mt-1 text-muted">
          Como criador desta instituição, você terá permissão total para gerenciar salas, turmas,
          convidar novos professores e acompanhar relatórios acadêmicos.
        </p>
      </div>

      {/* Feedback area */}
      <div aria-live="polite">
        {error ? (
          <p
            id="tenant-create-error"
            className="rounded-sm border border-danger bg-danger-surface px-4 py-3 text-label leading-[18px] text-ink"
          >
            {error}
          </p>
        ) : null}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending || !name.trim() || !slug.trim()}
          aria-busy={pending}
          className={buttonClass({
            variant: "ink",
            size: "lg",
            className: "w-full disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink",
          })}
        >
          {buttonLabel}
        </button>

        <div className="flex items-center justify-between pt-2">
          <Link
            href="/tenants"
            className={textLinkClass({
              className: "text-label/caption text-muted hover:text-ink",
            })}
          >
            ← Voltar para instituições
          </Link>
          <Link
            href="/login"
            className={textLinkClass({
              className: "text-label/caption text-muted hover:text-ink",
            })}
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </form>
  );
}
