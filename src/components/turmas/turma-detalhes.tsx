"use client";

import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { attendanceColor, attendanceBarColor } from "@/lib/utils";
import { LiveCallBanner } from "@/modules/dashboard";
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5A4.5 4.5 0 0 0 8 1.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-muted">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 13c0-2.5 2-3.8 4.5-3.8s4.5 1.3 4.5 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 4a2.2 2.2 0 0 1 0 4.4M14.5 12.5c0-1.8-1.2-2.8-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-muted">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 4v3.2l2 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function GpsTargetIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function formatSessionDate(openedAt: string): string {
  try {
    const date = new Date(openedAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(date);
    if (isToday) return `Hoje, ${dayMonth}`;
    const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dayMonth}`;
  } catch {
    return openedAt;
  }
}

function formatSessionTimeRange(openedAt: string, expiresAt: string): string {
  try {
    const start = new Date(openedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const end = new Date(expiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${start} - ${end}`;
  } catch {
    return "";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TurmaDetalhes({ id }: { id: string }) {
  const router = useRouter();
  const searchInputId = useId();

  // Turma state
  const [turma, setTurma] = useState<SubjectClassItem | null>(null);
  const [loadingTurma, setLoadingTurma] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"students" | "sessions" | "settings">("students");

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
  const [studentFilter, setStudentFilter] = useState<"all" | "regular" | "at_risk">("all");

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

  // Loading skeleton screen
  if (loadingTurma) {
    return (
      <div className="flex min-h-full flex-col bg-paper p-8 lg:p-10 space-y-6">
        <div className="h-10 w-48 rounded-lg bg-surface animate-pulse" />
        <div className="h-28 w-full rounded-2xl border border-border bg-white p-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl border border-border bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Erro se turma não encontrada
  if (errorMessage || !turma) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-paper p-8 text-center">
        <div className="rounded-2xl border border-border bg-white p-8 max-w-md shadow-xs space-y-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-danger-surface text-danger text-title font-bold">
            !
          </span>
          <h2 className="text-heading font-bold text-ink">Turma Não Encontrada</h2>
          <p className="text-body text-muted">
            {errorMessage ?? "Não foi possível carregar os detalhes da turma solicitada."}
          </p>
          <Link
            href="/dashboard/turmas"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-ink px-5 text-label font-bold text-white hover:opacity-90 transition-opacity"
          >
            ← Voltar para Turmas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Top Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-border bg-white px-8 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <nav className="flex items-center gap-2 text-caption text-muted mb-1 font-medium">
            <Link href="/dashboard/turmas" className="hover:text-ink transition-colors flex items-center gap-1">
              <ChevronLeftIcon size={14} />
              <span>Turmas</span>
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">{turma.name}</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-title font-bold text-ink leading-title tracking-tight">
              {turma.name}
            </h1>
            {turma.has_active_session ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-surface border border-accent/40 px-2.5 py-0.5 text-caption font-bold text-ink animate-pulse">
                AO VIVO
              </span>
            ) : turma.active ? (
              <span className="inline-flex items-center rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-semibold text-success">
                Ativa
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-caption font-medium text-muted">
                Inativa
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-body text-muted">
            <span className="font-medium text-ink">{turma.discipline_name}</span>
            <span>·</span>
            <span>Docente: {turma.professor_name ?? "Professor Responsável"}</span>
            {turma.room_name && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-ink">
                  <MapPinIcon size={13} />
                  {turma.room_name}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/turmas")}
            className="flex h-10 items-center rounded-lg border border-border bg-white px-4 text-label font-medium text-ink transition-colors hover:bg-surface cursor-pointer"
          >
            ← Voltar para Turmas
          </button>

          <Link
            href={`/dashboard/chamadas/nova?turma=${turma.id}`}
            className="flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            <PlusIcon size={14} />
            <span>Abrir chamada nesta turma</span>
          </Link>
        </div>
      </div>

      {/* ─── Live Session Banner (Se houver chamada ao vivo) ─────────────────── */}
      {activeSession && (
        <LiveCallBanner key={activeSession.session_id} session={activeSession} />
      )}

      {/* ─── 4 Summary KPI Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
        {/* KPI 1 */}
        <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
          <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Frequência acumulada
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-mono text-[36px] font-bold tracking-tight leading-none ${attendanceColor(attendancePct)}`}>
              {attendancePct}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden mt-1 max-w-[140px]">
            <div
              className={`h-full rounded-full ${attendanceBarColor(attendancePct)}`}
              style={{ width: `${attendancePct}%` }}
            />
          </div>
          <span className="font-sans text-caption text-muted mt-1">
            média de {sessions.length} {sessions.length === 1 ? "chamada" : "chamadas"}
          </span>
        </div>

        {/* KPI 2 */}
        <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
          <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Alunos matriculados
          </span>
          <div className="font-mono text-[36px] font-bold tracking-tight text-ink leading-none mt-1">
            {students.length}
          </div>
          <span className="font-sans text-caption text-muted mt-2">
            {regularCount} regulares · {atRiskCount} em atenção
          </span>
        </div>

        {/* KPI 3 */}
        <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
          <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Em risco de reprovação
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-mono text-[36px] font-bold tracking-tight leading-none ${atRiskCount > 0 ? "text-danger" : "text-ink"}`}>
              {String(atRiskCount).padStart(2, "0")}
            </span>
            <span className="text-caption font-medium text-muted">abaixo de 75%</span>
          </div>
          <span className="font-sans text-caption text-muted mt-2">
            demanda intervenção pedagógica
          </span>
        </div>

        {/* KPI 4 */}
        <div className="flex flex-col gap-1 py-4 pl-5">
          <span className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Espaço & Validação
          </span>
          <div className="text-heading font-bold text-ink leading-tight truncate mt-1">
            {room?.name ?? turma.room_name ?? "Sem sala"}
          </div>
          <span className="font-sans text-caption text-muted mt-1 flex items-center gap-1">
            <GpsTargetIcon size={12} />
            <span>Raio de {room?.tolerance_radius_meters ?? 50}m · Geofence ativo</span>
          </span>
        </div>
      </div>

      {/* ─── Tabs Navigation ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 border-b border-border bg-white px-8 lg:px-10">
        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={`py-3.5 text-label font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "students"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <UsersIcon size={15} />
          <span>Alunos & Frequência</span>
          <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-caption font-mono text-ink">
            {students.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`py-3.5 text-label font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "sessions"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <ClockIcon size={14} />
          <span>Histórico de Chamadas</span>
          <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-caption font-mono text-ink">
            {sessions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`py-3.5 text-label font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === "settings"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <MapPinIcon size={14} />
          <span>Espaço Físico & Geofence</span>
        </button>
      </div>

      {/* ─── Main Tab Content ──────────────────────────────────────────────── */}
      <div className="flex-1 px-8 py-6 lg:px-10">
        {/* ABA 1: ALUNOS & FREQUÊNCIA */}
        {activeTab === "students" && (
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[240px] flex-1 max-w-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon size={13} />
                  </div>
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Buscar aluno por nome ou e-mail..."
                    className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center rounded-lg border border-border bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setStudentFilter("all")}
                    className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                      studentFilter === "all" ? "bg-ink text-white" : "text-muted hover:text-ink"
                    }`}
                  >
                    Todos ({students.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentFilter("regular")}
                    className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                      studentFilter === "regular" ? "bg-ink text-white" : "text-muted hover:text-ink"
                    }`}
                  >
                    Regulares ({regularCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentFilter("at_risk")}
                    className={`rounded-md px-3 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                      studentFilter === "at_risk" ? "bg-danger text-white" : "text-muted hover:text-danger"
                    }`}
                  >
                    Em risco ({atRiskCount})
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  setEnrollErrorMessage(null);
                  setEnrollSuccessMessage(null);
                  setCatalogSearch("");
                  setShowAddStudentModal(true);
                }}
                className="flex h-10 items-center gap-1.5 rounded-lg bg-ink px-4 text-label font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <PlusIcon size={14} />
                <span>Matricular aluno</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
              <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-5 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
                <div className="col-span-12 md:col-span-4">ALUNO</div>
                <div className="col-span-4 md:col-span-2">PRESENÇAS / FALTAS</div>
                <div className="hidden md:col-span-2 md:block">DISTÂNCIA MÉDIA</div>
                <div className="col-span-4 md:col-span-2">FREQUÊNCIA</div>
                <div className="col-span-4 md:col-span-2 text-right">STATUS & AÇÕES</div>
              </div>

              {loadingStudents ? (
                <div className="py-12 text-center text-body text-muted animate-pulse">
                  Carregando relatório de alunos da turma...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-body text-muted">
                  {students.length === 0
                    ? "Nenhum aluno matriculado nesta turma ainda. Clique em 'Matricular aluno' para começar."
                    : "Nenhum aluno encontrado para os filtros selecionados."}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredStudents.map((stu) => {
                    const pct = Math.round(stu.frequency_rate * 100);
                    return (
                      <div
                        key={stu.tenant_member_id}
                        className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-surface/50 transition-colors"
                      >
                        {/* Student details */}
                        <div className="col-span-12 md:col-span-4 flex items-center gap-3 pr-2">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white font-mono text-caption font-bold">
                            {(stu.student_name || "A").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-ink text-body truncate">
                              {stu.student_name}
                            </span>
                            <span className="text-caption text-muted truncate">
                              {stu.email || `ID: ${stu.tenant_member_id.slice(0, 8)}`}
                            </span>
                          </div>
                        </div>

                        {/* Presenças e Faltas */}
                        <div className="col-span-4 md:col-span-2">
                          <span className="text-body font-mono font-medium text-ink">
                            {stu.total_present} {stu.total_present === 1 ? "presente" : "presentes"}
                          </span>
                          <span className="block text-[11px] text-muted">
                            {stu.total_absent} {stu.total_absent === 1 ? "falta" : "faltas"}
                          </span>
                        </div>

                        {/* Distância Média */}
                        <div className="hidden md:col-span-2 md:flex items-center gap-1.5 text-body text-ink">
                          <GpsTargetIcon size={13} />
                          <span className="font-mono text-label">{stu.avg_distance_meters.toFixed(1)}m</span>
                          <span className="text-[11px] text-muted">da sala</span>
                        </div>

                        {/* Frequência % */}
                        <div className="col-span-4 md:col-span-2 pr-4">
                          <div className="flex items-center justify-between text-label font-mono font-bold mb-1">
                            <span className={attendanceColor(pct)}>{pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                            <div
                              className={`h-full rounded-full ${attendanceBarColor(pct)}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Status & Ações */}
                        <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                          {stu.at_risk ? (
                            <span className="inline-flex rounded-full bg-danger-surface px-2.5 py-0.5 text-caption font-bold text-danger">
                              Em Risco
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-semibold text-success">
                              Regular
                            </span>
                          )}

                          {canDeleteEnrollment && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStudent(stu.tenant_member_id)}
                              className="text-muted hover:text-danger text-caption font-medium transition-colors cursor-pointer"
                              title="Remover matrícula da turma (Admin/Coord)"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 2: HISTÓRICO DE CHAMADAS */}
        {activeTab === "sessions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-heading font-bold text-ink">
                  Atestados & Histórico de Sessões
                </h3>
                <p className="text-caption text-muted">
                  Registros cronológicos de chamadas de presença geovalidadas nesta turma.
                </p>
              </div>

              <Link
                href={`/dashboard/chamadas/nova?turma=${turma.id}`}
                className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-label font-bold text-white transition-opacity hover:opacity-90 shadow-xs"
              >
                <PlusIcon size={14} />
                <span>Nova chamada</span>
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
              <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-5 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
                <div className="col-span-12 md:col-span-4">DATA / SESSÃO</div>
                <div className="col-span-4 md:col-span-2">CÓDIGO DO DIA</div>
                <div className="hidden md:col-span-2 md:block">DURAÇÃO</div>
                <div className="col-span-4 md:col-span-2">PRESENÇA</div>
                <div className="col-span-4 md:col-span-2 text-right">STATUS & ATA</div>
              </div>

              {loadingSessions ? (
                <div className="py-12 text-center text-body text-muted animate-pulse">
                  Carregando histórico de sessões...
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-12 text-center text-body text-muted">
                  Nenhuma chamada realizada nesta turma ainda.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {sessions.map((ses) => {
                    const sessionRate =
                      ses.total_students > 0
                        ? Math.round((ses.confirmed_count / ses.total_students) * 100)
                        : 0;

                    return (
                      <div
                        key={ses.id}
                        className="grid grid-cols-12 items-center px-5 py-4 hover:bg-surface/50 transition-colors"
                      >
                        <div className="col-span-12 md:col-span-4 pr-3">
                          <span className="font-semibold text-ink text-body block">
                            {formatSessionDate(ses.opened_at)}
                          </span>
                          <span className="text-caption text-muted">
                            {formatSessionTimeRange(ses.opened_at, ses.expires_at)} · {ses.room?.name ?? turma.room_name ?? "Sala física"}
                          </span>
                        </div>

                        <div className="col-span-4 md:col-span-2">
                          <span className="rounded bg-surface border border-border px-2 py-0.5 font-mono text-label font-bold text-ink">
                            {ses.day_code}
                          </span>
                        </div>

                        <div className="hidden md:col-span-2 md:block text-body text-ink">
                          {ses.duration_minutes} min
                        </div>

                        <div className="col-span-4 md:col-span-2">
                          <span className="font-mono text-body font-semibold text-ink">
                            {ses.confirmed_count}/{ses.total_students}
                          </span>
                          <span className="text-caption text-muted block">
                            {sessionRate}% de presença
                          </span>
                        </div>

                        <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                          {ses.status === "OPEN" && (
                            <span className="rounded-full bg-accent-surface border border-accent/30 px-2.5 py-0.5 text-caption font-bold text-ink animate-pulse">
                              Ao Vivo
                            </span>
                          )}
                          {ses.status === "CLOSED" && (
                            <span className="rounded-full bg-surface px-2.5 py-0.5 text-caption font-semibold text-muted">
                              Encerrada
                            </span>
                          )}
                          {ses.status === "EXPIRED" && (
                            <span className="rounded-full bg-warn/10 px-2.5 py-0.5 text-caption font-semibold text-warn">
                              Expirada
                            </span>
                          )}
                          {ses.status === "CANCELLED" && (
                            <span className="rounded-full bg-danger-surface px-2.5 py-0.5 text-caption font-semibold text-danger">
                              Cancelada
                            </span>
                          )}

                          <Link
                            href={`/dashboard/chamadas/${turma.id}/${ses.id}`}
                            className="rounded-lg border border-border bg-white px-2.5 py-1 text-caption font-bold text-ink hover:bg-surface transition-colors"
                          >
                            Ver ata
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 3: ESPAÇO FÍSICO & GEOFENCING */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-xs space-y-6">
              <div className="border-b border-border pb-4">
                <span className="text-caption font-bold uppercase tracking-caps text-muted block">
                  Infraestrutura de Presença
                </span>
                <h3 className="text-heading font-bold text-ink">
                  Espaço Físico Vinculado
                </h3>
                <p className="text-caption text-muted mt-0.5">
                  Localização WGS84 para a cerca geográfica (geofencing) obrigatória.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-accent/40 bg-accent-surface/20 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-accent">
                      <MapPinIcon size={18} />
                    </span>
                    <div>
                      <span className="text-heading font-bold text-ink block">
                        {room?.name ?? turma.room_name ?? "Sala não definida"}
                      </span>
                      <span className="text-caption text-muted">
                        Raio de tolerância: {room?.tolerance_radius_meters ?? 50} metros ao redor do ponto central
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-2 text-label text-ink">
                  <div className="flex justify-between border-b border-border/70 pb-2">
                    <span className="text-muted">Latitude:</span>
                    <span className="font-mono font-semibold">
                      {room ? `${room.latitude.toFixed(4)}°` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/70 pb-2">
                    <span className="text-muted">Longitude:</span>
                    <span className="font-mono font-semibold">
                      {room ? `${room.longitude.toFixed(4)}°` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/70 pb-2">
                    <span className="text-muted">Rigor Geográfico:</span>
                    <span className="font-semibold text-success">Validação Estrita</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-muted">Status do Geofence:</span>
                    <span className="font-bold text-ink">Ativo para todas as chamadas</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <Link
                    href="/dashboard/salas"
                    className="flex-1 rounded-lg border border-border bg-white py-2.5 text-center text-label font-bold text-ink hover:bg-surface transition-colors"
                  >
                    Gerenciar salas físicas
                  </Link>
                  <Link
                    href={`/dashboard/chamadas/nova?turma=${turma.id}`}
                    className="flex-1 rounded-lg bg-ink py-2.5 text-center text-label font-bold text-white hover:opacity-90 transition-opacity"
                  >
                    Testar chamada agora
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-xs space-y-6">
              <div className="border-b border-border pb-4">
                <span className="text-caption font-bold uppercase tracking-caps text-muted block">
                  Regras Pedagógicas
                </span>
                <h3 className="text-heading font-bold text-ink">
                  Critérios de Frequência
                </h3>
                <p className="text-caption text-muted mt-0.5">
                  Parâmetros de cálculo da frequência institucional desta turma.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border p-4 bg-white">
                  <span className="text-caption font-bold uppercase tracking-caps text-muted block mb-1">
                    Frequência Mínima Exigida
                  </span>
                  <span className="font-mono text-[32px] font-bold text-ink block">
                    75%
                  </span>
                  <p className="text-caption text-muted mt-1">
                    Alunos com percentual inferior a 75% entram automaticamente na lista de atenção pedagógica.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4 bg-white">
                  <span className="text-caption font-bold uppercase tracking-caps text-muted block mb-1">
                    Antifraude & Proximidade
                  </span>
                  <p className="text-caption text-ink leading-relaxed">
                    Sessões que detectam coordenadas no limite do raio (± 5 metros da borda) são sinalizadas com indicador de proximidade para auditoria do professor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Modal para Matricular Aluno (Catálogo da Instituição) ─────────────── */}
      {showAddStudentModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div>
                  <h3 className="text-title font-bold text-ink tracking-tight">
                    Matricular Aluno na Turma
                  </h3>
                  <p className="text-caption text-muted mt-0.5">
                    Busque alunos cadastrados na instituição para vincular a esta turma.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="rounded-lg p-1 text-muted hover:text-ink cursor-pointer"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Feedbacks de Sucesso ou Erro */}
              {enrollSuccessMessage && (
                <div className="mb-4 rounded-lg border border-success/30 bg-success-surface p-3 text-caption font-semibold text-success">
                  {enrollSuccessMessage}
                </div>
              )}
              {enrollErrorMessage && (
                <div className="mb-4 rounded-lg border border-danger/30 bg-danger-surface p-3 text-caption font-semibold text-danger">
                  {enrollErrorMessage}
                </div>
              )}

              {/* Campo de Busca no Catálogo */}
              <div className="mb-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {loadingCatalog ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    ) : (
                      <SearchIcon size={14} />
                    )}
                  </div>
                  <input
                    id={searchInputId}
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Buscar aluno por nome ou e-mail..."
                    className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-8 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
                    autoFocus
                  />
                  {catalogSearch && (
                    <button
                      type="button"
                      onClick={() => setCatalogSearch("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted hover:text-ink cursor-pointer"
                      title="Limpar pesquisa"
                    >
                      <CloseIcon size={12} />
                    </button>
                  )}
                </div>
                {!catalogSearch.trim() && (
                  <p className="text-[11px] text-muted mt-1.5">
                    Exibindo os primeiros 20 alunos. Digite para pesquisar outros alunos da instituição.
                  </p>
                )}
              </div>

              {/* Lista de Alunos Encontrados */}
              <div className="max-h-60 overflow-y-auto space-y-1.5 rounded-xl border border-border p-2 bg-[#FAFAFA]">
                {loadingCatalog ? (
                  <div className="py-8 text-center text-caption text-muted animate-pulse">
                    Buscando alunos da instituição...
                  </div>
                ) : catalogStudents.length === 0 ? (
                  <div className="py-8 text-center text-caption text-muted">
                    {catalogSearch.trim()
                      ? `Nenhum aluno encontrado para "${catalogSearch}".`
                      : "Nenhum aluno cadastrado na instituição."}
                  </div>
                ) : (
                  catalogStudents.map((stu) => {
                    const isEnrolled = enrolledMemberIds.has(stu.id);
                    const isEnrolling = enrollingStudentId === stu.id;

                    return (
                      <div
                        key={stu.id}
                        className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-border/60 hover:border-border transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-caption font-bold text-ink">
                            {(stu.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-label font-bold text-ink truncate">{stu.name}</span>
                            <span className="text-[11px] text-muted truncate">{stu.email}</span>
                          </div>
                        </div>

                        {isEnrolled ? (
                          <span className="shrink-0 rounded-full bg-surface border border-border px-2.5 py-1 text-[11px] font-semibold text-muted">
                            Já matriculado
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={isEnrolling}
                            onClick={() => handleEnrollStudent(stu)}
                            className="flex h-8 shrink-0 items-center gap-1 rounded-md bg-ink px-3 text-caption font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                          >
                            {isEnrolling ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <PlusIcon size={12} />
                            )}
                            <span>{isEnrolling ? "Matriculando..." : "Matricular"}</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Rodapé do Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="rounded-lg bg-ink px-5 py-2 text-label font-bold text-white hover:opacity-90 cursor-pointer transition-opacity"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
