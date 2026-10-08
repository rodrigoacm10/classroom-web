"use client";

import React from "react";
import { SearchIcon, PlusIcon, GpsTargetIcon } from "@/components/icons";
import { attendanceColor, attendanceBarColor } from "@/lib/utils";
import type { StudentReportItem } from "@/services/reports";
import type { StudentFilter } from "../../types";

export interface TabAlunosProps {
  students: StudentReportItem[];
  filteredStudents: StudentReportItem[];
  loadingStudents: boolean;
  studentSearch: string;
  onSearchChange: (search: string) => void;
  studentFilter: StudentFilter;
  onFilterChange: (filter: StudentFilter) => void;
  regularCount: number;
  atRiskCount: number;
  canDeleteEnrollment: boolean;
  onOpenAddStudentModal: () => void;
  onRemoveStudent: (tenantMemberId: string) => void;
}

export function TabAlunos({
  students,
  filteredStudents,
  loadingStudents,
  studentSearch,
  onSearchChange,
  studentFilter,
  onFilterChange,
  regularCount,
  atRiskCount,
  canDeleteEnrollment,
  onOpenAddStudentModal,
  onRemoveStudent,
}: TabAlunosProps) {
  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={13} />
            </div>
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar aluno por nome ou e-mail..."
              className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center rounded-lg border border-border bg-white p-1">
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                studentFilter === "all" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              Todos ({students.length})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange("regular")}
              className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                studentFilter === "regular" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              Regulares ({regularCount})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange("at_risk")}
              className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                studentFilter === "at_risk" ? "bg-danger text-white" : "text-muted hover:text-danger"
              }`}
            >
              Em risco ({atRiskCount})
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onOpenAddStudentModal}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-ink px-4 text-label font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <PlusIcon size={14} />
          <span>Matricular aluno</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
        <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-5 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
          <div className="col-span-12 md:col-span-4">ALUNO</div>
          <div className="col-span-4 md:col-span-2">PRESENÇAS / FALTAS</div>
          <div className="hidden md:col-span-2 md:block">DISTÂNCIA MÉDIA</div>
          <div className="col-span-4 md:col-span-2">FREQUÊNCIA</div>
          <div className="col-span-4 md:col-span-2 text-right">STATUS & AÇÕES</div>
        </div>

        {loadingStudents ? (
          <div className="py-12 text-center text-body text-muted animate-pulse">
            Carregando relatório de alunos da turma...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-body text-muted">
            {students.length === 0
              ? "Nenhum aluno matriculado nesta turma ainda. Clique em 'Matricular aluno' para começar."
              : "Nenhum aluno encontrado para os filtros selecionados."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredStudents.map((stu) => {
              const pct = Math.round(stu.frequency_rate * 100);
              return (
                <div
                  key={stu.tenant_member_id}
                  className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-surface/50 transition-colors"
                >
                  {/* Student details */}
                  <div className="col-span-12 md:col-span-4 flex items-center gap-3 pr-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white font-mono text-caption font-bold">
                      {(stu.student_name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-ink text-body truncate">
                        {stu.student_name}
                      </span>
                      <span className="text-caption text-muted truncate">
                        {stu.email || `ID: ${stu.tenant_member_id.slice(0, 8)}`}
                      </span>
                    </div>
                  </div>

                  {/* Presenças e Faltas */}
                  <div className="col-span-4 md:col-span-2">
                    <span className="text-body font-mono font-medium text-ink">
                      {stu.total_present} {stu.total_present === 1 ? "presente" : "presentes"}
                    </span>
                    <span className="block text-[11px] text-muted">
                      {stu.total_absent} {stu.total_absent === 1 ? "falta" : "faltas"}
                    </span>
                  </div>

                  {/* Distância Média */}
                  <div className="hidden md:col-span-2 md:flex items-center gap-1.5 text-body text-ink">
                    <GpsTargetIcon size={13} />
                    <span className="font-mono text-label">{stu.avg_distance_meters.toFixed(1)}m</span>
                    <span className="text-[11px] text-muted">da sala</span>
                  </div>

                  {/* Frequência % */}
                  <div className="col-span-4 md:col-span-2 pr-4">
                    <div className="flex items-center justify-between text-label font-mono font-bold mb-1">
                      <span className={attendanceColor(pct)}>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full ${attendanceBarColor(pct)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Status & Ações */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                    {stu.at_risk ? (
                      <span className="inline-flex rounded-full bg-danger-surface px-2.5 py-0.5 text-caption font-bold text-danger">
                        Em Risco
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-semibold text-success">
                        Regular
                      </span>
                    )}

                    {canDeleteEnrollment && (
                      <button
                        type="button"
                        onClick={() => onRemoveStudent(stu.tenant_member_id)}
                        className="text-muted hover:text-danger text-caption font-medium transition-colors cursor-pointer"
                        title="Remover matrícula da turma (Admin/Coord)"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
