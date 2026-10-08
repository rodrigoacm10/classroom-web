"use client";

import React from "react";
import { SaveIcon } from "@/components/icons";
import { useEditarSala } from "../hooks";
import {
  NovaSalaHeader,
  NovaSalaAlerts,
  NovaSalaForm,
  NovaSalaPreview,
} from "../components";

export interface EditarSalaProps {
  roomId: string;
}

export function EditarSala({ roomId }: EditarSalaProps) {
  const {
    name,
    setName,
    latStr,
    setLatStr,
    lngStr,
    setLngStr,
    latNum,
    lngNum,
    toleranceRadius,
    setToleranceRadius,
    submitting,
    initialLoading,
    initialRoom,
    geoLocating,
    geoMessage,
    setGeoMessage,
    error,
    setError,
    copied,
    isLatValid,
    isLngValid,
    isFormValid,
    radiusInfo,
    coverageAreaM2,
    googleMapsUrl,
    handleCaptureGps,
    handleCoordPaste,
    handleCopyCoords,
    handleSubmit,
    CAMPUS_PRESETS,
    RADIUS_PRESETS,
    ROOM_NAME_SUGGESTIONS,
  } = useEditarSala(roomId);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-paper">
      {/* ── Top Bar ── */}
      <NovaSalaHeader
        title={`Editar Sala ${initialRoom ? `· ${initialRoom.name}` : ""}`}
      />

      {/* ── Alertas (Erro / GPS) ── */}
      <NovaSalaAlerts
        error={error}
        onErrorClose={() => setError(null)}
        geoMessage={geoMessage}
        onGeoMessageClose={() => setGeoMessage(null)}
      />

      {/* ── Painel Principal ── */}
      <div className="flex min-h-0 flex-1">
        {/* Formulário lateral */}
        <NovaSalaForm
          name={name}
          onNameChange={setName}
          latStr={latStr}
          onLatChange={setLatStr}
          lngStr={lngStr}
          onLngChange={setLngStr}
          toleranceRadius={toleranceRadius}
          onRadiusChange={setToleranceRadius}
          submitting={submitting}
          initialLoading={initialLoading}
          geoLocating={geoLocating}
          isLatValid={isLatValid}
          isLngValid={isLngValid}
          isFormValid={isFormValid}
          radiusInfo={radiusInfo}
          onCaptureGps={handleCaptureGps}
          onCoordPaste={handleCoordPaste}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações da sala"
          submittingLabel="Salvando alterações..."
          submitIcon={<SaveIcon />}
          infoNote="As alterações surtirão efeito imediatamente em todas as novas chamadas"
          campusPresets={CAMPUS_PRESETS}
          radiusPresets={RADIUS_PRESETS}
          nameSuggestions={ROOM_NAME_SUGGESTIONS}
        />

        {/* Prévia em tempo real */}
        <NovaSalaPreview
          name={name}
          latNum={latNum}
          lngNum={lngNum}
          toleranceRadius={toleranceRadius}
          radiusInfo={radiusInfo}
          coverageAreaM2={coverageAreaM2}
          googleMapsUrl={googleMapsUrl}
          isLatValid={isLatValid}
          isLngValid={isLngValid}
          isFormValid={isFormValid}
          copied={copied}
          onCopyCoords={handleCopyCoords}
        />
      </div>
    </div>
  );
}
