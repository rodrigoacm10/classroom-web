"use client";

import React, { useId } from "react";
import { GpsIcon, InfoIcon, PlusIcon } from "@/components/icons";
import type { CampusPreset } from "../../types";
import type { RadiusLabelInfo } from "@/lib/utils";

export interface NovaSalaFormProps {
  name: string;
  onNameChange: (val: string) => void;
  latStr: string;
  onLatChange: (val: string) => void;
  lngStr: string;
  onLngChange: (val: string) => void;
  toleranceRadius: number;
  onRadiusChange: (val: number) => void;
  submitting: boolean;
  geoLocating: boolean;
  isLatValid: boolean;
  isLngValid: boolean;
  isFormValid: boolean;
  radiusInfo: RadiusLabelInfo;
  onCaptureGps: () => void;
  onCoordPaste: (val: string) => void;
  onSubmit: () => void;
  campusPresets: CampusPreset[];
  radiusPresets: readonly number[];
  nameSuggestions: readonly string[];
}

export function NovaSalaForm({
  name,
  onNameChange,
  latStr,
  onLatChange,
  lngStr,
  onLngChange,
  toleranceRadius,
  onRadiusChange,
  submitting,
  geoLocating,
  isLatValid,
  isLngValid,
  isFormValid,
  radiusInfo,
  onCaptureGps,
  onCoordPaste,
  onSubmit,
  campusPresets,
  radiusPresets,
  nameSuggestions,
}: NovaSalaFormProps) {
  const inputNameId = useId();
  const inputLatId = useId();
  const inputLngId = useId();

  const latNum = parseFloat(latStr.replace(",", "."));
  const lngNum = parseFloat(lngStr.replace(",", "."));

  return (
    <aside className="flex w-[470px] shrink-0 flex-col border-r border-border bg-paper">
      {/* Formulário com rolagem independente */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-9 py-7">
        {/* ── Seção 1 — Identificação ── */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
            1 — Identificação
          </span>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={inputNameId} className="text-label font-medium text-ink">
                Nome da sala ou espaço*
              </label>
              <span className="text-[11px] text-muted">
                {name.length}/255
              </span>
            </div>
            <input
              id={inputNameId}
              type="text"
              autoFocus
              required
              maxLength={255}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ex: Laboratório 204, Auditório Principal"
              className="flex h-[46px] w-full rounded-md border border-border bg-surface px-3.5 text-body text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none"
            />
            <p className="text-caption text-muted">
              Identificador que professores e alunos verão na lista e nas chamadas.
            </p>

            {/* Sugestões rápidas de preenchimento */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-muted">Sugestões:</span>
              {nameSuggestions.slice(0, 3).map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => onNameChange(sug)}
                  className="cursor-pointer rounded-sm border border-border bg-surface px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-ink/40 hover:text-ink"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px shrink-0 bg-border" />

        {/* ── Seção 2 — Coordenadas GPS ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
              2 — Coordenadas GPS (WGS84)
            </span>
            <button
              type="button"
              onClick={onCaptureGps}
              disabled={geoLocating}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
              title="Obter coordenadas GPS pelo navegador"
            >
              {geoLocating ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              ) : (
                <GpsIcon className="h-3 w-3 text-ink" />
              )}
              <span>{geoLocating ? "Obtendo sinal..." : "Capturar GPS atual"}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Latitude */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor={inputLatId} className="text-label font-medium text-ink">
                Latitude*
              </label>
              <input
                id={inputLatId}
                type="text"
                required
                value={latStr}
                onChange={(e) => {
                  onLatChange(e.target.value);
                  onCoordPaste(e.target.value);
                }}
                placeholder="-8.047600"
                className={`flex h-[46px] w-full rounded-md border bg-surface px-3.5 font-mono text-[14px] text-ink transition-colors placeholder:text-muted focus:outline-none ${
                  isLatValid
                    ? "border-border focus:border-ink"
                    : "border-danger focus:border-danger"
                }`}
              />
              <span className="text-[11px] text-muted">De -90.0000 a 90.0000</span>
            </div>

            {/* Longitude */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor={inputLngId} className="text-label font-medium text-ink">
                Longitude*
              </label>
              <input
                id={inputLngId}
                type="text"
                required
                value={lngStr}
                onChange={(e) => {
                  onLngChange(e.target.value);
                  onCoordPaste(e.target.value);
                }}
                placeholder="-34.877000"
                className={`flex h-[46px] w-full rounded-md border bg-surface px-3.5 font-mono text-[14px] text-ink transition-colors placeholder:text-muted focus:outline-none ${
                  isLngValid
                    ? "border-border focus:border-ink"
                    : "border-danger focus:border-danger"
                }`}
              />
              <span className="text-[11px] text-muted">De -180.0000 a 180.0000</span>
            </div>
          </div>

          {/* Presets rápidos de Campus */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-muted">
              Ou escolha um ponto de referência:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {campusPresets.map((p) => {
                const isSelected =
                  Math.abs(latNum - p.lat) < 0.0001 &&
                  Math.abs(lngNum - p.lng) < 0.0001;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      onLatChange(p.lat.toString());
                      onLngChange(p.lng.toString());
                    }}
                    className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                      isSelected
                        ? "border-ink bg-ink text-on-ink"
                        : "border-border bg-surface text-ink hover:border-ink/40 hover:bg-paper"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="h-px shrink-0 bg-border" />

        {/* ── Seção 3 — Raio de Presença ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
              3 — Raio de Presença Válida
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-caps"
              style={{ background: radiusInfo.bg, color: radiusInfo.color }}
            >
              {radiusInfo.label} ({toleranceRadius} m)
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label font-medium text-ink">
              Distância máxima permitida para o aluno*
            </label>

            {/* Botões pill de opções rápidas */}
            <div className="flex items-center gap-2">
              {radiusPresets.map((opt) => {
                const active = toleranceRadius === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onRadiusChange(opt)}
                    className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md text-[13px] font-semibold transition-colors [border-width:1.5px] border-solid ${
                      active
                        ? "border-ink bg-ink text-accent font-bold"
                        : "border-border bg-paper text-ink hover:border-ink/30"
                    }`}
                  >
                    {opt}m
                  </button>
                );
              })}
            </div>

            {/* Slider de ajuste fino */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={toleranceRadius}
                onChange={(e) => onRadiusChange(parseInt(e.target.value, 10))}
                className="h-2 flex-1 cursor-pointer accent-ink"
              />
              <div className="flex h-9 w-20 items-center justify-center rounded-md border border-border bg-surface font-mono text-[13px] font-bold text-ink">
                {toleranceRadius} m
              </div>
            </div>

            <p className="text-caption text-muted">
              {toleranceRadius <= 30
                ? "Raio preciso: ideal para salas de aula convencionais e laboratórios."
                : toleranceRadius <= 75
                  ? "Raio padrão: recomendado para salas maiores, blocos acadêmicos e corredores."
                  : "Raio amplo: recomendado para auditórios, ginásios esportivos ou pátios abertos."}
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA Footer Fixo ── */}
      <div className="flex shrink-0 flex-col gap-2.5 border-t border-border bg-paper px-9 py-5">
        <button
          id="btn-confirmar-sala"
          type="button"
          disabled={submitting || !isFormValid}
          onClick={onSubmit}
          className="flex h-[60px] shrink-0 cursor-pointer items-center gap-3.5 rounded-xl bg-ink px-5 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
            ) : (
              <PlusIcon />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-0.5 text-left">
            <span className="text-body font-bold leading-[115%] tracking-[-0.01em] text-on-ink">
              {submitting ? "Cadastrando sala..." : "Cadastrar sala física"}
            </span>
            <span className="text-[11px] leading-[14px] text-on-ink-subtle">
              {isFormValid
                ? "Clique aqui ou pressione ↵ Enter"
                : "Preencha o nome e coordenadas válidas para habilitar"}
            </span>
          </div>
          {isFormValid && (
            <div className="flex h-[26px] shrink-0 items-center justify-center rounded-sm border border-on-ink-border px-[9px]">
              <span className="font-mono text-caption text-on-ink-subtle">↵</span>
            </div>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5">
          <InfoIcon />
          <span className="text-[11px] leading-[14px] text-on-ink-muted">
            A sala ficará disponível imediatamente para todas as chamadas da instituição
          </span>
        </div>
      </div>
    </aside>
  );
}
