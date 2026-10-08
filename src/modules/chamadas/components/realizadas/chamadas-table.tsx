import React from "react";
import Link from "next/link";
import type { AttendanceRecord, AttendanceTab } from "../../types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
  StatusBadge,
  TableEmpty,
  TableSkeleton,
} from "./table";

export interface ChamadasTableProps {
  records: AttendanceRecord[];
  loading: boolean;
  activeTab: AttendanceTab;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectCall: (record: AttendanceRecord) => void;
}

export function ChamadasTable({
  records,
  loading,
  activeTab,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onSelectCall,
}: ChamadasTableProps) {
  return (
    <div className="grow px-10 pb-10">
      <Table
        footer={
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            currentCount={records.length}
            itemLabel="chamadas"
            loading={loading}
            onPageChange={onPageChange}
          />
        }
      >
        {/* Table Header */}
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHead>TURMA / DISCIPLINA</TableHead>
            <TableHead>DATA</TableHead>
            <TableHead className="w-[100px]">DURAÇÃO</TableHead>
            <TableHead className="w-[110px]">PRESENÇA</TableHead>
            <TableHead className="w-[130px]">STATUS</TableHead>
            <TableHead className="w-[120px] text-right" />
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {loading ? (
            <TableSkeleton
              rows={pageSize}
              renderRow={(idx) => (
                <TableRow key={idx} hoverable={false} className="animate-pulse">
                  {/* Turma / Disciplina */}
                  <TableCell>
                    <div className="h-4 w-44 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-28 rounded bg-surface" />
                  </TableCell>

                  {/* Data */}
                  <TableCell>
                    <div className="h-4 w-20 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-24 rounded bg-surface" />
                  </TableCell>

                  {/* Duração */}
                  <TableCell>
                    <div className="h-4 w-14 rounded bg-surface" />
                  </TableCell>

                  {/* Presença */}
                  <TableCell>
                    <div className="h-4 w-12 rounded bg-surface" />
                    <div className="mt-1.5 h-3 w-8 rounded bg-surface" />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="h-6 w-24 rounded-full bg-surface" />
                  </TableCell>

                  {/* Ação */}
                  <TableCell className="text-right">
                    <div className="inline-block h-8 w-24 rounded-lg bg-surface" />
                  </TableCell>
                </TableRow>
              )}
            />
          ) : records.length === 0 ? (
            <TableEmpty
              colSpan={6}
              title="Nenhuma chamada encontrada"
              description={
                activeTab === "em_andamento"
                  ? "Não há chamadas em andamento no momento. Inicie uma nova chamada para começar."
                  : "Nenhum registro corresponde aos filtros selecionados. Tente limpar os filtros."
              }
              action={
                activeTab === "em_andamento" ? (
                  <Link
                    href="/dashboard/chamadas/nova"
                    className="inline-flex rounded-lg bg-ink px-4 py-2 font-sans text-label font-semibold text-paper"
                  >
                    Abrir nova chamada
                  </Link>
                ) : null
              }
            />
          ) : (
            records.map((item) => (
              <TableRow key={item.id}>
                {/* Turma / Disciplina */}
                <TableCell>
                  <div className="font-sans text-body font-semibold text-ink leading-[18px]">
                    {item.discipline}
                  </div>
                  <div className="mt-0.5 font-sans text-label text-muted">
                    {item.classCode} {item.room} {item.timeBadge}
                  </div>
                </TableCell>

                {/* Data */}
                <TableCell>
                  <div className="font-sans text-[14px] text-ink leading-[18px]">
                    {item.dateLabel}
                  </div>
                  <div className="font-sans text-caption text-muted">
                    {item.timeRange}
                  </div>
                </TableCell>

                {/* Duração */}
                <TableCell className="font-sans text-[14px] text-ink leading-[18px]">
                  {item.duration}
                </TableCell>

                {/* Presença */}
                <TableCell>
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
                </TableCell>

                {/* Status */}
                <TableCell>
                  {(item.status === "ABERTA" || item.status === "EM ANDAMENTO") && (
                    <StatusBadge variant="accent" pulse>
                      ABERTA
                    </StatusBadge>
                  )}
                  {item.status === "ENCERRADA" && (
                    <StatusBadge variant="success">ENCERRADA</StatusBadge>
                  )}
                  {item.status === "EXPIRADA" && (
                    <StatusBadge variant="muted">EXPIRADA</StatusBadge>
                  )}
                  {item.status === "CANCELADA" && (
                    <StatusBadge variant="danger">CANCELADA</StatusBadge>
                  )}
                </TableCell>

                {/* Ação */}
                <TableCell className="text-right">
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
                      onClick={() => onSelectCall(item)}
                      className="inline-block cursor-pointer rounded border border-border px-3 py-1.5 font-sans text-label font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      Ver detalhes
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
