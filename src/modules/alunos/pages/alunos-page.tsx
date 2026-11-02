"use client";

import React from "react";
import { CallBanner } from "@/components/global";
import { useAlunos } from "../hooks/use-alunos";
import { AlunosHeader } from "../components/alunos-header";
import { AlunosKpis } from "../components/alunos-kpis";
import { AlunosFilters } from "../components/alunos-filters";
import { AlunosTable } from "../components/alunos-table";
import { ConvidarAlunoModal } from "../components/convidar-aluno-modal";

export function AlunosPage() {
  const {
    roleScope,
    searchQuery,
    setSearchQuery,
    selectedTurmaId,
    setSelectedTurmaId,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    pageSize,
    availableTurmas,
    kpis,
    alunos,
    totalStudents,
    totalPages,
    handleClearFilters,
    isInviteModalOpen,
    setIsInviteModalOpen,
    handleInviteStudent,
  } = useAlunos();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Header Principal ─── */}
      <AlunosHeader
        roleScope={roleScope}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        totalStudents={totalStudents}
      />

      {/* ─── Banner de Chamada em Andamento (se houver) ─── */}
      <CallBanner />

      {/* ─── 4 KPI Cards de Frequência e Engajamento de Alunos ─── */}
      <AlunosKpis kpis={kpis} roleScope={roleScope} />

      {/* ─── Barra de Filtros (Busca, Seletor de Turma, Status e Ordenação) ─── */}
      <AlunosFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTurmaId={selectedTurmaId}
        onTurmaChange={setSelectedTurmaId}
        availableTurmas={availableTurmas}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        roleScope={roleScope}
      />

      {/* ─── Tabela de Alunos com Contagem de Turmas e Métricas ─── */}
      <AlunosTable
        alunos={alunos}
        totalStudents={totalStudents}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onClearFilters={handleClearFilters}
        roleScope={roleScope}
      />

      {/* ─── Modal para Convidar / Cadastrar Novo Aluno ─── */}
      <ConvidarAlunoModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        availableTurmas={availableTurmas}
        onInvite={handleInviteStudent}
      />
    </div>
  );
}
