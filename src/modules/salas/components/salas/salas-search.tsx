"use client";

import React from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";

export interface SalasSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
  loading?: boolean;
}

export function SalasSearch({
  search,
  onSearchChange,
  resultCount,
  loading = false,
}: SalasSearchProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-9 py-4">
      <div className="relative flex-1 max-w-sm">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <SearchIcon size={16} />
        </span>
        <input
          id="salas-search"
          type="text"
          placeholder="Buscar sala pelo nome..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-paper pl-9 pr-9 text-body text-ink placeholder:text-muted focus:outline-none focus:border-control-border transition-colors"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
            title="Limpar busca"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
        )}
        {search && (
          <span className="text-label text-muted">
            {resultCount} resultado{resultCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
