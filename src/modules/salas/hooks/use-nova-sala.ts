"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, updateRoom, getRoom, type Room } from "@/services/rooms";
import { getRadiusLabel, getGoogleMapsUrl } from "@/lib/utils";
import {
  RADIUS_PRESETS,
  CAMPUS_PRESETS,
  ROOM_NAME_SUGGESTIONS,
} from "../types";

export interface UseNovaSalaOptions {
  roomId?: string;
}

export function useNovaSala(options?: UseNovaSalaOptions) {
  const router = useRouter();
  const roomId = options?.roomId;
  const isEditing = Boolean(roomId);

  // Estados de carregamento inicial (para edição)
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [initialRoom, setInitialRoom] = useState<Room | null>(null);

  // Estados dos campos do formulário
  const [name, setName] = useState("");
  const [latStr, setLatStr] = useState("-8.0476");
  const [lngStr, setLngStr] = useState("-34.8770");
  const [toleranceRadius, setToleranceRadius] = useState<number>(50);

  // Estados de controle e feedback
  const [submitting, setSubmitting] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Carrega dados existentes da sala caso seja modo de edição
  useEffect(() => {
    if (!roomId) return;

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

  // Conversão segura dos valores numéricos de coordenadas
  const latNum = useMemo(() => parseFloat(latStr.replace(",", ".")), [latStr]);
  const lngNum = useMemo(() => parseFloat(lngStr.replace(",", ".")), [lngStr]);

  // Validação em tempo real
  const isNameValid = useMemo(
    () => name.trim().length >= 1 && name.trim().length <= 255,
    [name]
  );
  const isLatValid = useMemo(
    () => !isNaN(latNum) && latNum >= -90 && latNum <= 90,
    [latNum]
  );
  const isLngValid = useMemo(
    () => !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180,
    [lngNum]
  );
  const isRadiusValid = useMemo(
    () =>
      !isNaN(toleranceRadius) && toleranceRadius >= 5 && toleranceRadius <= 500,
    [toleranceRadius]
  );
  const isFormValid =
    isNameValid && isLatValid && isLngValid && isRadiusValid;

  // Raio categorizado
  const radiusInfo = useMemo(
    () => getRadiusLabel(toleranceRadius),
    [toleranceRadius]
  );

  // Área estimada de cobertura circular (π * r²)
  const coverageAreaM2 = useMemo(
    () => Math.round(Math.PI * Math.pow(toleranceRadius, 2)),
    [toleranceRadius]
  );

  // Link do Google Maps
  const googleMapsUrl = useMemo(
    () =>
      !isNaN(latNum) && !isNaN(lngNum)
        ? getGoogleMapsUrl(latNum, lngNum)
        : null,
    [latNum, lngNum]
  );

  // Capturar GPS do navegador
  const handleCaptureGps = useCallback(() => {
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
        setGeoMessage(
          `Coordenadas obtidas via GPS com precisão de ~${Math.round(accuracy)}m.`
        );
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
  }, []);

  // Parser inteligente para detectar colagem de coordenadas completas (ex: "-8.0476, -34.8770" ou link maps)
  const handleCoordPaste = useCallback((pastedText: string) => {
    const matchMapsUrl = pastedText.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (matchMapsUrl) {
      setLatStr(matchMapsUrl[1]);
      setLngStr(matchMapsUrl[2]);
      return;
    }

    const parts = pastedText
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      const p1 = parseFloat(parts[0].replace(",", "."));
      const p2 = parseFloat(parts[1].replace(",", "."));
      if (
        !isNaN(p1) &&
        !isNaN(p2) &&
        p1 >= -90 &&
        p1 <= 90 &&
        p2 >= -180 &&
        p2 <= 180
      ) {
        setLatStr(p1.toString());
        setLngStr(p2.toString());
      }
    }
  }, []);

  // Copiar coordenadas para a área de transferência
  const handleCopyCoords = useCallback(() => {
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      navigator.clipboard.writeText(`${latNum}, ${lngNum}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  }, [latNum, lngNum]);

  // Submissão do cadastro ou atualização
  const handleSubmit = useCallback(async () => {
    if (!isFormValid || submitting || initialLoading) return;

    try {
      setSubmitting(true);
      setError(null);

      if (roomId) {
        // Modo Edição: PATCH /rooms/{roomId}
        await updateRoom(roomId, {
          name: name.trim(),
          latitude: latNum,
          longitude: lngNum,
          tolerance_radius_meters: toleranceRadius,
        });
      } else {
        // Modo Criação: POST /rooms
        await createRoom({
          name: name.trim(),
          latitude: latNum,
          longitude: lngNum,
          tolerance_radius_meters: toleranceRadius,
        });
      }

      // Redireciona com sucesso de volta para a listagem de salas
      router.push("/dashboard/salas");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Erro ao ${roomId ? "atualizar" : "cadastrar"} a sala física.`
      );
      setSubmitting(false);
    }
  }, [
    isFormValid,
    submitting,
    initialLoading,
    roomId,
    name,
    latNum,
    lngNum,
    toleranceRadius,
    router,
  ]);

  // Atalho Enter para submeter quando o formulário estiver pronto
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && isFormValid && !submitting && !initialLoading) {
        handleSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormValid, submitting, initialLoading, handleSubmit]);

  return {
    isEditing,
    initialLoading,
    initialRoom,
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
    geoLocating,
    geoMessage,
    setGeoMessage,
    error,
    setError,
    copied,
    isNameValid,
    isLatValid,
    isLngValid,
    isRadiusValid,
    isFormValid,
    radiusInfo,
    coverageAreaM2,
    googleMapsUrl,
    handleCaptureGps,
    handleCoordPaste,
    handleCopyCoords,
    handleSubmit,
    RADIUS_PRESETS,
    CAMPUS_PRESETS,
    ROOM_NAME_SUGGESTIONS,
  };
}

export function useEditarSala(roomId: string) {
  return useNovaSala({ roomId });
}
