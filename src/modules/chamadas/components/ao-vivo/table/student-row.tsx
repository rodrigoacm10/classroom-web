import React from "react";
import type { SessionRosterItem } from "@/lib/api";
import { formatDistance, formatTime } from "@/lib/utils";
import { EyeIcon } from "@/components/icons";
import { AoVivoAvatar } from "./avatar";
import { AoVivoStatusBadge } from "./status-badge";

interface AoVivoStudentRowProps {
  item: SessionRosterItem;
  onReview?: (item: SessionRosterItem) => void;
}

export function AoVivoStudentRow({ item, onReview }: AoVivoStudentRowProps) {
  const isIrregular =
    Boolean(item.record_id) &&
    (item.record_status === "irregular" ||
      (item.within_radius === false &&
        item.record_status !== "approved" &&
        item.record_status !== "rejected"));

  const isReviewed =
    Boolean(item.record_id) &&
    (item.record_status === "approved" || item.record_status === "rejected");

  const canReview = Boolean(item.record_id);

  return (
    <div
      onClick={() => {
        if (canReview && onReview) {
          onReview(item);
        }
      }}
      className={`flex items-center gap-4 border-b border-border px-6 py-3 last:border-0 hover:bg-surface/60 transition-colors ${
        canReview ? "cursor-pointer" : ""
      }`}
    >
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

      <div className="w-[230px] shrink-0 flex items-center justify-end gap-2">
        <AoVivoStatusBadge item={item} />

        {isIrregular && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReview?.(item);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-caption font-bold text-ink shadow-2xs hover:bg-surface hover:border-ink/40 transition-all cursor-pointer"
            title="Revisar inconsistências da presença"
          >
            <EyeIcon size={13} className="text-muted" />
            <span>Revisar</span>
          </button>
        )}

        {isReviewed && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReview?.(item);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-white/70 px-2 py-1 text-caption font-medium text-muted hover:bg-surface hover:text-ink transition-all cursor-pointer"
            title="Ver auditoria da presença"
          >
            <EyeIcon size={12} />
            <span>Auditoria</span>
          </button>
        )}
      </div>
    </div>
  );
}
