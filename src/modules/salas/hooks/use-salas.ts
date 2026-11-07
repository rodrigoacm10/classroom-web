"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  listRooms,
  getRoomMetrics,
  type Room,
  type RoomMetrics,
} from "@/services/rooms";
import type { SalasToastMessage } from "../types";

export function useSalas() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca e paginação via API
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);

  // Métricas consolidadas calculadas no backend
  const [metrics, setMetrics] = useState<RoomMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Modal de exclusão e toasts
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [toastMessage, setToastMessage] = useState<SalasToastMessage | null>(null);

  // Debounce da busca (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Ao alterar termo de busca, reseta para primeira página
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Carrega métricas globais do tenant via banco de dados
  const fetchMetrics = useCallback(async () => {
    try {
      setMetricsLoading(true);
      const data = await getRoomMetrics();
      setMetrics(data);
    } catch {
      // Falha não-bloqueante em métricas
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // Carrega lista paginada e filtrada via API
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listRooms({
        search: debouncedSearch.trim() || undefined,
        page,
        page_size: pageSize,
      });
      setRooms(res.items);
      setTotalRooms(res.total);
      setTotalPages(res.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar salas da instituição.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, pageSize]);

  // Dispara busca sempre que os parâmetros da rota mudarem
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Dispara métricas na montagem
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Limpa toast após 4 segundos
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleRoomDeleted = useCallback(
    (deletedId: string) => {
      const deletedName = rooms.find((r) => r.id === deletedId)?.name ?? "Sala";
      setToastMessage({
        text: `Sala "${deletedName}" excluída permanentemente.`,
        type: "success",
      });
      // Recarrega lista e métricas atualizadas
      fetchRooms();
      fetchMetrics();
    },
    [rooms, fetchRooms, fetchMetrics]
  );

  return {
    rooms,
    loading,
    error,
    search,
    setSearch,
    clearSearch: () => setSearch(""),
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalRooms,
    metrics,
    metricsLoading,
    deletingRoom,
    setDeletingRoom,
    toastMessage,
    setToastMessage,
    handleRoomDeleted,
    refreshRooms: fetchRooms,
    refreshMetrics: fetchMetrics,
  };
}
