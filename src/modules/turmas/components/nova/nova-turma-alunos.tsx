import React from "react";
import { SearchIcon, CloseIcon, PlusIcon } from "@/components/icons";
import type { StudentItem } from "@/services/tenants";
import type { StudentMode } from "../../types";

export interface NovaTurmaAlunosProps {
  studentMode: StudentMode;
  onStudentModeChange: (mode: StudentMode) => void;
  catalogSearch: string;
  onCatalogSearchChange: (search: string) => void;
  isSearching: boolean;
  loadingStudents: boolean;
  catalogStudents: StudentItem[];
  unselectedCatalogStudents: StudentItem[];
  selectedStudents: StudentItem[];
  onAddStudent: (student: StudentItem) => void;
  onRemoveStudent: (studentId: string) => void;
  onAddAllCatalog: () => void;
  batchText: string;
  onBatchTextChange: (text: string) => void;
  processingBatch: boolean;
  onProcessBatch: () => void;
  onRemoveAllSelected: () => void;
}

export function NovaTurmaAlunos({
  studentMode,
  onStudentModeChange,
  catalogSearch,
  onCatalogSearchChange,
  isSearching,
  loadingStudents,
  catalogStudents,
  unselectedCatalogStudents,
  selectedStudents,
  onAddStudent,
  onRemoveStudent,
  onAddAllCatalog,
  batchText,
  onBatchTextChange,
  processingBatch,
  onProcessBatch,
  onRemoveAllSelected,
}: NovaTurmaAlunosProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div>
          <span className="text-caption font-bold uppercase tracking-caps text-muted block">
            Etapa 03
          </span>
          <h2 className="text-heading font-bold text-ink">
            Alunos Matriculados
          </h2>
          <p className="text-caption text-muted mt-0.5">
            Adicione os estudantes que terão direito a registrar presença nesta turma.
          </p>
        </div>

        <span className="rounded-full bg-surface border border-border px-3 py-1 font-mono text-caption font-bold text-ink">
          {selectedStudents.length} alunos
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-border mb-5">
        <button
          type="button"
          onClick={() => onStudentModeChange("catalog")}
          className={`pb-2.5 text-label font-bold transition-colors border-b-2 cursor-pointer ${
            studentMode === "catalog"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          Buscar no catálogo da instituição
        </button>
        <button
          type="button"
          onClick={() => onStudentModeChange("batch")}
          className={`pb-2.5 text-label font-bold transition-colors border-b-2 cursor-pointer ${
            studentMode === "batch"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          Colar lista em lote (e-mails / nomes)
        </button>
      </div>

      {/* Tab 1: Catalog Search & Select */}
      {studentMode === "catalog" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {isSearching ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <SearchIcon size={14} />
                )}
              </div>
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => onCatalogSearchChange(e.target.value)}
                placeholder="Buscar aluno por nome ou e-mail..."
                className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-8 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
              />
              {catalogSearch && (
                <button
                  type="button"
                  onClick={() => onCatalogSearchChange("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted hover:text-ink cursor-pointer"
                  title="Limpar pesquisa"
                >
                  <CloseIcon size={12} />
                </button>
              )}
            </div>
            {unselectedCatalogStudents.length > 0 && (
              <button
                type="button"
                onClick={onAddAllCatalog}
                className="h-10 rounded-lg border border-border bg-surface px-3 text-caption font-semibold text-ink hover:border-control-border transition-colors cursor-pointer shrink-0"
              >
                + Adicionar todos ({unselectedCatalogStudents.length})
              </button>
            )}
          </div>

          {!catalogSearch.trim() && catalogStudents.length >= 20 && (
            <p className="text-[12px] text-muted">
              Exibindo 20 alunos iniciais. Digite o nome ou e-mail acima para pesquisar outros alunos.
            </p>
          )}

          {/* Available to select */}
          {loadingStudents ? (
            <div className="p-4 text-center text-caption text-muted animate-pulse">
              {catalogSearch.trim()
                ? "Buscando alunos..."
                : "Carregando catálogo de alunos da instituição..."}
            </div>
          ) : unselectedCatalogStudents.length > 0 ? (
            <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-border p-2 bg-[#FAFAFA]">
              {unselectedCatalogStudents.map((stu) => (
                <div
                  key={stu.id}
                  className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-border/60 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-caption font-bold text-ink">
                      {(stu.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-label font-bold text-ink truncate">
                        {stu.name}
                      </span>
                      <span className="text-[11px] text-muted truncate">
                        {stu.email}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddStudent(stu)}
                    className="flex h-8 items-center gap-1 rounded-md bg-ink px-2.5 text-caption font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shrink-0"
                  >
                    <PlusIcon size={11} />
                    <span>Adicionar</span>
                  </button>
                </div>
              ))}
            </div>
          ) : catalogSearch.trim() ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-center text-caption text-muted bg-surface/30">
              Nenhum aluno encontrado para &quot;{catalogSearch}&quot;.
            </div>
          ) : catalogStudents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-center text-caption text-muted bg-surface/30">
              Nenhum aluno cadastrado na instituição ainda.
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-center text-caption text-muted bg-surface/30">
              Todos os alunos exibidos já foram adicionados à turma.
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Batch Paste */
        <div className="space-y-3">
          <textarea
            rows={4}
            value={batchText}
            onChange={(e) => onBatchTextChange(e.target.value)}
            placeholder="Cole aqui os e-mails dos alunos cadastrados separados por vírgula ou linha...&#10;Ex: lucas.silva@aluno.locus.edu.br, mariana.costa@aluno.locus.edu.br"
            className="w-full rounded-lg border border-border bg-white p-3 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-caption text-muted">
              Separe por vírgula ou quebra de linha. O sistema vincula automaticamente com alunos do catálogo.
            </span>
            <button
              type="button"
              onClick={onProcessBatch}
              disabled={!batchText.trim() || processingBatch}
              className="rounded-lg bg-ink px-4 py-2 text-label font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
            >
              {processingBatch ? "Processando..." : "Processar lista"}
            </button>
          </div>
        </div>
      )}

      {/* Selected students chips */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-caption font-bold uppercase tracking-caps text-muted">
            Lista da Turma ({selectedStudents.length})
          </span>
          {selectedStudents.length > 0 && (
            <button
              type="button"
              onClick={onRemoveAllSelected}
              className="text-caption font-medium text-danger hover:underline cursor-pointer"
            >
              Remover todos
            </button>
          )}
        </div>

        {selectedStudents.length === 0 ? (
          <p className="text-caption text-muted italic">
            Nenhum aluno matriculado ainda. Adicione alunos pelo catálogo ou cole a lista em lote acima.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
            {selectedStudents.map((stu) => (
              <div
                key={stu.id}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-label text-ink"
              >
                <span className="font-medium text-ink">{stu.name}</span>
                <span className="text-[11px] text-muted truncate max-w-[140px]">
                  ({stu.email})
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveStudent(stu.id)}
                  className="text-muted hover:text-danger cursor-pointer ml-1"
                  title={`Remover ${stu.name}`}
                >
                  <CloseIcon size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
