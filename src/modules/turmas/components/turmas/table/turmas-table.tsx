"use client";

import React from "react";
import type { SubjectClassItem } from "@/lib/api";
import type { TurmasStatusFilter } from "../../../types";
import { TableSkeleton } from "./table-skeleton";
import { TableEmpty } from "./table-empty";
import { TurmaRow } from "./turma-row";
import { TablePagination } from "./table-pagination";

export interface TurmasTableProps {
  classes: SubjectClassItem[];
  loading: boolean;
  searchQuery: string;
  statusFilter: TurmasStatusFilter;
  currentPage: number;
  totalPages: number;
  totalClasses: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function TurmasTable({
  classes,
  loading,
  searchQuery,
  statusFilter,
  currentPage,
  totalPages,
  totalClasses,
  pageSize,
  onPageChange,
  onClearFilters,
}: TurmasTableProps) {
  const hasFilters = Boolean(searchQuery || statusFilter !== "all");

  return (
    <div className="flex-1 px-8 py-6 lg:px-10">
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-12 items-center border-b border-border bg-[#FAFAFA] px-5 py-3 font-sans text-caption font-bold uppercase tracking-caps text-muted">
          <div className="col-span-12 md:col-span-4">TURMA / DISCIPLINA</div>
          <div className="hidden md:col-span-2 md:block">DOCENTE</div>
          <div className="hidden md:col-span-2 md:block">SALA FÍSICA</div>
          <div className="col-span-4 md:col-span-1 text-center md:text-left">ALUNOS</div>
          <div className="col-span-4 md:col-span-2">FREQUÊNCIA</div>
          <div className="col-span-4 md:col-span-1 text-right">STATUS</div>
        </div>

        {/* Table Body */}
        {loading ? (
          <TableSkeleton />
        ) : classes.length === 0 ? (
          <TableEmpty hasFilters={hasFilters} onClearFilters={onClearFilters} />
        ) : (
          <div className="divide-y divide-border">
            {classes.map((item) => (
              <TurmaRow key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Table Footer / Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalClasses={totalClasses}
          pageSize={pageSize}
          loading={loading}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
