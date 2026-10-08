"use client";

import React from "react";
import {
  CopyIcon,
  ExternalLinkIcon,
  LocationPinIcon,
  RadiusIcon,
} from "@/components/icons";
import { formatCoord, type RadiusLabelInfo } from "@/lib/utils";
import { RoomAvatar } from "../salas/room-card";

export interface NovaSalaPreviewProps {
  name: string;
  latNum: number;
  lngNum: number;
  toleranceRadius: number;
  radiusInfo: RadiusLabelInfo;
  coverageAreaM2: number;
  googleMapsUrl: string | null;
  isLatValid: boolean;
  isLngValid: boolean;
  isFormValid: boolean;
  copied: boolean;
  onCopyCoords: () => void;
}

export function NovaSalaPreview({
  name,
  latNum,
  lngNum,
  toleranceRadius,
  radiusInfo,
  coverageAreaM2,
  googleMapsUrl,
  isLatValid,
  isLngValid,
  isFormValid,
  copied,
  onCopyCoords,
}: NovaSalaPreviewProps) {
  return (
    <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-surface p-5">
      {/* Header "Prévia em tempo real" */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-ping" />
        <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
          Prévia do Espaço em Tempo Real
        </span>
      </div>

      {/* Room Card Preview */}
      <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-paper shadow-xs">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 pb-3.5 pt-4">
          <div className="flex items-center gap-3 min-w-0">
            <RoomAvatar name={name || "Nova Sala"} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[16px] font-bold leading-[120%] tracking-tight text-ink truncate">
                {name.trim() || "Nome da Nova Sala"}
              </span>
              <span className="text-caption text-muted">
                Espaço físico cadastrado · Hoje
              </span>
            </div>
          </div>
          <span
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-bold tracking-caps uppercase"
            style={{ background: radiusInfo.bg, color: radiusInfo.color }}
          >
            <RadiusIcon size={12} />
            {radiusInfo.label}
          </span>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Raio */}
          <div className="flex flex-col gap-0.5 px-6 py-3.5">
            <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">
              RAIO DE PRESENÇA
            </span>
            <span className="font-mono text-title font-black text-ink">
              {toleranceRadius}
              <span className="ml-1 text-body font-semibold text-muted">m</span>
            </span>
            <span className="text-[11px] text-muted">
              Área estimada: ~{coverageAreaM2.toLocaleString("pt-BR")} m²
            </span>
          </div>

          {/* Localização WGS84 */}
          <div className="flex flex-col gap-0.5 px-6 py-3.5">
            <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">
              COORDENADAS GPS
            </span>
            <span className="font-mono text-label font-semibold text-ink">
              {formatCoord(latNum, "lat")}
            </span>
            <span className="font-mono text-label font-semibold text-ink">
              {formatCoord(lngNum, "lng")}
            </span>
          </div>
        </div>

        {/* Card footer actions */}
        <div className="flex items-center justify-between border-t border-border px-6 py-2.5 bg-surface/30">
          <button
            type="button"
            onClick={onCopyCoords}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-caption font-medium text-muted transition-colors hover:bg-border/60 hover:text-ink cursor-pointer"
          >
            <CopyIcon />
            <span>{copied ? "Copiado!" : "Copiar coordenadas"}</span>
          </button>

          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-border bg-paper px-2.5 py-1 text-caption font-semibold text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              <ExternalLinkIcon />
              <span>Ver no Maps</span>
            </a>
          )}
        </div>
      </div>

      {/* Bottom cards row */}
      <div className="flex min-h-0 flex-1 gap-3.5">
        {/* Geofence Map Simulation Card */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-paper shadow-xs">
          {/* Mapa estilizado com visualização de satélite/radar */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden min-h-[220px]"
            style={{
              background: "linear-gradient(135deg, #1c2229 0%, #13181e 50%, #0d1116 100%)",
            }}
          >
            {/* Linhas de grade de radar/geofence */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)",
                backgroundSize: "24px 24px, 48px 48px, 48px 48px",
              }}
            />

            {/* Círculo do Geofence dinâmico baseado no raio selecionado */}
            <div
              className="relative flex items-center justify-center transition-all duration-300"
              style={{
                width: `${Math.min(Math.max(90 + (toleranceRadius / 500) * 150, 90), 240)}px`,
                height: `${Math.min(Math.max(90 + (toleranceRadius / 500) * 150, 90), 240)}px`,
              }}
            >
              {/* Anel externo pulsante com cor de acento */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFC40099] bg-[#FFC4001F] animate-pulse" />

              {/* Anel intermediário translúcido */}
              <div className="absolute inset-4 rounded-full border border-[#FFC40040] bg-[#FFC40010]" />

              {/* Pin central de localização */}
              <div
                className="relative z-10 flex h-7 w-7 items-center justify-center rounded-tl-full rounded-tr-full rounded-br-full bg-accent border-[3px] border-solid border-ink shadow-[0px_4px_12px_rgba(0,0,0,0.5)] origin-center transition-transform hover:scale-110"
                style={{ rotate: "-45deg" }}
              >
                <div className="h-2 w-2 rounded-full bg-ink" />
              </div>

              {/* Badge de metragem central sobre o anel */}
              <div className="absolute -bottom-3 rounded-full bg-ink/90 border border-white/20 px-2 py-0.5 text-[10px] font-mono font-bold text-accent shadow-md">
                Raio: {toleranceRadius}m
              </div>
            </div>

            {/* Indicador de bússola/orientação no canto do mapa */}
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-black/40 border border-white/10 px-2 py-1 text-[10px] font-mono text-white/70 backdrop-blur-xs">
              <span className="font-bold text-accent">N</span>
              <span>0°</span>
            </div>
          </div>

          {/* Informações detalhadas do Geofence abaixo do mapa */}
          <div className="flex shrink-0 flex-col gap-2 p-4 bg-paper">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-ink">
                {name.trim() || "Nova Sala Física"}
              </span>
              <div className="flex items-center gap-1.5 rounded-full bg-success-surface px-2 py-0.5 text-[11px] font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span>Geofence Ativo</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-[12px] text-muted">
              <div className="flex items-center gap-1.5">
                <LocationPinIcon size={13} />
                <span className="font-mono">
                  {isLatValid && isLngValid
                    ? `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`
                    : "Aguardando coordenadas"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <RadiusIcon size={13} />
                <span>
                  Circunferência de presença de {toleranceRadius} metros (~{coverageAreaM2.toLocaleString("pt-BR")} m²)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card Dark (`bg-ink`) */}
        <div className="flex flex-1 flex-col rounded-xl bg-ink px-5 py-[18px] text-on-ink shadow-sm">
          <span className="shrink-0 pb-3 text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-on-ink-subtle">
            Resumo da Sala
          </span>

          <div className="flex flex-col">
            {/* Nome do espaço */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-label text-on-ink-muted">Espaço</span>
              <span className="text-label font-bold text-on-ink max-w-[190px] truncate text-right">
                {name.trim() || "Não definido"}
              </span>
            </div>
            <div className="h-px bg-on-ink-border" />

            {/* Coordenadas */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-label text-on-ink-muted">Ponto Central</span>
              <span className="text-label font-mono font-medium text-on-ink">
                {isLatValid && isLngValid
                  ? `${latNum.toFixed(4)}, ${lngNum.toFixed(4)}`
                  : "—"}
              </span>
            </div>
            <div className="h-px bg-on-ink-border" />

            {/* Raio */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-label text-on-ink-muted">Raio Máximo</span>
              <span className="text-label font-bold text-accent">
                {toleranceRadius} metros
              </span>
            </div>
            <div className="h-px bg-on-ink-border" />

            {/* Área de Cobertura */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-label text-on-ink-muted">Área Coberta</span>
              <span className="text-label font-semibold text-on-ink">
                ~{coverageAreaM2.toLocaleString("pt-BR")} m²
              </span>
            </div>
            <div className="h-px bg-on-ink-border" />

            {/* Classificação */}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-label text-on-ink-muted">Classificação</span>
              <span className="text-label font-semibold text-on-ink">
                {radiusInfo.label}
              </span>
            </div>
            <div className="h-px bg-on-ink-border" />
          </div>

          {/* Status footer da prévia */}
          <div className="flex flex-1 flex-col justify-end pt-4">
            <span className="pb-1 text-[10px] font-bold uppercase leading-3 tracking-[0.1em] text-muted">
              Status da Validação
            </span>
            <span className="text-heading font-bold text-on-ink">
              {isFormValid ? "Pronta para cadastro" : "Aguardando campos obrigatórios"}
            </span>
            <div className="mb-1.5 mt-2.5 h-1 overflow-hidden rounded-full bg-on-ink-border">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFormValid ? "w-full bg-accent" : "w-1/3 bg-warn"
                }`}
              />
            </div>
            <span className="text-[11px] text-muted">
              {isFormValid
                ? "Conexão com API REST /rooms pronta"
                : "Preencha o nome e valide as coordenadas"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
