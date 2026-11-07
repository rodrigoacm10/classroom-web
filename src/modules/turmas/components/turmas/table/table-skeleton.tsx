import React from "react";

export function TableSkeleton() {
  return (
    <div className="divide-y divide-border">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="grid grid-cols-12 items-center px-5 py-4 animate-pulse">
          <div className="col-span-12 md:col-span-4 flex items-center gap-3.5 pr-2">
            <div className="h-10 w-10 shrink-0 rounded-full bg-surface" />
            <div className="flex flex-col gap-1.5 w-40">
              <div className="h-4 w-28 rounded bg-surface" />
              <div className="h-3 w-36 rounded bg-surface" />
            </div>
          </div>
          <div className="hidden md:col-span-2 md:flex items-center gap-2 pr-2">
            <div className="h-4 w-28 rounded bg-surface" />
          </div>
          <div className="hidden md:col-span-2 md:flex items-center gap-1.5 pr-2">
            <div className="h-4 w-24 rounded bg-surface" />
          </div>
          <div className="col-span-4 md:col-span-1">
            <div className="h-4 w-8 rounded bg-surface" />
          </div>
          <div className="col-span-4 md:col-span-2 pr-3">
            <div className="h-2 w-full rounded bg-surface" />
          </div>
          <div className="col-span-4 md:col-span-1 flex justify-end">
            <div className="h-5 w-14 rounded-full bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}
