"use client";

import React, { useState } from "react";
import { CloseIcon, PlusIcon } from "@/components/icons";
import type { TurmaOption } from "../../types";

export interface MatricularModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTurmas: TurmaOption[];
  studentName: string;
  onConfirmEnroll: (turmaId: string) => void;
}

export function MatricularModal({
  isOpen,
  onClose,
  availableTurmas,
  studentName,
  onConfirmEnroll,
}: MatricularModalProps) {
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTurmaId) return;
    onConfirmEnroll(selectedTurmaId);
    setSelectedTurmaId("");
  };

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
          <div>
            <h2 className="text-heading font-extrabold text-ink tracking-tight">
              Matricular Aluno
            </h2>
            <p className="text-caption text-muted mt-0.5 truncate max-w-xs">
              Aluno: <strong>{studentName}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-sans text-label font-bold text-ink mb-1.5">
              Selecione a Turma *
            </label>
            {availableTurmas.length === 0 ? (
              <p className="text-caption text-muted italic">
                Não há turmas disponíveis para matrícula no momento.
              </p>
            ) : (
              <select
                required
                value={selectedTurmaId}
                onChange={(e) => setSelectedTurmaId(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none"
              >
                <option value="">Selecione uma turma...</option>
                {availableTurmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.discipline_name} — {t.name} ({t.professor_name})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-border mt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-label font-semibold text-ink hover:bg-surface transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!selectedTurmaId}
              className="flex items-center gap-1.5 rounded-lg bg-ink px-5 py-2 text-label font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <PlusIcon size={14} />
              <span>Confirmar Matrícula</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
