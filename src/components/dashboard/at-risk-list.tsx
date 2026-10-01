import type { AtRiskStudent } from "./dashboard.types";
import { getInitials } from "@/lib/utils";

export { getInitials };

export function AtRiskRow({ student }: { student: AtRiskStudent }) {
  const avatarBg = student.critical ? "bg-danger-surface" : "bg-accent-surface";
  const avatarText = student.critical ? "text-danger" : "text-ink";
  const pctColor = student.critical ? "text-danger" : "text-ink";

  return (
    <div className="flex h-14 w-full shrink-0 items-center gap-3 border-b border-b-border">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${avatarBg}`}
      >
        <span className={`font-bold text-[11px] leading-4 ${avatarText}`}>
          {student.initials}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold text-ink text-[14px] leading-5 truncate">
          {student.name}
        </span>
        <span className="text-muted text-caption/caption truncate">{student.classLabel}</span>
      </div>
      <span className={`shrink-0 font-mono font-semibold text-body/body ${pctColor}`}>
        {student.attendancePct}%
      </span>
    </div>
  );
}

export function AtRiskList({
  students,
  loading = false,
}: {
  students: AtRiskStudent[];
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="font-bold text-ink text-body/body">Alunos em risco</span>
        <span className="font-semibold text-muted text-label/caption">Limite 75%</span>
      </div>
      <div className="flex flex-col border-t border-t-border">
        {loading && students.length === 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {[1, 2].map((n) => (
              <div key={n} className="flex h-14 items-center gap-3 animate-pulse">
                <div className="h-7 w-7 rounded-full bg-surface" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3.5 w-32 rounded bg-surface" />
                  <div className="h-2.5 w-24 rounded bg-surface" />
                </div>
                <div className="h-4 w-8 rounded bg-surface" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted">
            <span className="text-caption/caption">Nenhum aluno em risco (&lt; 75%)</span>
          </div>
        ) : (
          students.map((s) => (
            <AtRiskRow key={s.id || `${s.name}-${s.classLabel}`} student={s} />
          ))
        )}
      </div>
    </div>
  );
}
