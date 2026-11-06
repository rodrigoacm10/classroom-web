"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { AuditMapInnerProps } from "./audit-map-inner";

const AuditMapClient = dynamic<AuditMapInnerProps>(
  () => import("./audit-map-inner").then((mod) => mod.AuditMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex flex-1 w-full h-full min-h-[200px] items-center justify-center bg-surface animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-caption text-muted">Carregando mapa de auditoria...</span>
        </div>
      </div>
    ),
  }
);

export type AuditMapProps = AuditMapInnerProps;

export function AuditMap(props: AuditMapProps) {
  return <AuditMapClient {...props} />;
}
