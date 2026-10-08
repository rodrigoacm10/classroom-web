"use client";

import React from "react";
import { useNovaChamada } from "../hooks";
import {
  NovaChamadaHeader,
  NovaChamadaForm,
  NovaChamadaPreview,
} from "../components/nova";

export function NovaChamada() {
  const {
    duration,
    setDuration,
    DURATION_OPTIONS,
    classes,
    classesTotal,
    rooms,
    filteredRooms,
    selectedClass,
    selectedRoom,
    selectedRoomId,
    loading,
    searchLoading,
    reportLoading,
    submitting,
    error,
    setError,
    turmaDropdownOpen,
    setTurmaDropdownOpen,
    roomDropdownOpen,
    setRoomDropdownOpen,
    turmaDropdownRef,
    roomDropdownRef,
    classSearchInputRef,
    roomSearchInputRef,
    classSearch,
    setClassSearch,
    roomSearch,
    setRoomSearch,
    turmaLabel,
    localLabel,
    studentCount,
    attendanceRatePercent,
    studentsAtRiskCount,
    handleSelectTurma,
    handleSelectRoom,
    handleSubmit,
  } = useNovaChamada();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <NovaChamadaHeader />

      {/* ── Mensagem de Erro (se houver) ── */}
      {error && (
        <div className="shrink-0 bg-danger-surface px-10 py-2.5 text-caption/body font-medium text-danger border-b border-danger/20 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-danger font-bold hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1">
        <NovaChamadaForm
          loading={loading}
          classes={classes}
          classesTotal={classesTotal}
          selectedClass={selectedClass}
          turmaLabel={turmaLabel}
          turmaDropdownOpen={turmaDropdownOpen}
          setTurmaDropdownOpen={setTurmaDropdownOpen}
          turmaDropdownRef={turmaDropdownRef}
          classSearch={classSearch}
          setClassSearch={setClassSearch}
          classSearchInputRef={classSearchInputRef}
          searchLoading={searchLoading}
          handleSelectTurma={handleSelectTurma}
          rooms={rooms}
          filteredRooms={filteredRooms}
          selectedRoom={selectedRoom}
          selectedRoomId={selectedRoomId}
          localLabel={localLabel}
          roomDropdownOpen={roomDropdownOpen}
          setRoomDropdownOpen={setRoomDropdownOpen}
          roomDropdownRef={roomDropdownRef}
          roomSearch={roomSearch}
          setRoomSearch={setRoomSearch}
          roomSearchInputRef={roomSearchInputRef}
          handleSelectRoom={handleSelectRoom}
          duration={duration}
          setDuration={setDuration}
          durationOptions={DURATION_OPTIONS}
          submitting={submitting}
          handleSubmit={handleSubmit}
          studentCount={studentCount}
        />

        <NovaChamadaPreview
          loading={loading}
          selectedClass={selectedClass}
          selectedRoom={selectedRoom}
          localLabel={localLabel}
          studentCount={studentCount}
          attendanceRatePercent={attendanceRatePercent}
          studentsAtRiskCount={studentsAtRiskCount}
          reportLoading={reportLoading}
          duration={duration}
          setTurmaDropdownOpen={setTurmaDropdownOpen}
        />
      </div>
    </div>
  );
}
