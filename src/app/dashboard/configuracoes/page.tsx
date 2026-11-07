import type { Metadata } from "next";
import { ConfiguracoesPage } from "@/modules/configuracoes";

export const metadata: Metadata = {
  title: "Configurações da Instituição | Locus Classroom",
  description: "Gerenciamento cadastral, parâmetros operacionais e regras de presença da instituição.",
};

export default function ConfiguracoesDashboardPage() {
  return <ConfiguracoesPage />;
}
