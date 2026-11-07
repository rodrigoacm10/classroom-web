"use client";

import React from "react";
import Link from "next/link";
import type { MyTenantResponse } from "@/services/tenants";

export interface PerfilTenantsListProps {
  tenants: MyTenantResponse[];
  activeTenantId?: string | null;
  switchingTenantId?: string | null;
  onSwitchTenant: (tenantId: string) => void;
}

const roleBadges: Record<string, string> = {
  admin: "Admin",
  coordenador: "Coord.",
  professor: "Docente",
  aluno: "Aluno",
};

export function PerfilTenantsList({
  tenants,
  activeTenantId,
  switchingTenantId,
  onSwitchTenant,
}: PerfilTenantsListProps) {
  const activeList = tenants.filter((t) => t.active && !t.deleted);

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start pt-8 border-t border-border">
      {/* Coluna Esquerda: Título da Seção */}
      <div className="md:col-span-4">
        <h2 className="font-sans text-heading font-bold text-ink">
          Instituições Vinculadas
        </h2>
        <p className="mt-1 text-caption text-muted leading-relaxed">
          Ambientes de ensino aos quais sua conta tem acesso direto.
        </p>

        <div className="mt-4">
          <Link
            href="/tenants"
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-ink hover:underline cursor-pointer"
          >
            <span>Gerenciar todas as instituições</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Coluna Direita: Tabela de Tenants com Hairline Dividers */}
      <div className="md:col-span-8 rounded-xl border border-border bg-white divide-y divide-border shadow-2xs overflow-hidden">
        {activeList.length === 0 ? (
          <div className="p-6 text-center text-muted text-body">
            Nenhuma instituição ativa vinculada à sua conta.
          </div>
        ) : (
          activeList.map((tenant) => {
            const isActive = tenant.id === activeTenantId;
            const isSwitching = switchingTenantId === tenant.id;

            return (
              <div
                key={tenant.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-3 transition-colors ${
                  isActive ? "bg-surface/30" : "hover:bg-surface/50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-body font-bold text-ink">
                      {tenant.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase font-bold text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                      {roleBadges[tenant.role] ?? tenant.role}
                    </span>
                  </div>
                  <span className="font-mono text-caption text-muted">
                    app.locus.edu/{tenant.slug}
                  </span>
                </div>

                <div className="shrink-0 sm:text-right">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-caption font-bold text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Sessão Atual
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isSwitching}
                      onClick={() => onSwitchTenant(tenant.id)}
                      className="rounded-lg border border-border bg-white px-3.5 py-1.5 text-caption font-bold text-ink transition-colors hover:bg-surface hover:border-ink/40 disabled:opacity-40 cursor-pointer shadow-2xs"
                    >
                      {isSwitching ? (
                        <span className="flex items-center gap-1.5">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                          <span>Trocando...</span>
                        </span>
                      ) : (
                        <span>Alternar</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
