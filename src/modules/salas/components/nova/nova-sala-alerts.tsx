"use client";

import React from "react";
import { GpsIcon } from "@/components/icons";

export interface NovaSalaAlertsProps {
  error: string | null;
  onErrorClose: () => void;
  geoMessage: string | null;
  onGeoMessageClose: () => void;
}

export function NovaSalaAlerts({
  error,
  onErrorClose,
  geoMessage,
  onGeoMessageClose,
}: NovaSalaAlertsProps) {
  return (
    <>
      {/* Mensagem de Erro Superior */}
      {error && (
        <div className="flex shrink-0 items-center justify-between border-b border-danger/20 bg-danger-surface px-10 py-3 text-caption font-medium text-danger animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="font-bold">Falha no cadastro:</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onErrorClose}
            className="cursor-pointer text-caption font-bold text-danger hover:underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Mensagem Informativa de GPS */}
      {geoMessage && (
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-10 py-2.5 text-caption font-medium text-ink animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <GpsIcon className="h-3.5 w-3.5 text-accent" />
            <span>{geoMessage}</span>
          </div>
          <button
            type="button"
            onClick={onGeoMessageClose}
            className="cursor-pointer text-caption text-muted hover:text-ink"
          >
            Fechar
          </button>
        </div>
      )}
    </>
  );
}
