"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  listSubjectClasses,
  getSubjectClassMetrics,
  listActiveAttendanceSessions,
  getMyProfile,
  updateSubjectClass,
  deleteSubjectClass,
  type SubjectClassItem,
  type SubjectClassMetrics,
  type ActiveAttendanceSessionResponse,
} from "@/lib/api";
import type { TurmasStatusFilter, TurmasSortOption, TurmasKpiData } from "../types";

export interface UseTurmasOptions {
  initialPageSize?: number;
}

export function useTurmas(options: UseTurmasOptions = {}) {
  const pageSize = options.initialPageSize ?? 8;

  // Estados de dados da API
  const [classes, setClasses] = useState<SubjectClassItem[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tableLoading, setTableLoading] = useState(true);

  // Métricas do topo (KPIs)
  const [metrics, setMetrics] = useState<SubjectClassMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Sessão ao vivo para banner / referência
  const [activeSession, setActiveSession] = useState<ActiveAttendanceSessionResponse | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Filtros e paginação
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TurmasStatusFilter>("all");
  const [sortOption, setSortOption] = useState<TurmasSortOption>("name_asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Perfil do usuário logado (para permissões de admin)
  const [userRole, setUserRole] = useState<string | null>(null);

  // Modal de exclusão
  const [turmaToDelete, setTurmaToDelete] = useState<SubjectClassItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast de feedback
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Limpa toast após 4s
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Carrega papel do usuário
  useEffect(() => {
    let isMounted = true;
    getMyProfile()
      .then((p) => {
        if (isMounted) setUserRole(p.role);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce na busca para evitar requisições a cada tecla digitada
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Carrega as métricas consolidadas dos KPIs e a chamada ativa do banner
  const loadHeaderData = useCallback(async (isMounted: () => boolean) => {
    try {
      setMetricsLoading(true);
      setSessionLoading(true);

      const [metricsResult, sessionsResult] = await Promise.allSettled([
        getSubjectClassMetrics({ days: 30 }),
        listActiveAttendanceSessions(),
      ]);

      if (!isMounted()) return;

      if (metricsResult.status === "fulfilled") {
        setMetrics(metricsResult.value);
      } else {
        console.warn("Métricas de turmas indisponíveis na API:", metricsResult.reason);
      }

      if (sessionsResult.status === "fulfilled") {
        const sessions = sessionsResult.value;
        setActiveSession(sessions.length > 0 ? sessions[0] : null);
      } else {
        console.warn("Sessões ativas indisponíveis na API:", sessionsResult.reason);
      }
    } finally {
      if (isMounted()) {
        setMetricsLoading(false);
        setSessionLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    loadHeaderData(() => mounted);
    return () => {
      mounted = false;
    };
  }, [loadHeaderData]);

  // Carrega a listagem paginada e filtrada de turmas diretamente da API
  const fetchClasses = useCallback(async (isMounted: () => boolean) => {
    try {
      setTableLoading(true);

      let activeParam: boolean | undefined = undefined;
      let liveParam: boolean | undefined = undefined;
      if (statusFilter === "active") activeParam = true;
      if (statusFilter === "inactive") activeParam = false;
      if (statusFilter === "live") liveParam = true;

      let sortByParam: string | undefined = undefined;
      let orderParam: "asc" | "desc" | undefined = undefined;
      if (sortOption === "name_asc") {
        sortByParam = "name";
        orderParam = "asc";
      } else if (sortOption === "name_desc") {
        sortByParam = "name";
        orderParam = "desc";
      } else if (sortOption === "students_desc") {
        sortByParam = "student_count";
        orderParam = "desc";
      }

      const res = await listSubjectClasses({
        search: debouncedSearch.trim() || undefined,
        active: activeParam,
        has_active_session: liveParam,
        sort_by: sortByParam,
        order: orderParam,
        page: currentPage,
        page_size: pageSize,
      });

      if (!isMounted()) return;

      setClasses(res.items);
      setTotalClasses(res.total);
      setTotalPages(Math.max(1, res.total_pages || Math.ceil(res.total / pageSize)));
    } catch (err) {
      if (!isMounted()) return;
      console.warn("Erro ao buscar turmas na API:", err);
      setClasses([]);
      setTotalClasses(0);
      setTotalPages(1);
    } finally {
      if (isMounted()) {
        setTableLoading(false);
      }
    }
  }, [debouncedSearch, statusFilter, sortOption, currentPage, pageSize]);

  useEffect(() => {
    let mounted = true;
    fetchClasses(() => mounted);
    return () => {
      mounted = false;
    };
  }, [fetchClasses]);

  // Indicadores consolidados dos 4 KPIs (com fallback zerado se não houver dados)
  const kpis: TurmasKpiData = useMemo(() => {
    if (!metrics) {
      return {
        totalClasses: 0,
        activeClasses: 0,
        totalStudents: 0,
        avgAttendance: 0,
        atRiskCount: 0,
        liveCount: 0,
      };
    }
    return {
      totalClasses: metrics.total_classes,
      activeClasses: metrics.active_classes,
      totalStudents: metrics.total_students,
      avgAttendance: Math.round(metrics.average_attendance_rate * 100),
      atRiskCount: metrics.at_risk_classes_count,
      liveCount: metrics.live_classes_count,
    };
  }, [metrics]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  }, []);

  const handleToggleActive = useCallback(async (turma: SubjectClassItem) => {
    const nextActive = !turma.active;
    try {
      await updateSubjectClass(turma.id, { active: nextActive });
      setClasses((prev) =>
        prev.map((c) => (c.id === turma.id ? { ...c, active: nextActive } : c))
      );
      setToastMessage({
        type: "success",
        text: nextActive
          ? `Turma "${turma.name}" ativada para chamadas.`
          : `Turma "${turma.name}" desativada (pausada).`,
      });
    } catch (err) {
      setToastMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao alterar status da turma.",
      });
    }
  }, []);

  const handleOpenDeleteModal = useCallback((turma: SubjectClassItem) => {
    setTurmaToDelete(turma);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setTurmaToDelete(null);
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!turmaToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSubjectClass(turmaToDelete.id);
      setClasses((prev) => prev.filter((c) => c.id !== turmaToDelete.id));
      setTotalClasses((prev) => Math.max(0, prev - 1));
      setToastMessage({
        type: "success",
        text: `Turma "${turmaToDelete.name}" excluída com sucesso.`,
      });
      setIsDeleteModalOpen(false);
      setTurmaToDelete(null);
    } catch (err) {
      setToastMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao excluir turma.",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [turmaToDelete]);

  return {
    classes,
    totalClasses,
    totalPages,
    tableLoading,
    metrics,
    metricsLoading,
    activeSession,
    sessionLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    pageSize,
    kpis,
    isAdmin: userRole === "admin",
    isDeleteModalOpen,
    turmaToDelete,
    isDeleting,
    toastMessage,
    handleToggleActive,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleClearFilters,
    refreshHeader: loadHeaderData,
    refreshClasses: fetchClasses,
  };
}
