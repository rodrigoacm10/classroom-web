import type { SubjectClassItem } from "@/services/subject-classes";
import type {
  AttendanceTab,
  AttendanceStatusFilter,
  AttendancePeriod,
  AttendanceSort,
} from "../types";

export interface ChamadasFiltersProps {
  activeTab: AttendanceTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedClass: string;
  onClassChange: (classId: string) => void;
  subjectClasses: SubjectClassItem[];
  selectedStatus: AttendanceStatusFilter;
  onStatusChange: (status: AttendanceStatusFilter) => void;
  selectedPeriod: AttendancePeriod;
  onPeriodChange: (period: AttendancePeriod) => void;
  selectedSort: AttendanceSort;
  onSortChange: (sort: AttendanceSort) => void;
}

export function ChamadasFilters({
  activeTab,
  searchQuery,
  onSearchChange,
  selectedClass,
  onClassChange,
  subjectClasses,
  selectedStatus,
  onStatusChange,
  selectedPeriod,
  onPeriodChange,
  selectedSort,
  onSortChange,
}: ChamadasFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-paper px-10 pt-5 pb-4">
      {/* Search Input */}
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
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar turma ou disciplina..."
          className="w-full bg-transparent font-sans text-[14px] text-ink placeholder:text-muted focus:outline-none"
        />
      </div>

      {/* Filter: Turma */}
      <div className="relative">
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
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

      {/* Filter: Status (apenas em Realizadas) */}
      {activeTab === "realizadas" && (
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as AttendanceStatusFilter)}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
          >
            <option value="all">Status: Todos</option>
            <option value="closed">Encerrada</option>
            <option value="cancelled">Cancelada</option>
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

      {/* Filter: Período (apenas em Realizadas) */}
      {activeTab === "realizadas" && (
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value as AttendancePeriod)}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-white py-[9px] pr-8 pl-[14px] font-sans text-[14px] text-ink focus:border-control-border focus:outline-none"
          >
            <option value="30">Período: Últimos 30 dias</option>
            <option value="15">Últimos 15 dias</option>
            <option value="7">Últimos 7 dias</option>
            <option value="1">Hoje (1 dia)</option>
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
          onChange={(e) => onSortChange(e.target.value as AttendanceSort)}
          className="cursor-pointer appearance-none bg-transparent pr-5 font-sans text-[14px] text-ink focus:outline-none"
        >
          <option value="recent">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
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
  );
}
