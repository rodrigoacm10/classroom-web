"use client";

import React from "react";
import { CloseIcon, TrashIcon } from "@/components/icons";
import type { AlunoTurma } from "../../types";

export interface DesmatricularModalProps {
  isOpen: boolean;
  onClose: () => void;
  turma: AlunoTurma | null;
  studentName: string;
  onConfirm: () => void;
}

export function DesmatricularModal({
  isOpen,
  onClose,
  turma,
  studentName,
  onConfirm,
}: DesmatricularModalProps) {
  if (!isOpen || !turma) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-2.5 text-danger">
            <TrashIcon size={18} />
            <h2 className="text-heading font-extrabold text-ink tracking-tight">
              Desmatricular Aluno
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-body text-ink">
            Tem certeza de que deseja desmatricular <strong>{studentName}</strong> da disciplina{" "}
            <strong>{turma.discipline_name}</strong>?
          </p>

          <div className="rounded-lg bg-surface p-3 text-caption text-muted space-y-1">
            <p>
              • <strong>Turma:</strong> {turma.name}
            </p>
            <p>
              • <strong>Professor:</strong> {turma.professor_name}
            </p>
            <p>
              • O aluno não constará mais na lista ativa de chamadas desta matéria.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-label font-semibold text-ink hover:bg-surface transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex items-center gap-1.5 rounded-lg bg-danger px-5 py-2 text-label font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <TrashIcon size={14} />
              <span>Desmatricular</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
