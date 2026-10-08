"use client";

import React, { useId } from "react";
import { CloseIcon, SearchIcon, PlusIcon } from "@/components/icons";
import type { StudentItem } from "@/services/tenants";

export interface MatricularAlunoModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogSearch: string;
  onSearchChange: (search: string) => void;
  catalogStudents: StudentItem[];
  loadingCatalog: boolean;
  enrolledMemberIds: Set<string>;
  enrollingStudentId: string | null;
  enrollSuccessMessage: string | null;
  enrollErrorMessage: string | null;
  onEnrollStudent: (student: StudentItem) => void;
}

export function MatricularAlunoModal({
  isOpen,
  onClose,
  catalogSearch,
  onSearchChange,
  catalogStudents,
  loadingCatalog,
  enrolledMemberIds,
  enrollingStudentId,
  enrollSuccessMessage,
  enrollErrorMessage,
  onEnrollStudent,
}: MatricularAlunoModalProps) {
  const searchInputId = useId();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <h3 className="text-title font-bold text-ink tracking-tight">
                Matricular Aluno na Turma
              </h3>
              <p className="text-caption text-muted mt-0.5">
                Busque alunos cadastrados na instituição para vincular a esta turma.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted hover:text-ink cursor-pointer"
            >
              <CloseIcon size={16} />
            </button>
          </div>

          {/* Feedbacks de Sucesso ou Erro */}
          {enrollSuccessMessage && (
            <div className="mb-4 rounded-lg border border-success/30 bg-success-surface p-3 text-caption font-semibold text-success">
              {enrollSuccessMessage}
            </div>
          )}
          {enrollErrorMessage && (
            <div className="mb-4 rounded-lg border border-danger/30 bg-danger-surface p-3 text-caption font-semibold text-danger">
              {enrollErrorMessage}
            </div>
          )}

          {/* Campo de Busca no Catálogo */}
          <div className="mb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {loadingCatalog ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <SearchIcon size={14} />
                )}
              </div>
              <input
                id={searchInputId}
                type="text"
                value={catalogSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar aluno por nome ou e-mail..."
                className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-8 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
                autoFocus
              />
              {catalogSearch && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted hover:text-ink cursor-pointer"
                  title="Limpar pesquisa"
                >
                  <CloseIcon size={12} />
                </button>
              )}
            </div>
            {!catalogSearch.trim() && (
              <p className="text-[11px] text-muted mt-1.5">
                Exibindo os primeiros 20 alunos. Digite para pesquisar outros alunos da instituição.
              </p>
            )}
          </div>

          {/* Lista de Alunos Encontrados */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 rounded-xl border border-border p-2 bg-[#FAFAFA]">
            {loadingCatalog ? (
              <div className="py-8 text-center text-caption text-muted animate-pulse">
                Buscando alunos da instituição...
              </div>
            ) : catalogStudents.length === 0 ? (
              <div className="py-8 text-center text-caption text-muted">
                {catalogSearch.trim()
                  ? `Nenhum aluno encontrado para "${catalogSearch}".`
                  : "Nenhum aluno cadastrado na instituição."}
              </div>
            ) : (
              catalogStudents.map((stu) => {
                const isEnrolled = enrolledMemberIds.has(stu.id);
                const isEnrolling = enrollingStudentId === stu.id;

                return (
                  <div
                    key={stu.id}
                    className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-border/60 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-caption font-bold text-ink">
                        {(stu.name || "A").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-label font-bold text-ink truncate">{stu.name}</span>
                        <span className="text-[11px] text-muted truncate">{stu.email}</span>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <span className="shrink-0 rounded-full bg-surface border border-border px-2.5 py-1 text-[11px] font-semibold text-muted">
                        Já matriculado
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isEnrolling}
                        onClick={() => onEnrollStudent(stu)}
                        className="flex h-8 shrink-0 items-center gap-1 rounded-md bg-ink px-3 text-caption font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                      >
                        {isEnrolling ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <PlusIcon size={12} />
                        )}
                        <span>{isEnrolling ? "Matriculando..." : "Matricular"}</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé do Modal */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-ink px-5 py-2 text-label font-bold text-white hover:opacity-90 cursor-pointer transition-opacity"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
