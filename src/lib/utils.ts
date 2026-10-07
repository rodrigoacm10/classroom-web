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

