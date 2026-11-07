import React from "react";

export const CLASS_SUGGESTIONS = [
  "Turma A — Noturno",
  "Turma B — Matutino",
  "Turma C — Vespertino",
  "Turma Especial 2026/1",
] as const;

export const DISCIPLINE_SUGGESTIONS = [
  "Engenharia de Software",
  "Banco de Dados Avançado",
  "Inteligência Artificial & Machine Learning",
  "Sistemas Distribuídos & Cloud",
  "Redes de Computadores",
] as const;

export interface NovaTurmaIdentificacaoProps {
  nameId: string;
  disciplineId: string;
  name: string;
  onNameChange: (value: string) => void;
  disciplineName: string;
  onDisciplineNameChange: (value: string) => void;
}

export function NovaTurmaIdentificacao({
  nameId,
  disciplineId,
  name,
  onNameChange,
  disciplineName,
  onDisciplineNameChange,
}: NovaTurmaIdentificacaoProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-2xs">
      <div className="border-b border-border pb-4 mb-6">
        <span className="text-caption font-bold uppercase tracking-caps text-muted block">
          Etapa 01
        </span>
        <h2 className="text-heading font-bold text-ink">
          Identificação da Turma
        </h2>
        <p className="text-caption text-muted mt-0.5">
          Informe o nome da turma e da matéria para visualização dos alunos.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor={nameId} className="block text-label font-bold text-ink mb-1.5">
            Nome da Turma <span className="text-danger">*</span>
          </label>
          <input
            id={nameId}
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex: Turma A — Noturno"
            className="h-11 w-full rounded-lg border border-border bg-white px-3.5 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
          />
          {/* Suggestions pills */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted mr-1">Sugestões:</span>
            {CLASS_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onNameChange(sug)}
                className="rounded-md border border-border bg-surface px-2 py-0.5 text-caption font-medium text-ink hover:border-control-border transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={disciplineId} className="block text-label font-bold text-ink mb-1.5">
            Nome da Disciplina <span className="text-danger">*</span>
          </label>
          <input
            id={disciplineId}
            type="text"
            required
            value={disciplineName}
            onChange={(e) => onDisciplineNameChange(e.target.value)}
            placeholder="Ex: Engenharia de Software"
            className="h-11 w-full rounded-lg border border-border bg-white px-3.5 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
          />
          {/* Suggestions pills */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted mr-1">Frequentes:</span>
            {DISCIPLINE_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onDisciplineNameChange(sug)}
                className="rounded-md border border-border bg-surface px-2 py-0.5 text-caption font-medium text-ink hover:border-control-border transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
