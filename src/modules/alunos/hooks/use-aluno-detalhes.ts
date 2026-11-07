"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getMyProfile } from "@/services/user";
import { getStudent, getStudentAttendanceHistory } from "@/services/tenants";
import {
  listStudentSubjectClasses,
  listSubjectClasses,
  enrollStudent,
  deleteEnrollment,
} from "@/services/subject-classes";
import type {
  AlunoItem,
  AlunoTurma,
  AlunoDetalhesTab,
  ChamadaHistoricoItem,
  ChamadaStatusFilter,
  TurmaOption,
  UserRoleScope,
} from "../types";

export function useAlunoDetalhes(id: string) {
  const [aluno, setAluno] = useState<AlunoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRoleScope>("admin");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AlunoDetalhesTab>("turmas");

  // Filtros de histórico de chamadas
  const [chamadasTurmaFilter, setChamadasTurmaFilter] = useState<string>("all");
  const [chamadasStatusFilter, setChamadasStatusFilter] = useState<ChamadaStatusFilter>("all");

  // Chamadas carregadas da API
  const [apiChamadas, setApiChamadas] = useState<ChamadaHistoricoItem[] | null>(null);

  // Turmas da instituição disponíveis para matricular
  const [allInstitutionTurmas, setAllInstitutionTurmas] = useState<TurmaOption[]>([]);

  // Modais de matrícula / desmatrícula
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [turmaToUnenroll, setTurmaToUnenroll] = useState<AlunoTurma | null>(null);
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false);

  // Trigger para recarregar dados
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // 1. Obter perfil e role do usuário logado
  useEffect(() => {
    let isMounted = true;
    getMyProfile()
      .then((profile) => {
        if (!isMounted) return;
        setCurrentUserId(profile.id);
        if (profile.role === "professor") {
          setUserRole("professor");
        } else {
          setUserRole("admin");
        }
      })
      .catch(() => {
        if (isMounted) setUserRole("admin");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Carregar turmas da instituição para o modal de matrícula
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
            professor_name: t.professor_name || "Sem professor vinculado",
            is_mine: t.professor_id === currentUserId,
          }));
          setAllInstitutionTurmas(mapped);
        }
      })
      .catch(() => {
        if (isMounted) setAllInstitutionTurmas([]);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUserId, refreshKey]);

  // 3. Carregar dados cadastrais do aluno e turmas matriculadas
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getStudent(id).catch(() => null),
      listStudentSubjectClasses(id).catch(() => null),
    ])
      .then(([studentData, classesData]) => {
        if (!isMounted) return;

        if (studentData) {
          const mappedTurmas: AlunoTurma[] = (classesData || []).map((c) => ({
            id: c.subject_class_id,
            enrollment_id: c.enrollment_id,
            name: c.name,
            discipline_name: c.discipline_name,
            professor_name: c.professor_name || "Sem professor atribuído",
            professor_id: c.professor_id || undefined,
            room_name: c.room_name || "Sala Convencional",
            attendance_rate: c.attendance_rate,
            total_sessions: c.total_sessions,
            total_present: Math.max(c.total_sessions - c.absences_count, 0),
            total_absent: c.absences_count,
            avg_distance_meters: 0,
            status: c.attendance_rate < 0.75 ? "at_risk" : "regular",
            is_mine: c.professor_id === currentUserId,
          }));

          const statusVal: "regular" | "at_risk" | "sem_turma" =
            mappedTurmas.length === 0
              ? "sem_turma"
              : (studentData.attendance_rate ?? 1.0) < 0.75
              ? "at_risk"
              : "regular";

          const studentObj: AlunoItem = {
            id: studentData.id,
            tenant_member_id: studentData.tenant_member_id || studentData.id,
            user_id: studentData.user_id,
            name: studentData.name,
            email: studentData.email,
            role: "aluno",
            matricula: studentData.email.split("@")[0].toUpperCase(),
            created_at: studentData.created_at,
            turmas_count: studentData.turmas_count ?? mappedTurmas.length,
            turmas: mappedTurmas,
            global_attendance_rate: studentData.attendance_rate ?? 0.0,
            total_sessions: studentData.total_sessions ?? 0,
            total_present: studentData.total_present ?? 0,
            total_absent: studentData.total_absent ?? 0,
            avg_distance_meters: 0,
            status: statusVal,
          };

          setAluno(studentObj);
        } else {
          setAluno(null);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setAluno(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, currentUserId, refreshKey]);

  // 4. Carregar histórico de chamadas das turmas do aluno
  useEffect(() => {
    let isMounted = true;
    const turmaParam =
      chamadasTurmaFilter !== "all" ? chamadasTurmaFilter : undefined;

    getStudentAttendanceHistory(id, {
      subject_class_id: turmaParam,
      page_size: 50,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.items) {
          const mapped: ChamadaHistoricoItem[] = res.items.map((it) => {
            const statusNorm = it.record_status?.toLowerCase();
            const isPresente =
              statusNorm === "regular" || statusNorm === "approved";
            return {
              id: it.record_id || it.session_id,
              session_id: it.session_id,
              subject_class_id: it.subject_class_id,
              subject_class_name: it.subject_class_name,
              discipline_name: it.discipline_name,
              room_name: it.room_name || "Sala Padrão",
              professor_name: "",
              date: it.opened_at,
              status: isPresente ? "presente" : "falta",
              distance_meters: null,
              within_radius: true,
              accuracy_meters: null,
            };
          });
          setApiChamadas(mapped);
        }
      })
      .catch(() => {
        // Fallback local se backend sem registros
        if (isMounted) setApiChamadas(null);
      });

    return () => {
      isMounted = false;
    };
  }, [id, chamadasTurmaFilter, refreshKey]);

  // Histórico de chamadas consolidado
  const chamadas = useMemo<ChamadaHistoricoItem[]>(() => {
    return apiChamadas ?? [];
  }, [apiChamadas]);

  // Chamadas filtradas por presença / falta
  const filteredChamadas = useMemo(() => {
    return chamadas.filter((item) => {
      if (
        chamadasTurmaFilter !== "all" &&
        item.subject_class_id !== chamadasTurmaFilter
      ) {
        return false;
      }
      if (
        chamadasStatusFilter !== "all" &&
        item.status !== chamadasStatusFilter
      ) {
        return false;
      }
      return true;
    });
  }, [chamadas, chamadasTurmaFilter, chamadasStatusFilter]);

  // Turmas disponíveis para matrícula que o aluno ainda não cursa
  const availableTurmasToEnroll = useMemo<TurmaOption[]>(() => {
    if (!aluno) return [];
    const enrolledClassIds = new Set(aluno.turmas.map((t) => t.id));
    const unEnrolled = allInstitutionTurmas.filter(
      (t) => !enrolledClassIds.has(t.id)
    );

    if (userRole === "professor") {
      return unEnrolled.filter((t) => t.is_mine);
    }
    return unEnrolled;
  }, [aluno, allInstitutionTurmas, userRole]);

  // Permissão de desmatricular: apenas ADMIN e COORDENADOR (conforme regra da API)
  const canUnenroll = useCallback(
    (_turma: AlunoTurma): boolean => {
      return userRole === "admin" || userRole === "coordenador";
    },
    [userRole]
  );

  // Ação de Matricular em Turma via API
  const handleEnroll = useCallback(
    async (turmaId: string) => {
      if (!aluno) return;

      try {
        await enrollStudent(turmaId, aluno.id);
        const turmaObj = allInstitutionTurmas.find((t) => t.id === turmaId);
        showToast(
          `Aluno matriculado com sucesso em ${turmaObj?.discipline_name || "turma"}!`
        );
        setIsEnrollModalOpen(false);
        triggerRefresh();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Erro ao matricular aluno na turma.";
        showToast(msg, "error");
      }
    },
    [aluno, allInstitutionTurmas, showToast, triggerRefresh]
  );

  // Ação de Desmatricular via API
  const handleConfirmUnenroll = useCallback(async () => {
    if (!aluno || !turmaToUnenroll) return;

    if (!canUnenroll(turmaToUnenroll)) {
      showToast(
        "Você não possui permissão para desmatricular esta turma.",
        "error"
      );
      setIsUnenrollModalOpen(false);
      return;
    }

    try {
      if (turmaToUnenroll.enrollment_id) {
        await deleteEnrollment(turmaToUnenroll.id, turmaToUnenroll.enrollment_id);
      }
      showToast(
        `Matrícula na turma ${turmaToUnenroll.discipline_name} cancelada com sucesso.`
      );
      setIsUnenrollModalOpen(false);
      setTurmaToUnenroll(null);
      triggerRefresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao desmatricular aluno da turma.";
      showToast(msg, "error");
    }
  }, [aluno, turmaToUnenroll, canUnenroll, showToast, triggerRefresh]);

  const requestUnenroll = (turma: AlunoTurma) => {
    setTurmaToUnenroll(turma);
    setIsUnenrollModalOpen(true);
  };

  return {
    aluno,
    loading,
    userRole,
    activeTab,
    setActiveTab,
    chamadas,
    filteredChamadas,
    chamadasTurmaFilter,
    setChamadasTurmaFilter,
    chamadasStatusFilter,
    setChamadasStatusFilter,
    availableTurmasToEnroll,
    canUnenroll,
    isEnrollModalOpen,
    setIsEnrollModalOpen,
    handleEnroll,
    turmaToUnenroll,
    isUnenrollModalOpen,
    setIsUnenrollModalOpen,
    requestUnenroll,
    handleConfirmUnenroll,
    toastMessage,
    triggerRefresh,
  };
}
