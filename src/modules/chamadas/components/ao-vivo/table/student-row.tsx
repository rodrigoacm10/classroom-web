import React from "react";
import type { SessionRosterItem } from "@/lib/api";
import { formatDistance, formatTime } from "@/lib/utils";
import { AoVivoAvatar } from "./avatar";
import { AoVivoStatusBadge } from "./status-badge";

interface AoVivoStudentRowProps {
  item: SessionRosterItem;
}

export function AoVivoStudentRow({ item }: AoVivoStudentRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-6 py-3 last:border-0 hover:bg-surface/60 transition-colors">
      <AoVivoAvatar name={item.student_name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold text-ink text-body leading-body">
          {item.student_name}
        </span>
        <span className="truncate text-label text-muted">
          {item.enrollment_id.slice(-8).toUpperCase()}
        </span>
      </div>
      <span className="w-[100px] shrink-0 text-right text-label text-ink">
        {item.confirmed_at ? formatTime(item.confirmed_at) : "—"}
      </span>
      <span
        className="w-[88px] shrink-0 text-right text-label font-medium"
        style={{
          color:
            item.within_radius === false
              ? "var(--color-danger)"
              : item.distance_meters !== null
              ? "var(--color-ink)"
              : "var(--color-muted)",
        }}
      >
        {formatDistance(item.distance_meters)}
      </span>
      <div className="w-[148px] shrink-0 flex justify-end">
        <AoVivoStatusBadge item={item} />
      </div>
    </div>
  );
}
