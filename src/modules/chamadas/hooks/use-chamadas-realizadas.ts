"use client";

import { useEffect, useState, useCallback } from "react";
import {
  listTenantAttendanceSessions,
  getAttendanceMetrics,
  type AttendanceMetricsResponse,
} from "@/services/attendance";
import { listSubjectClasses, type SubjectClassItem } from "@/services/subject-classes";
import { useActiveCall } from "@/hooks";
import { toAttendanceRecord, toAttendanceRecordFromActive } from "../mappers";
import type {
  AttendanceRecord,
  AttendanceTab,
  AttendanceSort,
  AttendancePeriod,
  AttendanceStatusFilter,
} from "../types";

export function useChamadasRealizadas() {
  const [activeTab, setActiveTab] = useState<AttendanceTab>("realizadas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatusFilter>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<AttendancePeriod>("30");
  const [selectedSort, setSelectedSort] = useState<AttendanceSort>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Chamada selecionada para o modal de detalhes
  const [selectedCall, setSelectedCall] = useState<AttendanceRecord | null>(null);

  // Sessão ativa em tempo real (apenas para fallback da lista e badge de aba)
  const { activeSession } = useActiveCall();

  // Métricas do tenant
  const [metrics, setMetrics] = useState<AttendanceMetricsResponse | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Turmas do professor para filtros
  const [subjectClasses, setSubjectClasses] = useState<SubjectClassItem[]>([]);

  // Sessões listadas
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Busca com debounce
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Carrega turmas ativas
  useEffect(() => {
    let cancelled = false;
    async function loadClasses() {
      try {
        const res = await listSubjectClasses({ page_size: 50, active: true });
        if (!cancelled && res?.items) {
          setSubjectClasses(res.items);
        }
      } catch {
        // Silencioso
      }
    }
    loadClasses();
    return () => {
      cancelled = true;
    };
  }, []);



  // Carrega métricas consolidadas conforme o período
  useEffect(() => {
    let cancelled = false;

    async function loadMetrics() {
      try {
        setLoadingMetrics(true);
        const days = selectedPeriod === "all" ? 365 : Number(selectedPeriod);
        const data = await getAttendanceMetrics(days);
        if (!cancelled && data) {
          setMetrics(data);
        }
      } catch {
        // Silencioso
      } finally {
        if (!cancelled) {
          setLoadingMetrics(false);
        }
      }
    }

    loadMetrics();
    return () => {
      cancelled = true;
    };
  }, [selectedPeriod]);

  // Carrega as sessões (histórico ou em andamento)
  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      try {
        setLoadingSessions(true);
        const params: Record<string, unknown> = {
          page: currentPage,
          page_size: pageSize,
          sort: selectedSort,
        };

        if (activeTab === "em_andamento") {
          params.status = "open";
        } else {
          if (selectedStatus !== "all") {
            params.status = selectedStatus;
          } else {
            params.exclude_status = "open";
          }
          if (selectedPeriod !== "all") {
            const d = new Date();
            d.setDate(d.getDate() - Number(selectedPeriod));
            params.opened_after = d.toISOString();
          }
        }

        if (selectedClass !== "all") {
          params.subject_class_id = selectedClass;
        }

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        const res = await listTenantAttendanceSessions(params);
        if (!cancelled && res && res.items) {
          let mapped = res.items.map(toAttendanceRecord);

          if (activeTab === "em_andamento" && mapped.length === 0 && activeSession) {
            mapped = [toAttendanceRecordFromActive(activeSession)];
            setRecords(mapped);
            setTotalItems(1);
          } else {
            setRecords(mapped);
            setTotalItems(res.total);
          }
        } else if (!cancelled) {
          setRecords([]);
          setTotalItems(0);
        }
      } catch {
        if (!cancelled) {
          setRecords([]);
          setTotalItems(0);
        }
      } finally {
        if (!cancelled) {
          setLoadingSessions(false);
        }
      }
    }

    loadSessions();
    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    pageSize,
    selectedStatus,
    debouncedSearch,
    selectedPeriod,
    selectedSort,
    activeTab,
    selectedClass,
    activeSession,
  ]);

  // Registros já ordenados pela API no banco
  const sortedRecords = records;

  // Cálculos de paginação
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentClampedPage = Math.min(currentPage, totalPages);

  // Ações de alteração com reset de página
  const handleTabChange = useCallback((tab: AttendanceTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleClassChange = useCallback((classId: string) => {
    setSelectedClass(classId);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((status: AttendanceStatusFilter | string) => {
    setSelectedStatus(status as AttendanceStatusFilter);
    setCurrentPage(1);
  }, []);

  const handlePeriodChange = useCallback((period: AttendancePeriod | string) => {
    setSelectedPeriod(period as AttendancePeriod);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: AttendanceSort | string) => {
    setSelectedSort(sort as AttendanceSort);
    setCurrentPage(1);
  }, []);

  return {
    // Filtros e busca
    activeTab,
    setActiveTab: handleTabChange,
    handleTabChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    handleSearchChange,
    selectedClass,
    setSelectedClass: handleClassChange,
    handleClassChange,
    selectedStatus,
    setSelectedStatus: handleStatusChange,
    handleStatusChange,
    selectedPeriod,
    setSelectedPeriod: handlePeriodChange,
    handlePeriodChange,
    selectedSort,
    setSelectedSort: handleSortChange,
    handleSortChange,

    // Paginação
    currentPage: currentClampedPage,
    currentClampedPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize,

    // Dados e listas
    records: sortedRecords,
    sortedRecords,
    loadingSessions,
    subjectClasses,

    // Sessão ativa
    activeSession,

    // Métricas
    metrics,
    loadingMetrics,

    // Modal
    selectedCall,
    setSelectedCall,
  };
}
