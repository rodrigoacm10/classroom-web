"use client";

import React from "react";
import { formatDate } from "@/lib/utils";

export interface PerfilKpisProps {
  userRole?: string | null;
  activeTenantName?: string | null;
  totalTenants: number;
  createdAt?: string | null;
  loading: boolean;
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  coordenador: "Coordenador",
  professor: "Docente",
  aluno: "Estudante",
};

export function PerfilKpis({
  userRole,
  activeTenantName,
  totalTenants,
  createdAt,
  loading,
}: PerfilKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
      {/* KPI 1: Papel na Sessão */}
      <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Papel na sessão
        </div>
        <div className="font-sans text-[26px] font-semibold tracking-tight text-ink leading-tight mt-1 truncate">
          {loading ? (
            <span className="inline-block h-8 w-24 animate-pulse rounded bg-surface" />
          ) : (
            roleLabels[userRole?.toLowerCase() ?? ""] ?? userRole ?? "Membro"
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          escopo no tenant ativo
        </div>
      </div>

      {/* KPI 2: Instituição Atual */}
      <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Instituição atual
        </div>
        <div className="font-sans text-[22px] font-semibold tracking-tight text-ink leading-snug mt-1 truncate">
          {loading ? (
            <span className="inline-block h-8 w-32 animate-pulse rounded bg-surface" />
          ) : (
            activeTenantName ?? "Nenhuma"
          )}
        </div>
        <div className="font-sans text-caption text-muted truncate">
          contexto selecionado
        </div>
      </div>

      {/* KPI 3: Vínculos */}
      <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Instituições
        </div>
        <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
          {loading ? (
            <span className="inline-block h-8 w-12 animate-pulse rounded bg-surface" />
          ) : (
            totalTenants
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          {totalTenants === 1 ? "vínculo ativo" : "vínculos ativos"}
        </div>
      </div>

      {/* KPI 4: Membro Desde */}
      <div className="flex flex-col gap-1 py-4 md:pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Membro desde
        </div>
        <div className="font-sans text-[20px] font-semibold tracking-tight text-ink leading-snug mt-1">
          {loading ? (
            <span className="inline-block h-8 w-24 animate-pulse rounded bg-surface" />
          ) : createdAt ? (
            formatDate(createdAt)
          ) : (
            "--"
          )}
        </div>
        <div className="font-sans text-caption text-muted">
          credenciais verificadas
        </div>
      </div>
    </div>
  );
}
