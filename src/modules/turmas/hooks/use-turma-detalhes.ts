"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSubjectClass,
  enrollStudent,
  deleteEnrollment,
  listEnrollments,
  type SubjectClassItem,
} from "@/services/subject-classes";
import {
  listActiveAttendanceSessions,
  listAttendanceSessions,
  type ActiveAttendanceSessionResponse,
  type AttendanceSessionResponse,
} from "@/services/attendance";
import {
  generateClassFrequencyReport,
  type StudentReportItem,
  type ClassReportResponse,
} from "@/services/reports";
import { getRoom, type Room } from "@/services/rooms";
import { listStudents, type StudentItem } from "@/services/tenants";
import { getMyProfile, type UserProfileResponse } from "@/services/user";
import type { TurmaDetalhesTab, StudentFilter } from "../types";

export function useTurmaDetalhes(id: string) {
  const router = useRouter();

  // Turma state
  const [turma, setTurma] = useState<SubjectClassItem | null>(null);
  const [loadingTurma, setLoadingTurma] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<TurmaDetalhesTab>("students");

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);

  // Room state (for Geofence tab)
  const [room, setRoom] = useState<Room | null>(null);

  // Active Session state (for LiveCallBanner)
  const [activeSession, setActiveSession] = useState<ActiveAttendanceSessionResponse | null>(null);

  // Sessions list state (for Aba 2)
  const [sessions, setSessions] = useState<AttendanceSessionResponse[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Students report list state (for Aba 1)
  const [students, setStudents] = useState<StudentReportItem[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [classReport, setClassReport] = useState<ClassReportResponse | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState<StudentFilter>("all");

  // Modal for new student enrollment
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [debouncedCatalogSearch, setDebouncedCatalogSearch] = useState("");
  const [catalogStudents, setCatalogStudents] = useState<StudentItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [enrollingStudentId, setEnrollingStudentId] = useState<string | null>(null);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);
  const [enrollErrorMessage, setEnrollErrorMessage] = useState<string | null>(null);

  // Carrega os dados da turma, perfil e sessão ativa
  const loadTurmaDetails = useCallback(async () => {
    try {
      setLoadingTurma(true);
      setErrorMessage(null);

      const [classRes, profileRes, activeSessionsRes] = await Promise.allSettled([
        getSubjectClass(id),
        getMyProfile(),
        listActiveAttendanceSessions(),
      ]);

      if (classRes.status === "fulfilled") {
        const classData = classRes.value;
        setTurma(classData);

        // Se tiver sala vinculada, carrega os dados da sala física
        if (classData.room_id) {
          getRoom(classData.room_id)
            .then((r) => setRoom(r))
            .catch((err) => console.warn("Falha ao carregar sala:", err));
        }

        // Verifica se há sessão ativa desta turma
        if (activeSessionsRes.status === "fulfilled") {
          const match = activeSessionsRes.value.find((s) => s.subject_class_id === classData.id);
          setActiveSession(match ?? null);
        }
      } else {
        setErrorMessage("Turma não encontrada ou você não tem permissão para acessá-la.");
      }

      if (profileRes.status === "fulfilled") {
        setCurrentUser(profileRes.value);
      }
    } finally {
      setLoadingTurma(false);
    }
  }, [id]);

  // Carrega relatório de frequência e lista de alunos
  const loadStudentsReport = useCallback(async () => {
    try {
      setLoadingStudents(true);
      const report = await generateClassFrequencyReport(id);
      setClassReport(report);
      setStudents(report.students);
    } catch (err) {
      console.warn("Falha ao carregar relatório de frequência:", err);
    } finally {
      setLoadingStudents(false);
    }
  }, [id]);

  // Carrega sessões de chamada da turma (para Aba 2)
  const loadSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const res = await listAttendanceSessions(id, { page_size: 50 });
      setSessions(res.items);
    } catch (err) {
      console.warn("Falha ao carregar sessões de chamada:", err);
    } finally {
      setLoadingSessions(false);
    }
  }, [id]);

  useEffect(() => {
    loadTurmaDetails();
    loadStudentsReport();
    loadSessions();
  }, [loadTurmaDetails, loadStudentsReport, loadSessions]);

  // Debounce da busca de alunos no modal (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCatalogSearch(catalogSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [catalogSearch]);

  // Busca catálogo quando o modal abre ou debouncedCatalogSearch muda
  useEffect(() => {
    if (!showAddStudentModal) return;

    let isCurrent = true;
    async function searchCatalog() {
      try {
        setLoadingCatalog(true);
        const res = await listStudents({
          search: debouncedCatalogSearch.trim() || undefined,
          page_size: 20,
        });
        if (isCurrent) {
          setCatalogStudents(res.items);
        }
      } catch (err) {
        if (isCurrent) {
          console.warn("Erro ao buscar alunos no catálogo:", err);
        }
      } finally {
        if (isCurrent) {
          setLoadingCatalog(false);
        }
      }
    }

    searchCatalog();
    return () => {
      isCurrent = false;
    };
  }, [showAddStudentModal, debouncedCatalogSearch]);

  // Set de IDs dos alunos já matriculados
  const enrolledMemberIds = useMemo(() => {
    return new Set(students.map((s) => s.tenant_member_id));
  }, [students]);

  // Ação de Matricular Aluno do catálogo
  async function handleEnrollStudent(studentItem: StudentItem) {
    if (!turma) return;
    try {
      setEnrollingStudentId(studentItem.id);
      setEnrollErrorMessage(null);
      setEnrollSuccessMessage(null);

      await enrollStudent(turma.id, studentItem.id);

      setEnrollSuccessMessage(`Aluno ${studentItem.name} matriculado com sucesso!`);
      await loadStudentsReport();
      setTurma((prev) => (prev ? { ...prev, student_count: prev.student_count + 1 } : prev));
    } catch (err) {
      setEnrollErrorMessage(err instanceof Error ? err.message : "Erro ao matricular aluno.");
    } finally {
      setEnrollingStudentId(null);
    }
  }

  // Apenas ADMIN e COORDENADOR podem remover matrículas
  const canDeleteEnrollment = currentUser?.role === "admin" || currentUser?.role === "coordenador";

  async function handleRemoveStudent(tenantMemberId: string) {
    if (!turma) return;
    if (!confirm("Tem certeza que deseja remover a matrícula deste aluno da turma?")) return;

    try {
      const enrollmentsRes = await listEnrollments(turma.id, { page_size: 100 });
      const enrollment = enrollmentsRes.items.find((e) => e.tenant_member_id === tenantMemberId);

      if (!enrollment) {
        alert("Matrícula não encontrada no servidor.");
        return;
      }

      await deleteEnrollment(turma.id, enrollment.id);
      await loadStudentsReport();
      setTurma((prev) => (prev ? { ...prev, student_count: Math.max(0, prev.student_count - 1) } : prev));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao remover matrícula.");
    }
  }

  // KPIs
  const attendancePct = useMemo(() => {
    if (classReport && classReport.total_students > 0) {
      return Math.round(classReport.class_average_frequency * 100);
    }
    if (turma) {
      return Math.round(turma.attendance_rate * 100);
    }
    return 0;
  }, [classReport, turma]);

  const atRiskCount = useMemo(() => {
    if (classReport) return classReport.students_at_risk;
    return students.filter((s) => s.at_risk).length;
  }, [classReport, students]);

  const regularCount = useMemo(() => {
    return Math.max(0, students.length - atRiskCount);
  }, [students, atRiskCount]);

  // Alunos filtrados por busca e status regular / em risco
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (studentFilter === "regular" && s.at_risk) return false;
      if (studentFilter === "at_risk" && !s.at_risk) return false;
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase().trim();
        return (
          s.student_name.toLowerCase().includes(q) ||
          (s.email && s.email.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [students, studentSearch, studentFilter]);

  return {
    router,
    turma,
    loadingTurma,
    errorMessage,
    activeTab,
    setActiveTab,
    currentUser,
    room,
    activeSession,
    sessions,
    loadingSessions,
    students,
    loadingStudents,
    classReport,
    studentSearch,
    setStudentSearch,
    studentFilter,
    setStudentFilter,
    showAddStudentModal,
    setShowAddStudentModal,
    catalogSearch,
    setCatalogSearch,
    catalogStudents,
    loadingCatalog,
    enrollingStudentId,
    enrollSuccessMessage,
    setEnrollSuccessMessage,
    enrollErrorMessage,
    setEnrollErrorMessage,
    enrolledMemberIds,
    handleEnrollStudent,
    canDeleteEnrollment,
    handleRemoveStudent,
    attendancePct,
    atRiskCount,
    regularCount,
    filteredStudents,
  };
}
