"use client";

import React from "react";
import Link from "next/link";
import { useEditarTurma } from "../hooks/use-editar-turma";
import {
  NovaTurmaIdentificacao,
  NovaTurmaSala,
} from "../components/nova";
import {
  EditarTurmaHeader,
  EditarTurmaStatus,
  EditarTurmaPreview,
} from "../components/editar";

export function EditarTurma({ id }: { id: string }) {
  const {
    nameId,
    disciplineId,
    name,
    setName,
    disciplineName,
    setDisciplineName,
    selectedRoomId,
    setSelectedRoomId,
    active,
    setActive,
    turma,
    rooms,
    loadingRooms,
    selectedRoom,
    currentUser,
    loading,
    submitting,
    errorMessage,
    handleSubmit,
  } = useEditarTurma(id);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-paper antialiased font-sans">
        <div className="flex flex-1 items-center justify-center p-8 text-center text-muted animate-pulse">
          Carregando dados da turma para edição...
        </div>
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="flex min-h-screen flex-col bg-paper antialiased font-sans p-8">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-xs">
          <h2 className="text-heading font-extrabold text-ink tracking-tight">
            Turma não encontrada
          </h2>
          <p className="text-body text-muted mt-2">
            A turma solicitada não foi localizada ou foi excluída.
          </p>
          <Link
            href="/dashboard/turmas"
            className="mt-6 inline-flex rounded-lg bg-ink px-5 py-2.5 text-label font-bold text-white hover:opacity-90 transition-opacity"
          >
            Voltar para lista de turmas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Top Header ────────────────────────────────────────────────────────── */}
      <EditarTurmaHeader
        turmaId={id}
        turmaName={turma.name}
        submitting={submitting}
      />

      {/* ─── Main Content Split View ─────────────────────────────────────────── */}
      <div className="flex-1 px-8 py-8 lg:px-10">
        <form
          id="editar-turma-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        >
          {/* ─── Coluna Esquerda: Formulário de Edição ────────────────────────── */}
          <div className="lg:col-span-7 space-y-8">
            {errorMessage && (
              <div className="rounded-xl border border-danger/30 bg-danger-surface p-4 text-label font-medium text-danger">
                {errorMessage}
              </div>
            )}

            {/* SEÇÃO 1: Identificação Básica */}
            <NovaTurmaIdentificacao
              nameId={nameId}
              disciplineId={disciplineId}
              name={name}
              onNameChange={setName}
              disciplineName={disciplineName}
              onDisciplineNameChange={setDisciplineName}
            />

            {/* SEÇÃO 2: Sala Física Vinculada (Geofence) */}
            <NovaTurmaSala
              rooms={rooms}
              loadingRooms={loadingRooms}
              selectedRoomId={selectedRoomId}
              onSelectRoomId={setSelectedRoomId}
            />

            {/* SEÇÃO 3: Status Operacional (Ativa vs Inativa) */}
            <EditarTurmaStatus
              active={active}
              onActiveChange={setActive}
            />
          </div>

          {/* ─── Coluna Direita: Pré-visualização em Tempo Real ─────────────────── */}
          <EditarTurmaPreview
            name={name}
            disciplineName={disciplineName}
            active={active}
            studentCount={turma.student_count}
            currentUser={currentUser}
            selectedRoom={selectedRoom}
            submitting={submitting}
          />
        </form>
      </div>
    </div>
  );
}
