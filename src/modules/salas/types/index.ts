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

export interface CampusPreset {
  label: string;
  lat: number;
  lng: number;
}

export const RADIUS_PRESETS = [15, 30, 50, 80, 120] as const;

export const CAMPUS_PRESETS: CampusPreset[] = [
  { label: "Campus Recife (Demo)", lat: -8.0476, lng: -34.8770 },
  { label: "Campus SP (Politécnica)", lat: -23.5505, lng: -46.6333 },
  { label: "Campus BH (Pampulha)", lat: -19.8690, lng: -43.9664 },
  { label: "Campus RJ (Praia Vermelha)", lat: -22.9519, lng: -43.1802 },
];

export const ROOM_NAME_SUGGESTIONS = [
  "Laboratório 101",
  "Laboratório 204",
  "Sala 08 - Bloco A",
  "Sala 12 - Bloco B",
  "Auditório Principal",
  "Anfiteatro Tecnológico",
];
