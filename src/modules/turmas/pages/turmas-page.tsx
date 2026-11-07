"use client";

import React from "react";
import { CallBanner } from "@/components/global";
import { useTurmas } from "../hooks";
import {
  TurmasHeader,
  TurmasKpis,
  TurmasFilters,
  TurmasTable,
  ExcluirTurmaModal,
} from "../components/turmas";

export function TurmasPage() {
  const {
    classes,
    totalClasses,
    totalPages,
    tableLoading,
    kpis,
    metricsLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    pageSize,
    isAdmin,
    isDeleteModalOpen,
    turmaToDelete,
    isDeleting,
    toastMessage,
    handleToggleActive,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleClearFilters,
  } = useTurmas();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* Toast Flutuante de Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-ink px-5 py-3 text-white shadow-2xl animate-fade-in"
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
              toastMessage.type === "success" ? "bg-success" : "bg-danger"
            }`}
          >
            {toastMessage.type === "success" ? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5l-7 7-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-label font-medium">{toastMessage.text}</span>
        </div>
      )}

      <TurmasHeader />

      <CallBanner />

      <TurmasKpis kpis={kpis} loading={metricsLoading} />

      <TurmasFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      <TurmasTable
        classes={classes}
        loading={tableLoading}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        currentPage={currentPage}
        totalPages={totalPages}
        totalClasses={totalClasses}
        pageSize={pageSize}
        isAdmin={isAdmin}
        onPageChange={setCurrentPage}
        onClearFilters={handleClearFilters}
        onToggleActive={handleToggleActive}
        onDelete={handleOpenDeleteModal}
      />

      {/* Modal de Exclusão Segura (Apenas ADMIN) */}
      <ExcluirTurmaModal
        turma={turmaToDelete}
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
