"use client";

import React from "react";
import Link from "next/link";
import { CallBanner } from "@/components/global";
import { CheckIcon, CloseIcon } from "@/components/icons";
import { useAlunoDetalhes } from "../hooks/use-aluno-detalhes";
import { AlunoDetalhesHeader } from "../components/detalhes/aluno-detalhes-header";
import { AlunoDetalhesKpis } from "../components/detalhes/aluno-detalhes-kpis";
import { AlunoDetalhesTabs } from "../components/detalhes/aluno-detalhes-tabs";
import { TabTurmas } from "../components/detalhes/tab-turmas";
import { TabHistorico } from "../components/detalhes/tab-historico";
import { MatricularModal } from "../components/detalhes/matricular-modal";
import { DesmatricularModal } from "../components/detalhes/desmatricular-modal";

export interface AlunoDetalhesPageProps {
  id: string;
}

export function AlunoDetalhesPage({ id }: AlunoDetalhesPageProps) {
  const {
    aluno,
    loading,
    userRole,
    activeTab,
    setActiveTab,
    chamadas,
    filteredChamadas,
    chamadasTurmaFilter,
    setChamadasTurmaFilter,
    chamadasStatusFilter,
    setChamadasStatusFilter,
    availableTurmasToEnroll,
    canUnenroll,
    isEnrollModalOpen,
    setIsEnrollModalOpen,
    handleEnroll,
    turmaToUnenroll,
    isUnenrollModalOpen,
    setIsUnenrollModalOpen,
    requestUnenroll,
    handleConfirmUnenroll,
    toastMessage,
  } = useAlunoDetalhes(id);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-paper antialiased font-sans">
        <div className="flex flex-1 items-center justify-center p-8 text-center text-muted animate-pulse">
          Carregando ficha e histórico do aluno...
        </div>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="flex min-h-screen flex-col bg-paper antialiased font-sans p-8">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-xs">
          <h2 className="text-heading font-extrabold text-ink tracking-tight">
            Aluno não encontrado
          </h2>
          <p className="text-body text-muted mt-2">
            Não foi possível localizar o cadastro deste aluno no tenant ativo.
          </p>
          <Link
            href="/dashboard/alunos"
            className="mt-6 inline-flex rounded-lg bg-ink px-5 py-2.5 text-label font-bold text-white hover:opacity-90 transition-opacity"
          >
            Voltar para lista de Alunos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Feedback Toast / Banner Flutuante ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-ink px-5 py-3 text-white shadow-xl animate-fade-in">
          {toastMessage.type === "success" ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
              <CheckIcon size={12} />
            </div>
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white">
              <CloseIcon size={12} />
            </div>
          )}
          <span className="text-label font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* ─── Header Principal do Aluno ─── */}
      <AlunoDetalhesHeader aluno={aluno} />

      {/* ─── Banner de Chamada em Andamento (se houver) ─── */}
      <CallBanner />

      {/* ─── 4 KPIs de Desempenho e Presença ─── */}
      <AlunoDetalhesKpis aluno={aluno} />

      {/* ─── Navegação de Abas (Turmas Matriculadas vs Histórico de Chamadas) ─── */}
      <AlunoDetalhesTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        turmasCount={aluno.turmas.length}
        chamadasCount={chamadas.length}
      />

      {/* ─── Conteúdo da Aba Ativa ─── */}
      <div className="flex-1 px-8 py-6 lg:px-10">
        {activeTab === "turmas" && (
          <TabTurmas
            turmas={aluno.turmas}
            userRole={userRole}
            canUnenroll={canUnenroll}
            onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
            onRequestUnenroll={requestUnenroll}
          />
        )}

        {activeTab === "chamadas" && (
          <TabHistorico
            chamadas={filteredChamadas}
            turmas={aluno.turmas}
            selectedTurmaFilter={chamadasTurmaFilter}
            onTurmaFilterChange={setChamadasTurmaFilter}
            statusFilter={chamadasStatusFilter}
            onStatusFilterChange={setChamadasStatusFilter}
          />
        )}
      </div>

      {/* ─── Modal de Matrícula em Turma ─── */}
      <MatricularModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        availableTurmas={availableTurmasToEnroll}
        studentName={aluno.name}
        onConfirmEnroll={handleEnroll}
      />

      {/* ─── Modal de Confirmação de Desmatrícula ─── */}
      <DesmatricularModal
        isOpen={isUnenrollModalOpen}
        onClose={() => setIsUnenrollModalOpen(false)}
        turma={turmaToUnenroll}
        studentName={aluno.name}
        onConfirm={handleConfirmUnenroll}
      />
    </div>
  );
}
