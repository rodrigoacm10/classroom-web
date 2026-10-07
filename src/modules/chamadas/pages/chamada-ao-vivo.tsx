"use client";

import React from "react";
import { useChamadaAoVivo } from "../hooks";
import {
  AoVivoHeader,
  AoVivoStats,
  AoVivoFilters,
  AoVivoTable,
  AoVivoModals,
} from "../components/ao-vivo";

export interface ChamadaAoVivoProps {
  subjectClassId: string;
  sessionId: string;
}

export function ChamadaAoVivo({ subjectClassId, sessionId }: ChamadaAoVivoProps) {
  const {
    session,
    roster,
    filteredRoster,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    closingSession,
    showCloseConfirm,
    setShowCloseConfirm,
    cancellingSession,
    showCancelConfirm,
    setShowCancelConfirm,
    secondsLeft,
    totalStudents,
    presentCount,
    outOfRadiusCount,
    notConfirmedCount,
    progressPct,
    disciplineName,
    subjectClassName,
    dayCode,
    durationTotal,
    isOpen,
    metaLine,
    handleClose,
    handleCancel,
  } = useChamadaAoVivo({ subjectClassId, sessionId });

  return (
    <div className="flex flex-1 flex-col bg-paper">
      <AoVivoHeader
        session={session}
        disciplineName={disciplineName}
        subjectClassName={subjectClassName}
        metaLine={metaLine}
        isOpen={isOpen}
        loading={loading}
        closingSession={closingSession}
        cancellingSession={cancellingSession}
        onOpenCancelConfirm={() => setShowCancelConfirm(true)}
        onOpenCloseConfirm={() => setShowCloseConfirm(true)}
      />

      {error && (
        <div className="mx-9 mt-4 rounded-md border border-danger bg-danger-surface px-4 py-3 text-label text-ink">
          {error}
        </div>
      )}

      <AoVivoStats
        loading={loading}
        isOpen={isOpen}
        dayCode={dayCode}
        secondsLeft={secondsLeft}
        durationTotal={durationTotal}
        presentCount={presentCount}
        totalStudents={totalStudents}
        progressPct={progressPct}
      />

      <AoVivoFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        rosterLength={roster.length}
        presentCount={presentCount}
        notConfirmedCount={notConfirmedCount}
        outOfRadiusCount={outOfRadiusCount}
      />

      <AoVivoTable loading={loading} roster={filteredRoster} />

      <AoVivoModals
        showCloseConfirm={showCloseConfirm}
        showCancelConfirm={showCancelConfirm}
        closingSession={closingSession}
        cancellingSession={cancellingSession}
        onCloseConfirm={handleClose}
        onCancelCloseModal={() => setShowCloseConfirm(false)}
        onCancelSessionConfirm={handleCancel}
        onCancelModal={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}
