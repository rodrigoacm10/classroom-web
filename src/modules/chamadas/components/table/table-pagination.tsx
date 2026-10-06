import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentCount?: number;
  itemLabel?: string;
  loading?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  currentCount,
  itemLabel = "chamadas",
  loading = false,
  onPageChange,
  className,
}: TablePaginationProps) {
  const visibleCount = currentCount !== undefined ? currentCount : totalItems;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between border-t border-border bg-white px-5 py-4 gap-3",
        className
      )}
    >
      {/* Informação de contagem */}
      <div className="font-sans text-label text-muted">
        {loading ? (
          <div className="h-4 w-44 rounded bg-surface animate-pulse" />
        ) : (
          `Mostrando ${visibleCount} de ${totalItems} ${itemLabel}`
        )}
      </div>

      {/* Controles de página */}
      <div className="flex items-center gap-1.5">
        {/* Botão Anterior */}
        <button
          type="button"
          aria-label="Página anterior"
          disabled={currentPage <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-border bg-surface text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-white"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 3L4.5 6l3 3"
              stroke="#5C5E63"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Páginas Dinâmicas */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            if (totalPages <= 5) return true;
            if (p === 1 || p === totalPages) return true;
            if (Math.abs(p - currentPage) <= 1) return true;
            return false;
          })
          .map((p, idx, arr) => {
            const prevPage = arr[idx - 1];
            const showEllipsis = prevPage && p - prevPage > 1;
            return (
              <React.Fragment key={p}>
                {showEllipsis && (
                  <span className="font-sans text-label text-muted px-0.5">...</span>
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "flex h-6 w-6 cursor-pointer items-center justify-center rounded font-sans text-label transition-colors",
                    currentPage === p
                      ? "border border-ink bg-ink font-semibold text-white"
                      : "border border-border bg-white text-ink hover:bg-surface"
                  )}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

        {/* Botão Próximo */}
        <button
          type="button"
          aria-label="Próxima página"
          disabled={currentPage >= totalPages || loading}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-border bg-white text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-surface"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 3L7.5 6l-3 3"
              stroke="#18191B"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
