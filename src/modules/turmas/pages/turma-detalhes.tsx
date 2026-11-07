"use client";

import React from "react";
import { LiveCallBanner } from "@/components/global";
import { useTurmaDetalhes } from "../hooks";
import {
  DetalhesHeader,
  DetalhesKpis,
  DetalhesTabsNav,
  TabAlunos,
  TabSessoes,
  TabEspaco,
  MatricularAlunoModal,
  DetalhesSkeleton,
  DetalhesNotFound,
} from "../components/detalhes";

export function TurmaDetalhes({ id }: { id: string }) {
  const {
    turma,
    loadingTurma,
    errorMessage,
    activeTab,
    setActiveTab,
    room,
    activeSession,
    sessions,
    loadingSessions,
    students,
    loadingStudents,
    studentSearch,
    setStudentSearch,
    studentFilter,
    setStudentFilter,
    showAddStudentModal,
    setShowAddStudentModal,
    catalogSearch,
    setCatalogSearch,
    catalogStudents,
    loadingCatalog,
    enrollingStudentId,
    enrollSuccessMessage,
    enrollErrorMessage,
    enrolledMemberIds,
    handleEnrollStudent,
    canDeleteEnrollment,
    handleRemoveStudent,
    attendancePct,
    atRiskCount,
    regularCount,
    filteredStudents,
  } = useTurmaDetalhes(id);

  if (loadingTurma) {
    return <DetalhesSkeleton />;
  }

  if (errorMessage || !turma) {
    return <DetalhesNotFound errorMessage={errorMessage} />;
  }

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Top Header ────────────────────────────────────────────────────────── */}
      <DetalhesHeader turma={turma} />

      {/* ─── Live Session Banner (Se houver chamada ao vivo) ─────────────────── */}
      {activeSession && (
        <LiveCallBanner key={activeSession.session_id} session={activeSession} />
      )}

      {/* ─── 4 Summary KPI Cards ────────────────────────────────────────────── */}
      <DetalhesKpis
        attendancePct={attendancePct}
        sessionsCount={sessions.length}
        studentsCount={students.length}
        regularCount={regularCount}
        atRiskCount={atRiskCount}
        roomName={room?.name ?? turma.room_name ?? "Sem sala"}
        toleranceRadius={room?.tolerance_radius_meters ?? 50}
      />

      {/* ─── Tabs Navigation ────────────────────────────────────────────────── */}
      <DetalhesTabsNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        studentsCount={students.length}
        sessionsCount={sessions.length}
      />

      {/* ─── Main Tab Content ──────────────────────────────────────────────── */}
      <div className="flex-1 px-8 py-6 lg:px-10">
        {activeTab === "students" && (
          <TabAlunos
            students={students}
            filteredStudents={filteredStudents}
            loadingStudents={loadingStudents}
            studentSearch={studentSearch}
            onSearchChange={setStudentSearch}
            studentFilter={studentFilter}
            onFilterChange={setStudentFilter}
            regularCount={regularCount}
            atRiskCount={atRiskCount}
            canDeleteEnrollment={canDeleteEnrollment}
            onOpenAddStudentModal={() => setShowAddStudentModal(true)}
            onRemoveStudent={handleRemoveStudent}
          />
        )}

        {activeTab === "sessions" && (
          <TabSessoes
            turmaId={turma.id}
            defaultRoomName={turma.room_name}
            sessions={sessions}
            loadingSessions={loadingSessions}
          />
        )}

        {activeTab === "settings" && (
          <TabEspaco turma={turma} room={room} />
        )}
      </div>

      {/* ─── Modal para Matricular Aluno (Catálogo da Instituição) ─────────────── */}
      <MatricularAlunoModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        catalogSearch={catalogSearch}
        onSearchChange={setCatalogSearch}
        catalogStudents={catalogStudents}
        loadingCatalog={loadingCatalog}
        enrolledMemberIds={enrolledMemberIds}
        enrollingStudentId={enrollingStudentId}
        enrollSuccessMessage={enrollSuccessMessage}
        enrollErrorMessage={enrollErrorMessage}
        onEnrollStudent={handleEnrollStudent}
      />
    </div>
  );
}
