import { api } from "@/lib/api-client";

export type Room = {
  id: string;
  tenant_id: string;
  created_by: string | null;
  name: string;
  latitude: number;
  longitude: number;
  tolerance_radius_meters: number;
  created_at: string;
  updated_at: string;
};

export type RoomsPageResponse = {
  items: Room[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type RoomMetrics = {
  total_rooms: number;
  avg_radius: number;
  precisas_count: number;
  amplas_count: number;
};

export type ListRoomsParams = {
  search?: string;
  page?: number;
  page_size?: number;
};

export type CreateRoomRequest = {
  name: string;
  latitude: number;
  longitude: number;
  tolerance_radius_meters?: number;
};

export type UpdateRoomRequest = {
  name?: string;
  latitude?: number;
  longitude?: number;
  tolerance_radius_meters?: number;
};

/**
 * Cria uma nova sala física cadastrada na instituição/tenant.
 */
export async function createRoom(data: CreateRoomRequest): Promise<Room> {
  return api<Room>("/rooms", {
    method: "POST",
    body: data,
  });
}

/**
 * Atualiza parcialmente uma sala física por ID.
 */
export async function updateRoom(
  roomId: string,
  data: UpdateRoomRequest
): Promise<Room> {
  return api<Room>(`/rooms/${roomId}`, {
    method: "PATCH",
    body: data,
  });
}

/**
 * Remove permanentemente uma sala física por ID (requer papel de ADMIN).
 */
export async function deleteRoom(roomId: string): Promise<void> {
  return api<void>(`/rooms/${roomId}`, {
    method: "DELETE",
  });
}

/**
 * Lista salas físicas da instituição com suporte a paginação e busca no backend.
 */
export async function listRooms(
  params: ListRoomsParams = {}
): Promise<RoomsPageResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.page_size !== undefined) query.set("page_size", String(params.page_size));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<RoomsPageResponse>(`/rooms${qs}`);
}

/**
 * Lista todas as salas (até 100 itens) para seletores e dropdowns.
 */
export async function listAllRooms(): Promise<Room[]> {
  const res = await listRooms({ page: 1, page_size: 100 });
  return res.items;
}

/**
 * Retorna as métricas agregadas de salas calculadas no banco de dados.
 */
export async function getRoomMetrics(): Promise<RoomMetrics> {
  return api<RoomMetrics>("/rooms/metrics");
}

/**
 * Consulta os detalhes de uma sala específica por ID.
 */
export async function getRoom(roomId: string): Promise<Room> {
  return api<Room>(`/rooms/${roomId}`);
}

export const roomService = {
  listRooms,
  listAllRooms,
  getRoomMetrics,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
