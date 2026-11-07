"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  listSubjectClasses,
  getSubjectClass,
  listAllRooms,
  openAttendanceSession,
  generateClassFrequencyReport,
  type SubjectClassItem,
  type Room,
  type ClassReportResponse,
} from "@/lib/api";
import { DURATION_OPTIONS, type Duration } from "../types";

export function useNovaChamada() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtém o ID da turma via query param (?turma=..., ?turmaId=..., ?classId=..., etc.)
  const queryTurmaId =
    searchParams?.get("turma") ||
    searchParams?.get("turmaId") ||
    searchParams?.get("turma_id") ||
    searchParams?.get("classId") ||
    searchParams?.get("subjectClassId") ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("turma") ||
      new URLSearchParams(window.location.search).get("turmaId") ||
      new URLSearchParams(window.location.search).get("turma_id") ||
      new URLSearchParams(window.location.search).get("classId") ||
      new URLSearchParams(window.location.search).get("subjectClassId")
      : null);

  // Estados dos formulários e seleções
  const [duration, setDuration] = useState<Duration>(15);
  const [classes, setClasses] = useState<SubjectClassItem[]>([]);
  const [classesTotal, setClassesTotal] = useState<number>(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedClass, setSelectedClass] = useState<SubjectClassItem | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [classReport, setClassReport] = useState<ClassReportResponse | null>(null);

  // Estados de geolocalização do professor
  const [locationMode, setLocationMode] = useState<"room" | "current_gps">("room");
  const [professorLat, setProfessorLat] = useState<number | null>(null);
  const [professorLng, setProfessorLng] = useState<number | null>(null);
  const [professorAccuracy, setProfessorAccuracy] = useState<number | null>(null);
  const [customRadius, setCustomRadius] = useState<number>(50);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  const RADIUS_OPTIONS = [30, 50, 80, 100, 150] as const;

  const handleCaptureGps = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoMessage("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setGeoLocating(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfessorLat(pos.coords.latitude);
        setProfessorLng(pos.coords.longitude);
        setProfessorAccuracy(pos.coords.accuracy ?? null);
        setGeoLocating(false);
        const acc = Math.round(pos.coords.accuracy ?? 0);
        if (acc > 50) {
          setGeoMessage(
            `Posição capturada (~${acc}m). Se estiver no notebook via Wi-Fi/cabo, sugerimos usar um raio maior (ex: 80m ou 100m).`
          );
        } else {
          setGeoMessage(`Posição GPS capturada com alta precisão (~${acc}m).`);
        }
      },
      (err) => {
        setGeoLocating(false);
        if (err.code === 1) {
          setGeoMessage("Permissão de localização negada pelo navegador. Permita o acesso nas configurações.");
        } else if (err.code === 2) {
          setGeoMessage("Sinal de GPS indisponível no momento.");
        } else {
          setGeoMessage("Tempo esgotado ao buscar sinal GPS. Tente novamente.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

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
          listAllRooms(),
        ]);

        if (!isMounted) return;

        if (classesRes.status === "fulfilled") {
          const items = classesRes.value.items ?? [];
          setClasses(items);
          setClassesTotal(classesRes.value.total ?? items.length);

          // Verifica se há turma passada via query param na URL (?turma=..., ?turmaId=..., etc.)
          if (queryTurmaId) {
            const matched = items.find((c) => c.id === queryTurmaId);
            if (matched) {
              setSelectedClass(matched);
              setSelectedRoomId(matched.room_id ?? null);
            } else {
              try {
                const specificClass = await getSubjectClass(queryTurmaId);
                if (specificClass && isMounted) {
                  setSelectedClass(specificClass);
                  setSelectedRoomId(specificClass.room_id ?? null);
                  setClasses((prev) =>
                    prev.some((c) => c.id === specificClass.id) ? prev : [specificClass, ...prev]
                  );
                }
              } catch {
                // Silencioso se não encontrar
              }
            }
          }
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
  }, [queryTurmaId]);

  // Sincroniza turma selecionada se queryTurmaId mudar após o carregamento inicial
  useEffect(() => {
    if (!queryTurmaId || loading || selectedClass?.id === queryTurmaId) return;
    let isMounted = true;

    async function syncTurmaFromQuery() {
      const matched = classes.find((c) => c.id === queryTurmaId);
      if (matched) {
        setSelectedClass(matched);
        setSelectedRoomId(matched.room_id ?? null);
      } else {
        try {
          const specificClass = await getSubjectClass(queryTurmaId!);
          if (specificClass && isMounted) {
            setSelectedClass(specificClass);
            setSelectedRoomId(specificClass.room_id ?? null);
            setClasses((prev) =>
              prev.some((c) => c.id === specificClass.id) ? prev : [specificClass, ...prev]
            );
          }
        } catch {
          // Silencioso se não encontrar
        }
      }
    }

    syncTurmaFromQuery();

    return () => {
      isMounted = false;
    };
  }, [queryTurmaId, classes, loading, selectedClass?.id]);

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

  const selectedClassId = selectedClass?.id;

  // 3. Atualizar relatório de alunos em risco sempre que a turma selecionada mudar
  useEffect(() => {
    if (!selectedClassId) return;
    let isMounted = true;

    async function fetchReport() {
      try {
        setReportLoading(true);
        const report = await generateClassFrequencyReport(selectedClassId!);
        if (isMounted) {
          setClassReport(report);
        }
      } catch {
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
  }, [selectedClassId]);

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
        setRoomSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Foca no input de busca ao abrir o dropdown
  useEffect(() => {
    if (turmaDropdownOpen) {
      const timer = setTimeout(() => classSearchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [turmaDropdownOpen]);

  useEffect(() => {
    if (roomDropdownOpen) {
      const timer = setTimeout(() => roomSearchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [roomDropdownOpen]);

  const handleSetRoomDropdownOpen = useCallback(
    (action: React.SetStateAction<boolean>) => {
      setRoomDropdownOpen((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        if (!next) {
          setRoomSearch("");
        }
        return next;
      });
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedClass) {
      setError("Selecione uma turma para iniciar a chamada.");
      return;
    }

    if (locationMode === "current_gps") {
      if (professorLat === null || professorLng === null) {
        setError(
          "Você selecionou 'Minha localização atual', mas o GPS ainda não foi capturado. Clique em 'Capturar localização GPS' antes de continuar."
        );
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload: Parameters<typeof openAttendanceSession>[1] = {
        duration_minutes: duration,
        room_id: selectedRoomId || undefined,
      };

      if (locationMode === "current_gps") {
        payload.use_professor_location = true;
        payload.latitude = professorLat;
        payload.longitude = professorLng;
        payload.tolerance_radius_meters = customRadius;
      }

      const session = await openAttendanceSession(selectedClass.id, payload);

      // Redireciona para a página de chamada ao vivo da sessão recém-criada
      router.push(`/dashboard/chamadas/${selectedClass.id}/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao abrir chamada.");
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedClass,
    selectedRoomId,
    duration,
    locationMode,
    professorLat,
    professorLng,
    customRadius,
    router,
  ]);

  // 5. Suporte a tecla Enter para iniciar a chamada quando houver turma selecionada
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "Enter" &&
        !submitting &&
        selectedClass &&
        !turmaDropdownOpen &&
        !roomDropdownOpen
      ) {
        handleSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedClass,
    submitting,
    turmaDropdownOpen,
    roomDropdownOpen,
    handleSubmit,
  ]);

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

  const localLabel =
    locationMode === "current_gps"
      ? professorLat !== null
        ? `Minha Localização (Raio: ${customRadius}m)`
        : "Minha Localização Atual"
      : selectedRoom
        ? selectedRoom.name
        : selectedClass?.room_name
          ? selectedClass.room_name
          : selectedClass
            ? "Nenhuma sala vinculada (Selecione)"
            : "Aguardando seleção da turma";

  const studentCount = selectedClass?.student_count ?? 0;

  const activeClassReport = selectedClass ? classReport : null;
  const rawAttendance =
    activeClassReport?.class_average_frequency ?? selectedClass?.attendance_rate ?? 0;
  const attendanceRatePercent = Math.round(
    rawAttendance <= 1 ? rawAttendance * 100 : rawAttendance
  );

  const studentsAtRiskCount = activeClassReport?.students_at_risk ?? 0;

  function handleSelectTurma(item: SubjectClassItem) {
    setSelectedClass(item);
    setSelectedRoomId(item.room_id ?? null);
    setClassReport(null);
    setTurmaDropdownOpen(false);
  }

  function handleSelectRoom(room: Room) {
    setSelectedRoomId(room.id);
    setRoomDropdownOpen(false);
    setRoomSearch("");
  }

  return {
    // Estados do formulário
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
    classReport: activeClassReport,

    // Estados de busca interna
    classSearch,
    setClassSearch,
    roomSearch,
    setRoomSearch,

    // Status de loading e submissão
    loading,
    searchLoading,
    reportLoading,
    submitting,
    error,
    setError,

    // Dropdowns
    turmaDropdownOpen,
    setTurmaDropdownOpen,
    roomDropdownOpen,
    setRoomDropdownOpen: handleSetRoomDropdownOpen,
    turmaDropdownRef,
    roomDropdownRef,
    classSearchInputRef,
    roomSearchInputRef,

    // Geolocalização dinâmica do professor
    locationMode,
    setLocationMode,
    professorLat,
    professorLng,
    professorAccuracy,
    customRadius,
    setCustomRadius,
    RADIUS_OPTIONS,
    geoLocating,
    geoMessage,
    handleCaptureGps,

    // Labels e derivados para preview
    turmaLabel,
    localLabel,
    studentCount,
    attendanceRatePercent,
    studentsAtRiskCount,

    // Ações
    handleSelectTurma,
    handleSelectRoom,
    handleSubmit,
  };
}

export type NovaChamadaState = ReturnType<typeof useNovaChamada>;
