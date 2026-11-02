"use client";

import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/icons";
import { getInitials } from "@/lib/utils";
import type { InviteItem, InviteRole, InviteStatus } from "../types";

export interface ConvitesTableProps {
  invites: InviteItem[];
  totalInvites: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onCopyLink: (invite: InviteItem) => void;
  onResendInvite: (invite: InviteItem) => void;
  onRevokeInvite: (invite: InviteItem) => void;
  onClearFilters: () => void;
}

export function ConvitesTable({
  invites,
  totalInvites,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onCopyLink,
  onResendInvite,
  onRevokeInvite,
  onClearFilters,
}: ConvitesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);

  const handleCopy = (invite: InviteItem) => {
    onCopyLink(invite);
    setCopiedId(invite.id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === invite.id ? null : prev));
    }, 2000);
  };

  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-b border-border bg-white px-8 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-4">
          <SearchIcon size={20} />
        </div>
        <h3 className="font-sans text-heading font-bold text-ink">
          Nenhum convite encontrado
        </h3>
        <p className="mt-1 text-body text-muted max-w-md">
          Não há registros correspondentes aos critérios de busca ou filtros aplicados.
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
  const endIdx = Math.min(currentPage * pageSize, totalInvites);

  return (
    <div className="flex flex-1 flex-col justify-between bg-white">
      <div className="overflow-x-auto">
        <div className="min-w-[1040px]">
          {/* Header da Tabela */}
          <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-8 py-3.5 font-sans text-caption font-bold uppercase tracking-caps text-muted">
            <div className="col-span-4">Convidado & E-mail</div>
            <div className="col-span-2">Papel Institucional</div>
            <div className="col-span-3">Turmas / Atribuição</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Ações</div>
          </div>

          {/* Linhas da Tabela */}
          <div className="divide-y divide-border">
            {invites.map((invite) => {
              const isCopied = copiedId === invite.id;
              const isConfirmingRevoke = confirmRevokeId === invite.id;

              return (
                <div
                  key={invite.id}
                  className="grid grid-cols-12 items-center px-8 py-4 transition-colors hover:bg-surface/60"
                >
                  {/* Coluna 1: Avatar, e-mail e data de disparo */}
                  <div className="col-span-4 flex items-center gap-3.5 pr-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface font-sans text-caption font-bold text-ink border border-border">
                      {getInitials(invite.email.split("@")[0].replace(".", " "))}
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-sans text-body font-semibold text-ink">
                        {invite.email}
                      </span>
                      <span className="text-caption text-muted flex items-center gap-1.5 mt-0.5">
                        <span>Enviado {formatDate(invite.created_at)}</span>
                        {invite.invited_by_name && (
                          <>
                            <span>·</span>
                            <span className="truncate text-muted">
                              por {invite.invited_by_name.split(" ")[0]}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Coluna 2: Papel */}
                  <div className="col-span-2">
                    <RoleBadge role={invite.role} />
                  </div>

                  {/* Coluna 3: Turmas / Escopo */}
                  <div className="col-span-3 pr-3">
                    {invite.role === "aluno" ? (
                      invite.subject_class_names && invite.subject_class_names.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {invite.subject_class_names.map((turma, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-md bg-surface px-2 py-0.5 text-caption font-medium text-ink border border-border/80"
                            >
                              {turma}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-caption text-muted italic">
                          Sem turmas pré-vinculadas
                        </span>
                      )
                    ) : (
                      <span className="text-caption text-muted font-medium">
                        {invite.role === "professor"
                          ? "Acesso Docente às Disciplinas"
                          : invite.role === "coordenador"
                          ? "Gestão Acadêmica e Relatórios"
                          : "Acesso Total Administrativo"}
                      </span>
                    )}
                  </div>

                  {/* Coluna 4: Status */}
                  <div className="col-span-1">
                    <StatusBadge status={invite.status} expiresAt={invite.expires_at} />
                  </div>

                  {/* Coluna 5: Ações Rápidas */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    {isConfirmingRevoke ? (
                      <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                        <span className="text-caption font-semibold text-rose-700">
                          Revogar?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onRevokeInvite(invite);
                            setConfirmRevokeId(null);
                          }}
                          className="px-2 py-0.5 text-caption font-bold bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRevokeId(null)}
                          className="px-1.5 py-0.5 text-caption font-semibold text-muted hover:text-ink cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Botão Copiar Link */}
                        <button
                          type="button"
                          onClick={() => handleCopy(invite)}
                          title="Copiar link direto de ativação"
                          className="relative flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-caption font-semibold text-ink transition-all hover:bg-surface active:scale-[0.98] cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <CheckIcon size={13} className="text-emerald-600" />
                              <span className="text-emerald-600">Copiado</span>
                            </>
                          ) : (
                            <>
                              <CopyIcon size={13} />
                              <span>Link</span>
                            </>
                          )}
                        </button>

                        {/* Botão Reenviar (para pendentes ou expirados) */}
                        {(invite.status === "pending" || invite.status === "expired") && (
                          <button
                            type="button"
                            onClick={() => onResendInvite(invite)}
                            title="Reenviar e-mail de convite"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink transition-all hover:bg-surface active:scale-[0.98] cursor-pointer"
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9L14 6"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14 2.5v3.5h-3.5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        )}

                        {/* Botão Revogar (para pendentes) */}
                        {invite.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => setConfirmRevokeId(invite.id)}
                            title="Revogar / Cancelar convite"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <CloseIcon size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Paginação inferior */}
      <div className="flex items-center justify-between border-t border-border bg-white px-8 py-4 lg:px-10">
        <span className="font-sans text-caption text-muted">
          Mostrando <strong className="text-ink font-semibold">{startIdx}</strong> a{" "}
          <strong className="text-ink font-semibold">{endIdx}</strong> de{" "}
          <strong className="text-ink font-semibold">{totalInvites}</strong> convites
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-8 items-center gap-1 rounded-md border border-border bg-white px-3 text-caption font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeftIcon size={12} />
            <span>Anterior</span>
          </button>

          <span className="px-2 font-mono text-caption text-muted">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-8 items-center gap-1 rounded-md border border-border bg-white px-3 text-caption font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Próxima</span>
            <ChevronRightIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: InviteRole }) {
  switch (role) {
    case "aluno":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-caption font-semibold text-blue-700 border border-blue-200">
          Aluno
        </span>
      );
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

function StatusBadge({
  status,
  expiresAt,
}: {
  status: InviteStatus;
  expiresAt: string;
}) {
  switch (status) {
    case "pending":
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-1.5 font-sans text-caption font-bold text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Pendente
          </span>
          <span className="text-[11px] text-muted font-mono mt-0.5">
            {getRelativeExpiry(expiresAt)}
          </span>
        </div>
      );
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1.5 font-sans text-caption font-bold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Aceito
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1.5 font-sans text-caption font-medium text-muted">
          <span className="h-2 w-2 rounded-full bg-zinc-400" />
          Expirado
        </span>
      );
    case "revoked":
      return (
        <span className="inline-flex items-center gap-1.5 font-sans text-caption font-medium text-rose-600">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Revogado
        </span>
      );
  }
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function getRelativeExpiry(isoString: string): string {
  try {
    const exp = new Date(isoString).getTime();
    const now = Date.now();
    const diffHours = Math.round((exp - now) / (1000 * 60 * 60));

    if (diffHours <= 0) return "Expirando";
    if (diffHours < 24) return `Expira em ${diffHours}h`;
    const days = Math.round(diffHours / 24);
    return `Expira em ${days}d`;
  } catch {
    return "7 dias";
  }
}
