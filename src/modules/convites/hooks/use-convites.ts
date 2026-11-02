"use client";

import { useState, useMemo } from "react";
import { MOCK_CONVITES, calculateInvitesKpis } from "../data/mock-convites";
import { MOCK_TURMAS } from "@/modules/alunos/data/mock-alunos";
import type {
  InviteItem,
  InviteRoleFilter,
  InviteSortOption,
  InviteStatusFilter,
  InvitesKpiData,
  SendInviteFormData,
} from "../types";

export function useConvites() {
  const [allInvites, setAllInvites] = useState<InviteItem[]>(MOCK_CONVITES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InviteStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<InviteRoleFilter>("all");
  const [sortOption, setSortOption] = useState<InviteSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // Exibir feedback com auto-dismiss
  const showFeedback = (text: string, type: "success" | "info" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => {
      setFeedback((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // KPIs calculados sobre todos os convites da instituição
  const kpis: InvitesKpiData = useMemo(() => {
    return calculateInvitesKpis(allInvites);
  }, [allInvites]);

  // Filtragem e ordenação
  const filteredInvites = useMemo(() => {
    let result = [...allInvites];

    // Busca textual por e-mail ou nome de turma
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.email.toLowerCase().includes(q) ||
          i.role.toLowerCase().includes(q) ||
          i.subject_class_names?.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }

    // Filtro por papel
    if (roleFilter !== "all") {
      result = result.filter((i) => i.role === roleFilter);
    }

    // Ordenação
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "email_asc":
          return a.email.localeCompare(b.email);
        case "email_desc":
          return b.email.localeCompare(a.email);
        default:
          return 0;
      }
    });

    return result;
  }, [allInvites, searchQuery, statusFilter, roleFilter, sortOption]);

  // Paginação
  const totalInvites = filteredInvites.length;
  const totalPages = Math.ceil(totalInvites / pageSize);
  const paginatedInvites = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvites.slice(start, start + pageSize);
  }, [filteredInvites, currentPage, pageSize]);

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
    const selectedClassNames = MOCK_TURMAS.filter((t) =>
      data.subjectClassIds.includes(t.id)
    ).map((t) => t.name);

    const newInvite: InviteItem = {
      id: `inv-${Date.now()}`,
      tenant_id: "ten-001",
      tenant_name: "Universidade Locus",
      email: data.email,
      role: data.role,
      status: "pending",
      token: `loc_tok_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`,
      subject_class_ids: data.subjectClassIds,
      subject_class_names: selectedClassNames,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      invited_by_name: "Ana Professora (Admin)",
    };

    setAllInvites((prev) => [newInvite, ...prev]);
    showFeedback(`Convite enviado com sucesso para ${data.email}!`, "success");
    setIsModalOpen(false);
  };

  // Revogar convite
  const handleRevokeInvite = (invite: InviteItem) => {
    setAllInvites((prev) =>
      prev.map((i) =>
        i.id === invite.id
          ? { ...i, status: "revoked", revoked_at: new Date().toISOString() }
          : i
      )
    );
    showFeedback(`Convite para ${invite.email} foi revogado.`, "info");
  };

  // Reenviar convite
  const handleResendInvite = (invite: InviteItem) => {
    setAllInvites((prev) =>
      prev.map((i) =>
        i.id === invite.id
          ? {
              ...i,
              status: "pending",
              expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              created_at: new Date().toISOString(),
            }
          : i
      )
    );
    showFeedback(`Convite renovado e reenviado para ${invite.email}!`, "success");
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
    availableTurmas: MOCK_TURMAS,
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
