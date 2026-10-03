"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  listActiveAttendanceSessions,
  listTenantAttendanceSessions,
  getAttendanceMetrics,
  type ActiveAttendanceSessionResponse,
  type AttendanceMetricsResponse,
  type AttendanceSessionResponse,
} from "@/services/attendance";
import { listSubjectClasses, type SubjectClassItem } from "@/services/subject-classes";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceRecord = {
  id: string;
  discipline: string;
  classCode: string;
  room: string;
  timeBadge: string;
  dateLabel: string;
  timeRange: string;
  duration: string;
  present: number;
  total: number;
  rate: number;
  status: "ENCERRADA" | "EXPIRADA" | "CANCELADA" | "ABERTA" | "EM ANDAMENTO";
  dayCode?: string;
  notes?: string;
  subjectClassId?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFormattedDateSubtitle(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return now.toLocaleDateString("pt-BR", options).toUpperCase();
}

function formatShortDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return "Hoje";
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    }
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return "Hoje";
  }
}

function formatHourBadge(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return `${d.getHours()}h`;
  } catch {
    return "19h";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChamadasRealizadas() {
  const [activeTab, setActiveTab] = useState<"realizadas" | "em_andamento">("realizadas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedSort, setSelectedSort] = useState<"recent" | "oldest" | "presence">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Selected call for details modal
  const [selectedCall, setSelectedCall] = useState<AttendanceRecord | null>(null);

  // Live active call session
  const [activeSession, setActiveSession] = useState<ActiveAttendanceSessionResponse | null>(null);
  const [loadingActive, setLoadingActive] = useState(true);
  const [remainingTime, setRemainingTime] = useState("08:12");

  // Real metrics from API
  const [metrics, setMetrics] = useState<AttendanceMetricsResponse | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Real subject classes for filter
  const [subjectClasses, setSubjectClasses] = useState<SubjectClassItem[]>([]);

  // Real sessions from API
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Debounced search for API query
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch subject classes from API
  useEffect(() => {
    let cancelled = false;
    async function loadClasses() {
      try {
        const res = await listSubjectClasses({ page_size: 50, active: true });
        if (!cancelled && res?.items) {
          setSubjectClasses(res.items);
        }
      } catch {
        // Fallback
      }
    }
    loadClasses();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch active session from API
  const loadActive = async () => {
    try {
      setLoadingActive(true);
      const sessions = await listActiveAttendanceSessions();
      if (sessions && sessions.length > 0) {
        setActiveSession(sessions[0]);
      } else {
        setActiveSession(null);
      }
    } catch {
      setActiveSession(null);
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    loadActive();
  }, []);

  // Fetch metrics from API (last 30 days or selected period)
  useEffect(() => {
    let cancelled = false;

    async function loadMetrics() {
      try {
        setLoadingMetrics(true);
        const days = selectedPeriod === "semester" ? 180 : selectedPeriod === "all" ? 365 : 30;
        const data = await getAttendanceMetrics(days);
        if (!cancelled && data) {
          setMetrics(data);
        }
      } catch {
        // Fallback
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

  // Fetch sessions from tenant API
  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      try {
        setLoadingSessions(true);
        const params: any = {
          page: currentPage,
          page_size: pageSize,
        };

        if (activeTab === "em_andamento") {
          params.status = "open";
        } else {
          // Tab "realizadas"
          if (selectedStatus !== "all") {
            params.status = selectedStatus.toLowerCase();
          } else {
            params.exclude_status = "open";
          }
          if (selectedPeriod === "30days") {
            const d = new Date();
            d.setDate(d.getDate() - 30);
            params.opened_after = d.toISOString();
          } else if (selectedPeriod === "semester") {
            const d = new Date();
            d.setDate(d.getDate() - 180);
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
          let mapped: AttendanceRecord[] = res.items.map((s) => {
            const openDate = new Date(s.opened_at);
            const closeDate = s.closed_at ? new Date(s.closed_at) : null;
            const openStr = openDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            const closeStr = closeDate
              ? closeDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
              : s.status === "open"
              ? "Aberta agora"
              : `${s.duration_minutes} min`;

            const statusUpper = s.status === "open" ? "ABERTA" : s.status.toUpperCase();

            return {
              id: s.id,
              subjectClassId: s.subject_class_id,
              discipline: s.subject_class?.discipline_name || s.subject_class?.name || "Disciplina",
              classCode: s.subject_class?.name || "T01",
              room: s.room?.name || "Sem sala",
              timeBadge: `${openDate.getHours()}h`,
              dateLabel: formatShortDate(s.opened_at),
              timeRange: s.status === "open" ? `${openStr} · Aberta` : `${openStr} - ${closeStr}`,
              duration: `${s.duration_minutes} min`,
              present: s.confirmed_count,
              total: s.total_students,
              rate: s.total_students > 0 ? Math.round((s.confirmed_count / s.total_students) * 100) : 0,
              status: statusUpper as any,
              dayCode: s.day_code,
              notes: s.status === "open" ? "Chamada em andamento no momento." : "Sessão registrada no sistema Locus.",
            };
          });

          if (activeTab === "em_andamento" && mapped.length === 0 && activeSession) {
            mapped = [
              {
                id: activeSession.session_id,
                subjectClassId: activeSession.subject_class_id,
                discipline: activeSession.discipline_name,
                classCode: activeSession.subject_class_name,
                room: activeSession.room_name ?? "Sem sala",
                timeBadge: `${new Date(activeSession.opened_at).getHours()}h`,
                dateLabel: "Hoje",
                timeRange: `${new Date(activeSession.opened_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · Aberta`,
                duration: `${activeSession.duration_minutes} min`,
                present: activeSession.present_count,
                total: activeSession.total_students,
                rate:
                  activeSession.total_students > 0
                    ? Math.round((activeSession.present_count / activeSession.total_students) * 100)
                    : 0,
                status: "ABERTA" as const,
                dayCode: activeSession.day_code,
                notes: "Chamada em andamento no momento.",
              },
            ];
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
  }, [currentPage, pageSize, selectedStatus, debouncedSearch, selectedPeriod, activeTab, selectedClass, activeSession]);

  // Countdown timer for active banner
  useEffect(() => {
    if (!activeSession?.expires_at) {
      setRemainingTime("00:00");
      return;
    }

    function updateCountdown() {
      if (!activeSession?.expires_at) return;
      const diffMs = new Date(activeSession.expires_at).getTime() - Date.now();
      if (diffMs <= 0) {
        setRemainingTime("00:00");
        loadActive();
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        setRemainingTime(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
      }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeSession]);

  // Sorted records
  const sortedRecords = useMemo(() => {
    let list = records.slice();
    if (selectedSort === "oldest") {
      list.reverse();
    } else if (selectedSort === "presence") {
      list.sort((a, b) => b.rate - a.rate);
    }
    return list;
  }, [records, selectedSort]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentClampedPage = Math.min(currentPage, totalPages);

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border bg-white px-10 py-5">
        <div>
          <div className="mb-1 font-sans text-caption uppercase tracking-caps text-muted">
            {getFormattedDateSubtitle()}
          </div>
          <h1 className="font-sans text-title font-bold text-ink leading-title">
            Chamadas
          </h1>
        </div>

        <Link
          href="/dashboard/chamadas/nova"
          className="flex items-center gap-2 rounded-lg bg-ink px-[18px] py-[10px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M7 1v12M1 7h12"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span>Abrir chamada</span>
        </Link>
      </div>

      {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center border-b border-border bg-white px-10">
        <button
          type="button"
          onClick={() => {
            setActiveTab("realizadas");
            setCurrentPage(1);
          }}
          className={`mr-5 cursor-pointer px-1 py-[14px] text-[14px] transition-colors ${
            activeTab === "realizadas"
              ? "border-b-2 border-ink font-semibold text-ink"
              : "border-b-2 border-transparent font-normal text-muted hover:text-ink"
          }`}
        >
          Realizadas
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("em_andamento");
            setCurrentPage(1);
          }}
          className={`mr-5 flex cursor-pointer items-center gap-2 px-1 py-[14px] text-[14px] transition-colors ${
            activeTab === "em_andamento"
              ? "border-b-2 border-ink font-semibold text-ink"
              : "border-b-2 border-transparent font-normal text-muted hover:text-ink"
          }`}
        >
          <span>Em andamento</span>
          {activeSession && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8A6D00]" />
            </span>
          )}
        </button>
      </div>

      {/* ─── Call Banner (Active vs Inactive vs Skeleton) ───────────────── */}
      {loadingActive && !activeSession ? (
        <div className="flex w-full items-center justify-between border-b border-border bg-surface/60 px-10 py-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-28 rounded bg-border" />
              <div className="h-4 w-64 rounded bg-border" />
            </div>
          </div>
          <div className="h-9 w-32 rounded bg-border" />
        </div>
      ) : activeSession ? (
        <div className="flex w-full items-center justify-between bg-accent px-10 py-4 transition-colors">
          <div className="flex items-center gap-4">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink" />
            </span>
            <div className="flex flex-col gap-[2px]">
              <span className="font-sans text-caption font-bold uppercase tracking-caps text-ink">
                Chamada aberta agora
              </span>
              <span className="font-sans text-[16px] font-bold text-ink leading-body">
                {activeSession.discipline_name} · {activeSession.subject_class_name} ·{" "}
                {activeSession.room_name ?? "Sem sala"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-7">
            <div className="flex flex-col">
              <span className="font-mono text-[22px] font-semibold tracking-code text-ink leading-[28px]">
                {activeSession.day_code}
              </span>
              <span className="font-sans text-caption font-medium text-ink">
                Código do dia
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[22px] font-semibold tracking-code text-ink leading-[28px]">
                {activeSession.present_count}/{activeSession.total_students}
              </span>
              <span className="font-sans text-caption font-medium text-ink">
                Presentes
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[22px] font-semibold tracking-code text-ink leading-[28px]">
                {remainingTime}
              </span>
              <span className="font-sans text-caption font-medium text-ink">
                Restantes
              </span>
            </div>

            <Link
              href={`/dashboard/chamadas/${activeSession.subject_class_id}/${activeSession.session_id}`}
              className="flex h-[36px] items-center rounded-lg bg-ink px-[14px] font-sans text-label font-bold text-paper transition-opacity hover:opacity-85"
            >
              Acompanhar
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between border-b border-border bg-surface px-10 py-4 transition-colors">
          <div className="flex items-center gap-4">
            {/* static indicator dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-muted/40" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-caption font-bold uppercase tracking-caps text-muted">
                Chamada em tempo real
              </span>
              <span className="font-sans text-[16px] font-semibold text-ink leading-body">
                Nenhuma chamada em andamento no momento
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden font-sans text-label text-muted md:inline">
              Inicie uma chamada em qualquer turma para acompanhar presenças ao vivo
            </span>
            <Link
              href="/dashboard/chamadas/nova"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-paper px-[14px] font-sans text-label font-semibold text-ink transition-colors hover:border-control-border hover:bg-surface"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              Iniciar chamada
            </Link>
          </div>
        </div>
      )}

      {/* ─── 4 Summary KPI Indicator Columns ───────────────────────────────── */}
      <div className="flex w-full border-b border-border bg-white px-10 pt-5 pb-4">
        {/* Col 1 */}
        <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border py-2 pr-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Total de chamadas
          </div>
          {loadingMetrics ? (
            <div className="my-1 h-[36px] w-20 rounded bg-surface animate-pulse" />
          ) : (
            <div className="font-mono text-[40px] font-medium tracking-tight text-ink leading-[44px]">
              {metrics ? metrics.total_sessions : 0}
            </div>
          )}
          <div className="font-sans text-label text-muted">
            {selectedPeriod === "30days"
              ? "últimos 30 dias"
              : selectedPeriod === "semester"
              ? "neste semestre"
              : "todos os períodos"}
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border px-5 py-2">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Frequência média
          </div>
          {loadingMetrics ? (
            <div className="my-1 h-[36px] w-24 rounded bg-surface animate-pulse" />
          ) : (
            <div className="font-mono text-[40px] font-medium tracking-tight text-success leading-[44px]">
              {metrics ? `${Math.round(metrics.average_attendance_rate * 100)}%` : "0%"}
            </div>
          )}
          <div className="font-sans text-label text-muted">
            {selectedPeriod === "30days"
              ? "últimos 30 dias"
              : selectedPeriod === "semester"
              ? "neste semestre"
              : "todos os períodos"}
          </div>
        </div>

        {/* Col 3 */}
        <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border px-5 py-2">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Canceladas
          </div>
          {loadingMetrics ? (
            <div className="my-1 h-[36px] w-16 rounded bg-surface animate-pulse" />
          ) : (
            <div className="font-mono text-[40px] font-medium tracking-tight text-danger leading-[44px]">
              {metrics ? String(metrics.cancelled_sessions).padStart(2, "0") : "00"}
            </div>
          )}
          <div className="font-sans text-label text-muted">
            {selectedPeriod === "30days"
              ? "últimos 30 dias"
              : selectedPeriod === "semester"
              ? "neste semestre"
              : "todos os períodos"}
          </div>
        </div>

        {/* Col 4 */}
        <div className="flex grow basis-0 flex-col gap-[6px] py-2 pl-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Última chamada
          </div>
          {loadingMetrics ? (
            <>
              <div className="my-1 h-[36px] w-28 rounded bg-surface animate-pulse" />
              <div className="h-4 w-40 rounded bg-surface animate-pulse" />
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[40px] font-medium tracking-tight text-ink leading-[44px]">
                  {metrics?.last_session
                    ? formatShortDate(metrics.last_session.opened_at)
                    : "--"}
                </span>
                {metrics?.last_session && (
                  <span className="rounded bg-accent-surface px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#8A6D00] leading-[14px]">
                    {formatHourBadge(metrics.last_session.opened_at)}
                  </span>
                )}
              </div>
              <div className="font-sans text-label text-muted truncate">
                {metrics?.last_session
                  ? `${metrics.last_session.discipline_name} · ${
                      metrics.last_session.room_name || metrics.last_session.subject_class_name
                    }`
                  : "Nenhuma chamada registrada"}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Filters Bar ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 bg-paper px-10 pt-5 pb-4">
        {/* Search */}
        <div className="flex max-w-[300px] grow basis-0 items-center gap-2 rounded-lg border border-border bg-white px-[14px] py-[9px]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <circle cx="6.5" cy="6.5" r="4" stroke="#5C5E63" strokeWidth="1.4" />
            <path
              d="M10 10l3 3"
              stroke="#5C5E63"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar turma ou disciplina..."
            className="w-full bg-transparent font-sans text-[14px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        {/* Filter: Turma */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
          >
            <option value="all">Turma: Todas</option>
            {subjectClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.discipline_name} · {cls.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5l3 3 3-3"
                stroke="#5C5E63"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Filter: Status */}
        {activeTab === "realizadas" && (
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
            >
              <option value="all">Status: Todos</option>
              <option value="ENCERRADA">Encerrada</option>
              <option value="EXPIRADA">Expirada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5l3 3 3-3"
                  stroke="#5C5E63"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Filter: Periodo */}
        {activeTab === "realizadas" && (
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
            >
              <option value="30days">Período: Últimos 30 dias</option>
              <option value="semester">Este semestre</option>
              <option value="all">Todos os períodos</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5l3 3 3-3"
                  stroke="#5C5E63"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="grow basis-0" />

        {/* Sorter */}
        <div className="relative flex items-center gap-1.5 rounded-lg border border-border bg-white px-[14px] py-[9px]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M2 4h10M4 7h6M6 10h2"
              stroke="#5C5E63"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="cursor-pointer appearance-none bg-transparent pr-5 font-sans text-[14px] text-ink focus:outline-none"
          >
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="presence">Maior presença</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5l3 3 3-3"
                stroke="#5C5E63"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Table Container ───────────────────────────────────────────────── */}
      <div className="grow px-10 pb-10">
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
          {/* Table Header */}
          <div className="flex items-center border-b border-border bg-[#FAFAFA] px-5">
            <div className="grow-2 basis-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              TURMA / DISCIPLINA
            </div>
            <div className="grow basis-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              DATA
            </div>
            <div className="w-[100px] shrink-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              DURAÇÃO
            </div>
            <div className="w-[100px] shrink-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              PRESENÇA
            </div>
            <div className="w-[120px] shrink-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              STATUS
            </div>
            <div className="w-[120px] shrink-0 py-3" />
          </div>

          {/* Table Rows or Skeletons or Empty */}
          {loadingSessions ? (
            <div className="divide-y divide-border">
              {Array.from({ length: pageSize }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-5 py-4 animate-pulse"
                >
                  {/* Turma / Disciplina */}
                  <div className="grow-2 basis-0 pr-4">
                    <div className="h-4 w-44 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-28 rounded bg-surface" />
                  </div>

                  {/* Data */}
                  <div className="grow basis-0 pr-4">
                    <div className="h-4 w-20 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-24 rounded bg-surface" />
                  </div>

                  {/* Duracao */}
                  <div className="w-[100px] shrink-0">
                    <div className="h-4 w-14 rounded bg-surface" />
                  </div>

                  {/* Presenca */}
                  <div className="w-[100px] shrink-0">
                    <div className="h-4 w-12 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-8 rounded bg-surface" />
                  </div>

                  {/* Status */}
                  <div className="w-[120px] shrink-0">
                    <div className="h-6 w-24 rounded-full bg-surface" />
                  </div>

                  {/* Acao */}
                  <div className="w-[120px] shrink-0 flex justify-end">
                    <div className="h-8 w-24 rounded-lg bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" stroke="var(--color-muted)" strokeWidth="1.6" />
                  <path d="M10 6.5v4l2.5 1.5" stroke="var(--color-muted)" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-sans text-heading font-semibold text-ink">
                Nenhuma chamada encontrada
              </h3>
              <p className="mt-1 font-sans text-label text-muted">
                {activeTab === "em_andamento"
                  ? "Não há chamadas em andamento no momento. Inicie uma nova chamada para começar."
                  : "Nenhum registro corresponde aos filtros selecionados. Tente limpar os filtros."}
              </p>
              {activeTab === "em_andamento" && (
                <Link
                  href="/dashboard/chamadas/nova"
                  className="mt-4 rounded-lg bg-ink px-4 py-2 font-sans text-label font-semibold text-paper"
                >
                  Abrir nova chamada
                </Link>
              )}
            </div>
          ) : (
            sortedRecords.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b border-border px-5 transition-colors hover:bg-surface/50"
              >
                {/* Turma / Disciplina */}
                <div className="grow-2 basis-0 py-4">
                  <div className="font-sans text-body font-semibold text-ink leading-[18px]">
                    {item.discipline}
                  </div>
                  <div className="mt-0.5 font-sans text-label text-muted">
                    {item.classCode} {item.room} {item.timeBadge}
                  </div>
                </div>

                {/* Data */}
                <div className="grow basis-0 py-4">
                  <div className="font-sans text-[14px] text-ink leading-[18px]">
                    {item.dateLabel}
                  </div>
                  <div className="font-sans text-caption text-muted">
                    {item.timeRange}
                  </div>
                </div>

                {/* Duracao */}
                <div className="w-[100px] shrink-0 py-4 font-sans text-[14px] text-ink leading-[18px]">
                  {item.duration}
                </div>

                {/* Presenca */}
                <div className="w-[100px] shrink-0 py-4">
                  {item.status === "CANCELADA" ? (
                    <>
                      <div className="font-sans text-[14px] font-semibold text-muted leading-[18px]">
                        --
                      </div>
                      <div className="font-sans text-caption text-muted">cancelada</div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`font-sans text-[14px] font-semibold leading-[18px] ${
                          item.rate >= 75 ? "text-success" : "text-[#B45309]"
                        }`}
                      >
                        {item.present}/{item.total}
                      </div>
                      <div
                        className={`font-sans text-caption ${
                          item.rate >= 75 ? "text-muted" : "text-[#B45309]"
                        }`}
                      >
                        {item.rate}%
                      </div>
                    </>
                  )}
                </div>

                {/* Status */}
                <div className="w-[120px] shrink-0 py-4">
                  {(item.status === "ABERTA" || item.status === "EM ANDAMENTO") && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-ink">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
                      </span>
                      ABERTA
                    </span>
                  )}
                  {item.status === "ENCERRADA" && (
                    <span className="inline-flex items-center rounded-full bg-success-surface px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-success">
                      ENCERRADA
                    </span>
                  )}
                  {item.status === "EXPIRADA" && (
                    <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-muted">
                      EXPIRADA
                    </span>
                  )}
                  {item.status === "CANCELADA" && (
                    <span className="inline-flex items-center rounded-full bg-danger-surface px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-danger">
                      CANCELADA
                    </span>
                  )}
                </div>

                {/* Acao */}
                <div className="w-[120px] shrink-0 py-4 text-right">
                  {item.status === "ABERTA" || item.status === "EM ANDAMENTO" ? (
                    <Link
                      href={
                        item.subjectClassId
                          ? `/dashboard/chamadas/${item.subjectClassId}/${item.id}`
                          : `/dashboard/chamadas`
                      }
                      className="inline-flex items-center justify-center rounded-lg bg-ink px-3 py-1.5 font-sans text-label font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Acompanhar
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedCall(item)}
                      className="inline-block cursor-pointer rounded border border-border px-3 py-1.5 font-sans text-label font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      Ver detalhes
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="font-sans text-label text-muted">
              {loadingSessions ? (
                <div className="h-4 w-44 rounded bg-surface animate-pulse" />
              ) : (
                `Mostrando ${sortedRecords.length} de ${totalItems} chamadas`
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Prev */}
              <button
                type="button"
                disabled={currentClampedPage <= 1 || loadingSessions}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-border bg-surface text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-white"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 3L4.5 6l3 3"
                    stroke="#5C5E63"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dynamic Pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - currentClampedPage) <= 1) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && p - prevPage > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <span className="font-sans text-label text-muted">...</span>
                      )}
                      <button
                        type="button"
                        disabled={loadingSessions}
                        onClick={() => setCurrentPage(p)}
                        className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded font-sans text-label ${
                          currentClampedPage === p
                            ? "border border-ink bg-ink font-semibold text-white"
                            : "border border-border bg-white text-ink hover:bg-surface"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              {/* Next */}
              <button
                type="button"
                disabled={currentClampedPage >= totalPages || loadingSessions}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-border bg-white text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-surface"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 3L7.5 6l-3 3"
                    stroke="#18191B"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detail Modal ──────────────────────────────────────────────────── */}
      {selectedCall && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedCall(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="rounded bg-accent-surface px-2 py-0.5 font-mono text-[11px] font-bold text-[#8A6D00]">
                  {selectedCall.timeBadge}
                </span>
                <h3 className="mt-2 font-sans text-heading font-bold text-ink">
                  {selectedCall.discipline}
                </h3>
                <p className="font-sans text-label text-muted">
                  Turma {selectedCall.classCode} · {selectedCall.room}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="cursor-pointer rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-2 gap-4 py-5 text-left">
              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Data e Horário
                </span>
                <p className="mt-1 font-sans text-body font-semibold text-ink">
                  {selectedCall.dateLabel}
                </p>
                <p className="font-sans text-caption text-muted">
                  {selectedCall.timeRange}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Código do Dia
                </span>
                <p className="mt-1 font-mono text-[20px] font-semibold text-ink">
                  {selectedCall.dayCode ?? "----"}
                </p>
                <p className="font-sans text-caption text-muted">Validação de raio ativa</p>
              </div>

              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Presença / Quórum
                </span>
                <p className="mt-1 font-mono text-[20px] font-semibold text-success">
                  {selectedCall.present}/{selectedCall.total}
                </p>
                <p className="font-sans text-caption text-muted">
                  {selectedCall.rate}% dos matriculados
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Status da Chamada
                </span>
                <div className="mt-1">
                  {selectedCall.status === "ENCERRADA" && (
                    <span className="inline-flex rounded-full bg-success-surface px-2.5 py-0.5 font-sans text-caption font-bold uppercase tracking-caps text-success">
                      ENCERRADA
                    </span>
                  )}
                  {selectedCall.status === "EXPIRADA" && (
                    <span className="inline-flex rounded-full bg-surface px-2.5 py-0.5 font-sans text-caption font-bold uppercase tracking-caps text-muted">
                      EXPIRADA
                    </span>
                  )}
                  {selectedCall.status === "CANCELADA" && (
                    <span className="inline-flex rounded-full bg-danger-surface px-2.5 py-0.5 font-sans text-caption font-bold uppercase tracking-caps text-danger">
                      CANCELADA
                    </span>
                  )}
                </div>
                <p className="mt-1 font-sans text-caption text-muted">
                  Duração: {selectedCall.duration}
                </p>
              </div>
            </div>

            {selectedCall.notes && (
              <div className="mb-5 rounded-lg border border-border bg-[#FAFAFA] p-3 text-left">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Observações da Sessão
                </span>
                <p className="mt-1 font-sans text-label text-ink">
                  {selectedCall.notes}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 font-sans text-label font-semibold text-ink hover:bg-surface"
              >
                Fechar
              </button>
              {selectedCall.subjectClassId && (
                <Link
                  href={`/dashboard/chamadas/${selectedCall.subjectClassId}/${selectedCall.id}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 font-sans text-label font-semibold text-ink hover:bg-surface"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Acessar chamada</span>
                </Link>
              )}
              <Link
                href="/dashboard/relatorios"
                className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 font-sans text-label font-semibold text-white hover:opacity-90"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 2v10M7 5v7M11 8v4"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Ver relatório</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
