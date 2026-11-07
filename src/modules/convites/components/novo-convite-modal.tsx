"use client";

import React, { useState } from "react";
import { CloseIcon, PlusIcon, CheckIcon } from "@/components/icons";
import type { TurmaOption } from "@/modules/alunos/types";
import type { InviteRole, SendInviteFormData } from "../types";

export interface NovoConviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTurmas: TurmaOption[];
  onSendInvite: (data: SendInviteFormData) => Promise<void> | void;
}

export function NovoConviteModal({
  isOpen,
  onClose,
  availableTurmas,
  onSendInvite,
}: NovoConviteModalProps) {
  const [selectedRole, setSelectedRole] = useState<InviteRole>("aluno");
  const [emailInput, setEmailInput] = useState("");
  const [selectedTurmaIds, setSelectedTurmaIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTurma = (id: string) => {
    setSelectedTurmaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllTurmas = () => {
    if (selectedTurmaIds.length === availableTurmas.length) {
      setSelectedTurmaIds([]);
    } else {
      setSelectedTurmaIds(availableTurmas.map((t) => t.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Por favor, informe um endereço de e-mail institucional válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSendInvite({
        email: cleanEmail,
        role: selectedRole,
        subjectClassIds: selectedRole === "aluno" ? selectedTurmaIds : [],
      });

      setEmailInput("");
      setSelectedTurmaIds([]);
      setSelectedRole("aluno");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar convite.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rolesList: { id: InviteRole; label: string; description: string }[] = [
    {
      id: "aluno",
      label: "Aluno",
      description: "Acesso ao app mobile para confirmação de presença nas turmas vinculadas.",
    },
    {
      id: "professor",
      label: "Professor",
      description: "Pode abrir e encerrar chamadas, visualizar turmas e gerenciar frequências.",
    },
    {
      id: "coordenador",
      label: "Coordenador",
      description: "Visualiza relatórios consolidados, turmas e indicadores globais do curso.",
    },
    {
      id: "admin",
      label: "Administrador",
      description: "Acesso total às configurações institucionais, membros e salas físicas.",
    },
  ];

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
              Emitir Novo Convite
            </h2>
            <p className="text-caption text-muted mt-0.5">
              O destinatário receberá um link seguro para ingressar na instituição.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto p-6 gap-5">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-caption font-medium text-rose-700 flex items-start gap-2">
              <span className="font-bold">Atenção:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Seleção de Papel */}
          <div>
            <label className="block text-label font-bold text-ink uppercase tracking-caps mb-2">
              1. Papel Institucional
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {rolesList.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border font-sans text-caption font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-ink text-paper border-ink shadow-xs"
                        : "bg-surface/50 text-muted border-border hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] text-muted mt-1.5 italic">
              {rolesList.find((r) => r.id === selectedRole)?.description}
            </p>
          </div>

          {/* Campo de E-mail */}
          <div>
            <label
              htmlFor="invite-email"
              className="block text-label font-bold text-ink uppercase tracking-caps mb-2"
            >
              2. E-mail Institucional
            </label>
            <input
              id="invite-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="ex: nome.sobrenome@universidade.edu.br"
              className="h-11 w-full rounded-lg border border-border bg-white px-3.5 font-sans text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Se for Aluno: Seleção de Turmas Pré-Vinculadas */}
          {selectedRole === "aluno" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-label font-bold text-ink uppercase tracking-caps">
                  3. Pré-matrícula em Turmas (Opcional)
                </label>
                {availableTurmas.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllTurmas}
                    className="text-caption font-semibold text-accent hover:underline cursor-pointer"
                  >
                    {selectedTurmaIds.length === availableTurmas.length
                      ? "Desmarcar todas"
                      : "Selecionar todas"}
                  </button>
                )}
              </div>

              {availableTurmas.length === 0 ? (
                <div className="rounded-lg border border-border bg-surface p-4 text-center text-caption text-muted">
                  Nenhuma turma acadêmica cadastrada no momento.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-border">
                  {availableTurmas.map((turma) => {
                    const isChecked = selectedTurmaIds.includes(turma.id);
                    return (
                      <div
                        key={turma.id}
                        onClick={() => toggleTurma(turma.id)}
                        className={`flex items-center justify-between p-3 transition-colors cursor-pointer ${
                          isChecked ? "bg-amber-50/40" : "hover:bg-surface/60"
                        }`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="font-sans text-caption font-bold text-ink truncate">
                            {turma.name}
                          </span>
                          <span className="text-[11px] text-muted truncate">
                            {turma.discipline_name} · Prof. {turma.professor_name}
                          </span>
                        </div>

                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            isChecked
                              ? "bg-accent border-accent text-ink"
                              : "border-border bg-white"
                          }`}
                        >
                          {isChecked && <CheckIcon size={12} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Footer do Modal */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-border px-4 font-sans text-label font-semibold text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !emailInput.trim()}
              className="flex h-10 items-center gap-2 rounded-lg bg-ink px-5 font-sans text-label font-bold text-paper transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isSubmitting ? (
                <span>Enviando...</span>
              ) : (
                <>
                  <PlusIcon size={14} />
                  <span>Enviar convite</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
