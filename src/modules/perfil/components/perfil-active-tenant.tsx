"use client";

import React from "react";
import type { MyTenantResponse } from "@/services/tenants";
import { CheckIcon } from "@/components/icons";

export interface PerfilActiveTenantProps {
  activeTenant: MyTenantResponse | null;
  userRole?: string | null;
}

const roleDescriptions: Record<string, string> = {
  admin: "Acesso total irrestrito: turmas, salas, membros, convites e gestão de tenant.",
  coordenador: "Supervisão pedagógica: monitoramento de turmas, alunos em risco e relatórios.",
  professor: "Docência ativa: abertura de chamadas geoespaciais, turmas e auditoria de presença.",
  aluno: "Estudante: confirmação de presença e acompanhamento de frequência.",
};

const permissionsByRole: Record<string, string[]> = {
  admin: [
    "Gerenciamento completo de turmas, salas e membros",
    "Envio e revogação de convites institucionais",
    "Acesso e exportação de relatórios gerenciais consolidados",
    "Abertura e auditoria irrestrita de chamadas de presença",
  ],
  coordenador: [
    "Consulta e monitoramento de frequência por curso e turma",
    "Acompanhamento de alunos em risco de reprovação",
    "Emissão e impressão de relatórios pedagógicos",
    "Supervisão de chamadas e histórico acadêmico",
  ],
  professor: [
    "Abertura de chamadas ao vivo com geofencing WGS84",
    "Criação e gerenciamento de suas turmas e disciplinas",
    "Matrícula de alunos a partir do catálogo institucional",
    "Auditoria de presenças irregulares e revisão de fotos",
  ],
  aluno: [
    "Confirmação de presença em chamadas ativas",
    "Acompanhamento de frequência e alertas de faltas",
    "Consulta de turmas matriculadas",
  ],
};

export function PerfilActiveTenant({
  activeTenant,
  userRole,
}: PerfilActiveTenantProps) {
  const roleName = userRole ?? activeTenant?.role ?? "membro";
  const permissions =
    permissionsByRole[roleName.toLowerCase()] ?? permissionsByRole.professor;

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start pt-8 border-t border-border">
      {/* Coluna Esquerda: Título da Seção */}
      <div className="md:col-span-4">
        <h2 className="font-sans text-heading font-bold text-ink">
          Instituição Ativa
        </h2>
        <p className="mt-1 text-caption text-muted leading-relaxed">
          Ambiente institucional selecionado onde as turmas, salas e chamadas estão vinculadas.
        </p>
      </div>

      {/* Coluna Direita: Linhas Divididas por Hairline */}
      <div className="md:col-span-8 rounded-xl border border-border bg-white divide-y divide-border shadow-2xs overflow-hidden">
        {/* Linha 1: Nome e Slug */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-2">
          <span className="text-label font-medium text-muted">Instituição em operação</span>
          <div className="sm:text-right">
            <span className="block font-sans text-body font-bold text-ink">
              {activeTenant?.name ?? "Nenhuma instituição ativa"}
            </span>
            {activeTenant?.slug && (
              <span className="block font-mono text-[11px] text-muted">
                app.locus.edu/{activeTenant.slug}
              </span>
            )}
          </div>
        </div>

        {/* Linha 2: Papel e Descrição */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-2">
          <span className="text-label font-medium text-muted">Papel atribuído</span>
          <div className="sm:text-right">
            <span className="font-sans text-body font-bold text-ink uppercase tracking-caps">
              {roleName}
            </span>
            <span className="block text-[11px] text-muted/80 max-w-sm sm:text-right">
              {roleDescriptions[roleName.toLowerCase()] ?? "Acesso padrão aos recursos."}
            </span>
          </div>
        </div>

        {/* Linha 3: Permissões Concedidas */}
        <div className="px-5 py-4">
          <span className="block text-label font-medium text-muted mb-2.5">
            Permissões ativas neste tenant
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption text-ink">
            {permissions.map((perm) => (
              <div key={perm} className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckIcon size={10} />
                </span>
                <span className="text-muted leading-tight">{perm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
