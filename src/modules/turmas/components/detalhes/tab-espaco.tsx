"use client";

import React from "react";
import Link from "next/link";
import { MapPinIcon } from "@/components/icons";
import type { Room } from "@/services/rooms";
import type { SubjectClassItem } from "@/services/subject-classes";

export interface TabEspacoProps {
  turma: SubjectClassItem;
  room: Room | null;
}

export function TabEspaco({ turma, room }: TabEspacoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-xs space-y-6">
        <div className="border-b border-border pb-4">
          <span className="text-caption font-bold uppercase tracking-caps text-muted block">
            Infraestrutura de Presença
          </span>
          <h3 className="text-heading font-bold text-ink">
            Espaço Físico Vinculado
          </h3>
          <p className="text-caption text-muted mt-0.5">
            Localização WGS84 para a cerca geográfica (geofencing) obrigatória.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-accent/40 bg-accent-surface/20 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-accent">
                <MapPinIcon size={18} />
              </span>
              <div>
                <span className="text-heading font-bold text-ink block">
                  {room?.name ?? turma.room_name ?? "Sala não definida"}
                </span>
                <span className="text-caption text-muted">
                  Raio de tolerância: {room?.tolerance_radius_meters ?? 50} metros ao redor do ponto central
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-2 text-label text-ink">
            <div className="flex justify-between border-b border-border/70 pb-2">
              <span className="text-muted">Latitude:</span>
              <span className="font-mono font-semibold">
                {room ? `${room.latitude.toFixed(4)}°` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/70 pb-2">
              <span className="text-muted">Longitude:</span>
              <span className="font-mono font-semibold">
                {room ? `${room.longitude.toFixed(4)}°` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/70 pb-2">
              <span className="text-muted">Rigor Geográfico:</span>
              <span className="font-semibold text-success">Validação Estrita</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-muted">Status do Geofence:</span>
              <span className="font-bold text-ink">Ativo para todas as chamadas</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Link
              href="/dashboard/salas"
              className="flex-1 rounded-lg border border-border bg-white py-2.5 text-center text-label font-bold text-ink hover:bg-surface transition-colors"
            >
              Gerenciar salas físicas
            </Link>
            <Link
              href={`/dashboard/chamadas/nova?turma=${turma.id}`}
              className="flex-1 rounded-lg bg-ink py-2.5 text-center text-label font-bold text-white hover:opacity-90 transition-opacity"
            >
              Testar chamada agora
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-xs space-y-6">
        <div className="border-b border-border pb-4">
          <span className="text-caption font-bold uppercase tracking-caps text-muted block">
            Regras Pedagógicas
          </span>
          <h3 className="text-heading font-bold text-ink">
            Critérios de Frequência
          </h3>
          <p className="text-caption text-muted mt-0.5">
            Parâmetros de cálculo da frequência institucional desta turma.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4 bg-white">
            <span className="text-caption font-bold uppercase tracking-caps text-muted block mb-1">
              Frequência Mínima Exigida
            </span>
            <span className="font-mono text-[32px] font-bold text-ink block">
              75%
            </span>
            <p className="text-caption text-muted mt-1">
              Alunos com percentual inferior a 75% entram automaticamente na lista de atenção pedagógica.
            </p>
          </div>

          <div className="rounded-xl border border-border p-4 bg-white">
            <span className="text-caption font-bold uppercase tracking-caps text-muted block mb-1">
              Antifraude & Proximidade
            </span>
            <p className="text-caption text-ink leading-relaxed">
              Sessões que detectam coordenadas no limite do raio (± 5 metros da borda) são sinalizadas com indicador de proximidade para auditoria do professor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
