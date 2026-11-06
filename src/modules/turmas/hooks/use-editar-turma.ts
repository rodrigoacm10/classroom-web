"use client";

import { useEffect, useId, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSubjectClass, updateSubjectClass, type SubjectClassItem } from "@/services/subject-classes";
import { listAllRooms, type Room } from "@/services/rooms";
import { getMyProfile, type UserProfileResponse } from "@/services/user";

export function useEditarTurma(id: string) {
  const router = useRouter();
  const nameId = useId();
  const disciplineId = useId();

  // Form states
  const [name, setName] = useState("");
  const [disciplineName, setDisciplineName] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  // Original data
  const [turma, setTurma] = useState<SubjectClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carrega turma, salas e perfil do usuário
  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        setLoading(true);
        const [turmaData, roomsData, profileData] = await Promise.all([
          getSubjectClass(id),
          listAllRooms().catch(() => [] as Room[]),
          getMyProfile().catch(() => null),
        ]);

        if (!isCurrent) return;

        setTurma(turmaData);
        setName(turmaData.name);
        setDisciplineName(turmaData.discipline_name);
        setSelectedRoomId(turmaData.room_id ?? "");
        setActive(turmaData.active);
        setRooms(roomsData);
        setCurrentUser(profileData);
      } catch (err) {
        if (!isCurrent) return;
        setErrorMessage(
          err instanceof Error ? err.message : "Não foi possível carregar os dados da turma."
        );
      } finally {
        if (isCurrent) {
          setLoading(false);
          setLoadingRooms(false);
        }
      }
    }

    loadData();

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) ?? null;
  }, [rooms, selectedRoomId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);

      const trimmedName = name.trim();
      const trimmedDiscipline = disciplineName.trim();

      if (!trimmedName || trimmedName.length < 2) {
        setErrorMessage("Informe um nome para a turma com no mínimo 2 caracteres.");
        return;
      }

      if (!trimmedDiscipline || trimmedDiscipline.length < 2) {
        setErrorMessage("Informe a disciplina vinculada com no mínimo 2 caracteres.");
        return;
      }

      setSubmitting(true);

      try {
        await updateSubjectClass(id, {
          name: trimmedName,
          discipline_name: trimmedDiscipline,
          room_id: selectedRoomId || null,
          active,
        });

        router.push(`/dashboard/turmas/${id}`);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Erro ao atualizar turma. Verifique os dados e tente novamente."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [id, name, disciplineName, selectedRoomId, active, router]
  );

  return {
    nameId,
    disciplineId,
    name,
    setName,
    disciplineName,
    setDisciplineName,
    selectedRoomId,
    setSelectedRoomId,
    active,
    setActive,
    turma,
    rooms,
    loadingRooms,
    selectedRoom,
    currentUser,
    loading,
    submitting,
    errorMessage,
    handleSubmit,
  };
}
