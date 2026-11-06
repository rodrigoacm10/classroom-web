"use client";

import React, { useState } from "react";
import { CloseIcon, CheckIcon } from "@/components/icons";
import { getInitials } from "@/lib/utils";
import type { MembroItem, MembroRole } from "../types";

export interface AlterarCargoModalProps {
  member: MembroItem | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (newRole: MembroRole) => Promise<void> | void;
}

export function AlterarCargoModal({
  member,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: AlterarCargoModalProps) {
  const [selectedRole, setSelectedRole] = useState<MembroRole>(member?.role || "professor");

  // Atualiza estado local quando o modal abre com novo membro
  React.useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const rolesOptions: {
    id: MembroRole;
    label: string;
    description: string;
    badgeStyle: string;
  }[] = [
    {
      id: "professor",
      label: "Professor",
      description:
        "Gerencia suas próprias turmas, realiza chamadas ao vivo via geofence e visualiza presenças.",
      badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "coordenador",
      label: "Coordenador",
      description:
        "Visão pedagógica global de todas as turmas, relatórios consolidados e envio de convites de docentes.",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      id: "admin",
      label: "Administrador",
      description:
        "Controle institucional total, gerenciamento de membros, configuração de salas físicas e auditoria.",
      badgeStyle: "bg-ink text-paper border-ink",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === member.role) {
      onClose();
      return;
    }
    onConfirm(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-white shadow-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface/40">
          <div>
            <h3 className="font-sans text-title font-bold text-ink">
              Alterar Cargo Institucional
            </h3>
            <p className="font-sans text-caption text-muted mt-0.5">
              Atualize as permissões de acesso deste membro no tenant ativo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Ficha rápida do membro */}
        <div className="flex items-center gap-3.5 border-b border-border bg-[#FAFAFA] px-6 py-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper font-mono text-body font-bold">
            {getInitials(member.name)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-body font-bold text-ink truncate">
              {member.name}
            </span>
            <span className="font-sans text-caption text-muted truncate">
              {member.email}
            </span>
          </div>
        </div>

        {/* Formulário de Seleção */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <span className="font-sans text-caption font-bold uppercase tracking-caps text-muted">
              Selecione o novo papel
            </span>

            <div className="flex flex-col gap-2.5">
              {rolesOptions.map((opt) => {
                const isSelected = selectedRole === opt.id;
                const isCurrent = member.role === opt.id;

                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3.5 rounded-lg border p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? "border-ink bg-surface/60 shadow-xs ring-1 ring-ink/20"
                        : "border-border bg-white hover:border-muted hover:bg-surface/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedRole(opt.id)}
                      className="mt-0.5 h-4 w-4 accent-ink cursor-pointer"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-body font-bold text-ink">
                          {opt.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-semibold text-muted bg-white border border-border px-1.5 py-0.5 rounded">
                            Papel Atual
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-caption text-muted leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Rodapé e Botões */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-border px-4 py-2 font-sans text-label font-semibold text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading || selectedRole === member.role}
              className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 font-sans text-label font-bold text-paper transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <span>Salvando...</span>
              ) : (
                <>
                  <CheckIcon size={14} />
                  <span>Salvar alteração</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
