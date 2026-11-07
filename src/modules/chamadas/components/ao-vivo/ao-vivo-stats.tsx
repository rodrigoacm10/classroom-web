import React from "react";
import { formatCountdown } from "@/lib/utils";

export interface AoVivoStatsProps {
  loading: boolean;
  isOpen: boolean;
  dayCode: string;
  secondsLeft: number;
  durationTotal: number;
  presentCount: number;
  totalStudents: number;
  progressPct: number;
}

export function AoVivoStats({
  loading,
  isOpen,
  dayCode,
  secondsLeft,
  durationTotal,
  presentCount,
  totalStudents,
  progressPct,
}: AoVivoStatsProps) {
  return (
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
  );
}
