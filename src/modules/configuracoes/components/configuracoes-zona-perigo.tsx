"use client";

import React from "react";
import { TrashIcon } from "@/components/icons";
import type { MyTenantResponse } from "@/services/tenants";

export interface ConfiguracoesZonaPerigoProps {
  tenant: MyTenantResponse;
  isAdmin: boolean;
  onOpenSuspendModal: () => void;
  onOpenDeleteModal: () => void;
}

export function ConfiguracoesZonaPerigo({
  tenant,
  isAdmin,
  onOpenSuspendModal,
  onOpenDeleteModal,
}: ConfiguracoesZonaPerigoProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start pt-6 border-t border-border">
      {/* Coluna Esquerda: Título da Seção */}
      <div className="md:col-span-4">
        <h2 className="font-sans text-heading font-bold text-danger">
          Zona de Perigo
        </h2>
        <p className="mt-1 text-caption text-muted leading-relaxed">
          Ações administrativas irreversíveis ou de impacto operacional sobre o ciclo de vida deste tenant.
        </p>
      </div>

      {/* Coluna Direita: Linhas Divididas por Hairline */}
      <div className="md:col-span-8 rounded-xl border border-danger/30 bg-white divide-y divide-border shadow-2xs overflow-hidden">
        {!isAdmin ? (
          <div className="p-5 text-body text-muted leading-relaxed">
            Seu perfil atual não possui permissões administrativas para suspender ou excluir este tenant.
            Para modificações de ciclo de vida, contate um Administrador Geral.
          </div>
        ) : (
          <>
            {/* Linha 1: Suspender / Reativar Instituição */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
              <div className="max-w-md">
                <span className="block font-sans text-label font-bold text-ink">
                  {tenant.active ? "Suspender Operações da Instituição" : "Reativar Operações da Instituição"}
                </span>
                <p className="mt-0.5 text-caption text-muted leading-relaxed">
                  {tenant.active
                    ? "Bloqueia o início de novas chamadas ao vivo e o ingresso de novos membros, mantendo intactos os históricos e relatórios."
                    : "Restaura o funcionamento integral da instituição, permitindo que os docentes voltem a iniciar chamadas."}
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenSuspendModal}
                className={`shrink-0 rounded-lg border px-4 py-2 text-label font-bold transition-all cursor-pointer ${
                  tenant.active
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                    : "border-success/40 bg-success-surface text-success hover:bg-success/20"
                }`}
              >
                {tenant.active ? "Suspender Instituição" : "Reativar Instituição"}
              </button>
            </div>

            {/* Linha 2: Excluir Instituição */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
              <div className="max-w-md">
                <span className="block font-sans text-label font-bold text-danger">
                  Excluir Instituição Definitivamente
                </span>
                <p className="mt-0.5 text-caption text-muted leading-relaxed">
                  Desativa a instituição no sistema e desvincula os membros. Esta ação exige confirmação estrita por digitação.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenDeleteModal}
                className="shrink-0 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger-surface px-4 py-2 text-label font-bold text-danger hover:bg-danger hover:text-white transition-all cursor-pointer"
              >
                <TrashIcon size={14} />
                <span>Excluir Instituição</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
