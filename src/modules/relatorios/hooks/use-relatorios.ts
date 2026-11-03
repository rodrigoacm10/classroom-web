"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listSubjectClasses } from "@/services/subject-classes";
import { reportService } from "@/services/reports";
import type {
  TurmaReportOption,
  EnrichedClassReportResponse,
  EnrichedStudentReportItem,
  ReportStatusFilter,
  ReportSortOption,
} from "../types";

export function useRelatorios() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Turmas disponíveis e seleção
  const [availableTurmas, setAvailableTurmas] = useState<TurmaReportOption[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");
  const [loadingTurmas, setLoadingTurmas] = useState<boolean>(true);

  // Estado do Relatório da Turma Ativa
  const [classReport, setClassReport] = useState<EnrichedClassReportResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros da tabela
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>("all");
  const [sortOption, setSortOption] = useState<ReportSortOption>("risk_first");

  // Feedback de exportação
  const [isExportingCsv, setIsExportingCsv] = useState<boolean>(false);

  // Carregar lista de turmas da API
  const fetchTurmas = useCallback(async () => {
    setLoadingTurmas(true);
    setError(null);
    try {
      const response = await listSubjectClasses({ page_size: 100 });
      const items = response?.items || [];
      const mapped: TurmaReportOption[] = items.map((c) => ({
        id: c.id,
        name: c.name,
        discipline_name: c.discipline_name || c.name,
        professor_name: c.professor_name || "Docente Responsável",
        student_count: c.student_count || 0,
        room_name: c.room_name || undefined,
      }));

      setAvailableTurmas(mapped);

      // Determinar turma selecionada inicial
      const fromUrl = searchParams.get("turmaId");
      if (fromUrl && mapped.some((t) => t.id === fromUrl)) {
        setSelectedTurmaId(fromUrl);
      } else if (mapped.length > 0) {
        setSelectedTurmaId(mapped[0].id);
      } else {
        setSelectedTurmaId("");
      }
    } catch (err: unknown) {
      console.error("Erro ao listar turmas para relatórios:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as turmas da instituição."
      );
      setAvailableTurmas([]);
    } finally {
      setLoadingTurmas(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTurmas();
  }, [fetchTurmas]);

  // Carregar relatório consolidado da turma selecionada via API
  const loadReport = useCallback(async (turmaId: string) => {
    if (!turmaId) {
      setClassReport(null);
      setLoadingReport(false);
      return;
    }

    setLoadingReport(true);
    setError(null);

    try {
      const apiReport = await reportService.generateClassFrequencyReport(turmaId);
      const activeTurma = availableTurmas.find((t) => t.id === turmaId);

      const totalSessions =
        apiReport.students && apiReport.students[0]
          ? apiReport.students[0].total_present +
            apiReport.students[0].total_absent +
            apiReport.students[0].total_irregular
          : 0;

      const students = apiReport.students || [];
      const totalPresences = students.reduce((acc, s) => acc + s.total_present, 0);
      const totalAbsences = students.reduce((acc, s) => acc + s.total_absent, 0);
      const sumDistances = students.reduce(
        (acc, s) => acc + (s.avg_distance_meters || 0),
        0
      );
      const avgDist = students.length ? sumDistances / students.length : 0;
      const gpsWarnings = students.filter(
        (s) => s.confirmations_near_limit > 0
      ).length;

      const enrichedStudents: EnrichedStudentReportItem[] = students.map(
        (s, idx) => ({
          ...s,
          id: s.tenant_member_id || `std-${idx}`,
          total_sessions: totalSessions,
        })
      );

      const enriched: EnrichedClassReportResponse = {
        ...apiReport,
        subject_class_name: activeTurma?.name || "Turma",
        discipline_name:
          activeTurma?.discipline_name || activeTurma?.name || "Disciplina",
        professor_name: activeTurma?.professor_name || "Docente Responsável",
        room_name: activeTurma?.room_name,
        total_sessions: totalSessions,
        total_presences: totalPresences,
        total_absences: totalAbsences,
        avg_distance_meters: Math.round(avgDist * 10) / 10,
        students_with_gps_warning: gpsWarnings,
        students: enrichedStudents,
      };

      setClassReport(enriched);
    } catch (err: unknown) {
      console.error("Erro ao gerar relatório de frequência:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível consolidar o relatório desta turma."
      );
      setClassReport(null);
    } finally {
      setLoadingReport(false);
    }
  }, [availableTurmas]);

  useEffect(() => {
    if (selectedTurmaId) {
      loadReport(selectedTurmaId);
    } else {
      setClassReport(null);
      setLoadingReport(false);
    }
  }, [selectedTurmaId, loadReport]);

  // Atualizar turma selecionada e sincronizar URL
  const handleSelectTurma = useCallback(
    (turmaId: string) => {
      setSelectedTurmaId(turmaId);
      router.replace(
        `/dashboard/relatorios?turmaId=${encodeURIComponent(turmaId)}`,
        { scroll: false }
      );
    },
    [router]
  );

  // Filtragem e Ordenação da lista de estudantes
  const filteredStudents = useMemo(() => {
    if (!classReport?.students) return [];

    let list = [...classReport.students];

    // Busca textual (Nome ou E-mail)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.student_name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    // Filtro por Status
    if (statusFilter === "regular") {
      list = list.filter((s) => !s.at_risk);
    } else if (statusFilter === "risk") {
      list = list.filter((s) => s.at_risk);
    } else if (statusFilter === "gps_warning") {
      list = list.filter(
        (s) => s.confirmations_near_limit > 0 || s.avg_distance_meters > 35
      );
    }

    // Ordenação
    list.sort((a, b) => {
      switch (sortOption) {
        case "risk_first":
          if (a.at_risk && !b.at_risk) return -1;
          if (!a.at_risk && b.at_risk) return 1;
          return a.frequency_rate - b.frequency_rate;
        case "freq_desc":
          return b.frequency_rate - a.frequency_rate;
        case "freq_asc":
          return a.frequency_rate - b.frequency_rate;
        case "name_asc":
          return a.student_name.localeCompare(b.student_name, "pt-BR");
        case "name_desc":
          return b.student_name.localeCompare(a.student_name, "pt-BR");
        case "gps_desc":
          return b.avg_distance_meters - a.avg_distance_meters;
        default:
          return 0;
      }
    });

    return list;
  }, [classReport, searchQuery, statusFilter, sortOption]);

  // Limpar filtros
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortOption("risk_first");
  }, []);

  // Exportar para CSV
  const handleExportCsv = useCallback(() => {
    if (!classReport || !classReport.students.length) return;

    setIsExportingCsv(true);

    try {
      const headers = [
        "Nome do Aluno",
        "E-mail",
        "Presenças",
        "Faltas",
        "Frequência (%)",
        "Status Acadêmico",
        "Distância Média GPS (m)",
        "Confirmações Limiar GPS",
      ];

      const rows = classReport.students.map((s) => {
        const pct = (s.frequency_rate * 100).toFixed(1).replace(".", ",");
        const status = s.at_risk ? "Em Risco (<75%)" : "Regular (≥75%)";
        const dist = s.avg_distance_meters.toFixed(1).replace(".", ",");

        return [
          `"${s.student_name.replace(/"/g, '""')}"`,
          `"${s.email.replace(/"/g, '""')}"`,
          s.total_present,
          s.total_absent,
          `"${pct}%"`,
          `"${status}"`,
          `"${dist}"`,
          s.confirmations_near_limit,
        ].join(";");
      });

      const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const cleanTurmaName = classReport.subject_class_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

      const today = new Date().toISOString().slice(0, 10);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `relatorio-frequencia-${cleanTurmaName}-${today}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Falha ao exportar CSV:", err);
    } finally {
      setIsExportingCsv(false);
    }
  }, [classReport]);

  // Ação de Impressão
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const retry = useCallback(() => {
    if (selectedTurmaId) {
      loadReport(selectedTurmaId);
    } else {
      fetchTurmas();
    }
  }, [selectedTurmaId, loadReport, fetchTurmas]);

  return {
    availableTurmas,
    selectedTurmaId,
    handleSelectTurma,
    classReport,
    loading: loadingTurmas || loadingReport,
    loadingTurmas,
    loadingReport,
    error,
    retry,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    filteredStudents,
    handleClearFilters,
    handleExportCsv,
    isExportingCsv,
    handlePrint,
  };
}
