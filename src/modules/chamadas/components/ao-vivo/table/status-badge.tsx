import React from "react";
import type { SessionRosterItem } from "@/lib/api";

interface AoVivoStatusBadgeProps {
  item: SessionRosterItem;
}

export function AoVivoStatusBadge({ item }: AoVivoStatusBadgeProps) {
  if (!item.record_id) {
    return (
      <span className="text-label font-semibold tracking-caps uppercase text-muted">
        NÃO CONFIRMOU
      </span>
    );
  }

  if (item.within_radius === false) {
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-label font-bold tracking-caps uppercase"
        style={{ background: "var(--color-danger-surface)", color: "var(--color-danger)" }}
      >
        FORA DO RAIO
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-label font-bold tracking-caps uppercase"
      style={{ background: "var(--color-success-surface)", color: "var(--color-success)" }}
    >
      PRESENTE
    </span>
  );
}
