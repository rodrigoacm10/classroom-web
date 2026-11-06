"use client";

import React from "react";
import { CloseIcon, AlertTriangleIcon, TrashIcon } from "@/components/icons";
import { getInitials } from "@/lib/utils";
import type { MembroItem } from "../types";

export interface RemoverMembroModalProps {
  member: MembroItem | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function RemoverMembroModal({
  member,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: RemoverMembroModalProps) {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-white shadow-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-red-50/60">
          <div className="flex items-center gap-2.5 text-red-700">
            <AlertTriangleIcon size={18} />
            <h3 className="font-sans text-title font-bold text-red-900">
              Remover Membro
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink transition-colors cursor-pointer"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 flex flex-col gap-5">
          {/* Identificação do membro */}
          <div className="flex items-center gap-3.5 rounded-lg border border-border bg-surface/50 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper font-mono text-label font-bold">
              {getInitials(member.name)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-body font-bold text-ink truncate">
                {member.name}
              </span>
              <span className="font-sans text-caption text-muted truncate">
                {member.email} • {member.role.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="font-sans text-body text-ink leading-relaxed">
            Tem certeza de que deseja remover este membro da instituição?
          </p>

          <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-caption text-amber-900 leading-relaxed">
            <strong>Aviso de impacto:</strong> O usuário perderá imediatamente o acesso a este tenant, às turmas atribuídas e ao lançamento de presenças. Os registros históricos anteriores serão preservados para auditoria.
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-border px-4 py-2 font-sans text-label font-semibold text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-sans text-label font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <span>Removendo...</span>
              ) : (
                <>
                  <TrashIcon size={14} />
                  <span>Sim, desvincular membro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
