"use client";

import React, { useState } from "react";
import { CloseIcon, PlusIcon, CheckIcon } from "@/components/icons";
import type { TurmaOption } from "@/modules/alunos/types";
import type { MembroRole, SendMemberInviteData } from "../types";

export interface NovoMembroModalProps {
  isOpen: boolean;
  isLoading: boolean;
  availableTurmas: TurmaOption[];
  onClose: () => void;
  onSendInvite: (data: SendMemberInviteData) => Promise<void> | void;
}

export function NovoMembroModal({
  isOpen,
  isLoading,
  availableTurmas,
  onClose,
  onSendInvite,
}: NovoMembroModalProps) {
  const [selectedRole, setSelectedRole] = useState<MembroRole>("professor");
  const [emailInput, setEmailInput] = useState("");
  const [selectedTurmaIds, setSelectedTurmaIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTurma = (id: string) => {
    setSelectedTurmaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Por favor, informe um endereço de e-mail institucional válido.");
      return;
    }

    setError(null);
    await onSendInvite({
      email: cleanEmail,
      role: selectedRole,
      subjectClassIds: selectedRole === "professor" ? selectedTurmaIds : [],
    });

    setEmailInput("");
    setSelectedTurmaIds([]);
    setSelectedRole("professor");
  };

  const rolesList: { id: MembroRole; label: string; description: string }[] = [
    {
      id: "professor",
      label: "Professor",
      description: "Acesso ao painel web para gerenciar suas turmas e realizar chamadas.",
    },
    {
      id: "coordenador",
      label: "Coordenador",
      description: "Supervisão pedagógica de todas as turmas e relatórios institucionais.",
    },
    {
      id: "admin",
      label: "Administrador",
      description: "Controle e governança institucional total no tenant.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-white shadow-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface/40">
          <div>
            <h3 className="font-sans text-title font-bold text-ink">
              Convidar Membro para a Instituição
            </h3>
            <p className="font-sans text-caption text-muted mt-0.5">
              Um link de ativação será gerado e enviado para o e-mail do participante.
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

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 font-sans text-caption text-red-700">
              {error}
            </div>
          )}

          {/* Seleção do Papel */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-caption font-bold uppercase tracking-caps text-muted">
              Papel do Novo Membro
            </label>
            <div className="grid grid-cols-3 gap-2">
              {rolesList.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-ink bg-ink text-paper font-bold shadow-xs"
                        : "border-border bg-white text-ink hover:bg-surface"
                    }`}
                  >
                    <span className="font-sans text-body font-bold">{r.label}</span>
                    <span
                      className={`font-sans text-[11px] mt-0.5 ${
                        isSelected ? "text-paper/80" : "text-muted"
                      }`}
                    >
                      {r.id === "admin" ? "Total" : r.id === "coordenador" ? "Gestão" : "Docente"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo de E-mail */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-caption font-bold uppercase tracking-caps text-muted">
              E-mail Institucional
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="exemplo@instituicao.edu.br"
              className="h-10 w-full rounded-lg border border-border bg-white px-3 font-sans text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Pré-vinculação de Turmas (somente se for professor) */}
          {selectedRole === "professor" && availableTurmas.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-sans text-caption font-bold uppercase tracking-caps text-muted">
                  Turmas para atribuição (Opcional)
                </label>
                <span className="font-sans text-[11px] text-muted">
                  {selectedTurmaIds.length} selecionada(s)
                </span>
              </div>

              <div className="max-h-36 overflow-y-auto rounded-lg border border-border bg-surface/30 p-2 divide-y divide-border/60">
                {availableTurmas.map((turma) => {
                  const isChecked = selectedTurmaIds.includes(turma.id);
                  return (
                    <label
                      key={turma.id}
                      className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-surface/70 rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTurma(turma.id)}
                        className="h-4 w-4 rounded accent-ink cursor-pointer"
                      />
                      <span className="font-sans text-body text-ink truncate">
                        {turma.name}{" "}
                        <span className="text-caption text-muted">
                          ({turma.discipline_name})
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rodapé e Botões */}
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
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 font-sans text-label font-bold text-paper transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
            >
              {isLoading ? (
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
