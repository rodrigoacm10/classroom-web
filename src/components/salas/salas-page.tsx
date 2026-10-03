"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  listRooms,
  deleteRoom,
  type Room,
} from "@/services/rooms";

// ─── Icons ────────────────────────────────────────────────────────────────────

function MapPinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M10 2a6 6 0 0 1 6 6c0 4.5-6 10-6 10S4 12.5 4 8a6 6 0 0 1 6-6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function RadiusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 2" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="1" y="4" width="8" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1H11a1.5 1.5 0 0 1 1.5 1.5V8a1.5 1.5 0 0 1-1.5 1.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M6 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 1H13m0 0v4.5M13 1 7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DotsVerticalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="8" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function PencilIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M10 2l2 2-7.5 7.5H2.5v-2L10 2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M2.5 3.5h9M5 3.5V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M11.5 3.5l-.8 8.4A1.5 1.5 0 0 1 9.2 13.5H4.8a1.5 1.5 0 0 1-1.5-1.6L2.5 3.5M5.5 6.5v4M8.5 6.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCoord(value: number, type: "lat" | "lng"): string {
  if (isNaN(value)) return "0°00.000'";
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = ((abs - deg) * 60).toFixed(3);
  const dir = type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "L" : "O";
  return `${deg}°${min}'${dir}`;
}

function getRadiusLabel(meters: number): { label: string; color: string; bg: string } {
  if (meters <= 30) return { label: "Preciso", color: "var(--color-success)", bg: "var(--color-success-surface)" };
  if (meters <= 75) return { label: "Padrão", color: "var(--color-ink)", bg: "var(--color-surface)" };
  return { label: "Amplo", color: "var(--color-warn)", bg: "#FEF3C7" };
}

function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

const ROOM_COLORS = [
  { bg: "#E9F4FF", fg: "#1A6DC2" },
  { bg: "#FFF0E0", fg: "#B05A00" },
  { bg: "#F0EAF8", fg: "#6B38A8" },
  { bg: "#E7F2EB", fg: "#1E7A44" },
  { bg: "#FFF4CC", fg: "#896300" },
  { bg: "#FCE8E8", fg: "#C42B1C" },
  { bg: "#E0F7FA", fg: "#00696F" },
  { bg: "#F3E5F5", fg: "#7B1FA2" },
];

function RoomAvatar({ name }: { name: string }) {
  const clean = name.trim();
  const idx = clean ? clean.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % ROOM_COLORS.length : 0;
  const { bg, fg } = ROOM_COLORS[idx];
  const letter = clean ? clean.charAt(0).toUpperCase() : "?";
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-heading"
      style={{ background: bg, color: fg }}
    >
      {letter}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copiar coordenadas"
      className="flex items-center gap-1 rounded px-1.5 py-0.5 text-caption font-medium transition-colors hover:bg-border cursor-pointer"
      style={{ color: "var(--color-muted)" }}
    >
      <CopyIcon />
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

// ─── Modal de Confirmação de Exclusão ─────────────────────────────────────────

function DeleteRoomModal({
  room,
  onClose,
  onDeleted,
}: {
  room: Room;
  onClose: () => void;
  onDeleted: (roomId: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      setSubmitting(true);
      setError(null);
      await deleteRoom(room.id);
      onDeleted(room.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao excluir a sala. Verifique se você possui papel de Administrador (ADMIN)."
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-2xl">
        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-surface text-danger mb-4">
            <TrashIcon size={22} />
          </div>

          <h2 className="text-title font-bold text-ink tracking-tight mb-2">
            Excluir sala física?
          </h2>
          <p className="text-body text-muted leading-relaxed mb-4">
            Tem certeza que deseja remover permanentemente o espaço{" "}
            <strong className="text-ink font-semibold">&ldquo;{room.name}&rdquo;</strong>?
            Esta ação não pode ser desfeita e qualquer turma vinculada perderá este ponto de presença padrão.
          </p>

          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger-surface p-3 text-caption font-medium text-danger mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="flex h-10 items-center rounded-lg border border-border px-4 text-label font-medium text-muted transition-colors hover:border-ink/30 hover:text-ink cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleDelete}
              className="flex h-10 items-center gap-2 rounded-lg bg-danger px-5 text-label font-bold text-white transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {submitting && (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>{submitting ? "Excluindo..." : "Excluir permanentemente"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Room Card com Menu de Opções ─────────────────────────────────────────────

function RoomCard({
  room,
  onDelete,
}: {
  room: Room;
  onDelete: (room: Room) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const radiusInfo = getRadiusLabel(room.tolerance_radius_meters);
  const mapsUrl = getGoogleMapsUrl(room.latitude, room.longitude);
  const coordText = `${room.latitude}, ${room.longitude}`;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="group relative flex flex-col gap-0 rounded-2xl border border-border bg-paper overflow-visible transition-shadow hover:shadow-md hover:shadow-border/60">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <RoomAvatar name={room.name} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-bold text-ink text-heading leading-heading tracking-tight truncate">
              {room.name}
            </span>
            <span className="text-label text-muted truncate font-medium">
              Criada em {formatDate(room.created_at)}
            </span>
          </div>
        </div>

        {/* Lado direito: Badge de raio e Botão de Opções */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-bold tracking-caps uppercase"
            style={{ background: radiusInfo.bg, color: radiusInfo.color }}
          >
            <RadiusIcon size={12} />
            {radiusInfo.label}
          </span>

          {/* Menu Dropdown de Opções */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={`Opções da sala ${room.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-ink/40 hover:bg-surface hover:text-ink cursor-pointer"
            >
              <DotsVerticalIcon size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9.5 z-40 w-44 overflow-hidden rounded-xl border border-border bg-paper p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <Link
                  href={`/dashboard/salas/${room.id}/editar`}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-ink transition-colors hover:bg-surface cursor-pointer"
                >
                  <PencilIcon size={14} />
                  <span>Editar sala</span>
                </Link>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(room);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-danger transition-colors hover:bg-danger-surface cursor-pointer"
                >
                  <TrashIcon size={14} />
                  <span>Excluir sala</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-6" />

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-0 divide-x divide-border px-0">
        {/* Radius metric */}
        <div className="flex flex-col gap-0.5 px-6 py-4">
          <span className="text-caption font-bold tracking-caps uppercase text-muted">
            RAIO DE PRESENÇA
          </span>
          <span className="font-black text-ink font-mono text-title leading-title tracking-code">
            {room.tolerance_radius_meters}
            <span className="ml-1 text-body font-semibold text-muted">m</span>
          </span>
        </div>

        {/* Location metric */}
        <div className="flex flex-col gap-0.5 px-6 py-4">
          <span className="text-caption font-bold tracking-caps uppercase text-muted">
            LOCALIZAÇÃO
          </span>
          <span className="font-semibold text-ink text-label leading-body font-mono">
            {formatCoord(room.latitude, "lat")}
          </span>
          <span className="font-semibold text-ink text-label leading-body font-mono">
            {formatCoord(room.longitude, "lng")}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-6" />

      {/* Footer actions */}
      <div className="flex items-center justify-between px-6 py-3">
        <CopyButton text={coordText} />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-label font-semibold text-muted border border-border transition-colors hover:bg-surface hover:text-ink"
        >
          <ExternalLinkIcon />
          Ver no Maps
        </a>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-paper overflow-hidden animate-pulse">
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-border/60" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4.5 w-40 rounded bg-border/60" />
            <div className="h-3.5 w-28 rounded bg-border/40" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-full bg-border/40" />
      </div>
      <div className="h-px bg-border mx-6" />
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-border/40" />
          <div className="h-8 w-16 rounded bg-border/60" />
        </div>
        <div className="px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-border/40" />
          <div className="h-4 w-32 rounded bg-border/60" />
          <div className="h-4 w-28 rounded bg-border/40" />
        </div>
      </div>
      <div className="h-px bg-border mx-6" />
      <div className="flex items-center justify-between px-6 py-3">
        <div className="h-5 w-16 rounded bg-border/40" />
        <div className="h-8 w-28 rounded-md bg-border/40" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--color-surface)" }}
      >
        <MapPinIcon size={28} />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-bold text-heading text-ink">Nenhuma sala cadastrada</span>
        <span className="text-body text-muted max-w-xs">
          As salas definem o ponto GPS onde os alunos devem estar para confirmar presença.
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SalasPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal de exclusão
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    listRooms()
      .then((data) => {
        if (isMounted) {
          setRooms(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Erro ao carregar salas.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Limpa toast após 4 segundos
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  function handleRoomDeleted(deletedId: string) {
    const deletedName = rooms.find((r) => r.id === deletedId)?.name ?? "Sala";
    setRooms((prev) => prev.filter((r) => r.id !== deletedId));
    setToastMessage({ text: `Sala "${deletedName}" excluída permanentemente.`, type: "success" });
  }

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRooms = rooms.length;
  const avgRadius =
    totalRooms > 0
      ? Math.round(rooms.reduce((acc, r) => acc + r.tolerance_radius_meters, 0) / totalRooms)
      : 0;

  return (
    <div className="flex flex-1 flex-col bg-paper overflow-y-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-paper px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              toastMessage.type === "success" ? "bg-success" : "bg-danger"
            }`}
          />
          <span className="text-[13px] font-medium text-ink">{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-muted hover:text-ink cursor-pointer ml-2"
          >
            <CloseIcon size={13} />
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="flex shrink-0 items-start justify-between border-b border-border px-9 py-7">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-label font-bold tracking-caps uppercase text-muted">
              ESPAÇOS FÍSICOS
            </span>
          </div>
          <h1
            className="font-black tracking-tight text-ink text-display leading-display"
          >
            Salas
          </h1>
          <p className="text-body text-muted">
            Gerencie os espaços físicos e seus raios de presença válida.
          </p>
        </div>

        {/* CTA: Nova sala */}
        <Link
          id="btn-nova-sala"
          href="/dashboard/salas/nova"
          className="flex shrink-0 items-center gap-2 rounded-xl px-5 h-11 font-bold text-label transition-opacity hover:opacity-80"
          style={{ background: "var(--color-ink)", color: "var(--color-on-ink)" }}
        >
          <PlusIcon />
          Nova sala
        </Link>
      </div>

      {/* Stats strip */}
      {!loading && !error && totalRooms > 0 && (
        <div className="flex shrink-0 divide-x divide-border border-b border-border">
          <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
            <span className="text-caption font-bold tracking-caps uppercase text-muted">
              TOTAL DE SALAS
            </span>
            <span
              className="font-black text-ink font-mono text-title leading-title"
            >
              {String(totalRooms).padStart(2, "0")}
            </span>
            <span className="text-label text-muted">espaços cadastrados</span>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
            <span className="text-caption font-bold tracking-caps uppercase text-muted">
              RAIO MÉDIO
            </span>
            <span
              className="font-black text-ink font-mono text-title leading-title"
            >
              {avgRadius}
              <span className="ml-1 text-body font-semibold text-muted">m</span>
            </span>
            <span className="text-label text-muted">de presença</span>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
            <span className="text-caption font-bold tracking-caps uppercase text-muted">
              PRECISAS
            </span>
            <span
              className="font-black font-mono text-title leading-title text-success"
            >
              {String(rooms.filter((r) => r.tolerance_radius_meters <= 30).length).padStart(2, "0")}
            </span>
            <span className="text-label text-muted">raio ≤ 30 m</span>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 px-9 py-5">
            <span className="text-caption font-bold tracking-caps uppercase text-muted">
              AMPLAS
            </span>
            <span
              className="font-black font-mono text-title leading-title text-warn"
            >
              {String(rooms.filter((r) => r.tolerance_radius_meters > 75).length).padStart(2, "0")}
            </span>
            <span className="text-label text-muted">raio &gt; 75 m</span>
          </div>
        </div>
      )}

      {/* Search bar */}
      {!loading && !error && totalRooms > 0 && (
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-9 py-4">
          <div className="relative flex-1 max-w-sm">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <input
              id="salas-search"
              type="text"
              placeholder="Buscar sala…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-paper pl-9 pr-3 text-body text-ink placeholder:text-muted focus:outline-none focus:border-control-border transition-colors"
            />
          </div>
          {search && (
            <span className="text-label text-muted">
              {filteredRooms.length} resultado{filteredRooms.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-9 py-7">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-danger bg-danger-surface px-5 py-4 text-body text-ink mb-6">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && totalRooms === 0 && <EmptyState />}

        {/* No search results */}
        {!loading && !error && totalRooms > 0 && filteredRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <span className="font-bold text-heading text-ink">Nenhuma sala encontrada</span>
            <span className="text-body text-muted">
              Tente buscar por outro nome.
            </span>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-1 text-label font-semibold text-ink underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity cursor-pointer"
            >
              Limpar busca
            </button>
          </div>
        )}

        {/* Room cards grid */}
        {!loading && !error && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onDelete={(r) => setDeletingRoom(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Exclusão */}
      {deletingRoom && (
        <DeleteRoomModal
          room={deletingRoom}
          onClose={() => setDeletingRoom(null)}
          onDeleted={handleRoomDeleted}
        />
      )}
    </div>
  );
}
