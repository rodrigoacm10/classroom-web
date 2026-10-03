"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  listSubjectClasses,
  getSubjectClassMetrics,
  listActiveAttendanceSessions,
  type SubjectClassItem,
  type SubjectClassMetrics,
  type ActiveAttendanceSessionResponse,
} from "@/lib/api";
import { attendanceColor, attendanceBarColor } from "@/lib/utils";
import {
  LiveCallBanner,
  NoActiveCallBanner,
  CallBannerSkeleton,
} from "@/components/dashboard/call-banner";

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-muted">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-muted">
      <path
        d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5A4.5 4.5 0 0 0 8 1.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function RadioLiveIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <path d="M4 4a5.66 5.66 0 0 0 0 8M12 4a5.66 5.66 0 0 1 0 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 2a8.5 8.5 0 0 0 0 12M14 2a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-muted">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 13.5c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AttendanceIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3.2l2 1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFormattedDateSubtitle(): string {
  const now = new Date();
  return now
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toUpperCase();
}

const AVATAR_PALETTE = [
  { bg: "#EBF3FE", text: "#1D64B4", border: "#D4E5FB" },
  { bg: "#FEF4E8", text: "#A45500", border: "#FCE4CA" },
  { bg: "#F3EDFB", text: "#6735A4", border: "#E5D7F8" },
  { bg: "#EBF6EE", text: "#1B733F", border: "#D2EDDA" },
  { bg: "#FDF0F0", text: "#B72314", border: "#FACCCC" },
  { bg: "#E6F7F8", text: "#006B70", border: "#C4EFF1" },
];

function getAvatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TurmasPage() {
  const router = useRouter();

  // Estados de dados da API
  const [classes, setClasses] = useState<SubjectClassItem[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tableLoading, setTableLoading] = useState(true);

  // Métricas do topo (KPIs)
  const [metrics, setMetrics] = useState<SubjectClassMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Sessão ao vivo para o banner
  const [activeSession, setActiveSession] = useState<ActiveAttendanceSessionResponse | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Filtros e controles
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "live">("all");
  const [sortOption, setSortOption] = useState<"name_asc" | "rate_desc" | "rate_asc" | "students_desc">("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Debounce na busca para evitar requisições a cada tecla digitada
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Carrega as métricas consolidadas dos KPIs e a chamada ativa do banner
  useEffect(() => {
    let isMounted = true;

    async function loadHeaderData() {
      try {
        setMetricsLoading(true);
        setSessionLoading(true);

        const [metricsResult, sessionsResult] = await Promise.allSettled([
          getSubjectClassMetrics({ days: 30 }),
          listActiveAttendanceSessions(),
        ]);

        if (!isMounted) return;

        if (metricsResult.status === "fulfilled") {
          setMetrics(metricsResult.value);
        } else {
          // Caso não haja dados na API ou ocorra erro, mantém métricas zeradas
          console.warn("Métricas de turmas indisponíveis na API:", metricsResult.reason);
        }

        if (sessionsResult.status === "fulfilled") {
          const sessions = sessionsResult.value;
          setActiveSession(sessions.length > 0 ? sessions[0] : null);
        } else {
          console.warn("Sessões ativas indisponíveis na API:", sessionsResult.reason);
        }
      } finally {
        if (isMounted) {
          setMetricsLoading(false);
          setSessionLoading(false);
        }
      }
    }

    loadHeaderData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Carrega a listagem paginada e filtrada de turmas diretamente da API
  useEffect(() => {
    let isMounted = true;

    async function fetchClasses() {
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
        } else if (sortOption === "rate_desc") {
          sortByParam = "attendance_rate";
          orderParam = "desc";
        } else if (sortOption === "rate_asc") {
          sortByParam = "attendance_rate";
          orderParam = "asc";
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

        if (!isMounted) return;

        setClasses(res.items);
        setTotalClasses(res.total);
        setTotalPages(Math.max(1, res.total_pages || Math.ceil(res.total / pageSize)));
      } catch (err) {
        if (!isMounted) return;
        // Caso a API não tenha dados cadastrados ou retorne erro, mantém estado vazio amigável
        console.warn("Erro ao buscar turmas na API:", err);
        setClasses([]);
        setTotalClasses(0);
        setTotalPages(1);
      } finally {
        if (isMounted) {
          setTableLoading(false);
        }
      }
    }

    fetchClasses();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, statusFilter, sortOption, currentPage, pageSize]);

  // Indicadores consolidados dos 4 KPIs (com fallback zerado se não houver dados)
  const kpis = useMemo(() => {
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


  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-border bg-white px-8 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <div suppressHydrationWarning className="mb-1 font-sans text-caption uppercase tracking-caps text-muted">
            {getFormattedDateSubtitle()}
          </div>
          <h1 className="font-sans text-title font-bold text-ink leading-title tracking-tight">
            Turmas
          </h1>
          <p className="mt-0.5 text-body text-muted">
            Gerencie as turmas ativas, acompanhe a taxa de presença e acesse as sessões ao vivo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/chamadas/nova"
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-label font-medium text-ink transition-colors hover:border-control-border hover:bg-surface"
          >
            <AttendanceIcon size={16} />
            <span>Abrir chamada</span>
          </Link>

          <Link
            href="/dashboard/turmas/nova"
            className="flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            <PlusIcon size={15} />
            <span>Criar turma</span>
          </Link>
        </div>
      </div>

      {/* ─── Banner de chamada em tempo real (Padrão Locus) ─────────────────── */}
      {sessionLoading ? (
        <CallBannerSkeleton />
      ) : activeSession ? (
        <LiveCallBanner key={activeSession.session_id} session={activeSession} />
      ) : (
        <NoActiveCallBanner />
      )}

      {/* ─── 4 Summary KPI Indicator Columns ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-white px-8 lg:px-10">
        {/* KPI 1 */}
        <div className="flex flex-col gap-1 border-r border-b md:border-b-0 border-border py-4 pr-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Total de turmas
          </div>
          <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
            {metricsLoading ? (
              <span className="inline-block h-8 w-12 animate-pulse rounded bg-surface" />
            ) : (
              kpis.totalClasses
            )}
          </div>
          <div className="font-sans text-caption text-muted">
            {kpis.activeClasses} turmas ativas
          </div>
        </div>

        {/* KPI 2 */}
        <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-border py-4 px-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Frequência média
          </div>
          <div className="font-mono text-[36px] font-semibold tracking-tight text-success leading-none mt-1">
            {metricsLoading ? (
              <span className="inline-block h-8 w-16 animate-pulse rounded bg-surface" />
            ) : (
              `${kpis.avgAttendance}%`
            )}
          </div>
          <div className="font-sans text-caption text-muted">
            últimos 30 dias letivos
          </div>
        </div>

        {/* KPI 3 */}
        <div className="flex flex-col gap-1 border-r border-border py-4 pr-5 md:px-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Alunos matriculados
          </div>
          <div className="font-mono text-[36px] font-semibold tracking-tight text-ink leading-none mt-1">
            {metricsLoading ? (
              <span className="inline-block h-8 w-14 animate-pulse rounded bg-surface" />
            ) : (
              kpis.totalStudents
            )}
          </div>
          <div className="font-sans text-caption text-muted">
            em todas as turmas
          </div>
        </div>

        {/* KPI 4 */}
        <div className="flex flex-col gap-1 py-4 pl-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Status pedagógico
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            {metricsLoading ? (
              <span className="inline-block h-8 w-10 animate-pulse rounded bg-surface" />
            ) : (
              <span
                className={`font-mono text-[36px] font-semibold tracking-tight leading-none ${
                  kpis.atRiskCount > 0 ? "text-danger" : "text-ink"
                }`}
              >
                {kpis.atRiskCount}
              </span>
            )}
            <span className="text-caption font-medium text-muted">
              {kpis.atRiskCount === 1 ? "turma < 75%" : "turmas < 75%"}
            </span>
          </div>
          <div className="font-sans text-caption text-muted">
            {kpis.liveCount > 0 ? `${kpis.liveCount} chamada aberta agora` : "nenhuma chamada ao vivo"}
          </div>
        </div>
      </div>

      {/* ─── Filter & Control Bar ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-8 py-3.5 lg:px-10">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[260px] flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por turma, disciplina, professor ou sala..."
              className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-8 font-sans text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-ink cursor-pointer"
                title="Limpar busca"
              >
                <CloseIcon size={12} />
              </button>
            )}
          </div>

          {/* Status selector */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none"
            >
              <option value="all">Status: Todas</option>
              <option value="active">Apenas Ativas</option>
              <option value="live">Ao Vivo Agora</option>
              <option value="inactive">Inativas</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort selector */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-white pl-3.5 pr-8 font-sans text-label font-medium text-ink focus:border-control-border focus:outline-none"
          >
            <option value="name_asc">Ordenar: Nome (A-Z)</option>
            <option value="rate_desc">Maior Frequência</option>
            <option value="rate_asc">Menor Frequência (Em risco)</option>
            <option value="students_desc">Mais Alunos</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Table Container ───────────────────────────────────────────────── */}
      <div className="flex-1 px-8 py-6 lg:px-10">
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
          {/* Table Header */}
          <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-5 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
            <div className="col-span-12 md:col-span-4">TURMA / DISCIPLINA</div>
            <div className="hidden md:col-span-2 md:block">DOCENTE</div>
            <div className="hidden md:col-span-2 md:block">SALA FÍSICA</div>
            <div className="col-span-4 md:col-span-1 text-center md:text-left">ALUNOS</div>
            <div className="col-span-4 md:col-span-2">FREQUÊNCIA</div>
            <div className="col-span-4 md:col-span-1 text-right">STATUS</div>
          </div>

          {/* Table Body */}
          {tableLoading ? (
            /* Skeleton de carregamento dos registros da tabela */
            <div className="divide-y divide-border">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="grid grid-cols-12 items-center px-5 py-4 animate-pulse">
                  <div className="col-span-12 md:col-span-4 flex items-center gap-3.5 pr-2">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-surface" />
                    <div className="flex flex-col gap-1.5 w-40">
                      <div className="h-4 w-28 rounded bg-surface" />
                      <div className="h-3 w-36 rounded bg-surface" />
                    </div>
                  </div>
                  <div className="hidden md:col-span-2 md:flex items-center gap-2 pr-2">
                    <div className="h-4 w-28 rounded bg-surface" />
                  </div>
                  <div className="hidden md:col-span-2 md:flex items-center gap-2 pr-2">
                    <div className="h-4 w-24 rounded bg-surface" />
                  </div>
                  <div className="col-span-4 md:col-span-1">
                    <div className="h-4 w-8 rounded bg-surface" />
                  </div>
                  <div className="col-span-4 md:col-span-2 pr-3">
                    <div className="h-2 w-full rounded bg-surface" />
                  </div>
                  <div className="col-span-4 md:col-span-1 flex justify-end">
                    <div className="h-5 w-14 rounded-full bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          ) : classes.length === 0 ? (
            /* Caso não haja dados retornados da API */
            searchQuery || statusFilter !== "all" ? (
              /* Caso a busca ou filtro ativo não tenha encontrado resultados */
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-3">
                  <SearchIcon size={22} />
                </div>
                <h3 className="font-sans text-heading font-semibold text-ink">
                  Nenhuma turma encontrada
                </h3>
                <p className="mt-1 text-body text-muted max-w-sm">
                  Não encontramos nenhuma turma correspondente aos filtros de busca aplicados.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                  className="mt-4 rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink hover:bg-surface transition-colors cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              /* Caso não haja turmas cadastradas na instituição na API, exibimos estado inicial */
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted mb-3">
                  <AttendanceIcon size={22} />
                </div>
                <h3 className="font-sans text-heading font-semibold text-ink">
                  Nenhuma turma cadastrada
                </h3>
                <p className="mt-1 text-body text-muted max-w-sm">
                  Sua instituição ainda não possui turmas registradas. Crie a primeira turma para começar o gerenciamento pedagógico.
                </p>
                <Link
                  href="/dashboard/turmas/nova"
                  className="mt-4 flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  <PlusIcon size={15} />
                  <span>Criar primeira turma</span>
                </Link>
              </div>
            )
          ) : (
            /* Listagem de turmas da API */
            <div className="divide-y divide-border">
              {classes.map((item) => {
                // Estilo visual com cor harmônica derivada da disciplina ou do nome da turma
                const avatar = getAvatarStyle(item.discipline_name || item.name || "");
                // Se a turma ainda não tiver sessões realizadas ou presenças registradas, a taxa padrão é 0%
                const attendancePct = Math.round((item.attendance_rate ?? 0) * 100);
                const initials = (item.name || item.discipline_name || "TU").trim().substring(0, 2).toUpperCase();

                return (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/dashboard/turmas/${item.id}`)}
                    className="group grid grid-cols-12 items-center px-5 py-4 transition-colors hover:bg-surface/60 cursor-pointer"
                  >
                    {/* Turma / Disciplina */}
                    <div className="col-span-12 md:col-span-4 flex items-center gap-3.5 pr-2">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-caption tracking-tight border"
                        style={{
                          backgroundColor: avatar.bg,
                          color: avatar.text,
                          borderColor: avatar.border,
                        }}
                      >
                        {initials}
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="font-semibold text-ink text-body group-hover:text-accent transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="text-caption text-muted truncate">
                          {item.discipline_name}
                        </span>
                      </div>
                    </div>

                    {/* Docente */}
                    <div className="hidden md:col-span-2 md:flex items-center gap-2 pr-2">
                      <UserIcon size={14} />
                      <span className="text-body text-ink truncate">
                        {item.professor_name ?? "Não atribuído"}
                      </span>
                    </div>

                    {/* Sala Física */}
                    <div className="hidden md:col-span-2 md:flex items-center gap-1.5 pr-2">
                      <MapPinIcon size={13} />
                      <span className="text-body text-ink truncate">
                        {item.room_name ? (
                          item.room_name
                        ) : (
                          <span className="text-muted italic text-caption">Sem sala vinculada</span>
                        )}
                      </span>
                    </div>

                    {/* Alunos */}
                    <div className="col-span-4 md:col-span-1 text-center md:text-left">
                      <span className="font-mono text-body font-semibold text-ink">
                        {item.student_count}
                      </span>
                      <span className="block text-[11px] text-muted">alunos</span>
                    </div>

                    {/* Frequência Média com Mini Bar */}
                    <div className="col-span-4 md:col-span-2 pr-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`font-mono text-label font-semibold ${attendanceColor(attendancePct)}`}>
                          {attendancePct}%
                        </span>
                        <span className="text-[11px] text-muted">média</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${attendanceBarColor(attendancePct)}`}
                          style={{ width: `${Math.min(100, Math.max(0, attendancePct))}%` }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-4 md:col-span-1 flex items-center justify-end">
                      {item.has_active_session ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-surface border border-accent/40 px-2.5 py-1 text-caption font-bold text-ink animate-pulse">
                          <RadioLiveIcon size={12} />
                          <span>AO VIVO</span>
                        </span>
                      ) : item.active ? (
                        <span className="inline-flex items-center rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-semibold text-success">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-caption font-medium text-muted">
                          Inativa
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table Footer / Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-[#FAFAFA] px-5 py-3 gap-3">
            <div className="text-caption text-muted">
              Mostrando{" "}
              <strong className="font-semibold text-ink">
                {totalClasses === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              a{" "}
              <strong className="font-semibold text-ink">
                {Math.min(currentPage * pageSize, totalClasses)}
              </strong>{" "}
              de <strong className="font-semibold text-ink">{totalClasses}</strong> turmas
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || tableLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-border bg-white px-3 py-1.5 text-label font-medium text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>
              <span className="px-2 font-mono text-label text-muted">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || tableLoading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-border bg-white px-3 py-1.5 text-label font-medium text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

