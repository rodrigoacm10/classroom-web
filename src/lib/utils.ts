/**
 * Funções utilitárias e formatadores compartilhados do projeto.
 */

// ─── Manipulação de Texto ─────────────────────────────────────────────────────

/**
 * Retorna as iniciais de um nome (ex: "Rodrigo Silva" -> "RS", "Ana" -> "AN").
 */
export function getInitials(name: string): string {
  if (!name) return "--";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Data e Tempo ─────────────────────────────────────────────────────────────

/**
 * Retorna saudação conforme o horário atual ("Bom dia", "Boa tarde", "Boa noite").
 */
export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/**
 * Formata data no padrão brasileiro por extenso (ex: "Quinta-feira, 1 de outubro").
 */
export function formattedDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(date)
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Retorna data por extenso em maiúsculas para subtítulos/eyebrows (ex: "QUARTA-FEIRA, 7 DE OUTUBRO").
 */
export function formattedDateSubtitle(date: Date = new Date()): string {
  return date
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toUpperCase();
}

export const getFormattedDateSubtitle = formattedDateSubtitle;


/**
 * Formata tempo restante até expiração em MM:SS (ex: "14:59").
 */
export function formatRemaining(expiresAt: string): string {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "00:00";
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Retorna data curta relativa ("Hoje", "Ontem" ou "05 out").
 */
export function formatShortDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return "Hoje";
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    }
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return "Hoje";
  }
}

/**
 * Retorna hora em formato de badge ("19h").
 */
export function formatHourBadge(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return `${d.getHours()}h`;
  } catch {
    return "19h";
  }
}

/**
 * Nomes completos dos dias da semana em português (0 = Domingo).
 */
export const FULL_DAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

/**
 * Converte data ISO YYYY-MM-DD em DD/MM (ex: "2026-10-01" -> "01/10").
 */
export function formatDayTooltipDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

/**
 * Formata horário completo no padrão pt-BR (ex: "19:30:15").
 */
export function formatTime(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "";
  }
}

/**
 * Formata contador regressivo em segundos no padrão MM:SS (ex: 90 -> "01:30").
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Formata data e hora resumida no padrão pt-BR (ex: "06 out, 19:30").
 */
export function formatDateTime(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

// ─── Apresentação de Presença e Métricas ──────────────────────────────────────

/**
 * Formata distância em metros (ex: 12.4 -> "12 m", null -> "—").
 */
export function formatDistance(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return "—";
  return `${Math.round(meters)} m`;
}

/**
 * Retorna classe de cor de texto com base no percentual de presença.
 * >= 85%: success, 75-84%: warn, < 75%: danger.
 */
export function attendanceColor(pct: number): string {
  if (pct >= 85) return "text-success";
  if (pct >= 75) return "text-warn";
  return "text-danger";
}

/**
 * Retorna classe de cor de barra de progresso com base no percentual de presença.
 */
export function attendanceBarColor(pct: number): string {
  if (pct >= 85) return "bg-success";
  if (pct >= 75) return "bg-warn";
  return "bg-danger";
}

/**
 * Formata data da sessão de chamada (ex: "Hoje, 07 de outubro" ou "Segunda-feira, 05 de outubro").
 */
export function formatSessionDate(openedAt: string): string {
  try {
    const date = new Date(openedAt);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(date);
    if (isToday) return `Hoje, ${dayMonth}`;
    const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dayMonth}`;
  } catch {
    return openedAt;
  }
}

/**
 * Formata intervalo de horários de uma sessão (ex: "19:00 - 19:15").
 */
export function formatSessionTimeRange(openedAt: string, expiresAt: string): string {
  try {
    const start = new Date(openedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const end = new Date(expiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${start} - ${end}`;
  } catch {
    return "";
  }
}

/**
 * Formata data ISO no padrão dia, mês abreviado e ano (ex: "08 out 2026").
 */
export function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/**
 * Formata coordenada geográfica em graus, minutos e direção cardinal (ex: -8.05389 -> "8°03.233'S").
 */
export function formatCoord(value: number, type: "lat" | "lng"): string {
  if (isNaN(value)) return "0°00.000'";
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = ((abs - deg) * 60).toFixed(3);
  const dir = type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "L" : "O";
  return `${deg}°${min}'${dir}`;
}

export interface RadiusLabelInfo {
  label: string;
  color: string;
  bg: string;
}

/**
 * Retorna classificação, cor e background conforme o raio de presença em metros.
 */
export function getRadiusLabel(meters: number): RadiusLabelInfo {
  if (meters <= 30) return { label: "Preciso", color: "var(--color-success)", bg: "var(--color-success-surface)" };
  if (meters <= 75) return { label: "Padrão", color: "var(--color-ink)", bg: "var(--color-surface)" };
  return { label: "Amplo", color: "var(--color-warn)", bg: "#FEF3C7" };
}

/**
 * Retorna a URL de busca de coordenadas no Google Maps.
 */
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export const ROOM_COLORS = [
  { bg: "#E9F4FF", fg: "#1A6DC2" },
  { bg: "#FFF0E0", fg: "#B05A00" },
  { bg: "#F0EAF8", fg: "#6B38A8" },
  { bg: "#E7F2EB", fg: "#1E7A44" },
  { bg: "#FFF4CC", fg: "#896300" },
  { bg: "#FCE8E8", fg: "#C42B1C" },
  { bg: "#E0F7FA", fg: "#00696F" },
  { bg: "#F3E5F5", fg: "#7B1FA2" },
] as const;

/**
 * Retorna as cores de fundo e texto para o avatar da sala.
 */
export function getRoomAvatarColor(name: string): { bg: string; fg: string } {
  const clean = name.trim();
  const idx = clean
    ? clean.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % ROOM_COLORS.length
    : 0;
  return ROOM_COLORS[idx];
}


