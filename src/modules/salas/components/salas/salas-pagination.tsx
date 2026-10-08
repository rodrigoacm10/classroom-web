"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export interface SalasPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function SalasPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: SalasPaginationProps) {
  if (totalItems <= 0) return null;

  const start = Math.min((page - 1) * pageSize + 1, totalItems);
  const end = Math.min(page * pageSize, totalItems);

  // Gera array de páginas para renderizar (com reticências se houver muitas)
  function getVisiblePages(): (number | "...")[] {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    pages.push(1);
    if (page > 3) pages.push("...");
    const middleStart = Math.max(2, page - 1);
    const middleEnd = Math.min(totalPages - 1, page + 1);
    for (let i = middleStart; i <= middleEnd; i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border px-9 py-4 bg-paper">
      {/* Informações da contagem */}
      <div className="flex items-center gap-2 text-label text-muted">
        <span>
          Mostrando <strong className="text-ink font-semibold">{start}</strong> a{" "}
          <strong className="text-ink font-semibold">{end}</strong> de{" "}
          <strong className="text-ink font-semibold">{totalItems}</strong> salas
        </span>

        {onPageSizeChange && (
          <div className="ml-4 flex items-center gap-1.5 text-caption">
            <span>Por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded border border-border bg-paper px-2 py-1 text-ink focus:outline-none focus:border-control-border cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        )}
      </div>

      {/* Controles de navegação */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-ink/40 hover:bg-surface hover:text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeftIcon size={14} />
          </button>

          {visiblePages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-6 items-center justify-center text-caption text-muted select-none"
                >
                  …
                </span>
              );
            }

            const isActive = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-caption font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-ink text-paper font-bold"
                    : "border border-border text-muted hover:border-ink/40 hover:bg-surface hover:text-ink"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Próxima página"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-ink/40 hover:bg-surface hover:text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRightIcon size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
