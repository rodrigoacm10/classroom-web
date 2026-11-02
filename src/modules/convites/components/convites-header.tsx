"use client";

import React from "react";
import { PageHeader, PageHeaderAddIcon } from "@/components/global";

export interface ConvitesHeaderProps {
  totalInvites: number;
  pendingCount: number;
  onOpenModal: () => void;
}

export function ConvitesHeader({
  totalInvites,
  pendingCount,
  onOpenModal,
}: ConvitesHeaderProps) {
  return (
    <PageHeader
      eyebrow={null}
      title="Convites & Acessos"
      description={`Gestão institucional · ${totalInvites} convites emitidos (${pendingCount} aguardando ativação)`}
      bordered
      actions={
        <button
          type="button"
          onClick={onOpenModal}
          className="flex h-10 items-center gap-2 rounded-md bg-ink px-4 font-bold text-paper text-label transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <PageHeaderAddIcon />
          <span>Novo convite</span>
        </button>
      }
    />
  );
}
