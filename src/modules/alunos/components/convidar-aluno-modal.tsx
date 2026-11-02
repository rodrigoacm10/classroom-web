"use client";

import React, { useState } from "react";
import { CloseIcon, PlusIcon } from "@/components/icons";
import type { TurmaOption } from "../types";

export interface ConvidarAlunoModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTurmas: TurmaOption[];
  onInvite: (data: { email: string; subjectClassIds: string[] }) => Promise<void> | void;
}

export function ConvidarAlunoModal({
  isOpen,
  onClose,
  availableTurmas,
  onInvite,
}: ConvidarAlunoModalProps) {
  const [email, setEmail] = useState("");
  const [selectedTurmaIds, setSelectedTurmaIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTurma = (id: string) => {
    setSelectedTurmaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTurmaIds.length === availableTurmas.length) {
      setSelectedTurmaIds([]);
    } else {
      setSelectedTurmaIds(availableTurmas.map((t) => t.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Por favor, informe um endereço de e-mail institucional válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onInvite({
        email: cleanEmail,
        subjectClassIds: selectedTurmaIds,
      });

      setEmail("");
      setSelectedTurmaIds([]);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar convite para o aluno.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={isSubmitting ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-heading font-extrabold text-ink tracking-tight">
              Convidar Novo Aluno
            </h2>
            <p className="text-caption text-muted mt-0.5">
              O aluno receberá um link para ingressar e será matriculado nas turmas escolhidas.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="rounded-lg bg-danger-surface p-3 text-caption font-semibold text-danger">
                {error}
              </div>
            )}

            <div>
              <label className="block font-sans text-label font-bold text-ink mb-1.5">
                E-mail Institucional do Aluno *
              </label>
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: aluno@universidade.edu.br"
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none transition-colors"
                autoFocus
              />
              <span className="text-[11px] text-muted mt-1 block">
                Se o estudante ainda não possuir conta, ele poderá se cadastrar ao abrir o convite.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-sans text-label font-bold text-ink">
                  Vincular a Turmas (opcional)
                </label>
                {availableTurmas.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    disabled={isSubmitting}
                    className="text-[12px] font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
                  >
                    {selectedTurmaIds.length === availableTurmas.length
                      ? "Desmarcar todas"
                      : "Selecionar todas"}
                  </button>
                )}
              </div>

              {availableTurmas.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-caption text-muted">
                  Nenhuma turma cadastrada no momento.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-lg border border-border p-2 bg-[#FAFAFA]">
                  {availableTurmas.map((turma) => {
                    const isSelected = selectedTurmaIds.includes(turma.id);
                    return (
                      <div
                        key={turma.id}
                        onClick={() => !isSubmitting && toggleTurma(turma.id)}
                        className={`flex items-center justify-between rounded-md p-2.5 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-white border border-ink/20 shadow-2xs"
                            : "hover:bg-surface/80 border border-transparent"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-label font-semibold text-ink truncate">
                            {turma.discipline_name || turma.name}
                          </p>
                          <p className="text-[11px] text-muted truncate">
                            {turma.name} {turma.professor_name ? `• ${turma.professor_name}` : ""}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Tratado no clique do container
                          disabled={isSubmitting}
                          className="h-4 w-4 rounded border-border text-ink focus:ring-0 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedTurmaIds.length > 0 && (
                <span className="text-[11px] font-semibold text-ink mt-1 block">
                  {selectedTurmaIds.length} turma(s) selecionada(s) para matrícula imediata
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 px-6 flex items-center justify-end gap-3 border-t border-border bg-white shrink-0">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-label font-semibold text-ink hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-ink px-5 py-2 text-label font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <PlusIcon size={14} />
              <span>{isSubmitting ? "Enviando convite..." : "Enviar Convite"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
