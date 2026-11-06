"use client";

import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons";
import { getInitials } from "@/lib/utils";
import type { MembroItem, MembroRole } from "../types";

export interface MembrosTableProps {
  members: MembroItem[];
  totalMembers: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  currentUserId?: string;
  canManageMembers: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEditRole: (member: MembroItem) => void;
  onRemoveMember: (member: MembroItem) => void;
  onClearFilters: () => void;
}

export function MembrosTable({
  members,
  totalMembers,
  currentPage,
  totalPages,
  pageSize,
  currentUserId,
  canManageMembers,
  isLoading = false,
  onPageChange,
  onEditRole,
  onRemoveMember,
  onClearFilters,
}: MembrosTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-ink mb-3" />
        <p className="font-sans text-body font-medium text-muted">
          Carregando membros da instituição...
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-4">
          <SearchIcon size={20} />
        </div>
        <h3 className="font-sans text-heading font-bold text-ink">
          Nenhum membro encontrado
        </h3>
        <p className="mt-1 text-body text-muted max-w-md">
          Nenhum membro da equipe corresponde aos filtros informados ou está cadastrado com esse papel.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink transition-colors hover:bg-surface cursor-pointer"
        >
          Limpar filtros
        </button>
      </div>
    );
  }

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalMembers);

  return (
    <div className="flex flex-1 flex-col justify-between bg-white">
      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          {/* Header da Tabela */}
          <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-8 py-3.5 font-sans text-caption font-bold uppercase tracking-caps text-muted">
            <div className="col-span-4">Membro & Contato</div>
            <div className="col-span-2">Papel Institucional</div>
            <div className="col-span-3">Turmas Atribuídas</div>
            <div className="col-span-2">Membro Desde</div>
            <div className="col-span-1 text-right">
              {canManageMembers ? "Gerenciar" : ""}
            </div>
          </div>

          {/* Linhas de Membros */}
          <div className="divide-y divide-border">
            {members.map((member) => {
              const isCurrentUser = currentUserId && member.user_id === currentUserId;
              const formattedDate = new Date(member.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={member.id}
                  className="grid grid-cols-12 items-center px-8 py-4 transition-colors hover:bg-surface/50"
                >
                  {/* Coluna 1: Membro e Avatar */}
                  <div className="col-span-4 flex items-center gap-3.5 pr-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper font-mono text-label font-bold tracking-tight shadow-xs">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-sans text-body font-bold text-ink">
                          {member.name}
                        </span>
                        {isCurrentUser && (
                          <span className="rounded bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-muted border border-border">
                            Você
                          </span>
                        )}
                      </div>
                      <span className="truncate font-sans text-caption text-muted">
                        {member.email}
                      </span>
                    </div>
                  </div>

                  {/* Coluna 2: Papel / Cargo */}
                  <div className="col-span-2">
                    <RoleBadge role={member.role} />
                  </div>

                  {/* Coluna 3: Turmas Atribuídas */}
                  <div className="col-span-3 pr-4">
                    {member.subject_class_names && member.subject_class_names.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {member.subject_class_names.slice(0, 2).map((turma, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-surface px-2 py-0.5 text-caption font-medium text-ink border border-border/80"
                            title={turma}
                          >
                            <span className="truncate max-w-[130px]">{turma}</span>
                          </span>
                        ))}
                        {member.subject_class_names.length > 2 && (
                          <span className="inline-flex items-center rounded-md bg-surface px-1.5 py-0.5 text-caption font-bold text-muted border border-border/80">
                            +{member.subject_class_names.length - 2}
                          </span>
                        )}
                      </div>
                    ) : member.role === "professor" ? (
                      <span className="font-sans text-caption text-muted italic">
                        {member.turmas_count && member.turmas_count > 0
                          ? `${member.turmas_count} turmas vinculadas`
                          : "Nenhuma turma atribuída"}
                      </span>
                    ) : (
                      <span className="font-sans text-caption text-muted">
                        {member.role === "admin"
                          ? "Acesso institucional global"
                          : "Supervisão acadêmica ampla"}
                      </span>
                    )}
                  </div>

                  {/* Coluna 4: Membro Desde */}
                  <div className="col-span-2 font-mono text-body text-ink">
                    {formattedDate}
                  </div>

                  {/* Coluna 5: Ações */}
                  <div className="col-span-1 flex items-center justify-end gap-1.5">
                    {canManageMembers ? (
                      isCurrentUser ? (
                        <span
                          className="text-caption text-muted font-medium cursor-not-allowed"
                          title="Você não pode alterar seu próprio cargo nem se remover por segurança."
                        >
                          Bloqueado
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onEditRole(member)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
                            title="Alterar cargo institucional"
                          >
                            <PencilIcon size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveMember(member)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remover membro da instituição"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </>
                      )
                    ) : (
                      <span className="text-caption text-muted">Leitura</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Paginação */}
      <div className="flex flex-wrap items-center justify-between border-t border-border px-8 py-4">
        <span className="font-sans text-caption text-muted">
          Mostrando <strong className="font-semibold text-ink">{startIdx}</strong> a{" "}
          <strong className="font-semibold text-ink">{endIdx}</strong> de{" "}
          <strong className="font-semibold text-ink">{totalMembers}</strong> membros
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-8 items-center gap-1 rounded-md border border-border px-2.5 font-sans text-caption font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeftIcon size={14} />
            <span>Anterior</span>
          </button>

          <span className="font-mono text-caption font-semibold text-ink px-2">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-8 items-center gap-1 rounded-md border border-border px-2.5 font-sans text-caption font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <span>Próxima</span>
            <ChevronRightIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: MembroRole }) {
  switch (role) {
    case "professor":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-caption font-semibold text-purple-700 border border-purple-200">
          Professor
        </span>
      );
    case "coordenador":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-caption font-semibold text-amber-800 border border-amber-200">
          Coordenador
        </span>
      );
    case "admin":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-ink px-2 py-0.5 text-caption font-semibold text-paper">
          Administrador
        </span>
      );
  }
}
