import React, { useMemo } from "react";
import { UsersIcon, MapPinIcon } from "@/components/icons";
import type { Room } from "@/services/rooms";
import type { StudentItem } from "@/services/tenants";
import type { UserProfileResponse } from "@/services/user";
import type { AvatarStyle } from "../../types";

export const AVATAR_PALETTE: AvatarStyle[] = [
  { bg: "#EBF3FE", text: "#1D64B4", border: "#D4E5FB" },
  { bg: "#FEF4E8", text: "#A45500", border: "#FCE4CA" },
  { bg: "#F3EDFB", text: "#6735A4", border: "#E5D7F8" },
  { bg: "#EBF6EE", text: "#1B733F", border: "#D2EDDA" },
  { bg: "#FDF0F0", text: "#B72314", border: "#FACCCC" },
  { bg: "#E6F7F8", text: "#006B70", border: "#C4EFF1" },
];

/**
 * Retorna as cores personalizadas do avatar com base no nome da turma ou disciplina.
 */
export function getAvatarStyle(name: string): AvatarStyle {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

export interface NovaTurmaPreviewProps {
  name: string;
  disciplineName: string;
  currentUser: UserProfileResponse | null;
  selectedRoom: Room | null;
  selectedStudents: StudentItem[];
  submitting: boolean;
}

export function NovaTurmaPreview({
  name,
  disciplineName,
  currentUser,
  selectedRoom,
  selectedStudents,
  submitting,
}: NovaTurmaPreviewProps) {
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
            Cards & Tabela
          </span>
        </div>

        {/* Class Preview Card */}
        <div className="p-6 space-y-6">
          {/* Main Card Header */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-heading border shadow-2xs"
              style={{
                backgroundColor: avatar.bg,
                color: avatar.text,
                borderColor: avatar.border,
              }}
            >
              {(name || disciplineName || "TR").substring(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <span className="inline-block rounded-full bg-success-surface px-2 py-0.5 text-[11px] font-bold text-success mb-1">
                TURMA ATIVA
              </span>
              <h3 className="text-title font-bold text-ink leading-tight truncate">
                {name || (
                  <span className="text-muted/60 italic font-normal">
                    Nome da Turma
                  </span>
                )}
              </h3>
              <p className="text-body text-muted truncate mt-0.5">
                {disciplineName || (
                  <span className="text-muted/60 italic">
                    Disciplina a ser definida
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Docente */}
            <div className="rounded-xl border border-border bg-surface/50 p-3.5">
              <span className="text-[11px] font-bold uppercase tracking-caps text-muted block mb-1">
                Docente Responsável
              </span>
              <span className="text-label font-bold text-ink block truncate">
                {currentUser?.name ?? "Professor Conectado"}
              </span>
              <span className="text-[11px] text-muted">Você (Conectado)</span>
            </div>

            {/* Sala Física */}
            <div className="rounded-xl border border-border bg-surface/50 p-3.5">
              <span className="text-[11px] font-bold uppercase tracking-caps text-muted block mb-1">
                Espaço Físico
              </span>
              <span className="text-label font-bold text-ink block truncate">
                {selectedRoom ? selectedRoom.name : "Nenhuma sala"}
              </span>
              <span className="text-[11px] text-muted">
                {selectedRoom
                  ? `Raio de ${selectedRoom.tolerance_radius_meters}m`
                  : "Sem geofence"}
              </span>
            </div>
          </div>

          {/* Enrolled Students Summary */}
          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-label font-bold text-ink">
                <UsersIcon size={15} />
                <span>Alunos Matriculados</span>
              </div>
              <span className="font-mono text-heading font-bold text-ink">
                {selectedStudents.length}
              </span>
            </div>

            {selectedStudents.length > 0 ? (
              <div className="space-y-2">
                <div className="flex -space-x-2 overflow-hidden py-1">
                  {selectedStudents.slice(0, 7).map((s, idx) => (
                    <div
                      key={s.id}
                      title={s.name}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-ink text-white font-mono text-caption font-bold"
                      style={{ zIndex: 10 - idx }}
                    >
                      {(s.name || "A").charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {selectedStudents.length > 7 && (
                    <div
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface text-ink font-mono text-caption font-bold"
                      style={{ zIndex: 1 }}
                    >
                      +{selectedStudents.length - 7}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-muted truncate">
                  {selectedStudents
                    .slice(0, 3)
                    .map((s) => s.name)
                    .join(", ")}
                  {selectedStudents.length > 3
                    ? ` e mais ${selectedStudents.length - 3} alunos`
                    : ""}
                </p>
              </div>
            ) : (
              <p className="text-caption text-muted italic">
                Adicione alunos para habilitar presenças na chamada.
              </p>
            )}
          </div>

          {/* Geofence verification note */}
          <div className="rounded-xl bg-accent-surface/50 border border-accent/40 p-4">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-accent">
                <MapPinIcon size={16} />
              </div>
              <div className="text-caption text-ink">
                <strong className="font-semibold block mb-0.5">
                  Validação por Geofence Ativa
                </strong>
                Os alunos só poderão assinar presença quando estiverem
                fisicamente dentro do raio de{" "}
                <strong>
                  {selectedRoom
                    ? `${selectedRoom.tolerance_radius_meters} metros`
                    : "50 metros"}
                </strong>{" "}
                da sala.
              </div>
            </div>
          </div>

          {/* Primary Button Preview */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-lg bg-ink text-white font-bold text-label hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting
                ? "Processando cadastro..."
                : "Confirmar e criar turma"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
