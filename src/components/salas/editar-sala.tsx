"use client";

import { useEffect, useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoom, updateRoom, type Room } from "@/services/rooms";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M10 3L5 8l5 5" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M13 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7l3 3v8a1 1 0 0 1-1 1z" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 14v-4H5v4M5 2v3h4" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GpsIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
      <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="6" cy="6" r="5" stroke="var(--color-on-ink-muted)" strokeWidth="1.2" />
      <path d="M6 5.5v3M6 4v.5" stroke="var(--color-on-ink-muted)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LocationPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M7 1.5a4 4 0 0 1 4 4c0 2.5-4 7-4 7S3 8 3 5.5a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="5.5" r="1.3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function RadiusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 4v3l2 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="1" y="4" width="8" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1H11a1.5 1.5 0 0 1 1.5 1.5V8a1.5 1.5 0 0 1-1.5 1.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M6 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 1H13m0 0v4.5M13 1 7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROOM_COLORS = [
  { bg: "#E9F4FF", fg: "#1A6DC2" },
  { bg: "#FFF0E0", fg: "#B05A00" },
  { bg: "#F0EAF8", fg: "#6B38A8" },
  { bg: "#E7F2EB", fg: "#1E7A44" },
  { bg: "#FFF4CC", fg: "#896300" },
  { bg: "#FCE8E8", fg: "#C42B1C" },
  { bg: "#E0F7FA", fg: "#00696F" },
  { bg: "#F3E5F5", fg: "#7B1FA2" },
];

function RoomAvatar({ name }: { name: string }) {
  const clean = name.trim();
  const idx = clean
    ? clean.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % ROOM_COLORS.length
    : 0;
  const { bg, fg } = ROOM_COLORS[idx];
  const letter = clean ? clean.charAt(0).toUpperCase() : "?";
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-heading shadow-xs"
      style={{ background: bg, color: fg }}
    >
      {letter}
    </div>
  );
}

function formatCoord(value: number, type: "lat" | "lng"): string {
  if (isNaN(value)) return "—";
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = ((abs - deg) * 60).toFixed(3);
  const dir = type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "L" : "O";
  return `${deg}°${min}'${dir}`;
}

function getRadiusLabel(meters: number): { label: string; color: string; bg: string } {
  if (meters <= 30) return { label: "Preciso", color: "var(--color-success)", bg: "var(--color-success-surface)" };
  if (meters <= 75) return { label: "Padrão", color: "var(--color-ink)", bg: "var(--color-surface)" };
  return { label: "Amplo", color: "var(--color-warn)", bg: "#FEF3C7" };
}

const RADIUS_PRESETS = [15, 30, 50, 80, 120] as const;

const CAMPUS_PRESETS = [
  { label: "Campus Recife (Demo)", lat: -8.0476, lng: -34.8770 },
  { label: "Campus SP (Politécnica)", lat: -23.5505, lng: -46.6333 },
  { label: "Campus BH (Pampulha)", lat: -19.8690, lng: -43.9664 },
  { label: "Campus RJ (Praia Vermelha)", lat: -22.9519, lng: -43.1802 },
];

const ROOM_NAME_SUGGESTIONS = [
  "Laboratório 101",
  "Laboratório 204",
  "Sala 08 - Bloco A",
  "Sala 12 - Bloco B",
  "Auditório Principal",
  "Anfiteatro Tecnológico",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function EditarSala({ roomId }: { roomId: string }) {
  const router = useRouter();
  const inputNameId = useId();
  const inputLatId = useId();
  const inputLngId = useId();

  // Estados de dados originais e formulário
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialRoom, setInitialRoom] = useState<Room | null>(null);

  const [name, setName] = useState("");
  const [latStr, setLatStr] = useState("");
  const [lngStr, setLngStr] = useState("");
  const [toleranceRadius, setToleranceRadius] = useState<number>(50);

  // Estados de feedback e controle
  const [submitting, setSubmitting] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Carrega os dados da sala atual por ID
  useEffect(() => {
    let isMounted = true;
    setInitialLoading(true);
    setError(null);

    getRoom(roomId)
      .then((data) => {
        if (!isMounted) return;
        setInitialRoom(data);
        setName(data.name);
        setLatStr(data.latitude.toString());
        setLngStr(data.longitude.toString());
        setToleranceRadius(data.tolerance_radius_meters);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os detalhes desta sala."
        );
      })
      .finally(() => {
        if (isMounted) setInitialLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  // Conversão segura dos valores numéricos
  const latNum = parseFloat(latStr.replace(",", "."));
  const lngNum = parseFloat(lngStr.replace(",", "."));

  // Validação em tempo real
  const isNameValid = name.trim().length >= 1 && name.trim().length <= 255;
  const isLatValid = !isNaN(latNum) && latNum >= -90 && latNum <= 90;
  const isLngValid = !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180;
  const isRadiusValid = !isNaN(toleranceRadius) && toleranceRadius >= 5 && toleranceRadius <= 500;
  const isFormValid = isNameValid && isLatValid && isLngValid && isRadiusValid;

  // Raio categorizado
  const radiusInfo = getRadiusLabel(toleranceRadius);

  // Área estimada de cobertura circular (π * r²)
  const coverageAreaM2 = Math.round(Math.PI * Math.pow(toleranceRadius, 2));

  // Link do Google Maps
  const googleMapsUrl = !isNaN(latNum) && !isNaN(lngNum)
    ? `https://www.google.com/maps?q=${latNum},${lngNum}`
    : null;

  // Atalho Enter para submeter quando o formulário for válido
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && isFormValid && !submitting && !initialLoading) {
        handleSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormValid, submitting, initialLoading, name, latNum, lngNum, toleranceRadius]);

  // Captura GPS do navegador
  function handleCaptureGps() {
    if (!navigator.geolocation) {
      setGeoMessage("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setGeoLocating(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLatStr(latitude.toFixed(6));
        setLngStr(longitude.toFixed(6));
        setGeoLocating(false);
        setGeoMessage(`Coordenadas obtidas via GPS com precisão de ~${Math.round(accuracy)}m.`);
        setTimeout(() => setGeoMessage(null), 5000);
      },
      (err) => {
        setGeoLocating(false);
        if (err.code === 1) {
          setGeoMessage("Permissão de localização negada pelo navegador.");
        } else if (err.code === 2) {
          setGeoMessage("Posição indisponível no momento.");
        } else {
          setGeoMessage("Tempo esgotado ao buscar sinal GPS.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // Parser inteligente de colagem de coordenadas
  function handleCoordPaste(pastedText: string) {
    const matchMapsUrl = pastedText.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (matchMapsUrl) {
      setLatStr(matchMapsUrl[1]);
      setLngStr(matchMapsUrl[2]);
      return;
    }

    const parts = pastedText.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const p1 = parseFloat(parts[0].replace(",", "."));
      const p2 = parseFloat(parts[1].replace(",", "."));
      if (!isNaN(p1) && !isNaN(p2) && p1 >= -90 && p1 <= 90 && p2 >= -180 && p2 <= 180) {
        setLatStr(p1.toString());
        setLngStr(p2.toString());
      }
    }
  }

  // Copiar coordenadas
  function handleCopyCoords() {
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      navigator.clipboard.writeText(`${latNum}, ${lngNum}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  }

  // Submissão da atualização via PATCH /rooms/{room_id}
  async function handleSubmit() {
    if (!isFormValid || submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      await updateRoom(roomId, {
        name: name.trim(),
        latitude: latNum,
        longitude: lngNum,
        tolerance_radius_meters: toleranceRadius,
      });

      // Redireciona de volta para a listagem de salas
      router.push("/dashboard/salas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar a sala física.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-paper">
      {/* ── Top Bar ── */}
      <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-border bg-paper px-10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/salas"
            className="flex items-center gap-1.5 text-label font-medium text-muted transition-opacity hover:opacity-70"
          >
            <ChevronLeftIcon />
            <span>Salas</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-heading font-bold tracking-tight text-ink">
            Editar Sala {initialRoom ? `· ${initialRoom.name}` : ""}
          </span>
        </div>
        <Link
          href="/dashboard/salas"
          className="flex h-[38px] items-center rounded-md border border-border px-4 text-[14px] font-medium leading-[18px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          Cancelar
        </Link>
      </header>

      {/* ── Mensagem de Erro Superior ── */}
      {error && (
        <div className="flex shrink-0 items-center justify-between border-b border-danger/20 bg-danger-surface px-10 py-3 text-caption font-medium text-danger">
          <div className="flex items-center gap-2">
            <span className="font-bold">Aviso:</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="cursor-pointer text-caption font-bold text-danger hover:underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* ── Mensagem Informativa de GPS ── */}
      {geoMessage && (
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-10 py-2.5 text-caption font-medium text-ink">
          <div className="flex items-center gap-2">
            <GpsIcon className="h-3.5 w-3.5 text-accent" />
            <span>{geoMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setGeoMessage(null)}
            className="cursor-pointer text-caption text-muted hover:text-ink"
          >
            Fechar
          </button>
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1">
        {/* ── Left Panel: Form ── */}
        <aside className="flex w-[470px] shrink-0 flex-col border-r border-border bg-paper">
          {initialLoading ? (
            <div className="flex flex-1 flex-col gap-6 p-9 animate-pulse">
              <div className="h-4 w-28 bg-border rounded" />
              <div className="h-11 w-full bg-surface border border-border rounded-md" />
              <div className="h-px bg-border" />
              <div className="h-4 w-36 bg-border rounded" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-11 bg-surface border border-border rounded-md" />
                <div className="h-11 bg-surface border border-border rounded-md" />
              </div>
              <div className="h-px bg-border" />
              <div className="h-4 w-32 bg-border rounded" />
              <div className="h-10 bg-surface border border-border rounded-md" />
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-9 py-7">
              {/* ── Seção 1 — Identificação ── */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                  1 — Identificação
                </span>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={inputNameId} className="text-label font-medium text-ink">
                      Nome da sala ou espaço*
                    </label>
                    <span className="text-[11px] text-muted">{name.length}/255</span>
                  </div>
                  <input
                    id={inputNameId}
                    type="text"
                    autoFocus
                    required
                    maxLength={255}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Laboratório 204, Auditório Principal"
                    className="flex h-[46px] w-full rounded-md border border-border bg-surface px-3.5 text-body text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none"
                  />
                  <p className="text-caption text-muted">
                    Identificador exibido nas listas de turmas e chamadas.
                  </p>

                  {/* Sugestões rápidas */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-muted">Sugestões:</span>
                    {ROOM_NAME_SUGGESTIONS.slice(0, 3).map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setName(sug)}
                        className="cursor-pointer rounded-sm border border-border bg-surface px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-ink/40 hover:text-ink"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px shrink-0 bg-border" />

              {/* ── Seção 2 — Coordenadas GPS ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                    2 — Coordenadas GPS (WGS84)
                  </span>
                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    disabled={geoLocating}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
                    title="Obter coordenadas GPS pelo navegador"
                  >
                    {geoLocating ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    ) : (
                      <GpsIcon className="h-3 w-3 text-ink" />
                    )}
                    <span>{geoLocating ? "Obtendo sinal..." : "Capturar GPS atual"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Latitude */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={inputLatId} className="text-label font-medium text-ink">
                      Latitude*
                    </label>
                    <input
                      id={inputLatId}
                      type="text"
                      required
                      value={latStr}
                      onChange={(e) => {
                        setLatStr(e.target.value);
                        handleCoordPaste(e.target.value);
                      }}
                      placeholder="-8.047600"
                      className={`flex h-[46px] w-full rounded-md border bg-surface px-3.5 font-mono text-[14px] text-ink transition-colors placeholder:text-muted focus:outline-none ${
                        isLatValid ? "border-border focus:border-ink" : "border-danger focus:border-danger"
                      }`}
                    />
                    <span className="text-[11px] text-muted">De -90.0000 a 90.0000</span>
                  </div>

                  {/* Longitude */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={inputLngId} className="text-label font-medium text-ink">
                      Longitude*
                    </label>
                    <input
                      id={inputLngId}
                      type="text"
                      required
                      value={lngStr}
                      onChange={(e) => {
                        setLngStr(e.target.value);
                        handleCoordPaste(e.target.value);
                      }}
                      placeholder="-34.877000"
                      className={`flex h-[46px] w-full rounded-md border bg-surface px-3.5 font-mono text-[14px] text-ink transition-colors placeholder:text-muted focus:outline-none ${
                        isLngValid ? "border-border focus:border-ink" : "border-danger focus:border-danger"
                      }`}
                    />
                    <span className="text-[11px] text-muted">De -180.0000 a 180.0000</span>
                  </div>
                </div>

                {/* Presets rápidos */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[11px] font-medium text-muted">Ou escolha um ponto de referência:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CAMPUS_PRESETS.map((p) => {
                      const isSelected =
                        Math.abs(latNum - p.lat) < 0.0001 && Math.abs(lngNum - p.lng) < 0.0001;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => {
                            setLatStr(p.lat.toString());
                            setLngStr(p.lng.toString());
                          }}
                          className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                            isSelected
                              ? "border-ink bg-ink text-on-ink"
                              : "border-border bg-surface text-ink hover:border-ink/40 hover:bg-paper"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="h-px shrink-0 bg-border" />

              {/* ── Seção 3 — Raio de Presença ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                    3 — Raio de Presença Válida
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-caps"
                    style={{ background: radiusInfo.bg, color: radiusInfo.color }}
                  >
                    {radiusInfo.label} ({toleranceRadius} m)
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label font-medium text-ink">
                    Distância máxima permitida para o aluno*
                  </label>

                  {/* Botões pill de opções rápidas */}
                  <div className="flex items-center gap-2">
                    {RADIUS_PRESETS.map((opt) => {
                      const active = toleranceRadius === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setToleranceRadius(opt)}
                          className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md text-[13px] font-semibold transition-colors [border-width:1.5px] border-solid ${
                            active
                              ? "border-ink bg-ink text-accent font-bold"
                              : "border-border bg-paper text-ink hover:border-ink/30"
                          }`}
                        >
                          {opt}m
                        </button>
                      );
                    })}
                  </div>

                  {/* Slider de ajuste fino */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="range"
                      min={5}
                      max={500}
                      step={5}
                      value={toleranceRadius}
                      onChange={(e) => setToleranceRadius(parseInt(e.target.value, 10))}
                      className="h-2 flex-1 cursor-pointer accent-ink"
                    />
                    <div className="flex h-9 w-20 items-center justify-center rounded-md border border-border bg-surface font-mono text-[13px] font-bold text-ink">
                      {toleranceRadius} m
                    </div>
                  </div>

                  <p className="text-caption text-muted">
                    {toleranceRadius <= 30
                      ? "Raio preciso: ideal para salas de aula convencionais e laboratórios."
                      : toleranceRadius <= 75
                        ? "Raio padrão: recomendado para salas maiores, blocos acadêmicos e corredores."
                        : "Raio amplo: recomendado para auditórios, ginásios esportivos ou pátios abertos."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── CTA Footer Fixo ── */}
          <div className="flex shrink-0 flex-col gap-2.5 border-t border-border bg-paper px-9 py-5">
            <button
              id="btn-salvar-edicao"
              type="button"
              disabled={submitting || !isFormValid || initialLoading}
              onClick={handleSubmit}
              className="flex h-[60px] shrink-0 cursor-pointer items-center gap-3.5 rounded-xl bg-ink px-5 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <SaveIcon />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-0.5 text-left">
                <span className="text-body font-bold leading-[115%] tracking-[-0.01em] text-on-ink">
                  {submitting ? "Salvando alterações..." : "Salvar alterações da sala"}
                </span>
                <span className="text-[11px] leading-[14px] text-on-ink-subtle">
                  {isFormValid
                    ? "Clique aqui ou pressione ↵ Enter"
                    : "Preencha os campos obrigatórios para habilitar"}
                </span>
              </div>
              {isFormValid && (
                <div className="flex h-[26px] shrink-0 items-center justify-center rounded-sm border border-on-ink-border px-[9px]">
                  <span className="font-mono text-caption text-on-ink-subtle">↵</span>
                </div>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5">
              <InfoIcon />
              <span className="text-[11px] leading-[14px] text-on-ink-muted">
                As alterações surtirão efeito imediatamente em todas as novas chamadas
              </span>
            </div>
          </div>
        </aside>

        {/* ── Right Panel: Real-Time Preview ── */}
        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-surface p-5">
          {/* Header "Prévia em tempo real" */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-ping" />
            <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
              Prévia das Alterações em Tempo Real
            </span>
          </div>

          {/* Room Card Preview */}
          <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-paper shadow-xs">
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 pb-3.5 pt-4">
              <div className="flex items-center gap-3 min-w-0">
                <RoomAvatar name={name || "Sala"} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[16px] font-bold leading-[120%] tracking-tight text-ink truncate">
                    {name.trim() || "Nome da Sala"}
                  </span>
                  <span className="text-caption text-muted">
                    Espaço físico cadastrado · ID: {roomId.slice(0, 8)}...
                  </span>
                </div>
              </div>
              <span
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-bold tracking-caps uppercase"
                style={{ background: radiusInfo.bg, color: radiusInfo.color }}
              >
                <RadiusIcon size={12} />
                {radiusInfo.label}
              </span>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Raio */}
              <div className="flex flex-col gap-0.5 px-6 py-3.5">
                <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">
                  RAIO DE PRESENÇA
                </span>
                <span className="font-mono text-title font-black text-ink">
                  {toleranceRadius}
                  <span className="ml-1 text-body font-semibold text-muted">m</span>
                </span>
                <span className="text-[11px] text-muted">
                  Área estimada: ~{coverageAreaM2.toLocaleString("pt-BR")} m²
                </span>
              </div>

              {/* Localização WGS84 */}
              <div className="flex flex-col gap-0.5 px-6 py-3.5">
                <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-muted">
                  COORDENADAS GPS
                </span>
                <span className="font-mono text-label font-semibold text-ink">
                  {formatCoord(latNum, "lat")}
                </span>
                <span className="font-mono text-label font-semibold text-ink">
                  {formatCoord(lngNum, "lng")}
                </span>
              </div>
            </div>

            {/* Card footer actions */}
            <div className="flex items-center justify-between border-t border-border px-6 py-2.5 bg-surface/30">
              <button
                type="button"
                onClick={handleCopyCoords}
                className="flex items-center gap-1.5 rounded px-2 py-1 text-caption font-medium text-muted transition-colors hover:bg-border/60 hover:text-ink cursor-pointer"
              >
                <CopyIcon />
                <span>{copied ? "Copiado!" : "Copiar coordenadas"}</span>
              </button>

              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border bg-paper px-2.5 py-1 text-caption font-semibold text-muted transition-colors hover:border-ink/30 hover:text-ink"
                >
                  <ExternalLinkIcon />
                  <span>Ver no Maps</span>
                </a>
              )}
            </div>
          </div>

          {/* Bottom cards row */}
          <div className="flex min-h-0 flex-1 gap-3.5">
            {/* Geofence Map Simulation Card */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-paper shadow-xs">
              <div
                className="relative flex flex-1 items-center justify-center overflow-hidden min-h-[220px]"
                style={{
                  background: "linear-gradient(135deg, #1c2229 0%, #13181e 50%, #0d1116 100%)",
                }}
              >
                {/* Linhas de grade de radar/geofence */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)",
                    backgroundSize: "24px 24px, 48px 48px, 48px 48px",
                  }}
                />

                {/* Círculo do Geofence dinâmico */}
                <div
                  className="relative flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${Math.min(Math.max(90 + (toleranceRadius / 500) * 150, 90), 240)}px`,
                    height: `${Math.min(Math.max(90 + (toleranceRadius / 500) * 150, 90), 240)}px`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFC40099] bg-[#FFC4001F] animate-pulse" />
                  <div className="absolute inset-4 rounded-full border border-[#FFC40040] bg-[#FFC40010]" />

                  {/* Pin central de localização */}
                  <div
                    className="relative z-10 flex h-7 w-7 items-center justify-center rounded-tl-full rounded-tr-full rounded-br-full bg-accent border-[3px] border-solid border-ink shadow-[0px_4px_12px_rgba(0,0,0,0.5)] origin-center transition-transform hover:scale-110"
                    style={{ rotate: "-45deg" }}
                  >
                    <div className="h-2 w-2 rounded-full bg-ink" />
                  </div>

                  <div className="absolute -bottom-3 rounded-full bg-ink/90 border border-white/20 px-2 py-0.5 text-[10px] font-mono font-bold text-accent shadow-md">
                    Raio: {toleranceRadius}m
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-black/40 border border-white/10 px-2 py-1 text-[10px] font-mono text-white/70 backdrop-blur-xs">
                  <span className="font-bold text-accent">N</span>
                  <span>0°</span>
                </div>
              </div>

              {/* Informações detalhadas do Geofence abaixo do mapa */}
              <div className="flex shrink-0 flex-col gap-2 p-4 bg-paper">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">
                    {name.trim() || "Sala Física"}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-success-surface px-2 py-0.5 text-[11px] font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span>Geofence Configurado</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[12px] text-muted">
                  <div className="flex items-center gap-1.5">
                    <LocationPinIcon size={13} />
                    <span className="font-mono">
                      {isLatValid && isLngValid
                        ? `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`
                        : "Aguardando coordenadas"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadiusIcon size={13} />
                    <span>
                      Circunferência de presença de {toleranceRadius} metros (~{coverageAreaM2.toLocaleString("pt-BR")} m²)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card Dark (`bg-ink`) */}
            <div className="flex flex-1 flex-col rounded-xl bg-ink px-5 py-[18px] text-on-ink shadow-sm">
              <span className="shrink-0 pb-3 text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-on-ink-subtle">
                Resumo da Sala
              </span>

              <div className="flex flex-col">
                {/* Nome do espaço */}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-label text-on-ink-muted">Espaço</span>
                  <span className="text-label font-bold text-on-ink max-w-[190px] truncate text-right">
                    {name.trim() || "Não definido"}
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />

                {/* Coordenadas */}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-label text-on-ink-muted">Ponto Central</span>
                  <span className="text-label font-mono font-medium text-on-ink">
                    {isLatValid && isLngValid
                      ? `${latNum.toFixed(4)}, ${lngNum.toFixed(4)}`
                      : "—"}
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />

                {/* Raio */}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-label text-on-ink-muted">Raio Máximo</span>
                  <span className="text-label font-bold text-accent">
                    {toleranceRadius} metros
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />

                {/* Área de Cobertura */}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-label text-on-ink-muted">Área Coberta</span>
                  <span className="text-label font-semibold text-on-ink">
                    ~{coverageAreaM2.toLocaleString("pt-BR")} m²
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />

                {/* Classificação */}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-label text-on-ink-muted">Classificação</span>
                  <span className="text-label font-semibold text-on-ink">
                    {radiusInfo.label}
                  </span>
                </div>
                <div className="h-px bg-on-ink-border" />
              </div>

              {/* Status footer da prévia */}
              <div className="flex flex-1 flex-col justify-end pt-4">
                <span className="pb-1 text-[10px] font-bold uppercase leading-3 tracking-[0.1em] text-muted">
                  Status da Validação
                </span>
                <span className="text-heading font-bold text-on-ink">
                  {isFormValid ? "Pronta para atualizar" : "Aguardando campos válidos"}
                </span>
                <div className="mb-1.5 mt-2.5 h-1 overflow-hidden rounded-full bg-on-ink-border">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFormValid ? "w-full bg-accent" : "w-1/3 bg-warn"
                    }`}
                  />
                </div>
                <span className="text-[11px] text-muted">
                  {isFormValid
                    ? "Conexão com rota PATCH /rooms pronta"
                    : "Preencha o nome e valide as coordenadas"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
