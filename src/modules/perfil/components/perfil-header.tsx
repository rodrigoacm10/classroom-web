"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/global";
import { getFormattedDateSubtitle } from "@/lib/utils";

export interface PerfilHeaderProps {
  userName?: string;
  userEmail?: string;
}

export function PerfilHeader({ userName, userEmail }: PerfilHeaderProps) {
  return (
    <PageHeader
      bordered
      eyebrow={getFormattedDateSubtitle()}
      title="Meu Perfil"
      description={
        userName ? (
          <>
            <strong className="text-ink font-semibold">{userName}</strong> ·{" "}
            <span className="font-mono text-[13px] text-muted">{userEmail}</span>
          </>
        ) : (
          "Informações pessoais, instituições vinculadas e segurança de acesso."
        )
      }
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
