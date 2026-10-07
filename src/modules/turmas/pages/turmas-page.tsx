"use client";

import React from "react";
import { CallBanner } from "@/components/global";
import { useTurmas } from "../hooks";
import {
  TurmasHeader,
  TurmasKpis,
  TurmasFilters,
  TurmasTable,
} from "../components/turmas";

export function TurmasPage() {
  const {
    classes,
    totalClasses,
    totalPages,
    tableLoading,
    kpis,
    metricsLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    pageSize,
    handleClearFilters,
  } = useTurmas();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      <TurmasHeader />

      <CallBanner />

      <TurmasKpis kpis={kpis} loading={metricsLoading} />

      <TurmasFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      <TurmasTable
        classes={classes}
        loading={tableLoading}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        currentPage={currentPage}
        totalPages={totalPages}
        totalClasses={totalClasses}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
