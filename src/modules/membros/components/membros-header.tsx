"use client";

import React from "react";
import { PageHeader, PageHeaderAddIcon } from "@/components/global";
import { getFormattedDateSubtitle } from "@/lib/utils";

export interface MembrosHeaderProps {
  canInviteMembers: boolean;
  totalMembers: number;
  onOpenInviteModal: () => void;
}

export function MembrosHeader({
  canInviteMembers,
  totalMembers,
  onOpenInviteModal,
}: MembrosHeaderProps) {
  return (
    <PageHeader
      eyebrow={getFormattedDateSubtitle()}
      title="Membros"
      description={`Corpo Docente e Gestão — ${totalMembers} ${
        totalMembers === 1 ? "membro institucional cadastrado" : "membros institucionais cadastrados"
      } no tenant ativo.`}
      bordered
      actions={
        canInviteMembers ? (
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="flex h-10 items-center gap-2 rounded-md bg-ink px-4 font-bold text-paper text-label transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <PageHeaderAddIcon />
            <span>Convidar membro</span>
          </button>
        ) : undefined
      }
    />
  );
}
