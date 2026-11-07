"use client";

import React, { useState } from "react";
import type { UserProfileResponse } from "@/services/user";
import { getInitials, formatDate } from "@/lib/utils";
import { CopyIcon, CheckIcon } from "@/components/icons";

export interface PerfilUserCardProps {
  user: UserProfileResponse | null;
}

export function PerfilUserCard({ user }: PerfilUserCardProps) {
  const [copiedId, setCopiedId] = useState(false);

  if (!user) return null;

  const initials = getInitials(user.name);

  const handleCopyId = () => {
    if (!user.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
      {/* Coluna Esquerda: Título da Seção */}
      <div className="md:col-span-4">
        <h2 className="font-sans text-heading font-bold text-ink">
          Dados Pessoais
        </h2>
        <p className="mt-1 text-caption text-muted leading-relaxed">
          Informações cadastrais e credencial única de usuário na plataforma Locus.
        </p>
      </div>

      {/* Coluna Direita: Linhas Divididas por Hairline */}
      <div className="md:col-span-8 rounded-xl border border-border bg-white divide-y divide-border shadow-2xs overflow-hidden">
        {/* Linha 1: Avatar e Nome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-4">
          <span className="text-label font-medium text-muted">Identidade</span>

          <div className="flex items-center gap-3 sm:text-right">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-accent font-extrabold text-body shadow-2xs">
              {initials}
            </div>
            <div>
              <span className="block font-sans text-body font-bold text-ink">
                {user.name}
              </span>
              <span className="block font-mono text-[11px] text-muted">
                {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Linha 2: E-mail */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-2">
          <span className="text-label font-medium text-muted">E-mail cadastrado</span>
          <span className="font-mono text-label text-ink sm:text-right select-all">
            {user.email}
          </span>
        </div>

        {/* Linha 3: UUID com Copiar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-3">
          <div>
            <span className="block text-label font-medium text-muted">ID de Usuário (UUID)</span>
            <span className="block text-[11px] text-muted/80">Chave pública para auditoria e suporte</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-caption text-ink bg-surface px-2.5 py-1 rounded-md border border-border truncate max-w-[220px] select-all">
              {user.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-caption font-semibold transition-all cursor-pointer ${
                copiedId
                  ? "border-success bg-success-surface text-success"
                  : "border-border bg-white text-ink hover:border-ink/40 hover:bg-surface"
              }`}
              title="Copiar ID"
            >
              {copiedId ? (
                <>
                  <CheckIcon size={12} className="text-success" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <CopyIcon size={12} className="text-muted" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Linha 4: Data de Cadastro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-2">
          <span className="text-label font-medium text-muted">Cadastro realizado em</span>
          <span className="font-sans text-body text-ink sm:text-right">
            {user.created_at ? formatDate(user.created_at) : "Não informada"}
          </span>
        </div>
      </div>
    </section>
  );
}
