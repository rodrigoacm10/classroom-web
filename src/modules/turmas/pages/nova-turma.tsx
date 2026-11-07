"use client";

import React from "react";
import { useNovaTurma } from "../hooks";
import {
  NovaTurmaHeader,
  NovaTurmaIdentificacao,
  NovaTurmaSala,
  NovaTurmaAlunos,
  NovaTurmaPreview,
} from "../components/nova";

export function NovaTurma() {
  const {
    nameId,
    disciplineId,
    name,
    setName,
    disciplineName,
    setDisciplineName,
    selectedRoomId,
    setSelectedRoomId,
    rooms,
    loadingRooms,
    selectedRoom,
    currentUser,
    catalogStudents,
    loadingStudents,
    catalogSearch,
    setCatalogSearch,
    isSearching,
    unselectedCatalogStudents,
    studentMode,
    setStudentMode,
    batchText,
    setBatchText,
    processingBatch,
    selectedStudents,
    setSelectedStudents,
    handleAddStudent,
    handleRemoveStudent,
    handleAddAllCatalog,
    handleProcessBatch,
    handleSubmit,
    submitting,
    errorMessage,
  } = useNovaTurma();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Top Header ────────────────────────────────────────────────────────── */}
      <NovaTurmaHeader submitting={submitting} />

      {/* ─── Main Content Split View ─────────────────────────────────────────── */}
      <div className="flex-1 px-8 py-8 lg:px-10">
        <form
          id="nova-turma-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        >
          {/* ─── Coluna Esquerda: Formulário (Etapas 01, 02 e 03) ───────────────── */}
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

            {/* SEÇÃO 3: Matrícula de Alunos */}
            <NovaTurmaAlunos
              studentMode={studentMode}
              onStudentModeChange={setStudentMode}
              catalogSearch={catalogSearch}
              onCatalogSearchChange={setCatalogSearch}
              isSearching={isSearching}
              loadingStudents={loadingStudents}
              catalogStudents={catalogStudents}
              unselectedCatalogStudents={unselectedCatalogStudents}
              selectedStudents={selectedStudents}
              onAddStudent={handleAddStudent}
              onRemoveStudent={handleRemoveStudent}
              onAddAllCatalog={handleAddAllCatalog}
              batchText={batchText}
              onBatchTextChange={setBatchText}
              processingBatch={processingBatch}
              onProcessBatch={handleProcessBatch}
              onRemoveAllSelected={() => setSelectedStudents([])}
            />
          </div>

          {/* ─── Coluna Direita: Live Preview Dinâmico (Sticky) ──────────────── */}
          <NovaTurmaPreview
            name={name}
            disciplineName={disciplineName}
            currentUser={currentUser}
            selectedRoom={selectedRoom}
            selectedStudents={selectedStudents}
            submitting={submitting}
          />
        </form>
      </div>
    </div>
  );
}
