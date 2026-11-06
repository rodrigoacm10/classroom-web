"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getMyProfile, UserProfileResponse } from "@/services/user";
import {
  listMembers,
  getMembersMetrics,
  updateTenantMemberRole,
  removeTenantMember,
  sendInvite,
} from "@/services/tenants";
import { listSubjectClasses } from "@/services/subject-classes";
import type { TurmaOption } from "@/modules/alunos/types";
import type {
  MembroItem,
  MembrosKpiData,
  MembrosRoleFilter,
  MembrosSortOption,
  MembroRole,
  SendMemberInviteData,
} from "../types";

export function useMembros() {
  // Perfil do usuário atual logado
  const [currentProfile, setCurrentProfile] = useState<UserProfileResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Filtros e controles de listagem
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<MembrosRoleFilter>("all");
  const [sortOption, setSortOption] = useState<MembrosSortOption>("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Estado dos dados da API
  const [membersList, setMembersList] = useState<MembroItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [apiKpis, setApiKpis] = useState<MembrosKpiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Turmas disponíveis na instituição
  const [availableTurmas, setAvailableTurmas] = useState<TurmaOption[]>([]);

  // Modais de Governança
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [memberToEditRole, setMemberToEditRole] = useState<MembroItem | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<MembroItem | null>(null);

  // Mensagens de Feedback (Toasts)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const refreshData = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // 1. Carrega Perfil do Usuário Logado
  useEffect(() => {
    let isMounted = true;
    getMyProfile()
      .then((profile) => {
        if (!isMounted) return;
        setCurrentProfile(profile);
      })
      .catch((err) => {
        console.error("Erro ao obter perfil do usuário:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Carrega Turmas Disponíveis
  useEffect(() => {
    let isMounted = true;
    listSubjectClasses({ page_size: 100 })
      .then((res) => {
        if (!isMounted) return;
        if (res?.items) {
          setAvailableTurmas(
            res.items.map((t) => ({
              id: t.id,
              name: t.name,
              discipline_name: t.discipline_name,
              professor_name: t.professor_name || "Sem docente atribuído",
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar turmas:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // 3. Carrega Membros via API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    listMembers({
      exclude_role: "aluno",
      role: roleFilter !== "all" ? roleFilter : undefined,
      search: searchQuery.trim() || undefined,
      page: currentPage,
      page_size: pageSize,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.items) {
          const mapped: MembroItem[] = res.items.map((m) => {
            const memberTurmas = availableTurmas.filter(
              (t) =>
                t.professor_name &&
                m.name &&
                t.professor_name.trim().toLowerCase() === m.name.trim().toLowerCase()
            );

            return {
              id: m.id,
              user_id: m.user_id,
              tenant_id: m.tenant_id,
              name: m.name || "Membro sem nome",
              email: m.email,
              role: (m.role as MembroRole) || "professor",
              created_at: m.created_at,
              turmas_count: memberTurmas.length,
              subject_class_names: memberTurmas.map((t) => t.name),
            };
          });

          // Ordenação seletiva
          if (sortOption === "name_asc") {
            mapped.sort((a, b) => a.name.localeCompare(b.name));
          } else if (sortOption === "name_desc") {
            mapped.sort((a, b) => b.name.localeCompare(a.name));
          } else if (sortOption === "role") {
            mapped.sort((a, b) => a.role.localeCompare(b.role));
          } else if (sortOption === "created_at_asc") {
            mapped.sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          } else if (sortOption === "created_at_desc") {
            mapped.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          }

          setMembersList(mapped);
          setTotalCount(res.total);
        } else {
          setMembersList([]);
          setTotalCount(0);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar membros da API:", err);
        if (!isMounted) return;
        setMembersList([]);
        setTotalCount(0);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, roleFilter, sortOption, currentPage, availableTurmas, refreshKey]);

  // 4. Carrega Indicadores Consolidados (KPIs) via API (/members/metrics)
  useEffect(() => {
    let isMounted = true;
    getMembersMetrics()
      .then((data) => {
        if (!isMounted) return;
        setApiKpis({
          totalMembers: data.total_members,
          professoresCount: data.professors_count,
          gestaoCount: data.management_count,
          turmasCount: data.assigned_classes_count,
        });
      })
      .catch((err) => {
        console.error("Erro ao carregar métricas consolidadas dos membros da API:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // KPIs consolidados oficiais da API
  const kpis: MembrosKpiData = useMemo(() => {
    if (apiKpis) return apiKpis;
    return {
      totalMembers: totalCount,
      professoresCount: 0,
      gestaoCount: 0,
      turmasCount: 0,
    };
  }, [apiKpis, totalCount]);

  // Total de páginas
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Permissões
  const userRole = currentProfile?.role || "admin";
  const isAdmin = userRole === "admin";
  const isCoordenador = userRole === "coordenador";
  const canManageMembers = isAdmin; // Somente Admin altera cargos e remove membros
  const canInviteMembers = isAdmin || isCoordenador;

  // Handlers de busca e filtro com reset de página
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleRoleFilterChange = useCallback((role: MembrosRoleFilter) => {
    setRoleFilter(role);
    setCurrentPage(1);
  }, []);

  // Limpar filtros
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setRoleFilter("all");
    setSortOption("name_asc");
    setCurrentPage(1);
  }, []);

  // ─── Ações de Governança ───────────────────────────────────────────────────

  // Alterar Papel
  const handleConfirmRoleChange = async (newRole: MembroRole) => {
    if (!memberToEditRole) return;
    const tenantId = memberToEditRole.tenant_id || currentProfile?.tenant_id;
    if (!tenantId) {
      showToast("Instituição não identificada.", "error");
      return;
    }

    try {
      setActionLoading(true);
      await updateTenantMemberRole(tenantId, memberToEditRole.user_id, newRole);
      showToast(
        `Papel de ${memberToEditRole.name} atualizado para ${newRole.toUpperCase()} com sucesso.`
      );
      setMemberToEditRole(null);
      refreshData();
    } catch (err: unknown) {
      console.error("Falha ao atualizar papel:", err);
      const msg = err instanceof Error ? err.message : "Erro ao alterar papel do membro.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Remover Membro
  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    const tenantId = memberToRemove.tenant_id || currentProfile?.tenant_id;
    if (!tenantId) {
      showToast("Instituição não identificada.", "error");
      return;
    }

    try {
      setActionLoading(true);
      await removeTenantMember(tenantId, memberToRemove.user_id);
      showToast(`${memberToRemove.name} foi desvinculado(a) da instituição com sucesso.`);
      setMemberToRemove(null);
      refreshData();
    } catch (err: unknown) {
      console.error("Falha ao remover membro:", err);
      const msg = err instanceof Error ? err.message : "Erro ao remover membro da instituição.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Convidar Novo Membro
  const handleSendInvite = async (data: SendMemberInviteData) => {
    try {
      setActionLoading(true);
      await sendInvite({
        email: data.email,
        role: data.role,
        subject_class_ids: data.subjectClassIds,
      });
      showToast(`Convite enviado com sucesso para ${data.email} como ${data.role.toUpperCase()}.`);
      setIsInviteModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      console.error("Falha na API de convite:", err);
      const msg = err instanceof Error ? err.message : "Erro ao enviar convite.";
      showToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    currentProfile,
    loadingProfile,
    userRole,
    isAdmin,
    isCoordenador,
    canManageMembers,
    canInviteMembers,

    // Filtros e ordenação
    searchQuery,
    setSearchQuery: handleSearchChange,
    roleFilter,
    setRoleFilter: handleRoleFilterChange,
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
  };
}
