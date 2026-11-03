import { Suspense } from "react";
import type { Metadata } from "next";
import { RelatoriosPage } from "@/modules/relatorios";

export const metadata: Metadata = {
  title: "Relatórios — Locus",
  description:
    "Auditoria de frequência acadêmica e telemetria geoespacial consolidada por turma no Locus Classroom.",
};

export default function RelatoriosRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper">
          <div className="text-caption font-mono uppercase tracking-caps text-muted animate-pulse">
            Carregando relatório...
          </div>
        </div>
      }
    >
      <RelatoriosPage />
    </Suspense>
  );
}
