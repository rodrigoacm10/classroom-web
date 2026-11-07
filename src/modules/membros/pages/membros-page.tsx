"use client";

import React from "react";
import { CallBanner } from "@/components/global";
import { useMembros } from "../hooks/use-membros";
import { MembrosHeader } from "../components/membros-header";
import { MembrosKpis } from "../components/membros-kpis";
import { MembrosFilters } from "../components/membros-filters";
import { MembrosTable } from "../components/membros-table";
import { AlterarCargoModal } from "../components/alterar-cargo-modal";
import { RemoverMembroModal } from "../components/remover-membro-modal";
import { NovoMembroModal } from "../components/novo-membro-modal";

export function MembrosPage() {
  const {
    currentProfile,
    canManageMembers,
    canInviteMembers,

    // Filtros e ordenação
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    totalPages,
    handleClearFilters,

    // Dados e estados
    membersList,
    kpis,
    availableTurmas,
    isLoading,
    actionLoading,
    toast,

    // Modais
    isInviteModalOpen,
    setIsInviteModalOpen,
    memberToEditRole,
    setMemberToEditRole,
    memberToRemove,
    setMemberToRemove,

    // Operações
    handleConfirmRoleChange,
    handleConfirmRemove,
    handleSendInvite,
  } = useMembros();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans relative">
      {/* ─── Toast de Feedback Flutuante ─── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-900"
                : "border-border bg-ink text-paper"
            }`}
          >
            <span className="font-sans text-body font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* ─── Header Principal ─── */}
      <MembrosHeader
        canInviteMembers={canInviteMembers}
        totalMembers={totalCount}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
      />

      {/* ─── Banner de Chamada em Andamento (se houver) ─── */}
      <CallBanner />

      {/* ─── 4 KPI Cards Institucionais ─── */}
      <MembrosKpis kpis={kpis} />

      {/* ─── Barra de Filtros (Busca, Papel e Ordenação) ─── */}
      <MembrosFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
      />

      {/* ─── Tabela de Membros com Ações de Governança ─── */}
      <MembrosTable
        members={membersList}
        totalMembers={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        currentUserId={currentProfile?.id}
        canManageMembers={canManageMembers}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onEditRole={setMemberToEditRole}
        onRemoveMember={setMemberToRemove}
        onClearFilters={handleClearFilters}
      />

      {/* ─── Modal de Alteração de Cargo ─── */}
      <AlterarCargoModal
        member={memberToEditRole}
        isOpen={!!memberToEditRole}
        isLoading={actionLoading}
        onClose={() => setMemberToEditRole(null)}
        onConfirm={handleConfirmRoleChange}
      />

      {/* ─── Modal de Remoção / Desvinculação ─── */}
      <RemoverMembroModal
        member={memberToRemove}
        isOpen={!!memberToRemove}
        isLoading={actionLoading}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
      />

      {/* ─── Modal de Envio de Convite ─── */}
      <NovoMembroModal
        isOpen={isInviteModalOpen}
        isLoading={actionLoading}
        availableTurmas={availableTurmas}
        onClose={() => setIsInviteModalOpen(false)}
        onSendInvite={handleSendInvite}
      />
    </div>
  );
}
