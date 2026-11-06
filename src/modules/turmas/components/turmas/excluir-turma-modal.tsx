"use client";

import React from "react";
import { CloseIcon, AlertTriangleIcon, TrashIcon } from "@/components/icons";
import type { SubjectClassItem } from "@/lib/api";

export interface ExcluirTurmaModalProps {
  turma: SubjectClassItem | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ExcluirTurmaModal({
  turma,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: ExcluirTurmaModalProps) {
  if (!isOpen || !turma) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-excluir-turma-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-red-50/60">
          <div className="flex items-center gap-2.5 text-danger">
            <AlertTriangleIcon size={18} />
            <h3
              id="modal-excluir-turma-title"
              className="font-sans text-title font-bold text-red-900"
            >
              Excluir Turma
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Fechar modal"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 flex flex-col gap-5 text-left">
          {/* Identificação da turma */}
          <div className="flex items-center gap-3.5 rounded-lg border border-border bg-surface/50 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-accent font-mono text-label font-bold">
              {turma.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-body font-bold text-ink truncate">
                {turma.name}
              </span>
              <span className="font-sans text-caption text-muted truncate">
                {turma.discipline_name} • {turma.student_count} alunos matriculados
              </span>
            </div>
          </div>

          <p className="font-sans text-body text-ink leading-relaxed">
            Tem certeza de que deseja excluir a turma <strong>{turma.name}</strong>?
          </p>

          <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-caption text-amber-900 leading-relaxed">
            <strong>Auditoria e Histórico preservados:</strong> Esta ação realiza exclusão lógica (soft delete). As sessões de chamada anteriores, frequências e registros de geofence permanecerão arquivados para relatórios acadêmicos, mas a turma não aceitará novas chamadas.
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-border px-4 py-2 font-sans text-label font-semibold text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-danger px-4 py-2 font-sans text-label font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Excluindo…</span>
                </>
              ) : (
                <>
                  <TrashIcon size={14} />
                  <span>Sim, excluir turma</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
