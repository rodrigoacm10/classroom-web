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
 * Lista todas as salas físicas cadastradas na instituição/tenant.
 */
export async function listRooms(): Promise<Room[]> {
  return api<Room[]>("/rooms");
}

/**
 * Consulta os detalhes de uma sala específica por ID.
 */
export async function getRoom(roomId: string): Promise<Room> {
  return api<Room>(`/rooms/${roomId}`);
}

export const roomService = {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
