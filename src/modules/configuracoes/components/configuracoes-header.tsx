"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/global";
import { getFormattedDateSubtitle } from "@/lib/utils";
import type { MyTenantResponse } from "@/services/tenants";

export interface ConfiguracoesHeaderProps {
  tenant: MyTenantResponse | null;
  role?: string | null;
  loading: boolean;
}

const roleLabels: Record<string, string> = {
  admin: "Administrador Geral",
  coordenador: "Coordenador Acadêmico",
  professor: "Docente",
  aluno: "Estudante",
};

export function ConfiguracoesHeader({
  tenant,
  role,
  loading,
}: ConfiguracoesHeaderProps) {
  const roleLabel = role ? roleLabels[role.toLowerCase()] ?? role : null;

  const description = loading ? (
    "Carregando configurações da instituição..."
  ) : tenant ? (
    <>
      <strong className="text-ink font-semibold">{tenant.name}</strong> ·{" "}
      <span className="font-mono text-[13px] text-muted">{tenant.slug}</span>
      {roleLabel && (
        <>
          {" "}·{" "}
          <span className="font-medium text-ink">{roleLabel}</span>
        </>
      )}
      {" "}·{" "}
      <span className={tenant.active ? "text-success font-semibold" : "text-danger font-semibold"}>
        {tenant.active ? "Instituição Ativa" : "Instituição Suspensa"}
      </span>
    </>
  ) : (
    "Gestão cadastral, parâmetros de geofencing e regras de presença da instituição."
  );

  return (
    <PageHeader
      bordered
      eyebrow={getFormattedDateSubtitle()}
      title="Configurações"
      description={description}
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-11 items-center gap-2 rounded-md border border-border px-4 font-semibold text-ink text-[14px] leading-body transition-colors hover:bg-surface"
          >
            <span>← Início</span>
          </Link>

          <Link
            href="/tenants"
            className="flex h-11 items-center gap-2 rounded-md bg-ink px-[18px] font-bold text-paper text-[14px] leading-body transition-opacity hover:opacity-80"
          >
            <span>Trocar instituição</span>
          </Link>
        </div>
      }
    />
  );
}
