import React from "react";
import type { SubjectClassItem, Room } from "@/lib/api";
import {
  ClassesIcon,
  LocationIcon,
  ClockIcon,
  StudentsIcon,
  LocationPinIcon,
  RadiusIcon,
} from "@/components/icons";
import type { Duration } from "../../types";
import { PreviewSkeleton } from "./nova-chamada-skeletons";

export interface NovaChamadaPreviewProps {
  loading: boolean;
  selectedClass: SubjectClassItem | null;
  selectedRoom: Room | null;
  localLabel: string;
  studentCount: number;
  attendanceRatePercent: number;
  studentsAtRiskCount: number;
  reportLoading: boolean;
  duration: Duration;
  setTurmaDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NovaChamadaPreview({
  loading,
  selectedClass,
  selectedRoom,
  localLabel,
  studentCount,
  attendanceRatePercent,
  studentsAtRiskCount,
  reportLoading,
  duration,
  setTurmaDropdownOpen,
}: NovaChamadaPreviewProps) {
  return (
    <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-surface p-5">
      {loading ? (
        <PreviewSkeleton />
      ) : !selectedClass ? (
        /* Estado neutro sem turma selecionada */
        <div className="flex flex-1 flex-col items-center justify-center p-10 text-center bg-paper rounded-xl border border-dashed border-border min-h-[400px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border mb-4 text-muted">
            <ClassesIcon className="h-6 w-6 text-muted" />
          </div>
          <h3 className="text-body font-bold text-ink">Nenhuma turma selecionada</h3>
          <p className="text-caption/body text-muted mt-1.5 max-w-sm">
            Selecione uma turma no formulário ao lado para visualizar a prévia em tempo real com estatísticas de matrículas, frequência média e o mapa com geofence da sala.
          </p>
          <button
            type="button"
            onClick={() => setTurmaDropdownOpen(true)}
            className="mt-5 inline-flex h-9 items-center justify-center rounded-md border border-ink/20 bg-surface px-4 text-[13px] font-medium text-ink transition-colors hover:border-ink/50 hover:bg-paper cursor-pointer"
          >
            Selecionar turma
          </button>
        </div>
      ) : (
        <>
          {/* Header "Prévia em tempo real" */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
              Prévia em tempo real
            </span>
          </div>

          {/* Turma card */}
          <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-paper">
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 pb-3.5 pt-4">
              <div className="flex flex-col gap-[3px]">
                <span className="text-[16px] font-bold leading-[120%] tracking-tight text-ink">
                  {selectedClass.discipline_name}
                </span>
                <span className="text-label/caption text-muted">
                  {selectedClass.name} · {localLabel}
                  {/*
                    Nota: Informações de turno e horário (ex: "Noturno · 19h") não possuem colunas dedicadas
                    no modelo SubjectClass da API, portanto são mantidas aqui como referência visual.
                  */}
                  {" · Noturno · 19h"}
                </span>
              </div>
              <div className="shrink-0 rounded-full bg-success-surface px-2.5 py-1">
                <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.04em] text-success">
                  {selectedClass.active ? "Ativa" : "Inativa"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-5 py-3.5">
              {/* Stats row */}
              <div className="flex">
                <div className="flex flex-1 flex-col gap-0.5 pr-4">
                  <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">
                    Alunos
                  </span>
                  <span className="text-title font-bold leading-[100%] tracking-[-0.03em] text-ink">
                    {studentCount}
                  </span>
                  <span className="text-[11px] leading-[14px] text-on-ink-muted">
                    matrículas ativas
                  </span>
                </div>
                <div className="w-px shrink-0 bg-border" />
                <div className="flex flex-1 flex-col gap-0.5 px-4">
                  <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">
                    Freq. Média
                  </span>
                  <span className="text-title font-bold leading-[100%] tracking-[-0.03em] text-success">
                    {attendanceRatePercent}%
                  </span>
                  <span className="text-[11px] leading-[14px] text-on-ink-muted">
                    últimas 30 aulas
                  </span>
                </div>
                <div className="w-px shrink-0 bg-border" />
                <div className="flex flex-1 flex-col gap-0.5 pl-4">
                  <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">
                    Em risco
                  </span>
                  {reportLoading ? (
                    <div className="h-7 w-8 rounded bg-border animate-pulse my-0.5" />
                  ) : (
                    <span className="text-title font-bold leading-[100%] tracking-[-0.03em] text-danger">
                      {studentsAtRiskCount}
                    </span>
                  )}
                  <span className="text-[11px] leading-[14px] text-on-ink-muted">
                    abaixo de 75%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-caption/caption text-muted">Frequência geral</span>
                  <span className="text-caption/caption font-bold text-success">
                    {attendanceRatePercent}%
                  </span>
                </div>
                <div className="h-[5px] overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-300"
                    style={{
                      width: `${Math.min(Math.max(attendanceRatePercent, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom cards row */}
          <div className="flex min-h-0 flex-1 gap-3.5">
            {/* Geofence map card */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-paper">
              {/* Map placeholder */}
              <div
                className="relative flex flex-1 items-center justify-center overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #eaeef2 0%, #dce3ea 50%, #d0d9e3 100%)",
                }}
              >
                <div className="absolute inset-0" style={{ background: "#4285F41F" }} />
                <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFC4008C] bg-[#FFC40026]" />
                  <div
                    className="relative h-[22px] w-[22px] shrink-0 rounded-tl-full rounded-tr-full rounded-br-full bg-accent border-[3px] border-solid border-ink origin-center shadow-[0px_2px_8px_#00000040]"
                    style={{ rotate: "-45deg" }}
                  />
                </div>
              </div>

              {/* Map info */}
              <div className="flex shrink-0 flex-col gap-2 px-4 py-3.5">
                <span className="text-[14px] font-bold leading-[18px] text-ink">
                  {localLabel}
                </span>
                <div className="flex flex-col gap-[5px]">
                  <div className="flex items-center gap-[7px]">
                    <LocationPinIcon />
                    <span className="text-caption/caption text-muted">
                      {selectedRoom
                        ? `${selectedRoom.latitude.toFixed(4)}, ${selectedRoom.longitude.toFixed(4)}`
                        : "-23.5505, -46.6333"}
                    </span>
                  </div>
                  <div className="flex items-center gap-[7px]">
                    <RadiusIcon />
                    <span className="text-caption/caption text-muted">
                      Raio: {selectedRoom?.tolerance_radius_meters ?? 80} m
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-[7px] rounded-md bg-surface px-2.5 py-[7px]">
                  <div className="h-[7px] w-[7px] shrink-0 rounded-full bg-success" />
                  <span className="text-[11px] leading-[14px] text-muted">
                    Geofence ativo
                  </span>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="flex flex-1 flex-col rounded-xl bg-ink px-5 py-[18px]">
              <span className="shrink-0 pb-3.5 text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-on-ink-subtle">
                Resumo
              </span>

              <div className="flex flex-col">
                {/* Turma */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <ClassesIcon className="h-3.5 w-3.5 text-on-ink-muted" />
                    <span className="text-label/caption text-on-ink-muted">Turma</span>
                  </div>
                  <span className="text-label/caption font-semibold text-on-ink">
                    {selectedClass.discipline_name.slice(0, 3).toUpperCase()} ·{" "}
                    {selectedClass.name}
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />

                {/* Local */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <LocationIcon />
                    <span className="text-label/caption text-on-ink-muted">Local</span>
                  </div>
                  <span className="text-label/caption font-semibold text-on-ink">
                    {localLabel}
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />

                {/* Duração */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <ClockIcon />
                    <span className="text-label/caption text-on-ink-muted">Duração</span>
                  </div>
                  <span className="text-label/caption font-bold text-accent">
                    {duration} min
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />

                {/* Alunos */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <StudentsIcon />
                    <span className="text-label/caption text-on-ink-muted">Alunos</span>
                  </div>
                  <span className="text-label/caption font-semibold text-on-ink">
                    {studentCount} alertados
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />
              </div>

              {/* Timer preview */}
              <div className="flex flex-1 flex-col justify-end pt-4">
                <span className="pb-2 text-[10px] font-bold uppercase leading-3 tracking-[0.1em] text-muted">
                  Expira em
                </span>
                <span className="font-mono text-display font-bold leading-[100%] tracking-[-0.04em] text-on-ink">
                  {String(duration).padStart(2, "0")}:00
                </span>
                <div className="mb-1.5 mt-2.5 h-1 overflow-hidden rounded-full bg-on-ink-border">
                  <div className="h-full w-full rounded-full bg-accent" />
                </div>
                <span className="text-[11px] leading-[14px] text-muted">
                  Contador inicia após abertura
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
