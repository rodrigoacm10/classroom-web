"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ActiveAttendanceSessionResponse } from "@/lib/api";
import { formatRemaining } from "@/lib/utils";

export function LiveCallBanner({ session }: { session: ActiveAttendanceSessionResponse }) {
  const [remaining, setRemaining] = useState(() => formatRemaining(session.expires_at));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(formatRemaining(session.expires_at));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.expires_at]);

  const classTitle = `${session.discipline_name} · ${session.subject_class_name} · ${
    session.room_name ?? "Sem sala"
  }`;

  return (
    <div className="flex w-full items-center justify-between bg-accent px-9 py-4">
      <div className="flex items-center gap-4">
        {/* pulsing dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold tracking-caps uppercase text-ink text-caption/caption">
            Chamada aberta agora
          </span>
          <span className="font-bold text-ink text-[16px] leading-body">
            {classTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-7">
        <div className="flex flex-col">
          <span className="font-semibold tracking-code text-ink text-[22px] leading-7 font-mono">
            {session.day_code}
          </span>
          <span className="font-medium text-ink text-caption/caption">Código do dia</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-ink text-[22px] leading-7 font-mono">
            {session.present_count}/{session.total_students}
          </span>
          <span className="font-medium text-ink text-caption/caption">Presentes</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-ink text-[22px] leading-7 font-mono">
            {remaining}
          </span>
          <span className="font-medium text-ink text-caption/caption">Restantes</span>
        </div>
        <Link
          href={`/turmas/${session.subject_class_id}/chamadas/${session.session_id}`}
          className="flex h-9 items-center rounded-lg bg-ink px-[14px] font-bold text-paper text-label/caption transition-opacity hover:opacity-80"
        >
          Acompanhar
        </Link>
      </div>
    </div>
  );
}

export function NoActiveCallBanner() {
  return (
    <div className="flex w-full items-center justify-between bg-surface border-y border-y-border px-9 py-4">
      <div className="flex items-center gap-4">
        {/* static indicator dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-muted/40" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold tracking-caps uppercase text-muted text-caption/caption">
            Chamada em tempo real
          </span>
          <span className="font-semibold text-ink text-[16px] leading-body">
            Nenhuma chamada em andamento no momento
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-muted text-label/caption hidden md:inline">
          Inicie uma chamada em qualquer turma para acompanhar presenças ao vivo
        </span>
        <Link
          href="/dashboard/chamadas/nova"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-paper px-[14px] font-semibold text-ink text-label/caption transition-colors hover:bg-surface hover:border-control-border"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Iniciar chamada
        </Link>
      </div>
    </div>
  );
}

export function CallBannerSkeleton() {
  return (
    <div className="flex w-full items-center justify-between bg-surface/60 border-y border-y-border px-9 py-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-2.5 w-2.5 rounded-full bg-border" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-28 rounded bg-border" />
          <div className="h-4 w-64 rounded bg-border" />
        </div>
      </div>
      <div className="h-9 w-32 rounded bg-border" />
    </div>
  );
}
