import type { DayAttendanceMetric } from "@/lib/api";
import { FULL_DAY_NAMES, formatDayTooltipDate } from "@/lib/utils";

export { FULL_DAY_NAMES as fullDayNames, formatDayTooltipDate };

export function WeekFrequencyChart({ data }: { data: DayAttendanceMetric[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayDateStr = `${year}-${month}-${day}`;

  const todayItem = data.find((d) => d.date === todayDateStr);
  const todayLabel = todayItem
    ? todayItem.day_label || (todayItem as unknown as { label?: string }).label
    : null;

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-surface p-5">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-ink text-body/body">Frequência da semana</span>
        <span className="text-muted text-label/caption">
          Semana em curso{todayLabel ? ` · ${todayLabel} em andamento` : ""}
        </span>
      </div>
      <div className="flex h-[88px] w-full items-end justify-between">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-muted text-caption/caption">
            Sem registros nesta semana
          </div>
        ) : (
          data.map((d, index) => {
            const label = d.day_label || (d as unknown as { label?: string }).label || "";
            const pct = Math.round(d.attendance_rate * 100);
            const isToday = d.date === todayDateStr;
            const maxBarPx = 54;
            const heightPx = Math.max(4, Math.round((pct / 100) * maxBarPx));

            let barColor = "bg-ink opacity-45 group-hover:opacity-75";
            if (isToday) {
              barColor = "bg-accent opacity-100 group-hover:brightness-105";
            } else if (pct === 0 && d.total_sessions === 0) {
              barColor = "bg-ink opacity-20 group-hover:opacity-40";
            }

            const fullDay = FULL_DAY_NAMES[d.day_of_week] ?? label;
            const formattedDate = formatDayTooltipDate(d.date);

            // Ajuste horizontal do popup para não vazar nas extremidades do card
            let alignClass = "left-1/2 -translate-x-1/2";
            let arrowClass = "left-1/2 -translate-x-1/2";
            if (index === 0) {
              alignClass = "left-0";
              arrowClass = "left-3.5 -translate-x-1/2";
            } else if (index === data.length - 1) {
              alignClass = "right-0";
              arrowClass = "right-3.5 translate-x-1/2";
            }

            return (
              <div
                key={d.date}
                className="group relative flex w-7 shrink-0 flex-col items-center gap-2 cursor-pointer py-1"
              >
                {/* Popup / Tooltip Flutuante */}
                <div
                  className={`pointer-events-none absolute bottom-full mb-2.5 hidden group-hover:flex flex-col gap-1 rounded-md bg-ink p-2.5 text-paper shadow-xl border border-on-ink-border z-30 min-w-[130px] transition-all duration-150 ${alignClass}`}
                >
                  {/* Topo: Dia da Semana e Data */}
                  <div className="flex items-center justify-between gap-3 border-b border-on-ink-border pb-1">
                    <span className="font-bold text-[12px] text-paper">{fullDay}</span>
                    <span className="font-mono text-[11px] text-on-ink-muted">{formattedDate}</span>
                  </div>

                  {/* Informação de Frequência e Indicador Colorido */}
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          pct >= 85
                            ? "bg-success"
                            : pct >= 75
                              ? "bg-warn"
                              : pct > 0
                                ? "bg-danger"
                                : "bg-on-ink-muted"
                        }`}
                      />
                      <span className="font-bold text-[13px] text-paper font-mono">
                        {pct}%
                      </span>
                      <span className="text-[11px] text-on-ink-muted">presença</span>
                    </div>

                    <span className="text-[10px] leading-tight text-on-ink-subtle">
                      {d.total_sessions > 0
                        ? `${d.total_presents}/${d.total_expected} presenças`
                        : "Sem aulas registradas"}
                    </span>
                  </div>

                  {/* Seta do Popup apontando para a barra */}
                  <div
                    className={`absolute -bottom-1 h-2 w-2 rotate-45 bg-ink border-r border-b border-on-ink-border ${arrowClass}`}
                  />
                </div>

                {/* Barra do Gráfico */}
                <div
                  className={`w-7 shrink-0 rounded-[4px] transition-all duration-200 ${barColor}`}
                  style={{ height: `${heightPx}px` }}
                />

                {/* Rótulo Curto (DOM, SEG, TER...) */}
                <span
                  className={`text-caption/caption transition-colors ${
                    isToday
                      ? "font-bold text-ink"
                      : "font-semibold text-muted group-hover:text-ink"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
