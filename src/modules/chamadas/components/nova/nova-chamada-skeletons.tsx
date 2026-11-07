import React from "react";

export function PreviewSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3.5 animate-pulse" aria-busy="true">
      {/* Header skeleton */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-border" />
        <div className="h-3 w-36 rounded bg-border" />
      </div>

      {/* Turma card skeleton */}
      <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-paper p-5">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-60 rounded bg-border" />
            <div className="h-3.5 w-40 rounded bg-border/70" />
          </div>
          <div className="h-6 w-16 rounded-full bg-border/60" />
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <div className="flex">
            <div className="flex flex-1 flex-col gap-1.5 pr-4">
              <div className="h-2.5 w-12 rounded bg-border/70" />
              <div className="h-7 w-16 rounded bg-border" />
              <div className="h-2.5 w-24 rounded bg-border/60" />
            </div>
            <div className="w-px shrink-0 bg-border" />
            <div className="flex flex-1 flex-col gap-1.5 px-4">
              <div className="h-2.5 w-16 rounded bg-border/70" />
              <div className="h-7 w-16 rounded bg-border" />
              <div className="h-2.5 w-24 rounded bg-border/60" />
            </div>
            <div className="w-px shrink-0 bg-border" />
            <div className="flex flex-1 flex-col gap-1.5 pl-4">
              <div className="h-2.5 w-14 rounded bg-border/70" />
              <div className="h-7 w-10 rounded bg-border" />
              <div className="h-2.5 w-20 rounded bg-border/60" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="h-3 w-28 rounded bg-border/70" />
              <div className="h-3 w-10 rounded bg-border/70" />
            </div>
            <div className="h-[5px] w-full rounded-full bg-border" />
          </div>
        </div>
      </div>

      {/* Bottom cards row skeleton */}
      <div className="flex min-h-0 flex-1 gap-3.5">
        {/* Geofence map card skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-paper">
          <div className="flex-1 bg-border/30 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-border/50" />
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 p-4">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="h-3 w-40 rounded bg-border/60" />
            <div className="h-3 w-24 rounded bg-border/60" />
            <div className="h-6 w-28 rounded bg-border/50" />
          </div>
        </div>

        {/* Summary card skeleton */}
        <div className="flex flex-1 flex-col rounded-xl bg-ink p-5">
          <div className="h-3 w-16 rounded bg-white/20 pb-3.5" />
          <div className="flex flex-col gap-3 py-3">
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-white/20" />
              <div className="h-3 w-20 rounded bg-white/30" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <div className="h-3 w-14 rounded bg-white/20" />
              <div className="h-3 w-16 rounded bg-white/30" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-white/20" />
              <div className="h-3 w-14 rounded bg-white/30" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-white/20" />
              <div className="h-3 w-20 rounded bg-white/30" />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end pt-4">
            <div className="h-2.5 w-16 rounded bg-white/20 mb-2" />
            <div className="h-9 w-24 rounded bg-white/30" />
            <div className="mt-2.5 h-1 w-full rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormFieldsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" aria-busy="true">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 rounded bg-border/70" />
        <div className="h-3.5 w-32 rounded bg-border/60" />
        <div className="h-[46px] w-full rounded-md bg-surface border border-border" />
      </div>
      <div className="h-px bg-border" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 rounded bg-border/70" />
        <div className="h-3.5 w-36 rounded bg-border/60" />
        <div className="h-[46px] w-full rounded-md bg-surface border border-border" />
        <div className="h-3 w-56 rounded bg-border/50" />
      </div>
    </div>
  );
}
