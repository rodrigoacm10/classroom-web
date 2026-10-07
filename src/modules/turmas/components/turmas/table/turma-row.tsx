"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/global";
import { UserIcon, MapPinIcon, RadioLiveIcon } from "@/components/icons";
import { attendanceColor, attendanceBarColor } from "@/lib/utils";
import type { SubjectClassItem } from "@/lib/api";

export interface TurmaRowProps {
  item: SubjectClassItem;
}

export function TurmaRow({ item }: TurmaRowProps) {
  const router = useRouter();
  const attendancePct = Math.round((item.attendance_rate ?? 0) * 100);

  return (
    <div
      onClick={() => router.push(`/dashboard/turmas/${item.id}`)}
      className="group grid grid-cols-12 items-center px-5 py-4 transition-colors hover:bg-surface/60 cursor-pointer"
    >
      {/* Turma / Disciplina */}
      <div className="col-span-12 md:col-span-4 flex items-center gap-3.5 pr-2">
        <Avatar name={item.name || item.discipline_name || ""} />
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold text-ink text-body group-hover:text-accent transition-colors truncate">
            {item.name}
          </span>
          <span className="text-caption text-muted truncate">
            {item.discipline_name}
          </span>
        </div>
      </div>

      {/* Docente */}
      <div className="hidden md:col-span-2 md:flex items-center gap-2 pr-2">
        <UserIcon size={14} />
        <span className="text-body text-ink truncate">
          {item.professor_name ?? "Não atribuído"}
        </span>
      </div>

      {/* Sala Física */}
      <div className="hidden md:col-span-2 md:flex items-center gap-1.5 pr-2">
        <MapPinIcon size={13} />
        <span className="text-body text-ink truncate">
          {item.room_name ? (
            item.room_name
          ) : (
            <span className="text-muted italic text-caption">Sem sala vinculada</span>
          )}
        </span>
      </div>

      {/* Alunos */}
      <div className="col-span-4 md:col-span-1 text-center md:text-left">
        <span className="font-mono text-body font-semibold text-ink">
          {item.student_count}
        </span>
        <span className="block text-[11px] text-muted">alunos</span>
      </div>

      {/* Frequência Média com Mini Bar */}
      <div className="col-span-4 md:col-span-2 pr-3">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`font-mono text-label font-semibold ${attendanceColor(attendancePct)}`}>
            {attendancePct}%
          </span>
          <span className="text-[11px] text-muted">média</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${attendanceBarColor(attendancePct)}`}
            style={{ width: `${Math.min(100, Math.max(0, attendancePct))}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="col-span-4 md:col-span-1 flex items-center justify-end">
        {item.has_active_session ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-surface border border-accent/40 px-2.5 py-1 text-caption font-bold text-ink animate-pulse">
            <RadioLiveIcon size={12} />
            <span>AO VIVO</span>
          </span>
        ) : item.active ? (
          <span className="inline-flex items-center rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-semibold text-success">
            Ativa
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-caption font-medium text-muted">
            Inativa
          </span>
        )}
      </div>
    </div>
  );
}
