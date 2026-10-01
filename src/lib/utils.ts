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

// ─── Apresentação de Presença e Métricas ──────────────────────────────────────

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
