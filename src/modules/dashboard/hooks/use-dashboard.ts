"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getDashboardMetrics,
  listSubjectClasses,
  getMyProfile,
  type DashboardMetricsResponse,
  type SubjectClassItem,
} from "@/lib/api";
import { attendanceColor } from "@/lib/utils";
import { useActiveCall } from "@/hooks";
import { toClassItem, toAtRiskStudent } from "../mappers";
import type { DashboardStatsData } from "../types";

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [subjectClasses, setSubjectClasses] = useState<SubjectClassItem[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook global de sessão ativa
  const { activeSession, loading: activeLoading, reload: reloadActive } = useActiveCall();

  const loadDashboardData = useCallback(async (isMounted: () => boolean) => {
    try {
      setLoading(true);
      setError(null);

      const [metricsResult, classesResult, profileResult] =
        await Promise.allSettled([
          getDashboardMetrics({ active: true }),
          listSubjectClasses({ active: true, page_size: 20 }),
          getMyProfile(),
        ]);

      if (!isMounted()) return;

      if (metricsResult.status === "fulfilled") {
        setMetrics(metricsResult.value);
      }

      if (classesResult.status === "fulfilled") {
        setSubjectClasses(classesResult.value.items);
      }

      if (profileResult.status === "fulfilled") {
        const fullName = profileResult.value.name;
        const firstName = fullName ? fullName.trim().split(/\s+/)[0] : null;
        setUserName(firstName);
      }

      if (metricsResult.status === "rejected" && classesResult.status === "rejected") {
        const err = metricsResult.reason;
        setError(
          err instanceof Error ? err.message : "Erro ao carregar os dados do dashboard."
        );
      }
    } catch (err) {
      if (isMounted()) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar informações do dashboard."
        );
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    loadDashboardData(() => mounted);

    return () => {
      mounted = false;
    };
  }, [loadDashboardData]);

  // Transformação via mappers puros
  const atRiskStudents = (metrics?.at_risk_students ?? []).map(toAtRiskStudent);
  const classes = subjectClasses.map(toClassItem);
  const weekFrequency = metrics?.week_frequency ?? [];

  // Cálculos e formatação de estatísticas derivadas
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

  const stats: DashboardStatsData = {
    totalClasses: totalClassesDisplay,
    totalStudents: totalStudentsDisplay,
    averageAttendance: averageAttendanceDisplay,
    averageAttendanceClass,
    totalAtRisk: totalAtRiskDisplay,
    atRiskClass,
  };

  return {
    userName,
    stats,
    classes,
    atRiskStudents,
    weekFrequency,
    activeSession,
    loading,
    error,
    reload: () => loadDashboardData(() => true),
  };
}
