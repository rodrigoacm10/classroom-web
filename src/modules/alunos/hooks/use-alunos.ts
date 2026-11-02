"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getMyProfile } from "@/services/user";
import { getStudentsMetrics, listStudents, sendInvite } from "@/services/tenants";
import { listSubjectClasses, enrollStudent } from "@/services/subject-classes";
import type {
  AlunoItem,
  AlunosKpiData,
  AlunosSortOption,
  AlunosStatusFilter,
  TurmaOption,
  UserRoleScope,
} from "../types";
import {
  MOCK_ALUNOS,
  MOCK_TURMAS,
  CURRENT_PROFESSOR_ID,
} from "../data/mock-alunos";

export function useAlunos() {
  // Perfil e alternador de escopo (Admin/Gestor vs Professor)
  const [roleScope, setRoleScope] = useState<UserRoleScope>("admin");
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<AlunosStatusFilter>("all");
  const [sortOption, setSortOption] = useState<AlunosSortOption>("name_asc");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Estado do Drawer lateral
  const [selectedStudent, setSelectedStudent] = useState<AlunoItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Estado do Modal de Convidar / Matricular
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Estados dos dados vindos da API
  const [apiKpis, setApiKpis] = useState<AlunosKpiData | null>(null);
  const [apiAlunos, setApiAlunos] = useState<AlunoItem[] | null>(null);
  const [apiTotal, setApiTotal] = useState<number | null>(null);
  const [apiTurmas, setApiTurmas] = useState<TurmaOption[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // 1. Inicializar com o perfil do usuário caso logado
  useEffect(() => {
    let isMounted = true;
    getMyProfile()
      .then((profile) => {
        if (!isMounted) return;
        if (profile.role === "professor") {
          setRoleScope("professor");
        } else {
          setRoleScope("admin");
        }
      })
      .catch(() => {
        if (isMounted) setRoleScope("admin");
      })
      .finally(() => {
        if (isMounted) setLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Carregar lista de turmas reais da instituição
  useEffect(() => {
    let isMounted = true;
    listSubjectClasses({ page_size: 100 })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.items) {
          const mapped: TurmaOption[] = res.items.map((t) => ({
            id: t.id,
            name: t.name,
            discipline_name: t.discipline_name,
            professor_name: t.professor_name || "Sem professor atribuído",
          }));
          setApiTurmas(mapped);
        }
      })
      .catch(() => {
        // Em caso de falha de conexão, mantém fallback
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // 3. Carregar KPIs consolidados via API
  useEffect(() => {
    let isMounted = true;
    getStudentsMetrics()
      .then((data) => {
        if (!isMounted) return;
        setApiKpis({
          totalStudents: data.total_students,
          avgClassesPerStudent: data.avg_classes_per_student,
          avgAttendanceRate: Math.round(data.average_attendance_rate * 100),
          atRiskCount: data.students_at_risk,
          noClassCount: data.students_no_class,
          totalEnrollments: data.total_enrollments,
        });
      })
      .catch(() => {
        // Fallback local se backend offline
      });

    return () => {
      isMounted = false;
    };
  }, [roleScope, refreshKey]);

  // 4. Carregar lista de alunos paginada com ordenação e filtros via API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const sortByParam = sortOption.startsWith("name") ? "name" : "turmas_count";
    const orderParam = sortOption.endsWith("desc") ? "desc" : "asc";
    const statusParam =
      statusFilter !== "all" ? (statusFilter as "regular" | "sem_turma") : undefined;

    listStudents({
      search: searchQuery.trim() || undefined,
      subject_class_id: selectedTurmaId !== "all" ? selectedTurmaId : undefined,
      status: statusParam,
      sort_by: sortByParam,
      order: orderParam,
      page: currentPage,
      page_size: pageSize,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.items) {
          const mapped: AlunoItem[] = res.items.map((it) => {
            const turmasCount = it.turmas_count ?? 0;
            const statusVal: "regular" | "sem_turma" =
              turmasCount > 0 ? "regular" : "sem_turma";

            return {
              id: it.id,
              tenant_member_id: it.tenant_member_id,
              user_id: it.user_id,
              name: it.name,
              email: it.email,
              role: "aluno",
              matricula: it.email.split("@")[0].toUpperCase(),
              created_at: it.created_at,
              turmas_count: turmasCount,
              turmas: [],
              global_attendance_rate: it.attendance_rate ?? 0.0,
              total_sessions: it.total_sessions ?? 0,
              total_present: it.total_present ?? 0,
              total_absent: it.total_absent ?? 0,
              avg_distance_meters: 0,
              status: statusVal,
            };
          });
          setApiAlunos(mapped);
          setApiTotal(res.total);
        }
      })
      .catch(() => {
        // Mantém fallback para mock em caso de erro
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    searchQuery,
    selectedTurmaId,
    statusFilter,
    sortOption,
    currentPage,
    pageSize,
    refreshKey,
  ]);

  // Turmas disponíveis
  const availableTurmas = useMemo<TurmaOption[]>(() => {
    if (apiTurmas !== null) {
      return apiTurmas;
    }
    if (roleScope === "professor") {
      return MOCK_TURMAS.filter((t) => t.is_mine);
    }
    return MOCK_TURMAS;
  }, [apiTurmas, roleScope]);

  // Manipuladores de Drawer
  const openDrawer = (student: AlunoItem) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTurmaId("all");
    setStatusFilter("all");
    setSortOption("name_asc");
    setCurrentPage(1);
  };

  // Enviar convite para o aluno com multi-seleção de turmas
  const handleInviteStudent = async (data: {
    email: string;
    subjectClassIds: string[];
  }) => {
    await sendInvite({
      email: data.email,
      role: "aluno",
      subject_class_ids:
        data.subjectClassIds.length > 0 ? data.subjectClassIds : undefined,
    });

    // Atualiza a listagem e os KPIs na API
    refreshData();
    setIsInviteModalOpen(false);
  };

  // Matricular aluno em turma via API
  const handleEnrollInClass = async (studentId: string, turmaId: string) => {
    try {
      await enrollStudent(turmaId, studentId);
      refreshData();
    } catch (err) {
      console.error("Erro ao matricular estudante na turma:", err);
    }
  };

  // KPIs de fallback se a API não estiver conectada
  const fallbackKpis: AlunosKpiData = useMemo(() => {
    const total = MOCK_ALUNOS.length;
    const totalEnrollments = MOCK_ALUNOS.reduce((acc, a) => acc + a.turmas_count, 0);
    return {
      totalStudents: total,
      avgClassesPerStudent: Number((totalEnrollments / total).toFixed(1)),
      avgAttendanceRate: 85,
      atRiskCount: 0,
      noClassCount: MOCK_ALUNOS.filter((a) => a.turmas_count === 0).length,
      totalEnrollments,
    };
  }, []);

  const totalStudents = apiTotal ?? MOCK_ALUNOS.length;
  const totalPages = Math.max(1, Math.ceil(totalStudents / pageSize));

  return {
    roleScope,
    loadingProfile,
    isLoading,
    searchQuery,
    setSearchQuery: (q: string) => {
      setSearchQuery(q);
      setCurrentPage(1);
    },
    selectedTurmaId,
    setSelectedTurmaId: (tid: string) => {
      setSelectedTurmaId(tid);
      setCurrentPage(1);
    },
    statusFilter,
    setStatusFilter: (s: AlunosStatusFilter) => {
      setStatusFilter(s);
      setCurrentPage(1);
    },
    sortOption,
    setSortOption: (s: AlunosSortOption) => {
      setSortOption(s);
      setCurrentPage(1);
    },
    currentPage,
    setCurrentPage,
    pageSize,
    availableTurmas,
    kpis: apiKpis ?? fallbackKpis,
    alunos: apiAlunos ?? MOCK_ALUNOS.slice(0, pageSize),
    totalStudents,
    totalPages,
    handleClearFilters,
    selectedStudent,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    isInviteModalOpen,
    setIsInviteModalOpen,
    handleInviteStudent,
    handleEnrollInClass,
    refreshData,
  };
}
