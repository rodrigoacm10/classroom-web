"use client";

import React from "react";
import { CallBanner } from "@/components/global";
import { useChamadasRealizadas } from "../hooks";
import {
  ChamadasHeader,
  ChamadasTabs,
  ChamadasMetrics,
  ChamadasFilters,
  ChamadasTable,
  ChamadaDetailModal,
} from "../components";

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
      <ChamadasHeader />

      <ChamadasTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        hasActiveSession={!!activeSession}
      />

      <CallBanner />

      <ChamadasMetrics
        metrics={metrics}
        loading={loadingMetrics}
        selectedPeriod={selectedPeriod}
      />

      <ChamadasFilters
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
        selectedClass={selectedClass}
        onClassChange={(classId) => {
          setSelectedClass(classId);
          setCurrentPage(1);
        }}
        subjectClasses={subjectClasses}
        selectedStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
        selectedPeriod={selectedPeriod}
        onPeriodChange={(period) => {
          setSelectedPeriod(period);
          setCurrentPage(1);
        }}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      <ChamadasTable
        records={sortedRecords}
        loading={loadingSessions}
        activeTab={activeTab}
        currentPage={currentClampedPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onSelectCall={setSelectedCall}
      />

      <ChamadaDetailModal
        call={selectedCall}
        onClose={() => setSelectedCall(null)}
      />
    </div>
  );
}
