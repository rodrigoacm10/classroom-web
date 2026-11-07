import React from "react";
import Link from "next/link";
import {
  MapPinIcon,
  CheckIcon,
  PlusIcon,
  ExternalLinkIcon,
} from "@/components/icons";
import type { Room } from "@/services/rooms";
import type { RadiusInfo } from "../../types";

export function getRadiusLabel(meters: number): RadiusInfo {
  if (meters <= 30) {
    return {
      label: `Preciso · ${meters}m`,
      color: "var(--color-success)",
      bg: "var(--color-success-surface)",
    };
  }
  if (meters <= 60) {
    return {
      label: `Padrão · ${meters}m`,
      color: "var(--color-ink)",
      bg: "var(--color-surface)",
    };
  }
  return {
    label: `Amplo · ${meters}m`,
    color: "var(--color-warn)",
    bg: "#FEF3C7",
  };
}

export interface NovaTurmaSalaProps {
  rooms: Room[];
  loadingRooms: boolean;
  selectedRoomId: string;
  onSelectRoomId: (id: string) => void;
}

export function NovaTurmaSala({
  rooms,
  loadingRooms,
  selectedRoomId,
  onSelectRoomId,
}: NovaTurmaSalaProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-2xs">
      <div className="flex items-start justify-between border-b border-border pb-4 mb-6">
        <div>
          <span className="text-caption font-bold uppercase tracking-caps text-muted block">
            Etapa 02
          </span>
          <h2 className="text-heading font-bold text-ink">
            Vínculo de Sala Física (Geofence)
          </h2>
          <p className="text-caption text-muted mt-0.5">
            A presença dos alunos será validada pelo raio geográfico da sala selecionada.
          </p>
        </div>

        <Link
          href="/dashboard/salas/nova"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-caption font-semibold text-ink hover:bg-surface transition-colors"
          title="Abrir cadastro de salas em nova aba"
        >
          <PlusIcon size={12} />
          <span>Nova sala</span>
          <ExternalLinkIcon size={11} />
        </Link>
      </div>

      {/* Rooms Selection Grid */}
      {loadingRooms ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-border bg-surface/50 animate-pulse"
            />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center bg-surface/30">
          <p className="text-body font-semibold text-ink">
            Nenhuma sala física cadastrada
          </p>
          <p className="text-caption text-muted mt-1">
            É necessário ter pelo menos uma sala física cadastrada na instituição para definir o geofence da turma.
          </p>
          <Link
            href="/dashboard/salas/nova"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-caption font-bold text-white hover:opacity-90 transition-opacity"
          >
            <PlusIcon size={12} />
            <span>Cadastrar primeira sala</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const radius = getRadiusLabel(room.tolerance_radius_meters);

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoomId(room.id)}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "border-accent bg-accent-surface/20 ring-1 ring-accent"
                    : "border-border bg-white hover:border-control-border hover:bg-surface/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-ink text-accent"
                          : "bg-surface text-muted"
                      }`}
                    >
                      <MapPinIcon size={15} />
                    </span>
                    <span className="text-body font-bold text-ink leading-tight">
                      {room.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                      <CheckIcon size={11} />
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-caption text-muted pt-2 border-t border-border/60">
                  <span className="truncate font-mono text-[11px]">
                    {room.latitude.toFixed(4)}, {room.longitude.toFixed(4)}
                  </span>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: radius.bg, color: radius.color }}
                  >
                    {radius.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
