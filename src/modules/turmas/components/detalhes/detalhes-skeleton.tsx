"use client";

import React from "react";

export function DetalhesSkeleton() {
  return (
    <div className="flex min-h-full flex-col bg-paper p-8 lg:p-10 space-y-6">
      <div className="h-10 w-48 rounded-lg bg-surface animate-pulse" />
      <div className="h-28 w-full rounded-2xl border border-border bg-white p-6 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-white animate-pulse" />
        ))}
      </div>
    </div>
  );
}
