import Link from "next/link";
import type { ClassItem, ClassStatus } from "./dashboard.types";

export function statusLabel(status: ClassStatus): string {
  const map: Record<string, string> = {
    live: "AO VIVO",
    alert: "ALERTA",
    // Os status baseados em horários/agenda da turma foram comentados
    // pois a rota /subject-classes não retorna horários de aula atualmente:
    // today: "HOJE 10H",
    // tonight: "NOITE",
    // tomorrow: "AMANHÃ",
    // wednesday: "QUARTA",
  };
  return map[status] ?? "";
}

export function statusBadgeClass(status: ClassStatus): string {
  if (status === "live") return "bg-accent-surface text-ink font-bold animate-pulse";
  if (status === "alert") return "bg-danger-surface text-danger font-bold";
  return "bg-surface text-muted font-semibold";
}

import { attendanceColor, attendanceBarColor } from "@/lib/utils";

export { attendanceColor, attendanceBarColor };

export function accentBarColor(color: ClassItem["accentColor"]): string {
  if (color === "accent") return "bg-accent";
  if (color === "danger") return "bg-danger";
  return "bg-ink";
}

export function ClassRow({ item }: { item: ClassItem }) {
  const barWidth = `${item.attendance}%`;
  const isLive = item.status === "live";

  const rowContent = (
    <div className="flex h-[72px] w-full shrink-0 items-center gap-4 border-b border-b-border px-1 transition-colors hover:bg-surface/50">
      {/* left accent bar */}
      <div
        className={`h-10 w-2 shrink-0 rounded-[4px] ${accentBarColor(item.accentColor)}`}
      />

      {/* name + subtitle */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold text-ink text-body/body truncate">
          {item.name}
        </span>
        <span className="font-medium text-muted text-caption/caption truncate">
          {item.subtitle}
        </span>
      </div>

      {/* student count */}
      <div className="flex w-[72px] shrink-0 flex-col">
        <span className="font-mono font-medium text-ink text-body/body">{item.students}</span>
        <span className="text-muted text-caption/caption">alunos</span>
      </div>

      {/* attendance % + bar */}
      <div className="flex w-[88px] shrink-0 flex-col gap-1.5">
        <span className={`font-mono font-medium text-body/body ${attendanceColor(item.attendance)}`}>
          {item.attendance}%
        </span>
        <div className="h-1 w-[72px] rounded-full bg-surface">
          <div
            className={`h-1 rounded-full ${attendanceBarColor(item.attendance)}`}
            style={{ width: barWidth }}
          />
        </div>
      </div>

      {/* status badge */}
      <div className="flex w-[88px] shrink-0 justify-end">
        {item.status !== "normal" && statusLabel(item.status) ? (
          <div
            className={`flex h-5 items-center justify-center rounded-full px-2 text-caption/caption ${statusBadgeClass(
              item.status
            )}`}
          >
            {statusLabel(item.status)}
          </div>
        ) : null}
      </div>
    </div>
  );

  // Ação de clique para turmas com chamada ao vivo
  if (isLive && item.activeSessionId) {
    return (
      <Link
        href={`/dashboard/chamadas/${item.id}/${item.activeSessionId}`}
        className="block"
        title="Chamada aberta agora — Clique para acompanhar"
      >
        {rowContent}
      </Link>
    );
  }

  return rowContent;
}
