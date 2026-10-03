"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  listSubjectClasses,
  listRooms,
  openAttendanceSession,
  generateClassFrequencyReport,
  type SubjectClassItem,
  type Room,
  type ClassReportResponse,
} from "@/lib/api";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M10 3L5 8l5 5" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <path d="M4 6l4 4 4-4" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-muted">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M3.5 2.5l6 3.75-6 3.75V2.5z" fill="var(--color-ink)" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="6" cy="6" r="5" stroke="var(--color-on-ink-muted)" strokeWidth="1.2" />
      <path d="M6 5.5v3M6 4v.5" stroke="var(--color-on-ink-muted)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ClassesIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <rect x="1.5" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="8" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="8" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M7 1.5a4 4 0 0 1 4 4c0 2.5-4 7-4 7S3 8 3 5.5a4 4 0 0 1 4-4z" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
      <circle cx="7" cy="5.5" r="1.2" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="7" cy="7" r="5.5" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
      <path d="M7 4v3l2 1.2" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function StudentsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="5" cy="4.5" r="2" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
      <circle cx="9.5" cy="4.5" r="2" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" />
      <path d="M2 11c.5-1.8 1.8-2.8 3.7-2.8s3.2 1 3.7 2.8M10 8.4c1.3 0 2.4.7 2.9 1.9" stroke="var(--color-on-ink-subtle)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M7 1.5a4 4 0 0 1 4 4c0 2.5-4 7-4 7S3 8 3 5.5a4 4 0 0 1 4-4z" stroke="var(--color-muted)" strokeWidth="1.4" />
      <circle cx="7" cy="5.5" r="1.3" stroke="var(--color-muted)" strokeWidth="1.4" />
    </svg>
  );
}

function RadiusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="7" cy="7" r="5.5" stroke="var(--color-muted)" strokeWidth="1.4" />
      <path d="M7 4v3l2 1.2" stroke="var(--color-muted)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

export function PreviewSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3.5 animate-pulse" aria-busy="true">
      {/* Header skeleton */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-border" />
        <div className="h-3 w-36 rounded bg-border" />
      </div>

      {/* Turma card skeleton */}
      <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-paper p-5">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-60 rounded bg-border" />
            <div className="h-3.5 w-40 rounded bg-border/70" />
          </div>
          <div className="h-6 w-16 rounded-full bg-border/60" />
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <div className="flex">
            <div className="flex flex-1 flex-col gap-1.5 pr-4">
              <div className="h-2.5 w-12 rounded bg-border/70" />
              <div className="h-7 w-16 rounded bg-border" />
              <div className="h-2.5 w-24 rounded bg-border/60" />
            </div>
            <div className="w-px shrink-0 bg-border" />
            <div className="flex flex-1 flex-col gap-1.5 px-4">
              <div className="h-2.5 w-16 rounded bg-border/70" />
              <div className="h-7 w-16 rounded bg-border" />
              <div className="h-2.5 w-24 rounded bg-border/60" />
            </div>
            <div className="w-px shrink-0 bg-border" />
            <div className="flex flex-1 flex-col gap-1.5 pl-4">
              <div className="h-2.5 w-14 rounded bg-border/70" />
              <div className="h-7 w-10 rounded bg-border" />
              <div className="h-2.5 w-20 rounded bg-border/60" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="h-3 w-28 rounded bg-border/70" />
              <div className="h-3 w-10 rounded bg-border/70" />
            </div>
            <div className="h-[5px] w-full rounded-full bg-border" />
          </div>
        </div>
      </div>

      {/* Bottom cards row skeleton */}
      <div className="flex min-h-0 flex-1 gap-3.5">
        {/* Geofence map card skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-paper">
          <div className="flex-1 bg-border/30 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-border/50" />
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 p-4">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="h-3 w-40 rounded bg-border/60" />
            <div className="h-3 w-24 rounded bg-border/60" />
            <div className="h-6 w-28 rounded bg-border/50" />
          </div>
        </div>

        {/* Summary card skeleton */}
        <div className="flex flex-1 flex-col rounded-xl bg-ink p-5">
          <div className="h-3 w-16 rounded bg-white/20 pb-3.5" />
          <div className="flex flex-col gap-3 py-3">
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-white/20" />
              <div className="h-3 w-20 rounded bg-white/30" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <div className="h-3 w-14 rounded bg-white/20" />
              <div className="h-3 w-16 rounded bg-white/30" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-white/20" />
              <div className="h-3 w-14 rounded bg-white/30" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-white/20" />
              <div className="h-3 w-20 rounded bg-white/30" />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end pt-4">
            <div className="h-2.5 w-16 rounded bg-white/20 mb-2" />
            <div className="h-9 w-24 rounded bg-white/30" />
            <div className="mt-2.5 h-1 w-full rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormFieldsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" aria-busy="true">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 rounded bg-border/70" />
        <div className="h-3.5 w-32 rounded bg-border/60" />
        <div className="h-[46px] w-full rounded-md bg-surface border border-border" />
      </div>
      <div className="h-px bg-border" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 rounded bg-border/70" />
        <div className="h-3.5 w-36 rounded bg-border/60" />
        <div className="h-[46px] w-full rounded-md bg-surface border border-border" />
        <div className="h-3 w-56 rounded bg-border/50" />
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [10, 15, 30] as const;
type Duration = (typeof DURATION_OPTIONS)[number];

// ─── Main Component ───────────────────────────────────────────────────────────

export function NovaChamada() {
  const router = useRouter();

  // Estados dos formulários e seleções
  const [duration, setDuration] = useState<Duration>(15);
  const [classes, setClasses] = useState<SubjectClassItem[]>([]);
  const [classesTotal, setClassesTotal] = useState<number>(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedClass, setSelectedClass] = useState<SubjectClassItem | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [classReport, setClassReport] = useState<ClassReportResponse | null>(null);

  // Estados dos inputs de busca interna dos dropdowns
  const [classSearch, setClassSearch] = useState("");
  const [roomSearch, setRoomSearch] = useState("");

  // Estados de controle e feedback
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados dos dropdowns customizados
  const [turmaDropdownOpen, setTurmaDropdownOpen] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);

  const turmaDropdownRef = useRef<HTMLDivElement>(null);
  const roomDropdownRef = useRef<HTMLDivElement>(null);
  const classSearchInputRef = useRef<HTMLInputElement>(null);
  const roomSearchInputRef = useRef<HTMLInputElement>(null);

  // 1. Carga inicial das turmas e salas disponíveis na instituição
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // A API limita page_size a no máximo 50 (MAX_PAGE_SIZE = 50)
        const [classesRes, roomsRes] = await Promise.allSettled([
          listSubjectClasses({ active: true, page_size: 50 }),
          listRooms(),
        ]);

        if (!isMounted) return;

        if (classesRes.status === "fulfilled") {
          const items = classesRes.value.items ?? [];
          setClasses(items);
          setClassesTotal(classesRes.value.total ?? items.length);

          // Verifica se há turma passada via query param na URL (ex: ?turmaId=... ou ?classId=...)
          if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const queryId = urlParams.get("turmaId") || urlParams.get("classId");
            if (queryId) {
              const matched = items.find((c) => c.id === queryId);
              if (matched) {
                setSelectedClass(matched);
                setSelectedRoomId(matched.room_id ?? null);
              }
            }
          }
          // Caso contrário, NÃO pré-seleciona arbitrariamente: inicia vazio para escolha consciente do professor
        } else {
          const err = classesRes.reason;
          setError(err instanceof Error ? err.message : "Erro ao carregar turmas.");
        }

        if (roomsRes.status === "fulfilled") {
          setRooms(roomsRes.value ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Erro ao carregar dados iniciais."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Busca de turmas via Query na API com Debounce de 300ms
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await listSubjectClasses({
          active: true,
          search: classSearch.trim() || undefined,
          page_size: 50,
        });
        setClasses(res.items ?? []);
        setClassesTotal(res.total ?? 0);
      } catch (err) {
        console.error("Erro na busca de turmas via API:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [classSearch, loading]);

  // A sala ativa selecionada pode ser alterada manualmente ou assume a padrão da turma
  const selectedRoom =
    rooms.find((r) => r.id === selectedRoomId) ??
    (selectedClass?.room_id ? rooms.find((r) => r.id === selectedClass.room_id) : null) ??
    null;

  // 3. Atualizar relatório de alunos em risco sempre que a turma selecionada mudar
  useEffect(() => {
    if (!selectedClass?.id) {
      setClassReport(null);
      return;
    }
    let isMounted = true;

    async function fetchReport() {
      try {
        setReportLoading(true);
        const report = await generateClassFrequencyReport(selectedClass!.id);
        if (isMounted) {
          setClassReport(report);
        }
      } catch {
        // Fallback silencioso: se não houver histórico suficiente, mantém null
        if (isMounted) {
          setClassReport(null);
        }
      } finally {
        if (isMounted) {
          setReportLoading(false);
        }
      }
    }

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [selectedClass?.id]);

  // 4. Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        turmaDropdownRef.current &&
        !turmaDropdownRef.current.contains(event.target as Node)
      ) {
        setTurmaDropdownOpen(false);
      }
      if (
        roomDropdownRef.current &&
        !roomDropdownRef.current.contains(event.target as Node)
      ) {
        setRoomDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Foca no input de busca ao abrir o dropdown
  useEffect(() => {
    if (turmaDropdownOpen) {
      setTimeout(() => classSearchInputRef.current?.focus(), 50);
    }
  }, [turmaDropdownOpen]);

  useEffect(() => {
    if (roomDropdownOpen) {
      setTimeout(() => roomSearchInputRef.current?.focus(), 50);
    } else {
      setRoomSearch("");
    }
  }, [roomDropdownOpen]);

  // 5. Suporte a tecla Enter para iniciar a chamada quando houver turma selecionada
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && !submitting && selectedClass && !turmaDropdownOpen && !roomDropdownOpen) {
        handleSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedClass, selectedRoomId, duration, submitting, turmaDropdownOpen, roomDropdownOpen]);

  // Filtro local de salas (lista estática da tenant)
  const filteredRooms = rooms.filter((r) => {
    const query = roomSearch.trim().toLowerCase();
    if (!query) return true;
    return r.name.toLowerCase().includes(query);
  });

  // Valores derivados
  const turmaLabel = selectedClass
    ? `${selectedClass.discipline_name} · ${selectedClass.name}`
    : "Selecione uma turma";

  const localLabel = selectedRoom
    ? selectedRoom.name
    : selectedClass?.room_name
      ? selectedClass.room_name
      : selectedClass
        ? "Nenhuma sala vinculada (Selecione)"
        : "Aguardando seleção da turma";

  const studentCount = selectedClass?.student_count ?? 0;

  // Taxa de presença: converte 0.0-1.0 para porcentagem (ex: 0.91 -> 91%)
  const rawAttendance = classReport?.class_average_frequency ?? selectedClass?.attendance_rate ?? 0;
  const attendanceRatePercent = Math.round(rawAttendance <= 1 ? rawAttendance * 100 : rawAttendance);

  // Alunos em risco obtidos do relatório gerado ou fallback comentado caso a turma não tenha dados
  const studentsAtRiskCount = classReport?.students_at_risk ?? 0;

  async function handleSubmit() {
    if (!selectedClass) {
      setError("Selecione uma turma para iniciar a chamada.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const session = await openAttendanceSession(selectedClass.id, {
        room_id: selectedRoomId || undefined,
        duration_minutes: duration,
      });

      // Redireciona para a página de chamada ao vivo da sessão recém-criada
      router.push(
        `/dashboard/chamadas/${selectedClass.id}/${session.id}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao abrir chamada.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSelectTurma(item: SubjectClassItem) {
    setSelectedClass(item);
    setSelectedRoomId(item.room_id ?? null);
    setTurmaDropdownOpen(false);
  }

  function handleSelectRoom(room: Room) {
    setSelectedRoomId(room.id);
    setRoomDropdownOpen(false);
    setRoomSearch("");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-border bg-paper px-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/chamadas" className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
            <ChevronLeftIcon />
            <span className="text-label/caption font-medium text-muted">Chamadas</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-heading/body font-bold tracking-tight text-ink">Nova Chamada</span>
        </div>
        <Link
          href="/dashboard"
          className="flex h-[38px] items-center rounded-md border border-border px-[18px] text-[14px] font-medium leading-[18px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          Cancelar
        </Link>
      </header>

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
        {/* ── Left Panel: Form ── */}
        <aside className="flex w-[460px] shrink-0 flex-col border-r border-border">
          {/* Scrollable form fields */}
          <div className="flex flex-1 flex-col overflow-y-auto px-9 py-7">
            {loading ? (
              <FormFieldsSkeleton />
            ) : (
              <>
                {/* Section 1 — Turma */}
                <div className="relative flex flex-col gap-3 pb-5" ref={turmaDropdownRef}>
                  <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                    1 — Turma
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label/caption font-medium text-ink">Selecione a turma*</label>
                    <button
                      type="button"
                      disabled={classes.length === 0 && !classSearch}
                      onClick={() => setTurmaDropdownOpen((prev) => !prev)}
                      className={`flex h-[46px] shrink-0 cursor-pointer items-center justify-between rounded-md bg-surface px-[14px] [border-width:1.5px] border-solid transition-colors ${
                        selectedClass
                          ? "border-ink hover:border-ink/70"
                          : "border-border hover:border-ink/40"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <span
                        className={`text-[14px] leading-[18px] truncate mr-2 ${
                          selectedClass ? "font-medium text-ink" : "text-muted"
                        }`}
                      >
                        {classes.length === 0 && !classSearch ? "Nenhuma turma disponível" : turmaLabel}
                      </span>
                      <ChevronDownIcon className={turmaDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>

                    {/* Dropdown de Turmas com Busca via Query na API */}
                    {turmaDropdownOpen && (
                      <div className="absolute top-[82px] left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-paper shadow-2xl">
                        {/* Campo de Busca conectado à rota de pesquisa da API */}
                        <div className="border-b border-border p-2 bg-surface/40">
                          <div className="flex items-center gap-2 rounded-md bg-paper border border-border px-2.5 py-1.5 focus-within:border-ink">
                            {searchLoading ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                            ) : (
                              <SearchIcon />
                            )}
                            <input
                              ref={classSearchInputRef}
                              type="text"
                              value={classSearch}
                              onChange={(e) => setClassSearch(e.target.value)}
                              placeholder="Buscar por turma ou disciplina na API..."
                              className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none"
                            />
                            {classSearch && (
                              <button
                                type="button"
                                onClick={() => setClassSearch("")}
                                className="text-[11px] text-muted hover:text-ink cursor-pointer"
                              >
                                Limpar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lista com scroll */}
                        <div className="max-h-60 overflow-y-auto p-1">
                          {classes.length === 0 ? (
                            <div className="px-4 py-6 text-center text-[12px] text-muted">
                              {searchLoading
                                ? "Buscando turmas..."
                                : `Nenhuma turma encontrada para "${classSearch}"`}
                            </div>
                          ) : (
                            classes.map((c) => {
                              const isSelected = c.id === selectedClass?.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => handleSelectTurma(c)}
                                  className={`flex w-full items-center justify-between px-3.5 py-2.5 rounded-md text-left transition-colors hover:bg-surface cursor-pointer ${
                                    isSelected ? "bg-surface font-semibold text-ink" : "text-ink/80"
                                  }`}
                                >
                                  <div className="flex flex-col truncate pr-2 max-w-[340px]">
                                    <span className="text-[13px] font-medium text-ink truncate">
                                      {c.discipline_name} · {c.name}
                                    </span>
                                    <span className="text-[11px] text-muted truncate">
                                      {c.student_count} alunos · {c.room_name ?? "Sem sala padrão"}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>

                        {/* Indicador de limite/truncamento da paginação caso haja mais de 50 registros */}
                        {classesTotal > classes.length && (
                          <div className="border-t border-border px-3 py-1.5 bg-surface text-[11px] text-muted text-center">
                            Exibindo {classes.length} de {classesTotal} turmas. Digite acima para buscar turmas específicas.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px shrink-0 bg-border" />

                {/* Section 2 — Local */}
                <div className="relative flex flex-col gap-3 py-5" ref={roomDropdownRef}>
                  <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                    2 — Local
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label/caption font-medium text-ink">Sala para esta sessão</label>
                    <button
                      type="button"
                      disabled={!selectedClass || rooms.length === 0}
                      onClick={() => setRoomDropdownOpen((prev) => !prev)}
                      className={`flex h-[46px] shrink-0 cursor-pointer items-center justify-between rounded-md bg-surface px-[14px] [border-width:1.5px] border-solid transition-colors ${
                        selectedClass ? "border-border hover:border-ink/30" : "border-border/60 opacity-60"
                      } disabled:cursor-not-allowed`}
                    >
                      <span
                        className={`text-[14px] leading-[18px] truncate mr-2 ${
                          selectedClass ? "font-medium text-ink" : "text-muted"
                        }`}
                      >
                        {localLabel}
                      </span>
                      <ChevronDownIcon className={roomDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                    <p className="text-caption/caption text-muted">
                      {selectedClass
                        ? "Pré-selecionada da turma. Altere apenas se necessário."
                        : "Selecione a turma primeiro para carregar a sala associada."}
                    </p>

                    {/* Dropdown de Salas com Busca */}
                    {roomDropdownOpen && (
                      <div className="absolute top-[82px] left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-paper shadow-2xl">
                        {/* Campo de Busca de Sala */}
                        <div className="border-b border-border p-2 bg-surface/40">
                          <div className="flex items-center gap-2 rounded-md bg-paper border border-border px-2.5 py-1.5 focus-within:border-ink">
                            <SearchIcon />
                            <input
                              ref={roomSearchInputRef}
                              type="text"
                              value={roomSearch}
                              onChange={(e) => setRoomSearch(e.target.value)}
                              placeholder="Buscar sala por nome..."
                              className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none"
                            />
                            {roomSearch && (
                              <button
                                type="button"
                                onClick={() => setRoomSearch("")}
                                className="text-[11px] text-muted hover:text-ink cursor-pointer"
                              >
                                Limpar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lista com scroll */}
                        <div className="max-h-60 overflow-y-auto p-1">
                          {filteredRooms.length === 0 ? (
                            <div className="px-4 py-6 text-center text-[12px] text-muted">
                              Nenhuma sala encontrada para &ldquo;{roomSearch}&rdquo;
                            </div>
                          ) : (
                            filteredRooms.map((r) => {
                              const isSelected = r.id === selectedRoom?.id;
                              return (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => handleSelectRoom(r)}
                                  className={`flex w-full items-center justify-between px-3.5 py-2.5 rounded-md text-left transition-colors hover:bg-surface cursor-pointer ${
                                    isSelected ? "bg-surface font-semibold text-ink" : "text-ink/80"
                                  }`}
                                >
                                  <div className="flex flex-col truncate pr-2 max-w-[340px]">
                                    <span className="text-[13px] font-medium text-ink truncate">{r.name}</span>
                                    <span className="text-[11px] text-muted truncate">
                                      Raio: {r.tolerance_radius_meters}m · ({r.latitude.toFixed(4)}, {r.longitude.toFixed(4)})
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px shrink-0 bg-border" />
              </>
            )}

            {/* Section 3 — Duração */}
            <div className="flex flex-col gap-3 pt-5">
              <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                3 — Duração
              </span>
              <div className="flex flex-col gap-1.5">
                <label className="text-label/caption font-medium text-ink">
                  Janela para confirmar presença*
                </label>
                <div className="flex items-center gap-2">
                  {DURATION_OPTIONS.map((opt) => {
                    const active = duration === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDuration(opt)}
                        className={`flex h-10 cursor-pointer items-center rounded-md px-[18px] text-[14px] leading-[18px] transition-colors [border-width:1.5px] border-solid ${
                          active
                            ? "border-ink bg-ink font-bold text-accent"
                            : "border-border bg-paper font-medium text-ink hover:border-ink/30"
                        }`}
                      >
                        {opt} min
                      </button>
                    );
                  })}
                </div>
                <p className="text-caption/caption text-muted">
                  O código expira após esse período. Padrão recomendado: 15 min.
                </p>
              </div>
            </div>
          </div>

          {/* ── CTA footer ── */}
          <div className="flex shrink-0 flex-col gap-2.5 border-t border-border bg-paper px-9 py-5">
            <button
              type="button"
              disabled={submitting || !selectedClass}
              onClick={handleSubmit}
              className="flex h-[60px] shrink-0 cursor-pointer items-center gap-3.5 rounded-xl bg-ink px-5 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <PlayIcon />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-body font-bold leading-[115%] tracking-[-0.01em] text-on-ink">
                  {submitting
                    ? "Iniciando chamada..."
                    : selectedClass
                      ? "Iniciar chamada agora"
                      : "Selecione uma turma"}
                </span>
                <span className="text-[11px] leading-[14px] text-on-ink-subtle">
                  {selectedClass ? "Clique aqui ou pressione ↵ Enter" : "Escolha a turma no formulário para habilitar"}
                </span>
              </div>
              {selectedClass && (
                <div className="flex h-[26px] shrink-0 items-center justify-center rounded-sm border border-on-ink-border px-[9px]">
                  <span className="font-mono text-caption/caption text-on-ink-subtle">↵</span>
                </div>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5">
              <InfoIcon />
              <span className="text-[11px] leading-[14px] text-on-ink-muted">
                {selectedClass
                  ? `${studentCount} alunos serão notificados imediatamente ao iniciar`
                  : "Nenhum aluno será notificado até que a chamada seja iniciada"}
              </span>
            </div>
          </div>
        </aside>

        {/* ── Right Panel: Preview ── */}
        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-surface p-5">
          {loading ? (
            <PreviewSkeleton />
          ) : !selectedClass ? (
            /* Estado neutro sem turma selecionada */
            <div className="flex flex-1 flex-col items-center justify-center p-10 text-center bg-paper rounded-xl border border-dashed border-border min-h-[400px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border mb-4 text-muted">
                <ClassesIcon className="h-6 w-6 text-muted" />
              </div>
              <h3 className="text-body font-bold text-ink">Nenhuma turma selecionada</h3>
              <p className="text-caption/body text-muted mt-1.5 max-w-sm">
                Selecione uma turma no formulário ao lado para visualizar a prévia em tempo real com estatísticas de matrículas, frequência média e o mapa com geofence da sala.
              </p>
              <button
                type="button"
                onClick={() => setTurmaDropdownOpen(true)}
                className="mt-5 inline-flex h-9 items-center justify-center rounded-md border border-ink/20 bg-surface px-4 text-[13px] font-medium text-ink transition-colors hover:border-ink/50 hover:bg-paper cursor-pointer"
              >
                Selecionar turma
              </button>
            </div>
          ) : (
            <>
              {/* Header "Prévia em tempo real" */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                  Prévia em tempo real
                </span>
              </div>

              {/* Turma card */}
              <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-paper">
                <div className="flex items-start justify-between gap-3 border-b border-border px-5 pb-3.5 pt-4">
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[16px] font-bold leading-[120%] tracking-tight text-ink">
                      {selectedClass.discipline_name}
                    </span>
                    <span className="text-label/caption text-muted">
                      {selectedClass.name} · {localLabel}
                      {/*
                        Nota: Informações de turno e horário (ex: "Noturno · 19h") não possuem colunas dedicadas
                        no modelo SubjectClass da API, portanto são mantidas aqui como referência visual.
                      */}
                      {" · Noturno · 19h"}
                    </span>
                  </div>
                  <div className="shrink-0 rounded-full bg-success-surface px-2.5 py-1">
                    <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.04em] text-success">
                      {selectedClass.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 px-5 py-3.5">
                  {/* Stats row */}
                  <div className="flex">
                    <div className="flex flex-1 flex-col gap-0.5 pr-4">
                      <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">Alunos</span>
                      <span className="text-title font-bold leading-[100%] tracking-[-0.03em] text-ink">
                        {studentCount}
                      </span>
                      <span className="text-[11px] leading-[14px] text-on-ink-muted">matrículas ativas</span>
                    </div>
                    <div className="w-px shrink-0 bg-border" />
                    <div className="flex flex-1 flex-col gap-0.5 px-4">
                      <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">Freq. Média</span>
                      <span className="text-title font-bold leading-[100%] tracking-[-0.03em] text-success">
                        {attendanceRatePercent}%
                      </span>
                      <span className="text-[11px] leading-[14px] text-on-ink-muted">últimas 30 aulas</span>
                    </div>
                    <div className="w-px shrink-0 bg-border" />
                    <div className="flex flex-1 flex-col gap-0.5 pl-4">
                      <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">Em risco</span>
                      {reportLoading ? (
                        <div className="h-7 w-8 rounded bg-border animate-pulse my-0.5" />
                      ) : (
                        <span className="text-title font-bold leading-[100%] tracking-[-0.03em] text-danger">
                          {studentsAtRiskCount}
                        </span>
                      )}
                      <span className="text-[11px] leading-[14px] text-on-ink-muted">abaixo de 75%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-caption/caption text-muted">Frequência geral</span>
                      <span className="text-caption/caption font-bold text-success">
                        {attendanceRatePercent}%
                      </span>
                    </div>
                    <div className="h-[5px] overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-success transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(attendanceRatePercent, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom cards row */}
              <div className="flex min-h-0 flex-1 gap-3.5">
                {/* Geofence map card */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-paper">
                  {/* Map placeholder */}
                  <div
                    className="relative flex flex-1 items-center justify-center overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #eaeef2 0%, #dce3ea 50%, #d0d9e3 100%)",
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: "#4285F41F" }} />
                    <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFC4008C] bg-[#FFC40026]" />
                      <div
                        className="relative h-[22px] w-[22px] shrink-0 rounded-tl-full rounded-tr-full rounded-br-full bg-accent border-[3px] border-solid border-ink origin-center shadow-[0px_2px_8px_#00000040]"
                        style={{ rotate: "-45deg" }}
                      />
                    </div>
                  </div>

                  {/* Map info */}
                  <div className="flex shrink-0 flex-col gap-2 px-4 py-3.5">
                    <span className="text-[14px] font-bold leading-[18px] text-ink">{localLabel}</span>
                    <div className="flex flex-col gap-[5px]">
                      <div className="flex items-center gap-[7px]">
                        <LocationPinIcon />
                        <span className="text-caption/caption text-muted">
                          {selectedRoom
                            ? `${selectedRoom.latitude.toFixed(4)}, ${selectedRoom.longitude.toFixed(4)}`
                            : /* Coordenadas de exemplo caso nenhuma sala física possua latitude/longitude */
                              "-23.5505, -46.6333"}
                        </span>
                      </div>
                      <div className="flex items-center gap-[7px]">
                        <RadiusIcon />
                        <span className="text-caption/caption text-muted">
                          Raio: {selectedRoom?.tolerance_radius_meters ?? 80} m
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[7px] rounded-md bg-surface px-2.5 py-[7px]">
                      <div className="h-[7px] w-[7px] shrink-0 rounded-full bg-success" />
                      <span className="text-[11px] leading-[14px] text-muted">Geofence ativo</span>
                    </div>
                  </div>
                </div>

                {/* Summary card */}
                <div className="flex flex-1 flex-col rounded-xl bg-ink px-5 py-[18px]">
                  <span className="shrink-0 pb-3.5 text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-on-ink-subtle">
                    Resumo
                  </span>

                  <div className="flex flex-col">
                    {/* Turma */}
                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <ClassesIcon className="h-3.5 w-3.5 text-on-ink-muted" />
                        <span className="text-label/caption text-on-ink-muted">Turma</span>
                      </div>
                      <span className="text-label/caption font-semibold text-on-ink">
                        {selectedClass.discipline_name.slice(0, 3).toUpperCase()} · {selectedClass.name}
                      </span>
                    </div>
                    <div className="h-px bg-on-ink-border" />

                    {/* Local */}
                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <LocationIcon />
                        <span className="text-label/caption text-on-ink-muted">Local</span>
                      </div>
                      <span className="text-label/caption font-semibold text-on-ink">{localLabel}</span>
                    </div>
                    <div className="h-px bg-on-ink-border" />

                    {/* Duração */}
                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <ClockIcon />
                        <span className="text-label/caption text-on-ink-muted">Duração</span>
                      </div>
                      <span className="text-label/caption font-bold text-accent">{duration} min</span>
                    </div>
                    <div className="h-px bg-on-ink-border" />

                    {/* Alunos */}
                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <StudentsIcon />
                        <span className="text-label/caption text-on-ink-muted">Alunos</span>
                      </div>
                      <span className="text-label/caption font-semibold text-on-ink">{studentCount} alertados</span>
                    </div>
                    <div className="h-px bg-on-ink-border" />
                  </div>

                  {/* Timer preview */}
                  <div className="flex flex-1 flex-col justify-end pt-4">
                    <span className="pb-2 text-[10px] font-bold uppercase leading-3 tracking-[0.1em] text-muted">
                      Expira em
                    </span>
                    <span className="font-mono text-display font-bold leading-[100%] tracking-[-0.04em] text-on-ink">
                      {String(duration).padStart(2, "0")}:00
                    </span>
                    <div className="mb-1.5 mt-2.5 h-1 overflow-hidden rounded-full bg-on-ink-border">
                      <div className="h-full w-full rounded-full bg-accent" />
                    </div>
                    <span className="text-[11px] leading-[14px] text-muted">Contador inicia após abertura</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
