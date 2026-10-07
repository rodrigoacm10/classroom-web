import React from "react";
import { FilterIcon } from "@/components/icons";
import type { LiveFilterTab } from "../../types";

export interface AoVivoFiltersProps {
  activeFilter: LiveFilterTab;
  onFilterChange: (tab: LiveFilterTab) => void;
  rosterLength: number;
  presentCount: number;
  notConfirmedCount: number;
  outOfRadiusCount: number;
}

export function AoVivoFilters({
  activeFilter,
  onFilterChange,
  rosterLength,
  presentCount,
  notConfirmedCount,
  outOfRadiusCount,
}: AoVivoFiltersProps) {
  const tabs: { id: LiveFilterTab; label: string; count: number }[] = [
    { id: "all", label: "Todos", count: rosterLength },
    { id: "present", label: "Presente", count: presentCount },
    { id: "not_confirmed", label: "Não confirmou", count: notConfirmedCount },
    { id: "out_of_radius", label: "Fora do raio", count: outOfRadiusCount },
  ];

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-9 pb-4">
      <div className="flex items-center gap-1" role="tablist">
        {tabs.map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onFilterChange(tab.id)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-label font-semibold transition-colors"
              style={
                isSelected
                  ? { background: "var(--color-ink)", color: "var(--color-on-ink)" }
                  : { color: "var(--color-muted)" }
              }
            >
              {tab.label}
              <span
                className="inline-flex min-w-[20px] items-center justify-center rounded-full px-1 text-label font-bold"
                style={
                  isSelected
                    ? { background: "var(--color-on-ink-border)", color: "var(--color-on-ink)" }
                    : { background: "var(--color-border)", color: "var(--color-muted)" }
                }
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <button
        id="btn-filtrar-status"
        type="button"
        className="flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-label font-semibold text-muted transition-colors hover:bg-surface"
      >
        <FilterIcon />
        Filtrar status
      </button>
    </div>
  );
}
