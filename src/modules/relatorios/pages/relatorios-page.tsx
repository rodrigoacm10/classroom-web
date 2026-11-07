"use client";

import React from "react";
import { CallBanner } from "@/components/global";
import { useRelatorios } from "../hooks";
import {
  RelatoriosHeader,
  RelatoriosKpis,
  RelatoriosFilters,
  RelatoriosTable,
  RelatoriosEmpty,
  RelatoriosPrintHeader,
} from "../components";

export function RelatoriosPage() {
  const {
    availableTurmas,
    selectedTurmaId,
    handleSelectTurma,
    classReport,
    loading,
    loadingTurmas,
    error,
    retry,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    filteredStudents,
    handleClearFilters,
    handleExportCsv,
    isExportingCsv,
    handlePrint,
  } = useRelatorios();

  const totalStudents = classReport?.students?.length || 0;
  const atRiskCount = classReport?.students_at_risk || 0;
  const regularCount = Math.max(0, totalStudents - atRiskCount);
  const gpsWarningCount = classReport?.students_with_gps_warning || 0;
  const hasData = Boolean(classReport && totalStudents > 0);

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Cabeçalho Especial de Impressão (Aparece apenas na impressão/PDF) ─── */}
      <RelatoriosPrintHeader report={classReport} />

      {/* ─── Header Principal da Página (com Seletor de Turma e Ações de Exportação) ─── */}
      <RelatoriosHeader
        availableTurmas={availableTurmas}
        selectedTurmaId={selectedTurmaId}
        onSelectTurma={handleSelectTurma}
        onExportCsv={handleExportCsv}
        isExportingCsv={isExportingCsv}
        onPrint={handlePrint}
        hasData={hasData}
      />

      {/* ─── Banner de Chamada em Andamento (se houver) ─── */}
      <div className="print:hidden">
        <CallBanner />
      </div>

      {/* ─── Strip Integrado de 4 KPIs: Frequência, Risco, Presenças e Telemetria GPS ─── */}
      {hasData && (
        <div className="print:hidden">
          <RelatoriosKpis report={classReport} loading={loading} />
        </div>
      )}

      {/* ─── Barra de Filtros e Busca Textual de Alunos ─── */}
      {hasData && (
        <RelatoriosFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalStudents={totalStudents}
          filteredCount={filteredStudents.length}
          atRiskCount={atRiskCount}
          regularCount={regularCount}
          gpsWarningCount={gpsWarningCount}
        />
      )}

      {/* ─── Tratamento de Estados: Loading, Erro, Sem Turmas, Sem Alunos ou Tabela ─── */}
      {error ? (
        <RelatoriosEmpty type="error" errorMessage={error} onRetry={retry} />
      ) : loadingTurmas ? (
        <div className="flex flex-1 flex-col items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-ink mb-3" />
          <span className="text-caption font-mono uppercase tracking-caps text-muted">
            Carregando turmas da instituição...
          </span>
        </div>
      ) : availableTurmas.length === 0 ? (
        <RelatoriosEmpty type="no_turmas" />
      ) : !loading && totalStudents === 0 ? (
        <RelatoriosEmpty type="no_students" />
      ) : !loading && filteredStudents.length === 0 ? (
        <RelatoriosEmpty
          type="no_results"
          onClearFilters={handleClearFilters}
        />
      ) : (
        <RelatoriosTable
          students={filteredStudents}
          totalSessions={classReport?.total_sessions || 0}
          loading={loading}
        />
      )}
    </div>
  );
}
