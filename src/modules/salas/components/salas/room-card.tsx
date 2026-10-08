"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  RadiusIcon,
  CopyIcon,
  ExternalLinkIcon,
  DotsVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons";
import {
  formatDate,
  formatCoord,
  getRadiusLabel,
  getGoogleMapsUrl,
  getRoomAvatarColor,
} from "@/lib/utils";
import type { Room } from "@/services/rooms";

export function RoomAvatar({ name }: { name: string }) {
  const { bg, fg } = getRoomAvatarColor(name);
  const letter = name.trim() ? name.trim().charAt(0).toUpperCase() : "?";
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-heading"
      style={{ background: bg, color: fg }}
    >
      {letter}
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
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

export interface RoomCardProps {
  room: Room;
  onDelete: (room: Room) => void;
}

export function RoomCard({ room, onDelete }: RoomCardProps) {
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
