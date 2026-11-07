"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-paper overflow-hidden animate-pulse">
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-border/60" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4.5 w-40 rounded bg-border/60" />
            <div className="h-3.5 w-28 rounded bg-border/40" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-full bg-border/40" />
      </div>
      <div className="h-px bg-border mx-6" />
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-border/40" />
          <div className="h-8 w-16 rounded bg-border/60" />
        </div>
        <div className="px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-border/40" />
          <div className="h-4 w-32 rounded bg-border/60" />
          <div className="h-4 w-28 rounded bg-border/40" />
        </div>
      </div>
      <div className="h-px bg-border mx-6" />
      <div className="flex items-center justify-between px-6 py-3">
        <div className="h-5 w-16 rounded bg-border/40" />
        <div className="h-8 w-28 rounded-md bg-border/40" />
      </div>
    </div>
  );
}

export function SalasSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
