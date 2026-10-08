/**
 * Tipos e interfaces de domínio do módulo Salas.
 */

import type {
  Room,
  RoomsPageResponse,
  RoomMetrics,
  ListRoomsParams,
} from "@/services/rooms";

export type { Room, RoomsPageResponse, RoomMetrics, ListRoomsParams };

export interface SalasToastMessage {
  text: string;
  type: "success" | "error";
}

export interface SalasStatsData {
  totalRooms: number;
  avgRadius: number;
  precisasCount: number;
  amplasCount: number;
}
