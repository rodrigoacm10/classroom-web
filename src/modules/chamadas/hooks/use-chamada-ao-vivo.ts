"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAttendanceSession,
  listSessionRoster,
  closeAttendanceSession,
  cancelAttendanceSession,
  type AttendanceSessionResponse,
  type SessionRosterItem,
} from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { LiveFilterTab } from "../types";

export interface UseChamadaAoVivoProps {
  subjectClassId: string;
  sessionId: string;
}

export function useChamadaAoVivo({ subjectClassId, sessionId }: UseChamadaAoVivoProps) {
  const router = useRouter();

  const [session, setSession] = useState<AttendanceSessionResponse | null>(null);
  const [roster, setRoster] = useState<SessionRosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<LiveFilterTab>("all");
  const [closingSession, setClosingSession] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [cancellingSession, setCancellingSession] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Countdown Timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.expires_at) return;

    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [session?.expires_at]);

  const secondsLeft = session?.expires_at
    ? Math.max(0, Math.floor((new Date(session.expires_at).getTime() - now) / 1000))
    : 0;

  // ─── Data Fetching & Polling ────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
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
      setLoading(false);
    }
  }, [subjectClassId, sessionId]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      try {
        const [sessionData, rosterData] = await Promise.all([
          getAttendanceSession(subjectClassId, sessionId),
          listSessionRoster(subjectClassId, sessionId),
        ]);

        if (!isMounted) return;
        setSession(sessionData);
        setRoster(rosterData);
        setError(null);

        if (sessionData.status !== "open") {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar dados da chamada.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitial();
    pollRef.current = setInterval(() => {
      fetchData();
    }, 15_000);

    return () => {
      isMounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [subjectClassId, sessionId, fetchData]);

  // ─── Action Handlers ────────────────────────────────────────────────────────
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

  // ─── Derived Statistics ─────────────────────────────────────────────────────
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

  // ─── Metadata ───────────────────────────────────────────────────────────────
  const disciplineName = session?.subject_class?.discipline_name ?? "";
  const subjectClassName = session?.subject_class?.name ?? "";
  const roomName = session?.room?.name ?? null;
  const dayCode = session?.day_code ?? "—";
  const durationTotal = session?.duration_minutes ?? 15;
  const isOpen = session?.status === "open";

  const openedAtFormatted = session?.opened_at ? formatDateTime(session.opened_at) : "";
  const metaLine = [subjectClassName, roomName, openedAtFormatted].filter(Boolean).join(" · ");

  return {
    session,
    roster,
    filteredRoster,
    loading,
    error,
    setError,
    activeFilter,
    setActiveFilter,
    closingSession,
    showCloseConfirm,
    setShowCloseConfirm,
    cancellingSession,
    showCancelConfirm,
    setShowCancelConfirm,
    secondsLeft,
    totalStudents,
    presentCount,
    outOfRadiusCount,
    notConfirmedCount,
    progressPct,
    disciplineName,
    subjectClassName,
    roomName,
    dayCode,
    durationTotal,
    isOpen,
    metaLine,
    handleClose,
    handleCancel,
    refresh: fetchData,
  };
}
