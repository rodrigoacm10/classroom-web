"use client";

import { useEffect } from "react";

export function evidencePhotoUrl(url: string | null | undefined): string | null {
  if (!url || !url.startsWith("https://")) return null;
  return url;
}

export function EvidencePhotoDialog({
  url,
  studentName,
  onClose,
}: {
  url: string | null;
  studentName?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!url) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [url, onClose]);

  if (!url) return null;

  const who = studentName?.trim() || "aluno";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto de evidência de ${who}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs"
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
          <div className="min-w-0 text-left">
            <p className="font-sans text-caption uppercase tracking-caps text-muted">
              Foto de evidência
            </p>
            <p className="truncate font-sans text-body font-semibold text-ink">{who}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 font-sans text-label font-semibold text-ink hover:bg-surface"
          >
            Fechar
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- a URL vem do storage e o host não é fixo */}
        <img
          src={url}
          alt={`Foto de evidência enviada por ${who}`}
          className="max-h-[75vh] w-full bg-ink object-contain"
        />
      </div>
    </div>
  );
}
