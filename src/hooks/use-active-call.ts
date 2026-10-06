"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listActiveAttendanceSessions,
  type ActiveAttendanceSessionResponse,
} from "@/services/attendance";
import { formatRemaining } from "@/lib/utils";

export interface UseActiveCallOptions {
  /** Se deve recarregar a sessão automaticamente quando o timer zerar ("00:00"). Padrão: true */
  autoRefreshOnExpire?: boolean;
}

export function useActiveCall(options: UseActiveCallOptions = {}) {
  const { autoRefreshOnExpire = true } = options;

  const [activeSession, setActiveSession] = useState<ActiveAttendanceSessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState("00:00");

  const fetchActive = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sessions = await listActiveAttendanceSessions();
      if (sessions && sessions.length > 0) {
        setActiveSession(sessions[0]);
        setRemainingTime(formatRemaining(sessions[0].expires_at));
      } else {
        setActiveSession(null);
        setRemainingTime("00:00");
      }
    } catch (err) {
      setActiveSession(null);
      setRemainingTime("00:00");
      setError(err instanceof Error ? err.message : "Erro ao consultar chamada ativa.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    let mounted = true;

    async function initialLoad() {
      try {
        setLoading(true);
        setError(null);
        const sessions = await listActiveAttendanceSessions();
        if (!mounted) return;
        if (sessions && sessions.length > 0) {
          setActiveSession(sessions[0]);
          setRemainingTime(formatRemaining(sessions[0].expires_at));
        } else {
          setActiveSession(null);
          setRemainingTime("00:00");
        }
      } catch (err) {
        if (!mounted) return;
        setActiveSession(null);
        setRemainingTime("00:00");
        setError(err instanceof Error ? err.message : "Erro ao consultar chamada ativa.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialLoad();

    return () => {
      mounted = false;
    };
  }, []);

  // Timer de contagem regressiva em tempo real
  useEffect(() => {
    if (!activeSession?.expires_at) {
      setRemainingTime("00:00");
      return;
    }

    // Atualização imediata
    const current = formatRemaining(activeSession.expires_at);
    setRemainingTime(current);

    const interval = setInterval(() => {
      const remaining = formatRemaining(activeSession.expires_at);
      setRemainingTime(remaining);

      if (remaining === "00:00" && autoRefreshOnExpire) {
        fetchActive();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.expires_at, autoRefreshOnExpire, fetchActive]);

  return {
    activeSession,
    loading,
    error,
    remainingTime,
    reload: fetchActive,
    refresh: fetchActive,
  };
}
