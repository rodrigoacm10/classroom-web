"use client";

import React from "react";

export interface EditarTurmaStatusProps {
  active: boolean;
  onActiveChange: (active: boolean) => void;
}

export function EditarTurmaStatus({
  active,
  onActiveChange,
}: EditarTurmaStatusProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-xs space-y-4">
      <div className="border-b border-border pb-3">
        <h3 className="text-heading font-bold text-ink">
          Status Operacional da Turma
        </h3>
        <p className="text-caption text-muted mt-0.5">
          Define se a turma está liberada para chamadas ao vivo ou pausada.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface/40 p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
              active
                ? "bg-success-surface text-success border border-success/30"
                : "bg-surface text-muted border border-border"
            }`}
          >
            {active ? (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5l-7 7-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="3" width="3.5" height="10" rx="1" fill="currentColor" />
                <rect x="9.5" y="3" width="3.5" height="10" rx="1" fill="currentColor" />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink text-label">
                {active ? "Turma Ativa" : "Turma Inativa (Pausada)"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold ${
                  active
                    ? "bg-success-surface text-success"
                    : "bg-surface text-muted border border-border"
                }`}
              >
                {active ? "Pronta para chamadas" : "Chamadas bloqueadas"}
              </span>
            </div>
            <p className="text-caption text-muted mt-0.5">
              {active
                ? "A turma aparecerá no seletor de chamadas e alunos matriculados poderão registrar presença."
                : "A turma continuará salva no banco de dados e no histórico, mas não permitirá abertura de novas chamadas."}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={active}
          onClick={() => onActiveChange(!active)}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            active ? "bg-success" : "bg-border"
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              active ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
