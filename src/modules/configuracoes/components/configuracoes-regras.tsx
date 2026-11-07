"use client";

import React from "react";
import { CheckIcon, InfoIcon } from "@/components/icons";

export function ConfiguracoesRegras() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
      {/* Coluna Esquerda: Título e Contexto */}
      <div className="md:col-span-4">
        <h2 className="font-sans text-heading font-bold text-ink">
          Regras de Presença
        </h2>
        <p className="mt-1 text-caption text-muted leading-relaxed">
          Parâmetros institucionais de corte de faltas, perímetro de geofencing e tempo de sessão ao vivo.
        </p>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-surface/60 p-3 text-caption text-muted">
          <div className="mt-0.5 text-muted shrink-0">
            <InfoIcon />
          </div>
          <span className="leading-snug">
            Valores padrão do motor Locus (<code className="font-mono text-[11px]">RF16</code> e{" "}
            <code className="font-mono text-[11px]">UC11</code>). A edição personalizada por tenant será liberada na próxima versão.
          </span>
        </div>
      </div>

      {/* Coluna Direita: Linhas Divididas por Hairline */}
      <div className="md:col-span-8 rounded-xl border border-border bg-white divide-y divide-border shadow-2xs overflow-hidden">
        {/* Linha 1: Frequência Mínima */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-3">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-sans text-label font-bold text-ink">
                Frequência Mínima de Aprovação
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                LEITURA
              </span>
            </div>
            <p className="mt-0.5 text-caption text-muted leading-relaxed">
              Limite de corte para alerta acadêmico. Estudantes com frequência abaixo deste valor são classificados como <em className="not-italic font-semibold text-ink">Em Risco</em>.
            </p>
          </div>

          <div className="font-mono text-[28px] font-bold text-ink shrink-0 sm:text-right leading-none">
            75%
          </div>
        </div>

        {/* Linha 2: Raio de Tolerância GPS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-3">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-sans text-label font-bold text-ink">
                Raio Padrão de Tolerância
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                GEOFENCE
              </span>
            </div>
            <p className="mt-0.5 text-caption text-muted leading-relaxed">
              Distância limite ao redor das coordenadas WGS84 da sala. Preenchido por padrão ao criar salas para mitigar imprecisões de GPS em ambientes fechados.
            </p>
          </div>

          <div className="font-mono text-[28px] font-bold text-ink shrink-0 sm:text-right leading-none">
            50 m
          </div>
        </div>

        {/* Linha 3: Duração da Janela ao Vivo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-3">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-sans text-label font-bold text-ink">
                Duração Sugerida da Chamada
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                SESSÃO
              </span>
            </div>
            <p className="mt-0.5 text-caption text-muted leading-relaxed">
              Janela temporal padrão sugerida ao docente para confirmação dos estudantes antes da expiração do código dinâmico.
            </p>
          </div>

          <div className="font-mono text-[28px] font-bold text-ink shrink-0 sm:text-right leading-none">
            15 min
          </div>
        </div>

        {/* Linha 4: Mecanismos Antifraude */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between px-5 py-4 gap-3">
          <div className="max-w-md">
            <span className="font-sans text-label font-bold text-ink">
              Mecanismos Antifraude Ativos
            </span>
            <p className="mt-0.5 text-caption text-muted leading-relaxed">
              Camadas de integridade técnica ativas no backend para prevenir confirmações remotas ou cruzadas.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 text-caption text-ink">
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckIcon size={10} />
              </span>
              <span className="font-medium">Validação PostGIS ST_Distance</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckIcon size={10} />
              </span>
              <span className="font-medium">Código do Dia Efêmero</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckIcon size={10} />
              </span>
              <span className="font-medium">Auditoria de Evidência Fotográfica</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
