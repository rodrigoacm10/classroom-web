"use client";

import React, { useMemo } from "react";
import { MapPinIcon, UsersIcon } from "@/components/icons";
import { GeofenceMap } from "@/components/map";
import type { Room } from "@/services/rooms";
import type { UserProfileResponse } from "@/services/user";
import { getAvatarStyle } from "../nova/nova-turma-preview";

export interface EditarTurmaPreviewProps {
  name: string;
  disciplineName: string;
  active: boolean;
  studentCount?: number;
  currentUser: UserProfileResponse | null;
  selectedRoom: Room | null;
  submitting: boolean;
}

export function EditarTurmaPreview({
  name,
  disciplineName,
  active,
  studentCount = 0,
  currentUser,
  selectedRoom,
  submitting,
}: EditarTurmaPreviewProps) {
  const avatar = useMemo(() => {
    return getAvatarStyle(disciplineName || name || "Turma");
  }, [disciplineName, name]);

  return (
    <div className="lg:col-span-5 lg:sticky lg:top-8">
      <div className="rounded-2xl border border-border bg-white shadow-md overflow-hidden">
        {/* Preview Header Banner */}
        <div className="border-b border-border bg-[#FAFAFA] px-5 py-3 flex items-center justify-between">
          <span className="text-caption font-bold uppercase tracking-caps text-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success inline-block animate-pulse" />
            PRÉ-VISUALIZAÇÃO EM TEMPO REAL
          </span>
          <span className="rounded bg-surface border border-border px-2 py-0.5 text-[11px] font-mono text-muted">
            Card da Turma
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Principal da Turma */}
          <div className="rounded-xl border border-border bg-paper p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-extrabold text-[18px] tracking-tight border shadow-xs"
                  style={{
                    backgroundColor: avatar.bg,
                    color: avatar.text,
                    borderColor: avatar.border,
                  }}
                >
                  {(name || "TU").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-ink text-heading leading-tight truncate">
                    {name || "Nome da Turma"}
                  </span>
                  <span className="text-label text-muted truncate">
                    {disciplineName || "Disciplina acadêmica"}
                  </span>
                </div>
              </div>

              {active ? (
                <span className="rounded-full bg-success-surface border border-success/30 px-2.5 py-0.5 text-caption font-semibold text-success shrink-0">
                  Ativa
                </span>
              ) : (
                <span className="rounded-full bg-surface border border-border px-2.5 py-0.5 text-caption font-medium text-muted shrink-0">
                  Inativa
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="rounded-lg border border-border bg-surface/50 p-2.5">
                <span className="text-[11px] uppercase tracking-caps text-muted block">
                  Docente Responsável
                </span>
                <span className="font-medium text-caption text-ink block truncate mt-0.5">
                  {currentUser?.name ?? "Professor Titular"}
                </span>
              </div>

              <div className="rounded-lg border border-border bg-surface/50 p-2.5">
                <span className="text-[11px] uppercase tracking-caps text-muted block flex items-center gap-1">
                  <UsersIcon size={12} />
                  <span>Matrículas</span>
                </span>
                <span className="font-mono text-caption font-bold text-ink block mt-0.5">
                  {studentCount} aluno{studentCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          {/* Sala e Geofence Preview */}
          <div className="space-y-3 text-left">
            <span className="text-caption font-bold uppercase tracking-caps text-muted block">
              Espaço Físico & Geofencing
            </span>

            {selectedRoom ? (
              <div className="rounded-xl border border-border bg-surface/30 p-4 space-y-3">
                <div className="flex items-center gap-2.5 text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-accent">
                    <MapPinIcon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-label block truncate">
                      {selectedRoom.name}
                    </span>
                    <span className="text-caption text-muted block">
                      Raio de presença: {selectedRoom.tolerance_radius_meters ?? 50} metros
                    </span>
                  </div>
                </div>

                <div className="h-44 w-full overflow-hidden rounded-lg border border-border">
                  <GeofenceMap
                    latitude={selectedRoom.latitude}
                    longitude={selectedRoom.longitude}
                    radius={selectedRoom.tolerance_radius_meters ?? 50}
                    interactive={false}
                    className="h-full w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted text-caption">
                Nenhuma sala física selecionada. A turma ficará sem cerca geográfica até a vinculação.
              </div>
            )}
          </div>

          {/* Botão de envio auxiliar */}
          <button
            type="submit"
            form="editar-turma-form"
            disabled={submitting}
            className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-ink text-label font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Atualizando dados…</span>
              </>
            ) : (
              <span>Confirmar & Salvar Alterações</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
