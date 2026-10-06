"use client";

import React from "react";
import Link from "next/link";
import { formatShortDate, formatHourBadge, formattedDate } from "@/lib/utils";
import { CallBanner } from "@/components/global";
import { useChamadasRealizadas } from "../hooks";

// Reexporta os tipos para compatibilidade
export type { AttendanceRecord } from "../types";

export function ChamadasRealizadas() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedClass,
    setSelectedClass,
    selectedStatus,
    setSelectedStatus,
    selectedPeriod,
    setSelectedPeriod,
    selectedSort,
    setSelectedSort,
    currentPage,
    currentClampedPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize,
    sortedRecords,
    loadingSessions,
    subjectClasses,
    activeSession,
    metrics,
    loadingMetrics,
    selectedCall,
    setSelectedCall,
  } = useChamadasRealizadas();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border bg-white px-10 py-5">
        <div>
          <div className="mb-1 font-sans text-caption uppercase tracking-caps text-muted">
            {formattedDate().toUpperCase()}
          </div>
          <h1 className="font-sans text-title font-bold text-ink leading-title">
            Chamadas
          </h1>
        </div>

        <Link
          href="/dashboard/chamadas/nova"
          className="flex items-center gap-2 rounded-lg bg-ink px-[18px] py-[10px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M7 1v12M1 7h12"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span>Abrir chamada</span>
        </Link>
      </div>

      {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center border-b border-border bg-white px-10">
        <button
          type="button"
          onClick={() => {
            setActiveTab("realizadas");
            setCurrentPage(1);
          }}
          className={`mr-5 cursor-pointer px-1 py-[14px] text-[14px] transition-colors ${
            activeTab === "realizadas"
              ? "border-b-2 border-ink font-semibold text-ink"
              : "border-b-2 border-transparent font-normal text-muted hover:text-ink"
          }`}
        >
          Realizadas
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("em_andamento");
            setCurrentPage(1);
          }}
          className={`mr-5 flex cursor-pointer items-center gap-2 px-1 py-[14px] text-[14px] transition-colors ${
            activeTab === "em_andamento"
              ? "border-b-2 border-ink font-semibold text-ink"
              : "border-b-2 border-transparent font-normal text-muted hover:text-ink"
          }`}
        >
          <span>Em andamento</span>
          {activeSession && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8A6D00]" />
            </span>
          )}
        </button>
      </div>

      {/* ─── Call Banner (Global Auto-suficiente) ────────────────────────── */}
      <CallBanner />

      {/* ─── 4 Summary KPI Indicator Columns ───────────────────────────────── */}
      <div className="flex w-full border-b border-border bg-white px-10 pt-5 pb-4">
        {/* Col 1 */}
        <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border py-2 pr-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Total de chamadas
          </div>
          {loadingMetrics ? (
            <div className="my-1 h-[36px] w-20 rounded bg-surface animate-pulse" />
          ) : (
            <div className="font-mono text-[40px] font-medium tracking-tight text-ink leading-[44px]">
              {metrics ? metrics.total_sessions : 0}
            </div>
          )}
          <div className="font-sans text-label text-muted">
            {selectedPeriod === "30days"
              ? "últimos 30 dias"
              : selectedPeriod === "semester"
              ? "neste semestre"
              : "todos os períodos"}
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border px-5 py-2">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Frequência média
          </div>
          {loadingMetrics ? (
            <div className="my-1 h-[36px] w-24 rounded bg-surface animate-pulse" />
          ) : (
            <div className="font-mono text-[40px] font-medium tracking-tight text-success leading-[44px]">
              {metrics ? `${Math.round(metrics.average_attendance_rate * 100)}%` : "0%"}
            </div>
          )}
          <div className="font-sans text-label text-muted">
            {selectedPeriod === "30days"
              ? "últimos 30 dias"
              : selectedPeriod === "semester"
              ? "neste semestre"
              : "todos os períodos"}
          </div>
        </div>

        {/* Col 3 */}
        <div className="flex grow basis-0 flex-col gap-[6px] border-r border-border px-5 py-2">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Canceladas
          </div>
          {loadingMetrics ? (
            <div className="my-1 h-[36px] w-16 rounded bg-surface animate-pulse" />
          ) : (
            <div className="font-mono text-[40px] font-medium tracking-tight text-danger leading-[44px]">
              {metrics ? String(metrics.cancelled_sessions).padStart(2, "0") : "00"}
            </div>
          )}
          <div className="font-sans text-label text-muted">
            {selectedPeriod === "30days"
              ? "últimos 30 dias"
              : selectedPeriod === "semester"
              ? "neste semestre"
              : "todos os períodos"}
          </div>
        </div>

        {/* Col 4 */}
        <div className="flex grow basis-0 flex-col gap-[6px] py-2 pl-5">
          <div className="font-sans text-label font-semibold uppercase tracking-caps text-muted">
            Última chamada
          </div>
          {loadingMetrics ? (
            <>
              <div className="my-1 h-[36px] w-28 rounded bg-surface animate-pulse" />
              <div className="h-4 w-40 rounded bg-surface animate-pulse" />
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[40px] font-medium tracking-tight text-ink leading-[44px]">
                  {metrics?.last_session
                    ? formatShortDate(metrics.last_session.opened_at)
                    : "--"}
                </span>
                {metrics?.last_session && (
                  <span className="rounded bg-accent-surface px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#8A6D00] leading-[14px]">
                    {formatHourBadge(metrics.last_session.opened_at)}
                  </span>
                )}
              </div>
              <div className="font-sans text-label text-muted truncate">
                {metrics?.last_session
                  ? `${metrics.last_session.discipline_name} · ${
                      metrics.last_session.room_name || metrics.last_session.subject_class_name
                    }`
                  : "Nenhuma chamada registrada"}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Filters Bar ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 bg-paper px-10 pt-5 pb-4">
        {/* Search */}
        <div className="flex max-w-[300px] grow basis-0 items-center gap-2 rounded-lg border border-border bg-white px-[14px] py-[9px]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <circle cx="6.5" cy="6.5" r="4" stroke="#5C5E63" strokeWidth="1.4" />
            <path
              d="M10 10l3 3"
              stroke="#5C5E63"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar turma ou disciplina..."
            className="w-full bg-transparent font-sans text-[14px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        {/* Filter: Turma */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
          >
            <option value="all">Turma: Todas</option>
            {subjectClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.discipline_name} · {cls.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5l3 3 3-3"
                stroke="#5C5E63"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Filter: Status */}
        {activeTab === "realizadas" && (
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
            >
              <option value="all">Status: Todos</option>
              <option value="ENCERRADA">Encerrada</option>
              <option value="EXPIRADA">Expirada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5l3 3 3-3"
                  stroke="#5C5E63"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Filter: Periodo */}
        {activeTab === "realizadas" && (
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
            >
              <option value="30days">Período: Últimos 30 dias</option>
              <option value="semester">Este semestre</option>
              <option value="all">Todos os períodos</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5l3 3 3-3"
                  stroke="#5C5E63"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="grow basis-0" />

        {/* Sorter */}
        <div className="relative flex items-center gap-1.5 rounded-lg border border-border bg-white px-[14px] py-[9px]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M2 4h10M4 7h6M6 10h2"
              stroke="#5C5E63"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="cursor-pointer appearance-none bg-transparent pr-5 font-sans text-[14px] text-ink focus:outline-none"
          >
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="presence">Maior presença</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5l3 3 3-3"
                stroke="#5C5E63"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Table Container ───────────────────────────────────────────────── */}
      <div className="grow px-10 pb-10">
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
          {/* Table Header */}
          <div className="flex items-center border-b border-border bg-[#FAFAFA] px-5">
            <div className="grow-2 basis-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              TURMA / DISCIPLINA
            </div>
            <div className="grow basis-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              DATA
            </div>
            <div className="w-[100px] shrink-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              DURAÇÃO
            </div>
            <div className="w-[100px] shrink-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              PRESENÇA
            </div>
            <div className="w-[120px] shrink-0 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
              STATUS
            </div>
            <div className="w-[120px] shrink-0 py-3" />
          </div>

          {/* Table Rows or Skeletons or Empty */}
          {loadingSessions ? (
            <div className="divide-y divide-border">
              {Array.from({ length: pageSize }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-5 py-4 animate-pulse"
                >
                  {/* Turma / Disciplina */}
                  <div className="grow-2 basis-0 pr-4">
                    <div className="h-4 w-44 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-28 rounded bg-surface" />
                  </div>

                  {/* Data */}
                  <div className="grow basis-0 pr-4">
                    <div className="h-4 w-20 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-24 rounded bg-surface" />
                  </div>

                  {/* Duracao */}
                  <div className="w-[100px] shrink-0">
                    <div className="h-4 w-14 rounded bg-surface" />
                  </div>

                  {/* Presenca */}
                  <div className="w-[100px] shrink-0">
                    <div className="h-4 w-12 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-8 rounded bg-surface" />
                  </div>

                  {/* Status */}
                  <div className="w-[120px] shrink-0">
                    <div className="h-6 w-24 rounded-full bg-surface" />
                  </div>

                  {/* Acao */}
                  <div className="w-[120px] shrink-0 flex justify-end">
                    <div className="h-8 w-24 rounded-lg bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" stroke="var(--color-muted)" strokeWidth="1.6" />
                  <path d="M10 6.5v4l2.5 1.5" stroke="var(--color-muted)" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-sans text-heading font-semibold text-ink">
                Nenhuma chamada encontrada
              </h3>
              <p className="mt-1 font-sans text-label text-muted">
                {activeTab === "em_andamento"
                  ? "Não há chamadas em andamento no momento. Inicie uma nova chamada para começar."
                  : "Nenhum registro corresponde aos filtros selecionados. Tente limpar os filtros."}
              </p>
              {activeTab === "em_andamento" && (
                <Link
                  href="/dashboard/chamadas/nova"
                  className="mt-4 rounded-lg bg-ink px-4 py-2 font-sans text-label font-semibold text-paper"
                >
                  Abrir nova chamada
                </Link>
              )}
            </div>
          ) : (
            sortedRecords.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b border-border px-5 transition-colors hover:bg-surface/50"
              >
                {/* Turma / Disciplina */}
                <div className="grow-2 basis-0 py-4">
                  <div className="font-sans text-body font-semibold text-ink leading-[18px]">
                    {item.discipline}
                  </div>
                  <div className="mt-0.5 font-sans text-label text-muted">
                    {item.classCode} {item.room} {item.timeBadge}
                  </div>
                </div>

                {/* Data */}
                <div className="grow basis-0 py-4">
                  <div className="font-sans text-[14px] text-ink leading-[18px]">
                    {item.dateLabel}
                  </div>
                  <div className="font-sans text-caption text-muted">
                    {item.timeRange}
                  </div>
                </div>

                {/* Duracao */}
                <div className="w-[100px] shrink-0 py-4 font-sans text-[14px] text-ink leading-[18px]">
                  {item.duration}
                </div>

                {/* Presenca */}
                <div className="w-[100px] shrink-0 py-4">
                  {item.status === "CANCELADA" ? (
                    <>
                      <div className="font-sans text-[14px] font-semibold text-muted leading-[18px]">
                        --
                      </div>
                      <div className="font-sans text-caption text-muted">cancelada</div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`font-sans text-[14px] font-semibold leading-[18px] ${
                          item.rate >= 75 ? "text-success" : "text-[#B45309]"
                        }`}
                      >
                        {item.present}/{item.total}
                      </div>
                      <div
                        className={`font-sans text-caption ${
                          item.rate >= 75 ? "text-muted" : "text-[#B45309]"
                        }`}
                      >
                        {item.rate}%
                      </div>
                    </>
                  )}
                </div>

                {/* Status */}
                <div className="w-[120px] shrink-0 py-4">
                  {(item.status === "ABERTA" || item.status === "EM ANDAMENTO") && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-ink">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
                      </span>
                      ABERTA
                    </span>
                  )}
                  {item.status === "ENCERRADA" && (
                    <span className="inline-flex items-center rounded-full bg-success-surface px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-success">
                      ENCERRADA
                    </span>
                  )}
                  {item.status === "EXPIRADA" && (
                    <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-muted">
                      EXPIRADA
                    </span>
                  )}
                  {item.status === "CANCELADA" && (
                    <span className="inline-flex items-center rounded-full bg-danger-surface px-2.5 py-1 font-sans text-caption font-bold uppercase tracking-caps text-danger">
                      CANCELADA
                    </span>
                  )}
                </div>

                {/* Acao */}
                <div className="w-[120px] shrink-0 py-4 text-right">
                  {item.status === "ABERTA" || item.status === "EM ANDAMENTO" ? (
                    <Link
                      href={
                        item.subjectClassId
                          ? `/dashboard/chamadas/${item.subjectClassId}/${item.id}`
                          : `/dashboard/chamadas`
                      }
                      className="inline-flex items-center justify-center rounded-lg bg-ink px-3 py-1.5 font-sans text-label font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Acompanhar
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedCall(item)}
                      className="inline-block cursor-pointer rounded border border-border px-3 py-1.5 font-sans text-label font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      Ver detalhes
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="font-sans text-label text-muted">
              {loadingSessions ? (
                <div className="h-4 w-44 rounded bg-surface animate-pulse" />
              ) : (
                `Mostrando ${sortedRecords.length} de ${totalItems} chamadas`
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Prev */}
              <button
                type="button"
                disabled={currentClampedPage <= 1 || loadingSessions}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-border bg-surface text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-white"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 3L4.5 6l3 3"
                    stroke="#5C5E63"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dynamic Pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - currentClampedPage) <= 1) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && p - prevPage > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <span className="font-sans text-label text-muted">...</span>
                      )}
                      <button
                        type="button"
                        disabled={loadingSessions}
                        onClick={() => setCurrentPage(p)}
                        className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded font-sans text-label ${
                          currentClampedPage === p
                            ? "border border-ink bg-ink font-semibold text-white"
                            : "border border-border bg-white text-ink hover:bg-surface"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              {/* Next */}
              <button
                type="button"
                disabled={currentClampedPage >= totalPages || loadingSessions}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-border bg-white text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-surface"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 3L7.5 6l-3 3"
                    stroke="#18191B"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detail Modal ──────────────────────────────────────────────────── */}
      {selectedCall && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedCall(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="rounded bg-accent-surface px-2 py-0.5 font-mono text-[11px] font-bold text-[#8A6D00]">
                  {selectedCall.timeBadge}
                </span>
                <h3 className="mt-2 font-sans text-heading font-bold text-ink">
                  {selectedCall.discipline}
                </h3>
                <p className="font-sans text-label text-muted">
                  Turma {selectedCall.classCode} · {selectedCall.room}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="cursor-pointer rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-2 gap-4 py-5 text-left">
              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Data e Horário
                </span>
                <p className="mt-1 font-sans text-body font-semibold text-ink">
                  {selectedCall.dateLabel}
                </p>
                <p className="font-sans text-caption text-muted">
                  {selectedCall.timeRange}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Código do Dia
                </span>
                <p className="mt-1 font-mono text-[20px] font-semibold text-ink">
                  {selectedCall.dayCode ?? "----"}
                </p>
                <p className="font-sans text-caption text-muted">Validação de raio ativa</p>
              </div>

              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Presença / Quórum
                </span>
                <p className="mt-1 font-mono text-[20px] font-semibold text-success">
                  {selectedCall.present}/{selectedCall.total}
                </p>
                <p className="font-sans text-caption text-muted">
                  {selectedCall.rate}% dos matriculados
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface/50 p-3">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Status da Chamada
                </span>
                <div className="mt-1">
                  {selectedCall.status === "ENCERRADA" && (
                    <span className="inline-flex rounded-full bg-success-surface px-2.5 py-0.5 font-sans text-caption font-bold uppercase tracking-caps text-success">
                      ENCERRADA
                    </span>
                  )}
                  {selectedCall.status === "EXPIRADA" && (
                    <span className="inline-flex rounded-full bg-surface px-2.5 py-0.5 font-sans text-caption font-bold uppercase tracking-caps text-muted">
                      EXPIRADA
                    </span>
                  )}
                  {selectedCall.status === "CANCELADA" && (
                    <span className="inline-flex rounded-full bg-danger-surface px-2.5 py-0.5 font-sans text-caption font-bold uppercase tracking-caps text-danger">
                      CANCELADA
                    </span>
                  )}
                </div>
                <p className="mt-1 font-sans text-caption text-muted">
                  Duração: {selectedCall.duration}
                </p>
              </div>
            </div>

            {selectedCall.notes && (
              <div className="mb-5 rounded-lg border border-border bg-[#FAFAFA] p-3 text-left">
                <span className="font-sans text-caption uppercase tracking-caps text-muted">
                  Observações da Sessão
                </span>
                <p className="mt-1 font-sans text-label text-ink">
                  {selectedCall.notes}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 font-sans text-label font-semibold text-ink hover:bg-surface"
              >
                Fechar
              </button>
              {selectedCall.subjectClassId && (
                <Link
                  href={`/dashboard/chamadas/${selectedCall.subjectClassId}/${selectedCall.id}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 font-sans text-label font-semibold text-ink hover:bg-surface"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Acessar chamada</span>
                </Link>
              )}
              <Link
                href="/dashboard/relatorios"
                className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 font-sans text-label font-semibold text-white hover:opacity-90"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 2v10M7 5v7M11 8v4"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Ver relatório</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
