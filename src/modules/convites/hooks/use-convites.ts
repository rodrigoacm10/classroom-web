"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  listInvites,
  getInvitesMetrics,
  sendInvite,
  resendInvite,
  revokeInvite,
  type InviteStatusResponse,
} from "@/services/tenants";
import { listSubjectClasses } from "@/services/subject-classes";
import type { TurmaOption } from "@/modules/alunos/types";
import type {
  InviteItem,
  InviteRoleFilter,
  InviteSortOption,
  InviteStatusFilter,
  InvitesKpiData,
  SendInviteFormData,
} from "../types";

export function useConvites() {
  const [allInvites, setAllInvites] = useState<InviteItem[]>([]);
  const [apiKpis, setApiKpis] = useState<InvitesKpiData | null>(null);
  const [apiTotal, setApiTotal] = useState<number | null>(null);
  const [apiTurmas, setApiTurmas] = useState<TurmaOption[] | null>(null);
  const [isApiActive, setIsApiActive] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InviteStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<InviteRoleFilter>("all");
  const [sortOption, setSortOption] = useState<InviteSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Exibir feedback com auto-dismiss
  const showFeedback = (text: string, type: "success" | "info" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => {
      setFeedback((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // 1. Carregar turmas da instituição para o modal
  useEffect(() => {
    let isMounted = true;
    listSubjectClasses()
      .then((res) => {
        if (!isMounted) return;
        const options: TurmaOption[] = res.items.map((c) => ({
          id: c.id,
          name: c.name,
          discipline_name: c.discipline_name,
          professor_name: c.professor_name ?? "Docente a definir",
        }));
        setApiTurmas(options);
      })
      .catch(() => {
        // Fallback silencioso para MOCK_TURMAS
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Carregar Métricas dos Convites (30 dias) via API
  useEffect(() => {
    let isMounted = true;
    getInvitesMetrics(30)
      .then((m) => {
        if (!isMounted) return;
        setApiKpis({
          total: m.total,
          pending: m.pending,
          accepted: m.accepted,
          expired: m.expired,
          revoked: m.revoked,
          acceptanceRate: Math.round(m.acceptance_rate),
        });
      })
      .catch(() => {
        // Fallback silencioso para cálculo local dos mocks
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // 3. Carregar lista de convites via API
  useEffect(() => {
    let isMounted = true;
    const sortBy =
      sortOption === "email_asc" || sortOption === "email_desc" ? "email" : "created_at";
    const order =
      sortOption === "oldest" || sortOption === "email_asc" ? "asc" : "desc";

    listInvites({
      status: statusFilter,
      role: roleFilter,
      search: searchQuery.trim() || undefined,
      sort_by: sortBy,
      order: order,
      page: currentPage,
      page_size: pageSize,
    })
      .then((page) => {
        if (!isMounted) return;
        const turmaMap = new Map((apiTurmas ?? []).map((t) => [t.id, t.name]));
        const mapped: InviteItem[] = page.items.map((item: InviteStatusResponse) => {
          const names =
            item.subject_class_names && item.subject_class_names.length > 0
              ? item.subject_class_names
              : (item.subject_class_ids ?? [])
                  .map((id) => turmaMap.get(id))
                  .filter(Boolean) as string[];

          return {
            id: item.id,
            tenant_id: item.tenant_id,
            tenant_name: item.tenant_name,
            email: item.email,
            role: item.role,
            status: item.status,
            token: item.token,
            subject_class_ids: item.subject_class_ids ?? [],
            subject_class_names: names,
            expires_at: item.expires_at,
            created_at: item.created_at,
            accepted_at: item.accepted_at,
            revoked_at: item.revoked_at,
            invited_by_name: item.invited_by_name ?? undefined,
          };
        });

        setAllInvites(mapped);
        setApiTotal(page.total);
        setIsApiActive(true);
      })
      .catch(() => {
        setAllInvites([]);
        setApiTotal(0);
        setIsApiActive(false);
      });

    return () => {
      isMounted = false;
    };
  }, [statusFilter, roleFilter, searchQuery, sortOption, currentPage, pageSize, apiTurmas, refreshKey]);

  // KPIs consolidados
  const defaultKpis: InvitesKpiData = {
    total: 0,
    pending: 0,
    accepted: 0,
    expired: 0,
    revoked: 0,
    acceptanceRate: 0,
  };

  const kpis: InvitesKpiData = apiKpis ?? defaultKpis;

  // Paginação via API
  const totalInvites = apiTotal ?? allInvites.length;
  const totalPages = Math.max(1, Math.ceil(totalInvites / pageSize));
  const paginatedInvites = allInvites;

  // Limpar filtros
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
    setSortOption("newest");
    setCurrentPage(1);
  };

  // Enviar novo convite
  const handleSendInvite = async (data: SendInviteFormData) => {
    try {
      await sendInvite({
        email: data.email,
        role: data.role,
        subject_class_ids:
          data.role === "aluno" && data.subjectClassIds.length > 0
            ? data.subjectClassIds
            : undefined,
      });
      showFeedback(`Convite enviado com sucesso para ${data.email}!`, "success");
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar convite.";
      showFeedback(msg, "info");
    } finally {
      setIsModalOpen(false);
    }
  };

  // Revogar convite
  const handleRevokeInvite = async (invite: InviteItem) => {
    try {
      await revokeInvite(invite.id);
      showFeedback(`Convite para ${invite.email} foi revogado.`, "info");
      refreshData();
    } catch {
      showFeedback(`Não foi possível revogar o convite de ${invite.email}.`, "info");
    }
  };

  // Reenviar convite
  const handleResendInvite = async (invite: InviteItem) => {
    try {
      await resendInvite(invite.id);
      showFeedback(`Convite renovado e reenviado para ${invite.email}!`, "success");
      refreshData();
    } catch {
      showFeedback(`Falha ao reenviar convite para ${invite.email}.`, "info");
    }
  };

  // Copiar link do convite
  const handleCopyInviteLink = (invite: InviteItem) => {
    if (typeof window !== "undefined") {
      const inviteUrl = `${window.location.origin}/invites/accept?token=${invite.token}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(inviteUrl);
      }
    }
  };

  return {
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
    invites: paginatedInvites,
    availableTurmas: apiTurmas ?? [],
    isModalOpen,
    setIsModalOpen,
    handleClearFilters,
    handleSendInvite,
    handleRevokeInvite,
    handleResendInvite,
    handleCopyInviteLink,
    feedback,
  };
}
