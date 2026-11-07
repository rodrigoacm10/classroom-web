"use client";

import { useEffect, useId, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  createSubjectClass,
  enrollStudent,
} from "@/services/subject-classes";
import { listAllRooms, type Room } from "@/services/rooms";
import { listStudents, type StudentItem } from "@/services/tenants";
import { getMyProfile, type UserProfileResponse } from "@/services/user";
import type { StudentMode } from "../types";

export function useNovaTurma() {
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
  const [studentMode, setStudentMode] = useState<StudentMode>("catalog");
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
          listAllRooms(),
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
  const handleAddStudent = useCallback((student: StudentItem) => {
    setSelectedStudents((prev) => [...prev, student]);
  }, []);

  const handleRemoveStudent = useCallback((studentId: string) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId));
  }, []);

  const handleAddAllCatalog = useCallback(() => {
    const selectedIds = new Set(selectedStudents.map((s) => s.id));
    const toAdd = unselectedCatalogStudents.filter((s) => !selectedIds.has(s.id));
    setSelectedStudents((prev) => [...prev, ...toAdd]);
  }, [selectedStudents, unselectedCatalogStudents]);

  const handleProcessBatch = useCallback(async () => {
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
  }, [batchText, processingBatch, selectedStudents, catalogStudents]);

  // Submission handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [name, disciplineName, selectedRoomId, selectedStudents, router]);

  return {
    // Identificadores de acessibilidade
    nameId,
    disciplineId,

    // Estados do formulário
    name,
    setName,
    disciplineName,
    setDisciplineName,
    selectedRoomId,
    setSelectedRoomId,

    // Salas físicas
    rooms,
    loadingRooms,
    selectedRoom,

    // Usuário conectado
    currentUser,

    // Catálogo de estudantes
    catalogStudents,
    loadingStudents,
    catalogSearch,
    setCatalogSearch,
    isSearching,
    unselectedCatalogStudents,

    // Modo de matrícula e lote
    studentMode,
    setStudentMode,
    batchText,
    setBatchText,
    processingBatch,

    // Estudantes selecionados
    selectedStudents,
    setSelectedStudents,

    // Ações
    handleAddStudent,
    handleRemoveStudent,
    handleAddAllCatalog,
    handleProcessBatch,
    handleSubmit,

    // Status de submissão e erros
    submitting,
    errorMessage,
    setErrorMessage,
  };
}
