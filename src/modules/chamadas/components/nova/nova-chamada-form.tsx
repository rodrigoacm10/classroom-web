import React from "react";
import type { SubjectClassItem, Room } from "@/lib/api";
import {
  ChevronDownIcon,
  SearchIcon,
  PlayIcon,
  InfoIcon,
  GpsIcon,
} from "@/components/icons";
import type { Duration } from "../../types";
import { FormFieldsSkeleton } from "./nova-chamada-skeletons";

export interface NovaChamadaFormProps {
  loading: boolean;
  classes: SubjectClassItem[];
  classesTotal: number;
  selectedClass: SubjectClassItem | null;
  turmaLabel: string;
  turmaDropdownOpen: boolean;
  setTurmaDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  turmaDropdownRef: React.RefObject<HTMLDivElement | null>;
  classSearch: string;
  setClassSearch: (value: string) => void;
  classSearchInputRef: React.RefObject<HTMLInputElement | null>;
  searchLoading: boolean;
  handleSelectTurma: (item: SubjectClassItem) => void;

  rooms: Room[];
  filteredRooms: Room[];
  selectedRoom?: Room | null;
  selectedRoomId?: string | null;
  localLabel: string;
  roomDropdownOpen: boolean;
  setRoomDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomDropdownRef: React.RefObject<HTMLDivElement | null>;
  roomSearch: string;
  setRoomSearch: (value: string) => void;
  roomSearchInputRef: React.RefObject<HTMLInputElement | null>;
  handleSelectRoom: (room: Room) => void;

  // Geolocalização dinâmica do professor
  locationMode: "room" | "current_gps";
  setLocationMode: (mode: "room" | "current_gps") => void;
  professorLat: number | null;
  professorLng: number | null;
  professorAccuracy: number | null;
  customRadius: number;
  setCustomRadius: (radius: number) => void;
  radiusOptions: readonly number[];
  geoLocating: boolean;
  geoMessage: string | null;
  onCaptureGps: () => void;

  duration: Duration;
  setDuration: (duration: Duration) => void;
  durationOptions: readonly Duration[];

  submitting: boolean;
  handleSubmit: () => void;
  studentCount: number;
}

export function NovaChamadaForm({
  loading,
  classes,
  classesTotal,
  selectedClass,
  turmaLabel,
  turmaDropdownOpen,
  setTurmaDropdownOpen,
  turmaDropdownRef,
  classSearch,
  setClassSearch,
  classSearchInputRef,
  searchLoading,
  handleSelectTurma,

  rooms,
  filteredRooms,
  selectedRoom,
  selectedRoomId,
  localLabel,
  roomDropdownOpen,
  setRoomDropdownOpen,
  roomDropdownRef,
  roomSearch,
  setRoomSearch,
  roomSearchInputRef,
  handleSelectRoom,

  locationMode,
  setLocationMode,
  professorLat,
  professorLng,
  professorAccuracy,
  customRadius,
  setCustomRadius,
  radiusOptions,
  geoLocating,
  geoMessage,
  onCaptureGps,

  duration,
  setDuration,
  durationOptions,

  submitting,
  handleSubmit,
  studentCount,
}: NovaChamadaFormProps) {
  return (
    <aside className="flex w-[460px] shrink-0 flex-col border-r border-border">
      {/* Scrollable form fields */}
      <div className="flex flex-1 flex-col overflow-y-auto px-9 py-7">
        {loading ? (
          <FormFieldsSkeleton />
        ) : (
          <>
            {/* Section 1 — Turma */}
            <div className="relative flex flex-col gap-3 pb-5" ref={turmaDropdownRef}>
              <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                1 — Turma
              </span>
              <div className="flex flex-col gap-1.5">
                <label className="text-label/caption font-medium text-ink">
                  Selecione a turma*
                </label>
                <button
                  type="button"
                  disabled={classes.length === 0 && !classSearch}
                  onClick={() => setTurmaDropdownOpen((prev) => !prev)}
                  className={`flex h-[46px] shrink-0 cursor-pointer items-center justify-between rounded-md bg-surface px-[14px] [border-width:1.5px] border-solid transition-colors ${
                    selectedClass
                      ? "border-ink hover:border-ink/70"
                      : "border-border hover:border-ink/40"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <span
                    className={`text-[14px] leading-[18px] truncate mr-2 ${
                      selectedClass ? "font-medium text-ink" : "text-muted"
                    }`}
                  >
                    {classes.length === 0 && !classSearch
                      ? "Nenhuma turma disponível"
                      : turmaLabel}
                  </span>
                  <ChevronDownIcon
                    className={
                      turmaDropdownOpen
                        ? "rotate-180 transition-transform"
                        : "transition-transform"
                    }
                  />
                </button>

                {/* Dropdown de Turmas com Busca via Query na API */}
                {turmaDropdownOpen && (
                  <div className="absolute top-[82px] left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-paper shadow-2xl">
                    {/* Campo de Busca conectado à rota de pesquisa da API */}
                    <div className="border-b border-border p-2 bg-surface/40">
                      <div className="flex items-center gap-2 rounded-md bg-paper border border-border px-2.5 py-1.5 focus-within:border-ink">
                        {searchLoading ? (
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                        ) : (
                          <SearchIcon />
                        )}
                        <input
                          ref={classSearchInputRef}
                          type="text"
                          value={classSearch}
                          onChange={(e) => setClassSearch(e.target.value)}
                          placeholder="Buscar por turma ou disciplina na API..."
                          className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none"
                        />
                        {classSearch && (
                          <button
                            type="button"
                            onClick={() => setClassSearch("")}
                            className="text-[11px] text-muted hover:text-ink cursor-pointer"
                          >
                            Limpar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Lista com scroll */}
                    <div className="max-h-60 overflow-y-auto p-1">
                      {classes.length === 0 ? (
                        <div className="px-4 py-6 text-center text-[12px] text-muted">
                          {searchLoading
                            ? "Buscando turmas..."
                            : `Nenhuma turma encontrada para "${classSearch}"`}
                        </div>
                      ) : (
                        classes.map((c) => {
                          const isSelected = c.id === selectedClass?.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handleSelectTurma(c)}
                              className={`flex w-full items-center justify-between px-3.5 py-2.5 rounded-md text-left transition-colors hover:bg-surface cursor-pointer ${
                                isSelected
                                  ? "bg-surface font-semibold text-ink"
                                  : "text-ink/80"
                              }`}
                            >
                              <div className="flex flex-col truncate pr-2 max-w-[340px]">
                                <span className="text-[13px] font-medium text-ink truncate">
                                  {c.discipline_name} · {c.name}
                                </span>
                                <span className="text-[11px] text-muted truncate">
                                  {c.student_count} alunos · {c.room_name ?? "Sem sala padrão"}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>

                    {/* Indicador de limite/truncamento da paginação caso haja mais de 50 registros */}
                    {classesTotal > classes.length && (
                      <div className="border-t border-border px-3 py-1.5 bg-surface text-[11px] text-muted text-center">
                        Exibindo {classes.length} de {classesTotal} turmas. Digite acima para buscar turmas específicas.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="h-px shrink-0 bg-border" />

            {/* Section 2 — Local & Geolocalização */}
            <div className="relative flex flex-col gap-3 py-5" ref={roomDropdownRef}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
                  2 — Local & Geolocalização
                </span>

                {/* Seletor do Modo de Localização */}
                <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
                  <button
                    type="button"
                    onClick={() => setLocationMode("room")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      locationMode === "room"
                        ? "bg-paper text-ink shadow-2xs"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <span>Sala cadastrada</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMode("current_gps");
                      if (professorLat === null && !geoLocating) {
                        onCaptureGps();
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      locationMode === "current_gps"
                        ? "bg-paper text-ink shadow-2xs"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <GpsIcon className="h-3 w-3" />
                    <span>Minha localização atual</span>
                  </button>
                </div>
              </div>

              {locationMode === "room" ? (
                /* Modo Sala Cadastrada */
                <div className="flex flex-col gap-1.5">
                  <label className="text-label/caption font-medium text-ink">
                    Sala para esta sessão
                  </label>
                  <button
                    type="button"
                    disabled={!selectedClass || rooms.length === 0}
                    onClick={() => setRoomDropdownOpen((prev) => !prev)}
                    className={`flex h-[46px] shrink-0 cursor-pointer items-center justify-between rounded-md bg-surface px-[14px] [border-width:1.5px] border-solid transition-colors ${
                      selectedClass
                        ? "border-border hover:border-ink/30"
                        : "border-border/60 opacity-60"
                    } disabled:cursor-not-allowed`}
                  >
                    <span
                      className={`text-[14px] leading-[18px] truncate mr-2 ${
                        selectedClass ? "font-medium text-ink" : "text-muted"
                      }`}
                    >
                      {localLabel}
                    </span>
                    <ChevronDownIcon
                      className={
                        roomDropdownOpen
                          ? "rotate-180 transition-transform"
                          : "transition-transform"
                      }
                    />
                  </button>
                  <p className="text-caption/caption text-muted">
                    {selectedClass
                      ? "Pré-selecionada da turma. Altere apenas se necessário."
                      : "Selecione a turma primeiro para carregar a sala associada."}
                  </p>

                  {/* Dropdown de Salas com Busca */}
                  {roomDropdownOpen && (
                    <div className="absolute top-[102px] left-0 z-50 w-full overflow-hidden rounded-lg border border-border bg-paper shadow-2xl">
                      {/* Campo de Busca de Sala */}
                      <div className="border-b border-border p-2 bg-surface/40">
                        <div className="flex items-center gap-2 rounded-md bg-paper border border-border px-2.5 py-1.5 focus-within:border-ink">
                          <SearchIcon />
                          <input
                            ref={roomSearchInputRef}
                            type="text"
                            value={roomSearch}
                            onChange={(e) => setRoomSearch(e.target.value)}
                            placeholder="Buscar sala por nome..."
                            className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none"
                          />
                          {roomSearch && (
                            <button
                              type="button"
                              onClick={() => setRoomSearch("")}
                              className="text-[11px] text-muted hover:text-ink cursor-pointer"
                            >
                              Limpar
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Lista com scroll */}
                      <div className="max-h-60 overflow-y-auto p-1">
                        {filteredRooms.length === 0 ? (
                          <div className="px-4 py-6 text-center text-[12px] text-muted">
                            Nenhuma sala encontrada para &ldquo;{roomSearch}&rdquo;
                          </div>
                        ) : (
                          filteredRooms.map((r) => {
                            const isSelected =
                              r.id ===
                              (selectedRoomId ??
                                selectedRoom?.id ??
                                selectedClass?.room_id);
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => handleSelectRoom(r)}
                                className={`flex w-full items-center justify-between px-3.5 py-2.5 rounded-md text-left transition-colors hover:bg-surface cursor-pointer ${
                                  isSelected
                                    ? "bg-surface font-semibold text-ink"
                                    : "text-ink/80"
                                }`}
                              >
                                <div className="flex flex-col truncate pr-2 max-w-[340px]">
                                  <span className="text-[13px] font-medium text-ink truncate">
                                    {r.name}
                                  </span>
                                  <span className="text-[11px] text-muted truncate">
                                    Raio: {r.tolerance_radius_meters}m · ({r.latitude.toFixed(4)}, {r.longitude.toFixed(4)})
                                  </span>
                                </div>
                                {isSelected && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Modo Geolocalização Atual do Professor */
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-ink">
                      Ponto Central da Chamada
                    </span>
                    <button
                      type="button"
                      onClick={onCaptureGps}
                      disabled={geoLocating}
                      className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-paper px-2.5 py-1 text-[11px] font-semibold text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {geoLocating ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                      ) : (
                        <GpsIcon className="h-3 w-3 text-ink" />
                      )}
                      <span>
                        {geoLocating
                          ? "Obtendo GPS..."
                          : professorLat !== null
                            ? "Recapturar GPS"
                            : "Capturar meu GPS"}
                      </span>
                    </button>
                  </div>

                  {professorLat !== null && professorLng !== null ? (
                    <div className="flex flex-col gap-1.5 rounded-md border border-border/80 bg-paper p-3 font-mono text-[12px]">
                      <div className="flex items-center justify-between text-ink">
                        <span>Lat: <strong>{professorLat.toFixed(6)}</strong></span>
                        <span>Lng: <strong>{professorLng.toFixed(6)}</strong></span>
                      </div>
                      {professorAccuracy !== null && (
                        <div className="text-[11px] text-muted font-sans flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              professorAccuracy <= 30
                                ? "bg-success"
                                : professorAccuracy <= 70
                                  ? "bg-accent"
                                  : "bg-danger"
                            }`}
                          />
                          <span>Precisão reportada: ~{Math.round(professorAccuracy)}m</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-md bg-paper text-center">
                      <p className="text-[12px] text-muted">
                        Clique no botão acima para capturar a sua coordenada GPS atual.
                      </p>
                    </div>
                  )}

                  {geoMessage && (
                    <p className="text-[11px] text-muted italic">
                      {geoMessage}
                    </p>
                  )}

                  {/* Seletor de Raio / Range de Tolerância */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between text-[12px] font-medium text-ink">
                      <span>Raio de presença permitido</span>
                      <span className="font-mono font-bold text-ink">{customRadius} metros</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {radiusOptions.map((r) => {
                        const active = customRadius === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setCustomRadius(r)}
                            className={`flex-1 h-8 rounded-md text-[12px] font-mono font-medium transition-colors cursor-pointer border ${
                              active
                                ? "border-ink bg-ink text-paper font-bold"
                                : "border-border bg-paper text-ink hover:border-ink/40"
                            }`}
                          >
                            {r}m
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-muted">
                      Alunos fora deste raio em relação à sua localização terão a presença marcada como irregular para sua conferência.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px shrink-0 bg-border" />
          </>
        )}

        {/* Section 3 — Duração */}
        <div className="flex flex-col gap-3 pt-5">
          <span className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-muted">
            3 — Duração
          </span>
          <div className="flex flex-col gap-1.5">
            <label className="text-label/caption font-medium text-ink">
              Janela para confirmar presença*
            </label>
            <div className="flex items-center gap-2">
              {durationOptions.map((opt) => {
                const active = duration === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDuration(opt)}
                    className={`flex h-10 cursor-pointer items-center rounded-md px-[18px] text-[14px] leading-[18px] transition-colors [border-width:1.5px] border-solid ${
                      active
                        ? "border-ink bg-ink font-bold text-accent"
                        : "border-border bg-paper font-medium text-ink hover:border-ink/30"
                    }`}
                  >
                    {opt} min
                  </button>
                );
              })}
            </div>
            <p className="text-caption/caption text-muted">
              O código expira após esse período. Padrão recomendado: 15 min.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA footer ── */}
      <div className="flex shrink-0 flex-col gap-2.5 border-t border-border bg-paper px-9 py-5">
        <button
          type="button"
          disabled={submitting || !selectedClass}
          onClick={handleSubmit}
          className="flex h-[60px] shrink-0 cursor-pointer items-center gap-3.5 rounded-xl bg-ink px-5 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
            ) : (
              <PlayIcon />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-body font-bold leading-[115%] tracking-[-0.01em] text-on-ink">
              {submitting
                ? "Iniciando chamada..."
                : selectedClass
                  ? "Iniciar chamada agora"
                  : "Selecione uma turma"}
            </span>
            <span className="text-[11px] leading-[14px] text-on-ink-subtle">
              {selectedClass
                ? "Clique aqui ou pressione ↵ Enter"
                : "Escolha a turma no formulário para habilitar"}
            </span>
          </div>
          {selectedClass && (
            <div className="flex h-[26px] shrink-0 items-center justify-center rounded-sm border border-on-ink-border px-[9px]">
              <span className="font-mono text-caption/caption text-on-ink-subtle">
                ↵
              </span>
            </div>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5">
          <InfoIcon />
          <span className="text-[11px] leading-[14px] text-on-ink-muted">
            {selectedClass
              ? `${studentCount} alunos serão notificados imediatamente ao iniciar`
              : "Nenhum aluno será notificado até que a chamada seja iniciada"}
          </span>
        </div>
      </div>
    </aside>
  );
}
