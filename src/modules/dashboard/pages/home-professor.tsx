"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDashboardMetrics,
  listSubjectClasses,
  listActiveAttendanceSessions,
  getMyProfile,
  type DashboardMetricsResponse,
  type ActiveAttendanceSessionResponse,
  type SubjectClassItem,
} from "@/lib/api";

import {
  LiveCallBanner,
  NoActiveCallBanner,
  CallBannerSkeleton,
  StatCard,
  ClassList,
  WeekFrequencyChart,
  AtRiskList,
} from "../components";
import { toClassItem, toAtRiskStudent } from "../mappers";
import {
  greeting,
  formattedDate,
  attendanceColor,
} from "@/lib/utils";

// ─── Main Orchestrator Component ──────────────────────────────────────────────

export function HomeProfessor() {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [subjectClasses, setSubjectClasses] = useState<SubjectClassItem[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveAttendanceSessionResponse[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Dispara requisições simultâneas otimizadas
        const [metricsResult, classesResult, sessionsResult, profileResult] =
          await Promise.allSettled([
            getDashboardMetrics({ active: true }),
            listSubjectClasses({ active: true, page_size: 20 }),
            listActiveAttendanceSessions(),
            getMyProfile(),
          ]);

        if (!isMounted) return;

        if (metricsResult.status === "fulfilled") {
          setMetrics(metricsResult.value);
        }

        if (classesResult.status === "fulfilled") {
          setSubjectClasses(classesResult.value.items);
        }

        if (sessionsResult.status === "fulfilled") {
          setActiveSessions(sessionsResult.value);
        }

        if (profileResult.status === "fulfilled") {
          const fullName = profileResult.value.name;
          const firstName = fullName ? fullName.trim().split(/\s+/)[0] : null;
          setUserName(firstName);
        }

        // Se a chamada principal de métricas falhou com erro crítico
        if (metricsResult.status === "rejected" && classesResult.status === "rejected") {
          const err = metricsResult.reason;
          setError(
            err instanceof Error ? err.message : "Erro ao carregar os dados do dashboard."
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Erro ao carregar informações do dashboard."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mapeamento via funções puras (dashboard.mappers)
  const mappedAtRisk = (metrics?.at_risk_students ?? []).map(toAtRiskStudent);
  const mappedClasses = subjectClasses.map(toClassItem);

  const activeSession = activeSessions.length > 0 ? activeSessions[0] : null;

  // Formatação dos cards de estatísticas
  const totalClassesDisplay = metrics
    ? String(metrics.total_classes).padStart(2, "0")
    : loading
      ? "--"
      : "00";

  const totalStudentsDisplay = metrics
    ? String(metrics.total_unique_students).padStart(2, "0")
    : loading
      ? "--"
      : "00";

  const averageAttendancePct = metrics
    ? Math.round(metrics.average_attendance_rate * 100)
    : null;

  const averageAttendanceDisplay =
    averageAttendancePct !== null
      ? `${averageAttendancePct}%`
      : loading
        ? "--"
        : "0%";

  const averageAttendanceClass =
    averageAttendancePct !== null
      ? attendanceColor(averageAttendancePct)
      : "text-ink";

  const totalAtRiskDisplay = metrics
    ? String(metrics.total_students_at_risk).padStart(2, "0")
    : loading
      ? "--"
      : "00";

  const atRiskClass =
    metrics && metrics.total_students_at_risk > 0 ? "text-danger" : "text-ink";

  return (
    <div className="flex flex-1 flex-col bg-paper">
      {/* Header */}
      <div className="flex items-center justify-between px-9 pb-5 pt-7">
        <div className="flex flex-col gap-1">
          <span className="font-semibold tracking-caps uppercase text-muted text-label/caption">
            {formattedDate()}
          </span>
          <h1 className="font-extrabold tracking-tight text-ink text-[32px] leading-9">
            {/* O primeiro nome do professor é obtido via GET /users/me */}
            {greeting()}{userName ? `, ${userName}.` : "."}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/relatorios"
            className="flex h-11 items-center rounded-md border border-border px-4 font-semibold text-ink text-[14px] leading-body transition-colors hover:bg-surface"
          >
            Ver relatórios
          </Link>
          <Link
            href="/dashboard/chamadas/nova"
            className="flex h-11 items-center gap-2 rounded-md bg-ink px-[18px] font-bold text-paper text-[14px] leading-body transition-opacity hover:opacity-80"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3v10M3 8h10"
                stroke="var(--color-accent)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Abrir chamada
          </Link>
        </div>
      </div>

      {/* Banner de chamada em tempo real (GET /attendance-sessions/active) */}
      {loading && !activeSession ? (
        <CallBannerSkeleton />
      ) : activeSession ? (
        <LiveCallBanner key={activeSession.session_id} session={activeSession} />
      ) : (
        <NoActiveCallBanner />
      )}

      {/* Notificação de erro geral */}
      {error ? (
        <div className="mx-9 my-3 rounded-md border border-danger bg-danger-surface p-4 text-label/body text-ink">
          <span>{error}</span>
        </div>
      ) : null}

      {/* Stats row (GET /dashboard/metrics) */}
      <div className="flex w-full items-stretch px-9 py-5">
        <StatCard
          label="Turmas ativas"
          value={totalClassesDisplay}
          sub="neste semestre"
          border="right"
        />
        <StatCard
          label="Alunos registrados"
          value={totalStudentsDisplay}
          sub="matrículas únicas"
          border="left"
        />
        <StatCard
          label="Frequência média"
          value={averageAttendanceDisplay}
          sub="últimos 30 dias"
          valueClass={averageAttendanceClass}
          border="both"
        />
        <StatCard
          label="Em risco de falta"
          value={totalAtRiskDisplay}
          sub="abaixo de 75%"
          valueClass={atRiskClass}
          border="left"
        />
      </div>

      {/* Main two-column area */}
      <div className="flex flex-1 gap-10 px-9 pb-7 pt-4">
        {/* Classes list (GET /subject-classes?active=true) */}
        <ClassList items={mappedClasses} loading={loading} />

        {/* Right sidebar panel */}
        <div className="flex w-[340px] shrink-0 flex-col gap-5">
          {/* Week frequency chart (week_frequency de GET /dashboard/metrics) */}
          <WeekFrequencyChart data={metrics?.week_frequency ?? []} />

          {/* At-risk students (at_risk_students de GET /dashboard/metrics) */}
          <AtRiskList students={mappedAtRisk} loading={loading} />
        </div>
      </div>
    </div>
  );
}
