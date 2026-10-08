"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  listSubjectClasses,
  getSubjectClassMetrics,
  listActiveAttendanceSessions,
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
    handleClearFilters,
    refreshHeader: loadHeaderData,
    refreshClasses: fetchClasses,
  };
}
