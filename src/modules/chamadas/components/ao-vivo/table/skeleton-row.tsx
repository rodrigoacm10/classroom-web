import React from "react";

export function AoVivoSkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-6 py-3 last:border-0 animate-pulse">
      <div className="h-9 w-9 rounded-full bg-border/60" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="h-4 w-40 rounded bg-border/60" />
        <div className="h-3 w-20 rounded bg-border/40" />
      </div>
      <div className="w-[100px] shrink-0 flex justify-end">
        <div className="h-3 w-16 rounded bg-border/40" />
      </div>
      <div className="w-[88px] shrink-0 flex justify-end">
        <div className="h-3 w-12 rounded bg-border/40" />
      </div>
      <div className="w-[230px] shrink-0 flex justify-end gap-2">
        <div className="h-6 w-24 rounded-full bg-border/40" />
        <div className="h-6 w-16 rounded-lg bg-border/40" />
      </div>
    </div>
  );
}
