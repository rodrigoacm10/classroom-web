"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createSubjectClass,
  enrollStudent,
} from "@/services/subject-classes";
import { listRooms, type Room } from "@/services/rooms";
import { listStudents, type StudentItem } from "@/services/tenants";
import { getMyProfile, type UserProfileResponse } from "@/services/user";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5A4.5 4.5 0 0 0 8 1.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-muted">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 13c0-2.5 2-3.8 4.5-3.8s4.5 1.3 4.5 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 4a2.2 2.2 0 0 1 0 4.4M14.5 12.5c0-1.8-1.2-2.8-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M6 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 1H13m0 0v4.5M13 1 7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CLASS_SUGGESTIONS = [
  "Turma A — Noturno",
  "Turma B — Matutino",
  "Turma C — Vespertino",
  "Turma Especial 2026/1",
];

const DISCIPLINE_SUGGESTIONS = [
  "Engenharia de Software",
  "Banco de Dados Avançado",
  "Inteligência Artificial & Machine Learning",
  "Sistemas Distribuídos & Cloud",
  "Redes de Computadores",
];

const AVATAR_PALETTE = [
  { bg: "#EBF3FE", text: "#1D64B4", border: "#D4E5FB" },
  { bg: "#FEF4E8", text: "#A45500", border: "#FCE4CA" },
  { bg: "#F3EDFB", text: "#6735A4", border: "#E5D7F8" },
  { bg: "#EBF6EE", text: "#1B733F", border: "#D2EDDA" },
  { bg: "#FDF0F0", text: "#B72314", border: "#FACCCC" },
  { bg: "#E6F7F8", text: "#006B70", border: "#C4EFF1" },
];

function getAvatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

function getRadiusLabel(meters: number): { label: string; color: string; bg: string } {
  if (meters <= 30) return { label: `Preciso · ${meters}m`, color: "var(--color-success)", bg: "var(--color-success-surface)" };
  if (meters <= 60) return { label: `Padrão · ${meters}m`, color: "var(--color-ink)", bg: "var(--color-surface)" };
  return { label: `Amplo · ${meters}m`, color: "var(--color-warn)", bg: "#FEF3C7" };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NovaTurma() {
  const router = useRouter();
  const nameId = useId();
  const disciplineId = useId();

  // Form states
  const [name, setName] = useState("");
  const [disciplineName, setDisciplineName] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  // Rooms and Students data from API
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [catalogStudents, setCatalogStudents] = useState<StudentItem[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);

  // Student enrollment states
  const [studentMode, setStudentMode] = useState<"catalog" | "batch">("catalog");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [batchText, setBatchText] = useState("");
  const [processingBatch, setProcessingBatch] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<StudentItem[]>([]);

  // Submission & Validation states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debounce da pesquisa de alunos por nome ou e-mail (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(catalogSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [catalogSearch]);

  // Carrega lista de alunos da API (20 iniciais e atualiza conforme busca)
  useEffect(() => {
    let isCurrent = true;

    async function fetchStudents() {
      try {
        setLoadingStudents(true);
        const res = await listStudents({
          search: debouncedSearch.trim() || undefined,
          page_size: 20,
        });

        if (isCurrent) {
          setCatalogStudents(res.items);
        }
      } catch (err) {
        if (isCurrent) {
          console.warn("Falha ao carregar alunos da API:", err);
        }
      } finally {
        if (isCurrent) {
          setLoadingStudents(false);
        }
      }
    }

    fetchStudents();

    return () => {
      isCurrent = false;
    };
  }, [debouncedSearch]);

  // Carrega salas físicas e perfil do professor logado da API
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoadingRooms(true);

        const [roomsRes, profileRes] = await Promise.allSettled([
          listRooms(),
          getMyProfile(),
        ]);

        if (!isMounted) return;

        if (roomsRes.status === "fulfilled") {
          const roomList = roomsRes.value;
          setRooms(roomList);
          if (roomList.length > 0) {
            setSelectedRoomId(roomList[0].id);
          }
        } else {
          console.warn("Falha ao carregar salas da API:", roomsRes.reason);
        }

        if (profileRes.status === "fulfilled") {
          setCurrentUser(profileRes.value);
        }
      } finally {
        if (isMounted) {
          setLoadingRooms(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected Room helper
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) ?? null;
  }, [rooms, selectedRoomId]);

  // Indicador de busca em andamento (digitando no debounce ou carregando da API)
  const isSearching = loadingStudents || catalogSearch !== debouncedSearch;

  // Alunos retornados da API que ainda não foram selecionados
  const unselectedCatalogStudents = useMemo(() => {
    const selectedIds = new Set(selectedStudents.map((s) => s.id));
    return catalogStudents.filter((s) => !selectedIds.has(s.id));
  }, [catalogStudents, selectedStudents]);

  // Actions for student list
  function handleAddStudent(student: StudentItem) {
    setSelectedStudents((prev) => [...prev, student]);
  }

  function handleRemoveStudent(studentId: string) {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId));
  }

  function handleAddAllCatalog() {
    const selectedIds = new Set(selectedStudents.map((s) => s.id));
    const toAdd = unselectedCatalogStudents.filter((s) => !selectedIds.has(s.id));
    setSelectedStudents((prev) => [...prev, ...toAdd]);
  }

  async function handleProcessBatch() {
    if (!batchText.trim() || processingBatch) return;
    const items = batchText
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const selectedIds = new Set(selectedStudents.map((s) => s.id));
    const toAdd: StudentItem[] = [];

    setProcessingBatch(true);
    try {
      for (const item of items) {
        const query = item.toLowerCase();
        // 1. Tenta encontrar no catálogo já carregado
        let matched = catalogStudents.find(
          (s) =>
            s.email.toLowerCase() === query ||
            s.name.toLowerCase() === query ||
            s.email.toLowerCase().startsWith(query)
        );

        // 2. Se não estiver no catálogo carregado, pesquisa diretamente na API
        if (!matched) {
          try {
            const res = await listStudents({ search: item, page_size: 5 });
            matched = res.items.find(
              (s) =>
                s.email.toLowerCase() === query ||
                s.name.toLowerCase() === query ||
                s.email.toLowerCase().startsWith(query)
            );
          } catch (e) {
            console.warn("Erro ao buscar aluno por lote:", e);
          }
        }

        if (matched && !selectedIds.has(matched.id)) {
          selectedIds.add(matched.id);
          toAdd.push(matched);
        }
      }

      if (toAdd.length > 0) {
        setSelectedStudents((prev) => [...prev, ...toAdd]);
        setBatchText("");
      }
    } finally {
      setProcessingBatch(false);
    }
  }

  // Submission handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Por favor, preencha o nome da turma.");
      return;
    }

    if (!disciplineName.trim()) {
      setErrorMessage("Por favor, preencha o nome da disciplina.");
      return;
    }

    if (!selectedRoomId) {
      setErrorMessage("Selecione uma sala física vinculada para o perímetro de presença.");
      return;
    }

    try {
      setSubmitting(true);

      // Cria a turma na API (POST /subject-classes)
      const createdClass = await createSubjectClass({
        name: name.trim(),
        discipline_name: disciplineName.trim(),
        room_id: selectedRoomId,
      });

      // Matricula todos os alunos selecionados na turma criada (POST /subject-classes/{id}/enrollments)
      if (selectedStudents.length > 0) {
        await Promise.allSettled(
          selectedStudents.map((s) => enrollStudent(createdClass.id, s.id))
        );
      }

      router.push(`/dashboard/turmas/${createdClass.id}`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao criar a turma. Tente novamente."
      );
      setSubmitting(false);
    }
  }

  const avatar = getAvatarStyle(disciplineName || name || "Turma");

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Top Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-border bg-white px-8 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <nav className="flex items-center gap-2 text-caption text-muted mb-1 font-medium">
            <Link href="/dashboard/turmas" className="hover:text-ink transition-colors flex items-center gap-1">
              <ChevronLeftIcon size={14} />
              <span>Turmas</span>
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">Nova turma</span>
          </nav>
          <h1 className="text-title font-bold text-ink leading-title tracking-tight">
            Criar nova turma
          </h1>
          <p className="text-body text-muted mt-0.5">
            Configure os dados acadêmicos, associe a sala física para geofencing e matricule os alunos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/turmas"
            className="flex h-10 items-center rounded-lg border border-border bg-white px-4 text-label font-medium text-ink transition-colors hover:bg-surface"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            form="nova-turma-form"
            disabled={submitting}
            className="flex h-10 items-center gap-2 rounded-lg bg-ink px-5 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Criando turma...</span>
              </>
            ) : (
              <span>Criar turma</span>
            )}
          </button>
        </div>
      </div>

      {/* ─── Main Content Split View ─────────────────────────────────────────── */}
      <div className="flex-1 px-8 py-8 lg:px-10">
        <form
          id="nova-turma-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        >
          {/* ─── Coluna Esquerda: Formulário ──────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-8">
            {errorMessage && (
              <div className="rounded-xl border border-danger/30 bg-danger-surface p-4 text-label font-medium text-danger">
                {errorMessage}
              </div>
            )}

            {/* SEÇÃO 1: Identificação Básica */}
            <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-2xs">
              <div className="border-b border-border pb-4 mb-6">
                <span className="text-caption font-bold uppercase tracking-caps text-muted block">
                  Etapa 01
                </span>
                <h2 className="text-heading font-bold text-ink">
                  Identificação da Turma
                </h2>
                <p className="text-caption text-muted mt-0.5">
                  Informe o nome da turma e da matéria para visualização dos alunos.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor={nameId} className="block text-label font-bold text-ink mb-1.5">
                    Nome da Turma <span className="text-danger">*</span>
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Turma A — Noturno"
                    className="h-11 w-full rounded-lg border border-border bg-white px-3.5 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
                  />
                  {/* Suggestions pills */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-muted mr-1">Sugestões:</span>
                    {CLASS_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setName(sug)}
                        className="rounded-md border border-border bg-surface px-2 py-0.5 text-caption font-medium text-ink hover:border-control-border transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor={disciplineId} className="block text-label font-bold text-ink mb-1.5">
                    Nome da Disciplina <span className="text-danger">*</span>
                  </label>
                  <input
                    id={disciplineId}
                    type="text"
                    required
                    value={disciplineName}
                    onChange={(e) => setDisciplineName(e.target.value)}
                    placeholder="Ex: Engenharia de Software"
                    className="h-11 w-full rounded-lg border border-border bg-white px-3.5 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
                  />
                  {/* Suggestions pills */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-muted mr-1">Frequentes:</span>
                    {DISCIPLINE_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setDisciplineName(sug)}
                        className="rounded-md border border-border bg-surface px-2 py-0.5 text-caption font-medium text-ink hover:border-control-border transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: Sala Física Vinculada */}
            <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-2xs">
              <div className="flex items-start justify-between border-b border-border pb-4 mb-6">
                <div>
                  <span className="text-caption font-bold uppercase tracking-caps text-muted block">
                    Etapa 02
                  </span>
                  <h2 className="text-heading font-bold text-ink">
                    Vínculo de Sala Física (Geofence)
                  </h2>
                  <p className="text-caption text-muted mt-0.5">
                    A presença dos alunos será validada pelo raio geográfico da sala selecionada.
                  </p>
                </div>

                <Link
                  href="/dashboard/salas/nova"
                  target="_blank"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-caption font-semibold text-ink hover:bg-surface transition-colors"
                  title="Abrir cadastro de salas em nova aba"
                >
                  <PlusIcon size={12} />
                  <span>Nova sala</span>
                  <ExternalLinkIcon size={11} />
                </Link>
              </div>

              {/* Rooms Selection Grid */}
              {loadingRooms ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 rounded-xl border border-border bg-surface/50 animate-pulse" />
                  ))}
                </div>
              ) : rooms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center bg-surface/30">
                  <p className="text-body font-semibold text-ink">Nenhuma sala física cadastrada</p>
                  <p className="text-caption text-muted mt-1">
                    É necessário ter pelo menos uma sala física cadastrada na instituição para definir o geofence da turma.
                  </p>
                  <Link
                    href="/dashboard/salas/nova"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-caption font-bold text-white hover:opacity-90 transition-opacity"
                  >
                    <PlusIcon size={12} />
                    <span>Cadastrar primeira sala</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rooms.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const radius = getRadiusLabel(room.tolerance_radius_meters);

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "border-accent bg-accent-surface/20 ring-1 ring-accent"
                            : "border-border bg-white hover:border-control-border hover:bg-surface/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                isSelected ? "bg-ink text-accent" : "bg-surface text-muted"
                              }`}
                            >
                              <MapPinIcon size={15} />
                            </span>
                            <span className="text-body font-bold text-ink leading-tight">
                              {room.name}
                            </span>
                          </div>

                          {isSelected && (
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                              <CheckIcon size={11} />
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-caption text-muted pt-2 border-t border-border/60">
                          <span className="truncate font-mono text-[11px]">
                            {room.latitude.toFixed(4)}, {room.longitude.toFixed(4)}
                          </span>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                            style={{ background: radius.bg, color: radius.color }}
                          >
                            {radius.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SEÇÃO 3: Matrícula de Alunos */}
            <div className="rounded-2xl border border-border bg-white p-6 md:p-7 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <span className="text-caption font-bold uppercase tracking-caps text-muted block">
                    Etapa 03
                  </span>
                  <h2 className="text-heading font-bold text-ink">
                    Alunos Matriculados
                  </h2>
                  <p className="text-caption text-muted mt-0.5">
                    Adicione os estudantes que terão direito a registrar presença nesta turma.
                  </p>
                </div>

                <span className="rounded-full bg-surface border border-border px-3 py-1 font-mono text-caption font-bold text-ink">
                  {selectedStudents.length} alunos
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-border mb-5">
                <button
                  type="button"
                  onClick={() => setStudentMode("catalog")}
                  className={`pb-2.5 text-label font-bold transition-colors border-b-2 cursor-pointer ${
                    studentMode === "catalog"
                      ? "border-ink text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  Buscar no catálogo da instituição
                </button>
                <button
                  type="button"
                  onClick={() => setStudentMode("batch")}
                  className={`pb-2.5 text-label font-bold transition-colors border-b-2 cursor-pointer ${
                    studentMode === "batch"
                      ? "border-ink text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  Colar lista em lote (e-mails / nomes)
                </button>
              </div>

              {/* Tab 1: Catalog Search & Select */}
              {studentMode === "catalog" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {isSearching ? (
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                        ) : (
                          <SearchIcon size={14} />
                        )}
                      </div>
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Buscar aluno por nome ou e-mail..."
                        className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-8 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
                      />
                      {catalogSearch && (
                        <button
                          type="button"
                          onClick={() => setCatalogSearch("")}
                          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted hover:text-ink cursor-pointer"
                          title="Limpar pesquisa"
                        >
                          <CloseIcon size={12} />
                        </button>
                      )}
                    </div>
                    {unselectedCatalogStudents.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAddAllCatalog}
                        className="h-10 rounded-lg border border-border bg-surface px-3 text-caption font-semibold text-ink hover:border-control-border transition-colors cursor-pointer shrink-0"
                      >
                        + Adicionar todos ({unselectedCatalogStudents.length})
                      </button>
                    )}
                  </div>

                  {!catalogSearch.trim() && catalogStudents.length >= 20 && (
                    <p className="text-[12px] text-muted">
                      Exibindo 20 alunos iniciais. Digite o nome ou e-mail acima para pesquisar outros alunos.
                    </p>
                  )}

                  {/* Available to select */}
                  {loadingStudents ? (
                    <div className="p-4 text-center text-caption text-muted animate-pulse">
                      {catalogSearch.trim()
                        ? "Buscando alunos..."
                        : "Carregando catálogo de alunos da instituição..."}
                    </div>
                  ) : unselectedCatalogStudents.length > 0 ? (
                    <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-border p-2 bg-[#FAFAFA]">
                      {unselectedCatalogStudents.map((stu) => (
                        <div
                          key={stu.id}
                          className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-border/60 hover:border-border transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-caption font-bold text-ink">
                              {(stu.name || "A").charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-label font-bold text-ink truncate">{stu.name}</span>
                              <span className="text-[11px] text-muted truncate">
                                {stu.email}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddStudent(stu)}
                            className="flex h-8 items-center gap-1 rounded-md bg-ink px-2.5 text-caption font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shrink-0"
                          >
                            <PlusIcon size={11} />
                            <span>Adicionar</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : catalogSearch.trim() ? (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-caption text-muted bg-surface/30">
                      Nenhum aluno encontrado para &quot;{catalogSearch}&quot;.
                    </div>
                  ) : catalogStudents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-caption text-muted bg-surface/30">
                      Nenhum aluno cadastrado na instituição ainda.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-caption text-muted bg-surface/30">
                      Todos os alunos exibidos já foram adicionados à turma.
                    </div>
                  )}
                </div>
              ) : (
                /* Tab 2: Batch Paste */
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    placeholder="Cole aqui os e-mails dos alunos cadastrados separados por vírgula ou linha...&#10;Ex: lucas.silva@aluno.locus.edu.br, mariana.costa@aluno.locus.edu.br"
                    className="w-full rounded-lg border border-border bg-white p-3 text-body text-ink placeholder:text-muted focus:border-control-border focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-muted">
                      Separe por vírgula ou quebra de linha. O sistema vincula automaticamente com alunos do catálogo.
                    </span>
                    <button
                      type="button"
                      onClick={handleProcessBatch}
                      disabled={!batchText.trim() || processingBatch}
                      className="rounded-lg bg-ink px-4 py-2 text-label font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
                    >
                      {processingBatch ? "Processando..." : "Processar lista"}
                    </button>
                  </div>
                </div>
              )}

              {/* Selected students chips */}
              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-caption font-bold uppercase tracking-caps text-muted">
                    Lista da Turma ({selectedStudents.length})
                  </span>
                  {selectedStudents.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedStudents([])}
                      className="text-caption font-medium text-danger hover:underline cursor-pointer"
                    >
                      Remover todos
                    </button>
                  )}
                </div>

                {selectedStudents.length === 0 ? (
                  <p className="text-caption text-muted italic">
                    Nenhum aluno matriculado ainda. Adicione alunos pelo catálogo ou cole a lista em lote acima.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                    {selectedStudents.map((stu) => (
                      <div
                        key={stu.id}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-label text-ink"
                      >
                        <span className="font-medium text-ink">{stu.name}</span>
                        <span className="text-[11px] text-muted truncate max-w-[140px]">({stu.email})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(stu.id)}
                          className="text-muted hover:text-danger cursor-pointer ml-1"
                          title={`Remover ${stu.name}`}
                        >
                          <CloseIcon size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Coluna Direita: Live Preview Dinâmico (Sticky) ──────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="rounded-2xl border border-border bg-white shadow-md overflow-hidden">
              {/* Preview Header Banner */}
              <div className="border-b border-border bg-[#FAFAFA] px-5 py-3 flex items-center justify-between">
                <span className="text-caption font-bold uppercase tracking-caps text-muted flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success inline-block animate-pulse" />
                  PRÉ-VISUALIZAÇÃO EM TEMPO REAL
                </span>
                <span className="rounded bg-surface border border-border px-2 py-0.5 text-[11px] font-mono text-muted">
                  Cards & Tabela
                </span>
              </div>

              {/* Class Preview Card */}
              <div className="p-6 space-y-6">
                {/* Main Card Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-heading border shadow-2xs"
                    style={{
                      backgroundColor: avatar.bg,
                      color: avatar.text,
                      borderColor: avatar.border,
                    }}
                  >
                    {(name || disciplineName || "TR").substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-success-surface px-2 py-0.5 text-[11px] font-bold text-success mb-1">
                      TURMA ATIVA
                    </span>
                    <h3 className="text-title font-bold text-ink leading-tight truncate">
                      {name || <span className="text-muted/60 italic font-normal">Nome da Turma</span>}
                    </h3>
                    <p className="text-body text-muted truncate mt-0.5">
                      {disciplineName || <span className="text-muted/60 italic">Disciplina a ser definida</span>}
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Docente */}
                  <div className="rounded-xl border border-border bg-surface/50 p-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-caps text-muted block mb-1">
                      Docente Responsável
                    </span>
                    <span className="text-label font-bold text-ink block truncate">
                      {currentUser?.name ?? "Professor Conectado"}
                    </span>
                    <span className="text-[11px] text-muted">Você (Conectado)</span>
                  </div>

                  {/* Sala Física */}
                  <div className="rounded-xl border border-border bg-surface/50 p-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-caps text-muted block mb-1">
                      Espaço Físico
                    </span>
                    <span className="text-label font-bold text-ink block truncate">
                      {selectedRoom ? selectedRoom.name : "Nenhuma sala"}
                    </span>
                    <span className="text-[11px] text-muted">
                      {selectedRoom ? `Raio de ${selectedRoom.tolerance_radius_meters}m` : "Sem geofence"}
                    </span>
                  </div>
                </div>

                {/* Enrolled Students Summary */}
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-label font-bold text-ink">
                      <UsersIcon size={15} />
                      <span>Alunos Matriculados</span>
                    </div>
                    <span className="font-mono text-heading font-bold text-ink">
                      {selectedStudents.length}
                    </span>
                  </div>

                  {selectedStudents.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex -space-x-2 overflow-hidden py-1">
                        {selectedStudents.slice(0, 7).map((s, idx) => (
                          <div
                            key={s.id}
                            title={s.name}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-ink text-white font-mono text-caption font-bold"
                            style={{ zIndex: 10 - idx }}
                          >
                            {(s.name || "A").charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {selectedStudents.length > 7 && (
                          <div
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface text-ink font-mono text-caption font-bold"
                            style={{ zIndex: 1 }}
                          >
                            +{selectedStudents.length - 7}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted truncate">
                        {selectedStudents.slice(0, 3).map((s) => s.name).join(", ")}
                        {selectedStudents.length > 3 ? ` e mais ${selectedStudents.length - 3} alunos` : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-caption text-muted italic">
                      Adicione alunos para habilitar presenças na chamada.
                    </p>
                  )}
                </div>

                {/* Geofence verification note */}
                <div className="rounded-xl bg-accent-surface/50 border border-accent/40 p-4">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-accent">
                      <MapPinIcon size={16} />
                    </div>
                    <div className="text-caption text-ink">
                      <strong className="font-semibold block mb-0.5">Validação por Geofence Ativa</strong>
                      Os alunos só poderão assinar presença quando estiverem fisicamente dentro do raio de{" "}
                      <strong>{selectedRoom ? `${selectedRoom.tolerance_radius_meters} metros` : "50 metros"}</strong> da sala.
                    </div>
                  </div>
                </div>

                {/* Primary Button Preview */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-lg bg-ink text-white font-bold text-label hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {submitting ? "Processando cadastro..." : "Confirmar e criar turma"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
