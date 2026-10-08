"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, PlusIcon, MapPinIcon } from "@/components/icons";
import type { SubjectClassItem } from "@/services/subject-classes";

export interface DetalhesHeaderProps {
  turma: SubjectClassItem;
}

export function DetalhesHeader({ turma }: DetalhesHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 border-b border-border bg-white px-8 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
      <div>
        <nav className="flex items-center gap-2 text-caption text-muted mb-1 font-medium">
          <Link href="/dashboard/turmas" className="hover:text-ink transition-colors flex items-center gap-1">
            <ChevronLeftIcon size={14} />
            <span>Turmas</span>
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">{turma.name}</span>
        </nav>

        <div className="flex items-center gap-3">
          <h1 className="text-title font-bold text-ink leading-title tracking-tight">
            {turma.name}
          </h1>
          {turma.has_active_session ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-surface border border-accent/40 px-2.5 py-0.5 text-caption font-bold text-ink animate-pulse">
              AO VIVO
            </span>
          ) : turma.active ? (
            <span className="inline-flex items-center rounded-full bg-success-surface px-2.5 py-0.5 text-caption font-semibold text-success">
              Ativa
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-caption font-medium text-muted">
              Inativa
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-body text-muted">
          <span className="font-medium text-ink">{turma.discipline_name}</span>
          <span>·</span>
          <span>Docente: {turma.professor_name ?? "Professor Responsável"}</span>
          {turma.room_name && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-ink">
                <MapPinIcon size={13} />
                {turma.room_name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/turmas")}
          className="flex h-10 items-center rounded-lg border border-border bg-white px-4 text-label font-medium text-ink transition-colors hover:bg-surface cursor-pointer"
        >
          ← Voltar para Turmas
        </button>

        <Link
          href={`/dashboard/chamadas/nova?turma=${turma.id}`}
          className="flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <PlusIcon size={14} />
          <span>Abrir chamada nesta turma</span>
        </Link>
      </div>
    </div>
  );
}
