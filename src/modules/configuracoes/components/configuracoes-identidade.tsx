"use client";

import React from "react";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import type { MyTenantResponse } from "@/services/tenants";

export interface ConfiguracoesIdentidadeProps {
  tenant: MyTenantResponse;
  copiedId: boolean;
  onCopyId: () => void;
}

export function ConfiguracoesIdentidade({
  tenant,
  copiedId,
  onCopyId,
}: ConfiguracoesIdentidadeProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
      {/* Coluna Esquerda: Título da Seção */}
      <div className="md:col-span-4">
        <h2 className="font-sans text-heading font-bold text-ink">
          Identidade
        </h2>
        <p className="mt-1 text-caption text-muted leading-relaxed">
          Identificadores oficiais da instituição para credenciamento, contratos e integrações com o Locus.
        </p>
      </div>

      {/* Coluna Direita: Linhas Divididas por Hairline */}
      <div className="md:col-span-8 rounded-xl border border-border bg-white divide-y divide-border shadow-2xs overflow-hidden">
        {/* Linha 1: Nome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-2">
          <span className="text-label font-medium text-muted">Nome oficial</span>
          <span className="font-sans text-body font-semibold text-ink text-left sm:text-right">
            {tenant.name}
          </span>
        </div>

        {/* Linha 2: Slug */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-2">
          <span className="text-label font-medium text-muted">Domínio interno (Slug)</span>
          <span className="font-mono text-label text-ink text-left sm:text-right">
            app.locus.edu/<strong className="text-accent-dark font-bold">{tenant.slug}</strong>
          </span>
        </div>

        {/* Linha 3: UUID com Copiar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-3">
          <div>
            <span className="block text-label font-medium text-muted">UUID da Instituição</span>
            <span className="block text-[11px] text-muted/80">Identificador único do tenant no banco</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-caption text-ink bg-surface px-2.5 py-1 rounded-md border border-border truncate max-w-[220px] select-all">
              {tenant.id}
            </span>
            <button
              type="button"
              onClick={onCopyId}
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

        {/* Linha 4: Data de Criação */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-2">
          <span className="text-label font-medium text-muted">Membro desde</span>
          <span className="font-sans text-body text-ink text-left sm:text-right">
            {tenant.created_at ? formatDate(tenant.created_at) : "Não informada"}
          </span>
        </div>
      </div>
    </section>
  );
}
