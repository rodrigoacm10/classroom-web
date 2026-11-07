"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CloseIcon,
  CheckIcon,
  AlertTriangleIcon,
  ClockIcon,
  GpsIcon,
  UsersIcon,
  MapPinIcon,
  InfoIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { formatDateTime, formatDistance } from "@/lib/utils";
import { AuditMap } from "@/components/map";
import {
  getAttendanceRecord,
  reviewAttendanceRecord,
  type AttendanceRecordResponse,
  type AttendanceSessionResponse,
  type SessionRosterItem,
} from "@/services/attendance";
import { getRoom, type Room } from "@/services/rooms";

export interface AuditoriaPresencaModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectClassId: string;
  sessionId: string;
  session?: AttendanceSessionResponse | null;
  studentItem: SessionRosterItem | null;
  onReviewSuccess: (
    recordId: string,
    decision: "approved" | "rejected",
    note?: string
  ) => void;
}

export function AuditoriaPresencaModal({
  isOpen,
  onClose,
  subjectClassId,
  sessionId,
  session,
  studentItem,
  onReviewSuccess,
}: AuditoriaPresencaModalProps) {
  const [record, setRecord] = useState<AttendanceRecordResponse | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showMap, setShowMap] = useState(false);

  const cachedRoomId = useRef<string | null>(null);

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Carrega informações da sala se necessário (com cache simples para evitar refetch ao alternar alunos)
  useEffect(() => {
    if (!isOpen || !session?.room_id || session.custom_latitude != null) {
      return;
    }
    if (cachedRoomId.current === session.room_id && room) {
      return;
    }

    let isMounted = true;
    getRoom(session.room_id)
      .then((data) => {
        if (isMounted) {
          cachedRoomId.current = session.room_id;
          setRoom(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isOpen, session?.room_id, session?.custom_latitude, room]);

  const roomLat = session?.custom_latitude ?? room?.latitude ?? null;
  const roomLng = session?.custom_longitude ?? room?.longitude ?? null;
  const toleranceRadius =
    session?.custom_tolerance_radius_meters ??
    room?.tolerance_radius_meters ??
    50;
  const roomName = session?.room?.name ?? room?.name ?? "Sala de Aula";

  // Busca detalhes do registro de presença
  useEffect(() => {
    setShowMap(false);

    if (!isOpen || !studentItem?.record_id) {
      setRecord(null);
      setFetchError(null);
      setActionError(null);
      setNote("");
      return;
    }

    let isMounted = true;
    setLoading(true);
    setFetchError(null);
    setActionError(null);

    getAttendanceRecord(subjectClassId, sessionId, studentItem.record_id)
      .then((data) => {
        if (!isMounted) return;
        setRecord(data);
        setNote(data.review_note ?? "");
      })
      .catch((err) => {
        if (!isMounted) return;
        setFetchError(
          err instanceof Error ? err.message : "Erro ao carregar detalhes da presença."
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, subjectClassId, sessionId, studentItem?.record_id]);

  if (!isOpen || !studentItem) return null;

  async function handleDecision(decision: "approved" | "rejected") {
    if (!studentItem?.record_id) return;
    setSubmitting(true);
    setActionError(null);

    try {
      await reviewAttendanceRecord(subjectClassId, sessionId, studentItem.record_id, {
        decision,
        note: note.trim() || undefined,
      });

      onReviewSuccess(studentItem.record_id, decision, note.trim() || undefined);
      onClose();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Erro ao registrar decisão.");
    } finally {
      setSubmitting(false);
    }
  }

  // Identificar flags de irregularidade e dados espaciais
  const flags = record?.irregularity_flags ?? [];
  const effectiveDistance = record?.distance_meters ?? studentItem.distance_meters;
  const effectiveWithinRadius =
    record !== null ? record.within_radius : studentItem.within_radius;
  const effectiveTolerance = toleranceRadius;

  const isOutsideRadius =
    flags.includes("outside_radius") ||
    effectiveWithinRadius === false ||
    (effectiveDistance !== null && effectiveDistance > effectiveTolerance);

  const excessMeters =
    isOutsideRadius &&
    effectiveDistance !== null &&
    effectiveDistance > effectiveTolerance
      ? Math.round(effectiveDistance - effectiveTolerance)
      : null;

  const hasCoordinates = Boolean(record?.latitude != null && record?.longitude != null);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border bg-[#FAFAFA] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-accent-surface px-2 py-0.5 font-mono text-[11px] font-bold text-[#8A6D00] uppercase tracking-caps">
                Auditoria de Presença
              </span>
              <span className="text-caption text-muted font-mono">
                MAT: {studentItem.enrollment_id.slice(-8).toUpperCase()}
              </span>
            </div>
            <h3 className="mt-1 text-heading font-bold text-ink">
              {studentItem.student_name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
          {loading ? (
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-14 rounded-xl bg-surface" />
              <div className="h-28 rounded-xl bg-surface" />
              <div className="h-20 rounded-xl bg-surface" />
            </div>
          ) : fetchError ? (
            <div className="rounded-xl border border-danger/30 bg-danger-surface p-4 text-center">
              <p className="text-label font-semibold text-danger">{fetchError}</p>
              <button
                type="button"
                onClick={() => {
                  if (studentItem.record_id) {
                    setLoading(true);
                    setFetchError(null);
                    getAttendanceRecord(subjectClassId, sessionId, studentItem.record_id)
                      .then((d) => setRecord(d))
                      .catch((e) => setFetchError(e.message))
                      .finally(() => setLoading(false));
                  }
                }}
                className="mt-2 text-caption font-bold text-ink underline cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          ) : record ? (
            <>
              {/* Banner do Status Atual */}
              <div
                className="flex items-center gap-3 rounded-xl border p-3.5"
                style={{
                  background:
                    record.record_status === "approved"
                      ? "var(--color-success-surface)"
                      : record.record_status === "rejected"
                      ? "var(--color-danger-surface)"
                      : "var(--color-accent-surface)",
                  borderColor:
                    record.record_status === "approved"
                      ? "rgba(30, 122, 68, 0.25)"
                      : record.record_status === "rejected"
                      ? "rgba(196, 43, 28, 0.25)"
                      : "rgba(255, 196, 0, 0.4)",
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background:
                      record.record_status === "approved"
                        ? "var(--color-success)"
                        : record.record_status === "rejected"
                        ? "var(--color-danger)"
                        : "#D49B00",
                    color: "#FFFFFF",
                  }}
                >
                  {record.record_status === "approved" ? (
                    <CheckIcon size={18} />
                  ) : record.record_status === "rejected" ? (
                    <CloseIcon size={16} />
                  ) : (
                    <AlertTriangleIcon size={18} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-bold tracking-caps uppercase text-ink">
                      Status da Presença:
                    </span>
                    <strong className="text-label uppercase">
                      {record.record_status === "approved"
                        ? "Validada pelo Professor"
                        : record.record_status === "rejected"
                        ? "Rejeitada / Falta"
                        : "Com Ressalvas (Pendente de Validação)"}
                    </strong>
                  </div>
                  <p className="text-caption text-muted mt-0.5">
                    {record.record_status === "approved"
                      ? "Esta presença foi validada e conta como presença no quórum da turma."
                      : record.record_status === "rejected"
                      ? "Esta presença foi rejeitada após auditoria e é computada como falta."
                      : "O sistema registrou anomalias durante a confirmação. Analise os pontos abaixo para validar ou rejeitar."}
                  </p>
                </div>
              </div>

              {/* Informação Clara de Raio e Geolocalização (sem carregar o mapa pesado imediatamente) */}
              <div className="overflow-hidden rounded-xl border border-border bg-paper shadow-xs">
                {/* Cabeçalho da Evidência Espacial */}
                <div className="flex items-center justify-between border-b border-border bg-[#FAFAFA] px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        isOutsideRadius
                          ? "bg-danger-surface text-danger"
                          : effectiveWithinRadius
                          ? "bg-success-surface text-success"
                          : "bg-surface text-muted"
                      }`}
                    >
                      <MapPinIcon size={15} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-caps text-muted block">
                        Validação de Raio & Presença Física
                      </span>
                      <span className="text-caption font-semibold text-ink">
                        Espaço: {roomName}
                      </span>
                    </div>
                  </div>

                  {/* Badge de status no raio */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      isOutsideRadius
                        ? "bg-danger-surface text-danger border border-danger/30"
                        : effectiveWithinRadius
                        ? "bg-success-surface text-success border border-success/30"
                        : "bg-surface text-muted border border-border"
                    }`}
                  >
                    {isOutsideRadius ? (
                      <>
                        <CloseIcon size={11} />
                        FORA DO RAIO
                      </>
                    ) : effectiveWithinRadius ? (
                      <>
                        <CheckIcon size={11} />
                        DENTRO DO RAIO
                      </>
                    ) : (
                      "SEM DADOS GPS"
                    )}
                  </span>
                </div>

                {/* Resumo da validação de raio */}
                <div className="p-4 space-y-3">
                  <div
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      isOutsideRadius
                        ? "border-danger/30 bg-danger-surface/70 text-ink"
                        : effectiveWithinRadius
                        ? "border-success/30 bg-success-surface/70 text-ink"
                        : "border-border bg-surface/50 text-muted"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isOutsideRadius ? (
                        <AlertTriangleIcon size={18} className="text-danger" />
                      ) : effectiveWithinRadius ? (
                        <CheckIcon size={18} className="text-success" />
                      ) : (
                        <InfoIcon size={18} className="text-muted" />
                      )}
                    </div>
                    <div className="text-caption leading-relaxed flex-1">
                      {isOutsideRadius ? (
                        <div>
                          <p className="font-bold text-danger text-label">
                            O aluno confirmou presença FORA do perímetro delimitado.
                          </p>
                          <p className="text-ink mt-0.5">
                            Distância registrada de{" "}
                            <strong>{formatDistance(effectiveDistance)}</strong> da sala,
                            ultrapassando a margem de tolerância ({formatDistance(effectiveTolerance)})
                            {excessMeters ? ` em cerca de ${formatDistance(excessMeters)}.` : "."}
                          </p>
                        </div>
                      ) : effectiveWithinRadius ? (
                        <div>
                          <p className="font-bold text-success text-label">
                            O aluno confirmou presença DENTRO do perímetro da sala.
                          </p>
                          <p className="text-ink mt-0.5">
                            Distância de <strong>{formatDistance(effectiveDistance)}</strong>, dentro
                            da margem de tolerância de{" "}
                            <strong>{formatDistance(effectiveTolerance)}</strong> da sala de aula.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-ink text-label">
                            Telemetria geoespacial não disponível
                          </p>
                          <p className="text-muted mt-0.5">
                            Não foram detectadas coordenadas precisas no momento da confirmação.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Métricas rápidas: Distância vs Raio vs Precisão */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-border bg-[#FAFAFA] p-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-caps text-muted block">
                        Distância do Aluno
                      </span>
                      <span
                        className={`text-label font-bold block mt-0.5 ${
                          isOutsideRadius ? "text-danger" : "text-ink"
                        }`}
                      >
                        {formatDistance(effectiveDistance)}
                      </span>
                    </div>

                    <div className="rounded-lg border border-border bg-[#FAFAFA] p-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-caps text-muted block">
                        Raio Permitido
                      </span>
                      <span className="text-label font-bold text-ink block mt-0.5">
                        {formatDistance(effectiveTolerance)}
                      </span>
                    </div>

                    <div className="rounded-lg border border-border bg-[#FAFAFA] p-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-caps text-muted block">
                        Precisão do GPS
                      </span>
                      <span className="text-label font-bold text-ink block mt-0.5">
                        {record.gps_accuracy_meters
                          ? `±${Math.round(record.gps_accuracy_meters)}m`
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Botão para carregar o mapa interativo sob demanda */}
                  {hasCoordinates ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowMap((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-3.5 py-2.5 text-label font-semibold text-ink shadow-2xs hover:bg-surface hover:border-ink/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <MapPinIcon size={15} className="text-muted" />
                          <span>
                            {showMap
                              ? "Ocultar mapa de evidência"
                              : "Visualizar evidência no mapa interativo"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-caption text-muted font-normal">
                          <span>{showMap ? "Recolher" : "Carregar mapa"}</span>
                          <ChevronDownIcon
                            size={15}
                            className={`transition-transform duration-200 ${
                              showMap ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Mapa carregado estritamente sob demanda */}
                {hasCoordinates && showMap && (
                  <div className="border-t border-border bg-paper animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-border bg-[#FAFAFA] px-4 py-2 text-caption text-muted">
                      <span className="text-[10px] font-bold uppercase tracking-caps text-muted">
                        Visualização Georreferenciada (Leaflet)
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent border border-ink" />
                          {roomName}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className={`inline-block h-2.5 w-2.5 rounded-full border border-ink ${
                              isOutsideRadius ? "bg-danger" : "bg-success"
                            }`}
                          />
                          {studentItem.student_name.split(" ")[0]} ({formatDistance(effectiveDistance)})
                        </span>
                      </div>
                    </div>

                    <div className="h-60 w-full">
                      <AuditMap
                        studentLat={record.latitude!}
                        studentLng={record.longitude!}
                        studentName={studentItem.student_name}
                        accuracyMeters={record.gps_accuracy_meters}
                        roomLat={roomLat}
                        roomLng={roomLng}
                        roomName={roomName}
                        toleranceRadius={effectiveTolerance}
                        distanceMeters={effectiveDistance}
                        isOutsideRadius={isOutsideRadius}
                        className="h-60 w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de Inconsistências / Ressalvas Adicionais */}
              <div className="rounded-xl border border-border bg-[#FAFAFA] p-4">
                <span className="block text-caption font-bold uppercase tracking-caps text-muted mb-3">
                  Inconsistências Identificadas ({flags.length > 0 ? flags.length : isOutsideRadius ? 1 : 0})
                </span>

                <div className="space-y-2.5">
                  {isOutsideRadius && (
                    <div className="flex items-start gap-3 rounded-lg border border-danger/20 bg-danger-surface p-3 text-ink">
                      <div className="mt-0.5 text-danger shrink-0">
                        <MapPinIcon size={16} />
                      </div>
                      <div className="text-left text-caption">
                        <p className="font-bold text-danger text-label">
                          Fora do Raio Permitido
                        </p>
                        <p className="text-muted mt-0.5">
                          O aluno confirmou a <strong>{formatDistance(effectiveDistance)}</strong> do
                          centro da sala física cadastrada, ultrapassando a margem de tolerância.
                        </p>
                      </div>
                    </div>
                  )}

                  {flags.includes("shared_device") && (
                    <div className="flex items-start gap-3 rounded-lg border border-danger/20 bg-danger-surface p-3 text-ink">
                      <div className="mt-0.5 text-danger shrink-0">
                        <UsersIcon size={16} />
                      </div>
                      <div className="text-left text-caption">
                        <p className="font-bold text-danger text-label">
                          Dispositivo Móvel Compartilhado
                        </p>
                        <p className="text-muted mt-0.5">
                          O identificador único deste aparelho celular já foi utilizado por outra matrícula para confirmar presença nesta mesma sessão.
                        </p>
                      </div>
                    </div>
                  )}

                  {flags.includes("low_gps_accuracy") && (
                    <div className="flex items-start gap-3 rounded-lg border border-border bg-white p-3 text-ink">
                      <div className="mt-0.5 text-warn shrink-0">
                        <GpsIcon size={16} />
                      </div>
                      <div className="text-left text-caption">
                        <p className="font-bold text-ink text-label">
                          Precisão de GPS Baixa
                        </p>
                        <p className="text-muted mt-0.5">
                          O aparelho indicou margem de erro no GPS de ±{record.gps_accuracy_meters ? Math.round(record.gps_accuracy_meters) : "—"}m, indicando possível instabilidade no sinal.
                        </p>
                      </div>
                    </div>
                  )}

                  {flags.includes("confirmed_near_expiry") && (
                    <div className="flex items-start gap-3 rounded-lg border border-border bg-white p-3 text-ink">
                      <div className="mt-0.5 text-muted shrink-0">
                        <ClockIcon size={16} />
                      </div>
                      <div className="text-left text-caption">
                        <p className="font-bold text-ink text-label">
                          Confirmação nos Segundos Finais
                        </p>
                        <p className="text-muted mt-0.5">
                          O registro foi enviado a menos de 30 segundos do encerramento da chamada.
                        </p>
                      </div>
                    </div>
                  )}

                  {flags.includes("non_mobile_client") && (
                    <div className="flex items-start gap-3 rounded-lg border border-border bg-white p-3 text-ink">
                      <div className="mt-0.5 text-muted shrink-0">
                        <InfoIcon size={16} />
                      </div>
                      <div className="text-left text-caption">
                        <p className="font-bold text-ink text-label">
                          Origem Não Mobile
                        </p>
                        <p className="text-muted mt-0.5">
                          A confirmação não partiu de um cliente mobile oficial do Locus (possível navegador ou script automatizado).
                        </p>
                      </div>
                    </div>
                  )}

                  {!isOutsideRadius && flags.length === 0 && (
                    <p className="text-caption text-muted italic">
                      Nenhuma flag de anomalia grave detectada.
                    </p>
                  )}
                </div>
              </div>

              {/* Informações Técnicas */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="rounded-lg border border-border bg-surface/40 p-3">
                  <span className="text-caption uppercase tracking-caps text-muted block font-sans">
                    Horário da Confirmação
                  </span>
                  <span className="font-medium text-body text-ink block mt-0.5">
                    {formatDateTime(record.confirmed_at)}
                  </span>
                </div>

                <div className="rounded-lg border border-border bg-surface/40 p-3">
                  <span className="text-caption uppercase tracking-caps text-muted block font-sans">
                    Distância Calculada
                  </span>
                  <span className="font-mono text-body font-bold text-ink block mt-0.5">
                    {formatDistance(effectiveDistance)}
                  </span>
                </div>

                <div className="rounded-lg border border-border bg-surface/40 p-3">
                  <span className="text-caption uppercase tracking-caps text-muted block font-sans">
                    Precisão do Sensor
                  </span>
                  <span className="font-medium text-body text-ink block mt-0.5">
                    {record.gps_accuracy_meters
                      ? `± ${Math.round(record.gps_accuracy_meters)} metros`
                      : "Não informada"}
                  </span>
                </div>

                <div className="rounded-lg border border-border bg-surface/40 p-3">
                  <span className="text-caption uppercase tracking-caps text-muted block font-sans">
                    Dispositivo Identificado
                  </span>
                  <span className="font-mono text-caption text-ink block mt-0.5 truncate" title={record.device_id ?? "—"}>
                    {record.device_id
                      ? `ID: ...${record.device_id.slice(-10)}`
                      : "Dispositivo padrão"}
                  </span>
                </div>
              </div>

              {/* Histórico de Revisão se já revisado */}
              {record.reviewed_at && (
                <div className="rounded-lg border border-border bg-white p-3 text-left">
                  <div className="flex items-center justify-between text-caption text-muted">
                    <span className="font-bold uppercase tracking-caps">
                      Revisão Anterior
                    </span>
                    <span>{formatDateTime(record.reviewed_at)}</span>
                  </div>
                  {record.review_note && (
                    <p className="text-caption text-ink mt-1 italic">
                      "{record.review_note}"
                    </p>
                  )}
                </div>
              )}

              {/* Formulário de Ação */}
              <div className="space-y-2 text-left pt-2">
                <label
                  htmlFor="review-note-input"
                  className="block text-caption font-bold uppercase tracking-caps text-muted"
                >
                  Justificativa / Observação do Professor (opcional)
                </label>
                <textarea
                  id="review-note-input"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: Aluno comprovou problema técnico no aparelho ou estava presente em sala..."
                  className="w-full rounded-xl border border-border bg-white p-3 text-label text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none transition-colors"
                />
              </div>

              {actionError && (
                <div className="rounded-lg border border-danger/40 bg-danger-surface p-3 text-caption font-semibold text-danger">
                  {actionError}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer / Ações */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-[#FAFAFA] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-border bg-white px-4 py-2 text-label font-semibold text-ink hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
          >
            Fechar
          </button>

          {record && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDecision("rejected")}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger-surface px-4 py-2 text-label font-bold text-danger hover:bg-danger hover:text-white transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <CloseIcon size={14} />
                <span>{submitting ? "Processando…" : "Rejeitar (Marcar Falta)"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision("approved")}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-label font-bold text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <CheckIcon size={14} />
                <span>{submitting ? "Processando…" : "Validar Presença"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
