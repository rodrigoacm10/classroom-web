"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/global";
import { PlusIcon } from "@/components/icons";

export function SalasHeader() {
  return (
    <PageHeader
      bordered
      eyebrow="ESPAÇOS FÍSICOS"
      title="Salas"
      subtitle="Gerencie os espaços físicos e seus raios de presença válida."
      actions={
        <Link
          id="btn-nova-sala"
          href="/dashboard/salas/nova"
          className="flex shrink-0 items-center gap-2 rounded-xl px-5 h-11 font-bold text-label transition-opacity hover:opacity-80"
          style={{ background: "var(--color-ink)", color: "var(--color-on-ink)" }}
        >
          <PlusIcon size={14} />
          <span>Nova sala</span>
        </Link>
      }
    />
  );
}
