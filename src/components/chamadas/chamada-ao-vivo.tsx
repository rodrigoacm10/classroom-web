"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAttendanceSession,
  listSessionRoster,
  closeAttendanceSession,
  cancelAttendanceSession,
  type AttendanceSessionResponse,
  type SessionRosterItem,
} from "@/lib/api";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M10 3L5 8l5 5" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="var(--color-muted)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatTime(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDistance(meters: number | null): string {
  if (meters === null) return "—";
  return `${Math.round(meters)} m`;
}

type FilterTab = "all" | "present" | "not_confirmed" | "out_of_radius";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ item }: { item: SessionRosterItem }) {
  if (!item.record_id) {
    return (
      <span className="text-label font-semibold tracking-caps uppercase text-muted">
        NÃO CONFIRMOU
      </span>
    );
  }

  if (item.within_radius === false) {
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-label font-bold tracking-caps uppercase"
        style={{ background: "var(--color-danger-surface)", color: "var(--color-danger)" }}
      >
        FORA DO RAIO
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-label font-bold tracking-caps uppercase"
      style={{ background: "var(--color-success-surface)", color: "var(--color-success)" }}
    >
      PRESENTE
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  { bg: "#E9F4FF", fg: "#1A6DC2" },
  { bg: "#FFF0E0", fg: "#B05A00" },
  { bg: "#F0EAF8", fg: "#6B38A8" },
  { bg: "#E7F2EB", fg: "#1E7A44" },
  { bg: "#FFF4CC", fg: "#896300" },
  { bg: "#FCE8E8", fg: "#C42B1C" },
];

function Avatar({ name }: { name: string }) {
  const idx =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const { bg, fg } = AVATAR_COLORS[idx];
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-label font-bold"
      style={{ background: bg, color: fg }}
    >
      {initials(name)}
    </div>
  );
}

// ─── Student Row ──────────────────────────────────────────────────────────────

function StudentRow({ item }: { item: SessionRosterItem }) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-6 py-3 last:border-0 hover:bg-surface/60 transition-colors">
      <Avatar name={item.student_name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold text-ink text-body leading-body">
          {item.student_name}
        </span>
        <span className="truncate text-label text-muted">
          {item.enrollment_id.slice(-8).toUpperCase()}
        </span>
      </div>
      <span className="w-[100px] shrink-0 text-right text-label text-ink">
        {item.confirmed_at ? formatTime(item.confirmed_at) : "—"}
      </span>
      <span
        className="w-[88px] shrink-0 text-right text-label font-medium"
        style={{
          color:
            item.within_radius === false
              ? "var(--color-danger)"
              : item.distance_meters !== null
              ? "var(--color-ink)"
              : "var(--color-muted)",
        }}
      >
        {formatDistance(item.distance_meters)}
      </span>
      <div className="w-[148px] shrink-0 flex justify-end">
        <StatusBadge item={item} />
      </div>
    </div>
  );
}

// ─── Skeleton Loading ─────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-6 py-3 last:border-0 animate-pulse">
      <div className="h-9 w-9 rounded-full bg-border/60" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="h-4 w-40 rounded bg-border/60" />
        <div className="h-3 w-20 rounded bg-border/40" />
      </div>
      <div className="h-3 w-20 rounded bg-border/40" />
      <div className="h-3 w-14 rounded bg-border/40" />
      <div className="h-6 w-24 rounded-full bg-border/40" />
    </div>
  );
}

// ─── Countdown Timer Hook ─────────────────────────────────────────────────────

function useCountdown(expiresAt: string | null): number {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSeconds(diff);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return seconds;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ChamadaAoVivoProps {
  subjectClassId: string;
  sessionId: string;
}

export function ChamadaAoVivo({ subjectClassId, sessionId }: ChamadaAoVivoProps) {
  const router = useRouter();

  const [session, setSession] = useState<AttendanceSessionResponse | null>(null);
  const [roster, setRoster] = useState<SessionRosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [closingSession, setClosingSession] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [cancellingSession, setCancellingSession] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsLeft = useCountdown(session?.expires_at ?? null);

  const fetchData = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);

        const [sessionData, rosterData] = await Promise.all([
          getAttendanceSession(subjectClassId, sessionId),
          listSessionRoster(subjectClassId, sessionId),
        ]);

        setSession(sessionData);
        setRoster(rosterData);
        setError(null);

        if (sessionData.status !== "open") {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados da chamada.");
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [subjectClassId, sessionId]
  );

  useEffect(() => {
    fetchData(true);
    pollRef.current = setInterval(() => fetchData(false), 15_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  async function handleClose() {
    setClosingSession(true);
    try {
      await closeAttendanceSession(subjectClassId, sessionId);
      router.push("/dashboard/chamadas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao encerrar chamada.");
      setClosingSession(false);
      setShowCloseConfirm(false);
    }
  }

  async function handleCancel() {
    setCancellingSession(true);
    try {
      await cancelAttendanceSession(subjectClassId, sessionId);
      router.push("/dashboard/chamadas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cancelar chamada.");
      setCancellingSession(false);
      setShowCancelConfirm(false);
    }
  }

  // Derived stats
  const totalStudents = session?.total_students ?? 0;
  const presentCount = roster.filter((r) => r.record_id && r.within_radius !== false).length;
  const outOfRadiusCount = roster.filter((r) => r.record_id && r.within_radius === false).length;
  const notConfirmedCount = roster.filter((r) => !r.record_id).length;
  const progressPct = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const filteredRoster = roster.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "present") return item.record_id && item.within_radius !== false;
    if (activeFilter === "not_confirmed") return !item.record_id;
    if (activeFilter === "out_of_radius") return item.record_id && item.within_radius === false;
    return true;
  });

  // Session metadata
  const disciplineName = session?.subject_class?.discipline_name ?? "";
  const subjectClassName = session?.subject_class?.name ?? "";
  const roomName = session?.room?.name ?? null;
  const dayCode = session?.day_code ?? "—";
  const durationTotal = session?.duration_minutes ?? 15;
  const isOpen = session?.status === "open";

  const openedAtFormatted = session?.opened_at
    ? new Date(session.opened_at).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const metaLine = [subjectClassName, roomName, openedAtFormatted].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-1 flex-col bg-paper">
      {/* Topbar */}
      <div
        className="flex shrink-0 items-center justify-between border-b border-border px-9 py-5"
        style={{ minHeight: 110 }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {isOpen && (
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "var(--color-danger)" }}
              />
            )}
            <span
              className="text-label font-bold tracking-caps uppercase"
              style={{ color: isOpen ? "var(--color-danger)" : "var(--color-muted)" }}
            >
              {isOpen
                ? "AO VIVO"
                : session?.status === "closed"
                ? "ENCERRADA"
                : session?.status === "cancelled"
                ? "CANCELADA"
                : "CHAMADA"}
            </span>
          </div>

          <h1
            className="font-black tracking-tight text-ink"
            style={{ fontSize: "var(--text-display)", lineHeight: "var(--leading-display)" }}
          >
            {loading ? (
              <span className="inline-block h-8 w-80 animate-pulse rounded bg-border/60" />
            ) : (
              disciplineName || subjectClassName || "Chamada ao Vivo"
            )}
          </h1>

          {loading ? (
            <span className="inline-block h-3.5 w-56 animate-pulse rounded bg-border/40 mt-1" />
          ) : (
            <span className="text-label text-muted">{metaLine}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/chamadas"
            className="flex h-11 items-center gap-2 rounded-md border border-border px-4 font-semibold text-ink text-label transition-colors hover:bg-surface"
          >
            <ChevronLeftIcon />
            Voltar
          </Link>

          {isOpen && (
            <>
              <button
                id="btn-cancelar-chamada-trigger"
                onClick={() => setShowCancelConfirm(true)}
                disabled={closingSession || cancellingSession}
                className="flex h-11 items-center rounded-md border border-border px-4 font-semibold text-danger text-label transition-colors hover:bg-danger-surface hover:border-danger disabled:opacity-50"
              >
                Cancelar chamada
              </button>

              <button
                id="btn-encerrar-chamada"
                onClick={() => setShowCloseConfirm(true)}
                disabled={closingSession || cancellingSession}
                className="flex h-11 items-center rounded-md px-5 font-bold text-paper text-label transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--color-ink)" }}
              >
                {closingSession ? "Encerrando…" : "Encerrar chamada"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-9 mt-4 rounded-md border border-danger bg-danger-surface px-4 py-3 text-label text-ink">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="flex shrink-0 gap-4 px-9 py-5">
        {/* Código do dia */}
        <div
          className="flex flex-col gap-2 rounded-xl px-6 py-5"
          style={{ background: "var(--color-accent)", flex: "1.2" }}
        >
          <span
            className="text-label font-bold tracking-caps uppercase"
            style={{ color: "rgba(0,0,0,0.55)" }}
          >
            CÓDIGO DO DIA
          </span>
          <span
            className="font-black tracking-tight text-ink"
            style={{
              fontSize: "var(--text-code)",
              lineHeight: "var(--leading-code)",
              letterSpacing: "var(--tracking-code)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {loading ? (
              <span className="inline-block h-14 w-32 animate-pulse rounded bg-black/10" />
            ) : (
              dayCode
            )}
          </span>
          <span className="text-label" style={{ color: "rgba(0,0,0,0.55)" }}>
            Mostre na lousa ou no projetor
          </span>
        </div>

        {/* Timer */}
        <div
          className="flex flex-col gap-2 rounded-xl border border-border px-6 py-5"
          style={{ background: "var(--color-surface)", flex: 1 }}
        >
          <span className="text-label font-bold tracking-caps uppercase text-muted">FECHA EM</span>
          <span
            className="font-black tracking-tight text-ink"
            style={{
              fontSize: "var(--text-code)",
              lineHeight: "var(--leading-code)",
              letterSpacing: "var(--tracking-code)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {loading ? (
              <span className="inline-block h-14 w-28 animate-pulse rounded bg-border/60" />
            ) : isOpen ? (
              formatCountdown(secondsLeft)
            ) : (
              "—"
            )}
          </span>
          <span className="text-label text-muted">de {durationTotal} minutos totais</span>
        </div>

        {/* Confirmados */}
        <div
          className="flex flex-col gap-2 rounded-xl border border-border px-6 py-5"
          style={{ background: "var(--color-surface)", flex: 1 }}
        >
          <span className="text-label font-bold tracking-caps uppercase text-muted">CONFIRMADOS</span>
          <span
            className="font-black tracking-tight text-ink"
            style={{
              fontSize: "var(--text-code)",
              lineHeight: "var(--leading-code)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {loading ? (
              <span className="inline-block h-14 w-28 animate-pulse rounded bg-border/60" />
            ) : (
              `${presentCount}/${totalStudents}`
            )}
          </span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: "var(--color-success)" }}
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-9 pb-4">
        <div className="flex items-center gap-1" role="tablist">
          {(
            [
              { id: "all", label: "Todos", count: roster.length },
              { id: "present", label: "Presente", count: presentCount },
              { id: "not_confirmed", label: "Não confirmou", count: notConfirmedCount },
              { id: "out_of_radius", label: "Fora do raio", count: outOfRadiusCount },
            ] as { id: FilterTab; label: string; count: number }[]
          ).map((tab) => (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              role="tab"
              aria-selected={activeFilter === tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-label font-semibold transition-colors"
              style={
                activeFilter === tab.id
                  ? { background: "var(--color-ink)", color: "var(--color-on-ink)" }
                  : { color: "var(--color-muted)" }
              }
            >
              {tab.label}
              <span
                className="inline-flex min-w-[20px] items-center justify-center rounded-full px-1 text-label font-bold"
                style={
                  activeFilter === tab.id
                    ? { background: "var(--color-on-ink-border)", color: "var(--color-on-ink)" }
                    : { background: "var(--color-border)", color: "var(--color-muted)" }
                }
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          id="btn-filtrar-status"
          className="flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-label font-semibold text-muted transition-colors hover:bg-surface"
        >
          <FilterIcon />
          Filtrar status
        </button>
      </div>

      {/* Table header */}
      <div className="flex shrink-0 items-center gap-4 border-b border-border px-6 py-2.5">
        <div className="h-9 w-9 shrink-0" />
        <span className="flex-1 text-label font-bold tracking-caps uppercase text-muted">ALUNO</span>
        <span className="w-[100px] shrink-0 text-right text-label font-bold tracking-caps uppercase text-muted">HORÁRIO</span>
        <span className="w-[88px] shrink-0 text-right text-label font-bold tracking-caps uppercase text-muted">DISTÂNCIA</span>
        <span className="w-[148px] shrink-0 text-right text-label font-bold tracking-caps uppercase text-muted">STATUS</span>
      </div>

      {/* Student list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filteredRoster.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted">
            <span className="text-heading font-semibold">Nenhum aluno neste filtro</span>
            <span className="text-label">Mude o filtro acima para ver os alunos</span>
          </div>
        ) : (
          filteredRoster.map((item) => (
            <StudentRow key={item.tenant_member_id} item={item} />
          ))
        )}
      </div>

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl">
            <h2 className="mb-2 font-bold text-heading text-ink">Encerrar chamada?</h2>
            <p className="mb-6 text-body text-muted">
              Os alunos que ainda não confirmaram presença ficarão marcados como{" "}
              <strong>não confirmados</strong>. Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                id="btn-cancelar-encerrar"
                onClick={() => setShowCloseConfirm(false)}
                disabled={closingSession || cancellingSession}
                className="rounded-md border border-border px-4 py-2.5 font-semibold text-label text-ink transition-colors hover:bg-surface disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                id="btn-confirmar-encerrar"
                onClick={handleClose}
                disabled={closingSession || cancellingSession}
                className="rounded-md px-4 py-2.5 font-bold text-label text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--color-danger)" }}
              >
                {closingSession ? "Encerrando…" : "Encerrar chamada"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl">
            <h2 className="mb-2 font-bold text-heading text-ink">Cancelar chamada?</h2>
            <p className="mb-6 text-body text-muted">
              A chamada será anulada e nenhuma presença ou falta será registrada no histórico. Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                id="btn-desistir-cancelar"
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancellingSession || closingSession}
                className="rounded-md border border-border px-4 py-2.5 font-semibold text-label text-ink transition-colors hover:bg-surface disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                id="btn-confirmar-cancelar"
                onClick={handleCancel}
                disabled={cancellingSession || closingSession}
                className="rounded-md px-4 py-2.5 font-bold text-label text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--color-danger)" }}
              >
                {cancellingSession ? "Cancelando…" : "Sim, cancelar chamada"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
