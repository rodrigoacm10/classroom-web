"use client";

import React from "react";
import { CallBanner } from "@/components/global";
import { useConvites } from "../hooks/use-convites";
import { ConvitesHeader } from "../components/convites-header";
import { ConvitesKpis } from "../components/convites-kpis";
import { ConvitesFilters } from "../components/convites-filters";
import { ConvitesTable } from "../components/convites-table";
import { NovoConviteModal } from "../components/novo-convite-modal";

export function ConvitesPage() {
  const {
    kpis,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalInvites,
    invites,
    availableTurmas,
    isModalOpen,
    setIsModalOpen,
    handleClearFilters,
    handleSendInvite,
    handleRevokeInvite,
    handleResendInvite,
    handleCopyInviteLink,
    feedback,
  } = useConvites();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans relative">
      {/* ─── Header Principal ─── */}
      <ConvitesHeader
        totalInvites={kpis.total}
        pendingCount={kpis.pending}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* ─── Banner de Chamada em Andamento (se houver) ─── */}
      <CallBanner />

      {/* ─── 4 KPI Cards de Indicadores de Convites ─── */}
      <ConvitesKpis kpis={kpis} />

      {/* ─── Barra de Filtros (Busca, Status, Papel e Ordenação) ─── */}
      <ConvitesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onClearFilters={handleClearFilters}
      />

      {/* ─── Tabela de Convites ─── */}
      <ConvitesTable
        invites={invites}
        totalInvites={totalInvites}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onCopyLink={handleCopyInviteLink}
        onResendInvite={handleResendInvite}
        onRevokeInvite={handleRevokeInvite}
        onClearFilters={handleClearFilters}
      />

      {/* ─── Modal para Emitir Novo Convite ─── */}
      <NovoConviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableTurmas={availableTurmas}
        onSendInvite={handleSendInvite}
      />

      {/* ─── Toast de Feedback Flutuante ─── */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg bg-ink px-4 py-3 text-paper shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-sans text-caption font-semibold">
            {feedback.text}
          </span>
        </div>
      )}
    </div>
  );
}
