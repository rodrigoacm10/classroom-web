"use client";

import React from "react";

export interface StarterPromptsProps {
  role: "admin" | "professor" | "coordenador" | "aluno" | null;
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

type PromptSuggestion = {
  title: string;
  question: string;
};

const PROFESSOR_PROMPTS: PromptSuggestion[] = [
  {
    title: "Chamadas abertas agora",
    question: "Tem alguma chamada aberta agora nas minhas turmas?",
  },
  {
    title: "Resumo de frequência e risco",
    question:
      "Qual o resumo geral das minhas turmas e quantos alunos estão abaixo de 75%?",
  },
  {
    title: "Abrir chamada ao vivo",
    question: "Como abrir uma chamada ao vivo para minha turma?",
  },
  {
    title: "Auditoria de presença",
    question:
      "Qual a diferença entre presença irregular e rejeitada e como auditar?",
  },
];

const ADMIN_PROMPTS: PromptSuggestion[] = [
  {
    title: "Resumo operacional da instituição",
    question:
      "Como está o resumo geral da instituição e quantos alunos estão em risco (< 75%)?",
  },
  {
    title: "Chamadas abertas agora",
    question: "Há alguma chamada aberta neste momento na instituição?",
  },
  {
    title: "Convites e equipe",
    question:
      "Quantos convites pendentes e quantos professores ativos temos na instituição?",
  },
  {
    title: "Configurar salas e geofence",
    question:
      "Como funciona o raio de tolerância de uma sala e como cadastrar uma nova?",
  },
];

const COORDINATOR_PROMPTS: PromptSuggestion[] = [
  {
    title: "Resumo operacional da instituição",
    question:
      "Como está o resumo geral da instituição e quantos alunos estão em risco (< 75%)?",
  },
  {
    title: "Chamadas abertas agora",
    question: "Há alguma chamada aberta neste momento na instituição?",
  },
  {
    title: "Abrir e auditar chamadas",
    question:
      "Como abrir uma chamada ao vivo e auditar registros de presença irregulares?",
  },
  {
    title: "Configurar salas e geofence",
    question:
      "Como funciona o raio de tolerância de uma sala e como cadastrar uma nova?",
  },
];

export function StarterPrompts({
  role,
  onSelectPrompt,
  disabled = false,
}: StarterPromptsProps) {
  const suggestions =
    role === "admin"
      ? ADMIN_PROMPTS
      : role === "coordenador"
        ? COORDINATOR_PROMPTS
        : PROFESSOR_PROMPTS;

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold tracking-tight text-heading text-ink">
          Como posso ajudar na operação do Locus hoje?
        </h3>
        <p className="text-body text-muted">
          Tire dúvidas sobre chamadas ao vivo, raio de geofencing, auditoria de
          presença, turmas, relatórios ou permissões do painel.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-md border border-border bg-paper">
        {suggestions.map((item) => (
          <button
            key={item.question}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.question)}
            className="group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-surface disabled:opacity-50 cursor-pointer"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-semibold text-label text-ink group-hover:text-ink">
                {item.title}
              </span>
              <span className="text-caption text-muted line-clamp-2">
                {item.question}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink"
              aria-hidden="true"
            >
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
