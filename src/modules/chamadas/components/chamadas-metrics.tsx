import type { AttendanceMetricsResponse } from "@/services/attendance";
import { formatShortDate, formatHourBadge } from "@/lib/utils";
import type { AttendancePeriod } from "../types";

export interface ChamadasMetricsProps {
  metrics: AttendanceMetricsResponse | null;
  loading: boolean;
  selectedPeriod: AttendancePeriod;
}

export function ChamadasMetrics({
  metrics,
  loading,
  selectedPeriod,
}: ChamadasMetricsProps) {
  const periodLabel =
    selectedPeriod === "1"
      ? "hoje"
      : selectedPeriod === "7"
      ? "últimos 7 dias"
      : selectedPeriod === "15"
      ? "últimos 15 dias"
      : selectedPeriod === "30"
      ? "últimos 30 dias"
      : "todos os períodos";

  return (
    <div className="flex w-full border-b border-border bg-white px-10 pt-5 pb-4">
      {/* Col 1: Total de chamadas */}
      <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border py-2 pr-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Total de chamadas
        </div>
        {loading ? (
          <div className="my-1 h-[36px] w-20 rounded bg-surface animate-pulse" />
        ) : (
          <div className="font-mono text-[40px] font-medium tracking-tight text-ink leading-[44px]">
            {metrics ? metrics.total_sessions : 0}
          </div>
        )}
        <div className="font-sans text-label text-muted">{periodLabel}</div>
      </div>

      {/* Col 2: Frequência média */}
      <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border px-5 py-2">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Frequência média
        </div>
        {loading ? (
          <div className="my-1 h-[36px] w-24 rounded bg-surface animate-pulse" />
        ) : (
          <div className="font-mono text-[40px] font-medium tracking-tight text-success leading-[44px]">
            {metrics ? `${Math.round(metrics.average_attendance_rate * 100)}%` : "0%"}
          </div>
        )}
        <div className="font-sans text-label text-muted">{periodLabel}</div>
      </div>

      {/* Col 3: Canceladas */}
      <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border px-5 py-2">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Canceladas
        </div>
        {loading ? (
          <div className="my-1 h-[36px] w-16 rounded bg-surface animate-pulse" />
        ) : (
          <div className="font-mono text-[40px] font-medium tracking-tight text-danger leading-[44px]">
            {metrics ? String(metrics.cancelled_sessions).padStart(2, "0") : "00"}
          </div>
        )}
        <div className="font-sans text-label text-muted">{periodLabel}</div>
      </div>

      {/* Col 4: Última chamada */}
      <div className="flex grow basis-0 flex-col gap-[6px] py-2 pl-5">
        <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
          Última chamada
        </div>
        {loading ? (
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
  );
}
