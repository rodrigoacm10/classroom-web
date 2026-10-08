"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

export function NovaSalaHeader() {
  return (
    <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-border bg-paper px-10">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/salas"
          className="flex items-center gap-1.5 text-label font-medium text-muted transition-opacity hover:opacity-70"
        >
          <ChevronLeftIcon size={14} />
          <span>Salas</span>
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="text-heading font-bold tracking-tight text-ink">
          Nova Sala
        </span>
      </div>
      <Link
        href="/dashboard/salas"
        className="flex h-[38px] items-center rounded-md border border-border px-4 text-[14px] font-medium leading-[18px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
      >
        Cancelar
      </Link>
    </header>
  );
}
