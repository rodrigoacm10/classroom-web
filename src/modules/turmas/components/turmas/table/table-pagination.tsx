"use client";

import React from "react";

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalClasses: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalClasses,
  pageSize,
  loading,
  onPageChange,
}: TablePaginationProps) {
  const start = totalClasses === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalClasses);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-[#FAFAFA] px-5 py-3 gap-3">
      <div className="text-caption text-muted">
        Mostrando <strong className="font-semibold text-ink">{start}</strong> a{" "}
        <strong className="font-semibold text-ink">{end}</strong> de{" "}
        <strong className="font-semibold text-ink">{totalClasses}</strong> turmas
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="rounded-md border border-border bg-white px-3 py-1.5 text-label font-medium text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Anterior
        </button>
        <span className="px-2 font-mono text-label text-muted">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages || loading}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="rounded-md border border-border bg-white px-3 py-1.5 text-label font-medium text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
