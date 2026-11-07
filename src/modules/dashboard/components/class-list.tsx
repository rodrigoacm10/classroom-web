import Link from "next/link";
import type { ClassItem } from "../types";
import { ClassRow } from "./class-row";

export interface ClassListProps {
  items: ClassItem[];
  loading?: boolean;
}

export function ClassList({ items, loading = false }: ClassListProps) {
  return (
    <div className="flex flex-1 flex-col gap-4" style={{ flexGrow: 1.4 }}>
      <div className="flex items-baseline justify-between">
        <span className="font-bold text-ink text-heading/heading">Minhas turmas</span>
        <Link
          href="/dashboard/turmas"
          className="font-semibold text-muted text-label/caption hover:text-ink transition-colors"
        >
          Ver todas
        </Link>
      </div>

      <div className="flex flex-col border-t border-t-border">
        {loading && items.length === 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex h-[72px] items-center gap-4 px-1 animate-pulse">
                <div className="h-10 w-2 rounded bg-surface" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 w-48 rounded bg-surface" />
                  <div className="h-3 w-28 rounded bg-surface" />
                </div>
                <div className="h-4 w-12 rounded bg-surface" />
                <div className="h-4 w-16 rounded bg-surface" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted border-b border-b-border">
            <p className="text-body/body font-medium">Nenhuma turma ativa encontrada.</p>
            <span className="text-caption/caption mt-1">
              Suas turmas cadastradas aparecerão aqui.
            </span>
          </div>
        ) : (
          items.map((c) => <ClassRow key={c.id} item={c} />)
        )}
      </div>
    </div>
  );
}
