"use client";

import React from "react";
import { PageHeader, PageHeaderAddIcon } from "@/components/global";
import { getFormattedDateSubtitle } from "@/lib/utils";
import type { UserRoleScope } from "../../types";

export interface AlunosHeaderProps {
  roleScope: UserRoleScope;
  onOpenInviteModal: () => void;
  totalStudents: number;
}

export function AlunosHeader({
  roleScope,
  onOpenInviteModal,
  totalStudents,
}: AlunosHeaderProps) {
  const isProfessor = roleScope === "professor";

  return (
    <PageHeader
      eyebrow={getFormattedDateSubtitle()}
      title="Alunos"
      description={
        isProfessor
          ? `Minhas Turmas — Visualizando ${totalStudents} alunos matriculados nas disciplinas que você leciona.`
          : `Visão Geral da Instituição — ${totalStudents} alunos vinculados ao tenant ativo.`
      }
      bordered
      actions={
        !isProfessor ? (
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="flex h-10 items-center gap-2 rounded-md bg-ink px-4 font-bold text-paper text-label transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <PageHeaderAddIcon />
            <span>Convidar aluno</span>
          </button>
        ) : undefined
      }
    />
  );
}
