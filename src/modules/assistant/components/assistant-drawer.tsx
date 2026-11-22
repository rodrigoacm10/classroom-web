"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon, PlusIcon, TrashIcon } from "@/components/icons";
import type {
  AssistantRequestStage,
  ChatMessage,
  ConversationSummary,
} from "@/modules/assistant/types";
import { AssistantMessage } from "./assistant-message";
import { StarterPrompts } from "./starter-prompts";

const MIN_DRAWER_WIDTH = 460;
const EXPANDED_DRAWER_WIDTH = 720;
const MAX_DRAWER_WIDTH = 920;

export interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: "admin" | "professor" | "coordenador" | "aluno" | null;
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  requestStage: AssistantRequestStage;
  activeToolQuery: string | null;
  isStreaming: boolean;
  isSearchingDocs: boolean;
  error: string | null;
  onClearError: () => void;
  onSelectConversation: (conversationId: string) => Promise<void> | void;
  onStartNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => Promise<void> | void;
  onSendMessage: (content: string) => Promise<void> | void;
}

function clampDrawerWidth(desiredWidth: number): number {
  const viewportLimit =
    typeof window !== "undefined"
      ? Math.max(MIN_DRAWER_WIDTH, window.innerWidth - 48)
      : MAX_DRAWER_WIDTH;
  const ceiling = Math.min(MAX_DRAWER_WIDTH, viewportLimit);
  return Math.min(ceiling, Math.max(MIN_DRAWER_WIDTH, Math.round(desiredWidth)));
}

export function AssistantDrawer({
  isOpen,
  onClose,
  userRole,
  conversations,
  activeConversationId,
  messages,
  loadingConversations,
  loadingMessages,
  requestStage,
  activeToolQuery,
  isStreaming,
  isSearchingDocs,
  error,
  onClearError,
  onSelectConversation,
  onStartNewConversation,
  onDeleteConversation,
  onSendMessage,
}: AssistantDrawerProps) {
  const [inputValue, setInputValue] = useState("");
  const [showHistoryList, setShowHistoryList] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(MIN_DRAWER_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages, isSearchingDocs]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeConversationId]);

  useEffect(() => {
    if (!isResizing) return;

    function handlePointerMove(event: MouseEvent) {
      const nextWidth = clampDrawerWidth(window.innerWidth - event.clientX);
      setDrawerWidth(nextWidth);
    }

    function handlePointerUp() {
      setIsResizing(false);
    }

    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, [isResizing]);

  const isExpanded = drawerWidth > MIN_DRAWER_WIDTH + 24;

  const toggleExpandWidth = useCallback(() => {
    setDrawerWidth((current) =>
      current > MIN_DRAWER_WIDTH + 24
        ? MIN_DRAWER_WIDTH
        : clampDrawerWidth(EXPANDED_DRAWER_WIDTH),
    );
  }, []);

  if (!isOpen) return null;

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;
    setInputValue("");
    setShowHistoryList(false);
    await onSendMessage(trimmed);
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="locus-assistant-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <aside
        style={{ width: `min(100vw, ${drawerWidth}px)` }}
        className={`relative z-10 flex h-full w-full flex-col border-l border-border bg-paper shadow-[0_24px_48px_rgba(24,25,27,0.22)] ${
          isResizing ? "" : "transition-[width] duration-150 ease-out"
        }`}
      >
        {/* Left-edge Drag Handle for desktop width resizing */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Arraste para redimensionar a largura do assistente"
          aria-valuemin={MIN_DRAWER_WIDTH}
          aria-valuemax={MAX_DRAWER_WIDTH}
          aria-valuenow={drawerWidth}
          tabIndex={0}
          title="Arraste para ajustar a largura (duplo clique para alternar)"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          onDoubleClick={toggleExpandWidth}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setDrawerWidth((w) => clampDrawerWidth(w + 40));
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              setDrawerWidth((w) => clampDrawerWidth(w - 40));
            }
          }}
          className="group absolute inset-y-0 -left-1.5 z-20 hidden w-3 cursor-ew-resize items-center justify-center sm:flex"
        >
          <span
            className={`h-12 w-1 rounded-full transition-colors duration-150 ${
              isResizing
                ? "bg-accent"
                : "bg-transparent group-hover:bg-control-border"
            }`}
          />
        </div>

        {/* Header (Ink Editorial Bar) */}
        <header className="flex items-center justify-between border-b border-on-ink-border bg-ink px-5 py-4 text-on-ink">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent text-ink">
              <span className="font-extrabold text-label leading-none">L</span>
            </div>
            <div className="flex min-w-0 flex-col">
              <h2
                id="locus-assistant-title"
                className="font-bold tracking-tight text-heading text-on-ink leading-tight truncate"
              >
                Assistente Locus
              </h2>
              <span className="text-caption text-on-ink-muted truncate">
                Documentação e suporte operacional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setShowHistoryList(false);
                onStartNewConversation();
              }}
              title="Iniciar nova conversa"
              className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-on-ink-control-border bg-on-ink-border/60 px-2.5 text-caption font-semibold text-on-ink transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:outline-accent cursor-pointer"
            >
              <PlusIcon size={13} />
              <span>Nova</span>
            </button>

            <button
              type="button"
              onClick={toggleExpandWidth}
              aria-label={
                isExpanded
                  ? "Restaurar largura padrão do assistente"
                  : "Expandir largura do assistente"
              }
              title={
                isExpanded
                  ? "Restaurar largura padrão (460px)"
                  : "Expandir largura (720px)"
              }
              className="hidden h-9 w-9 items-center justify-center rounded-sm text-on-ink-muted transition-colors duration-150 hover:bg-on-ink-border hover:text-on-ink focus-visible:outline-accent cursor-pointer sm:flex"
            >
              {isExpanded ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 3v3H3M10 3v3h3M6 13v-3H3M10 13v-3h3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5.5 3H3v2.5M10.5 3H13v2.5M5.5 13H3v-2.5M10.5 13H13v-2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar assistente"
              title="Fechar (Esc)"
              className="flex h-9 w-9 items-center justify-center rounded-sm text-on-ink-muted transition-colors duration-150 hover:bg-on-ink-border hover:text-on-ink focus-visible:outline-accent cursor-pointer"
            >
              <CloseIcon size={15} />
            </button>
          </div>
        </header>

        {/* Sub-bar: Conversation Switcher */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-2.5">
          <button
            type="button"
            onClick={() => setShowHistoryList((prev) => !prev)}
            aria-expanded={showHistoryList}
            className="flex min-w-0 flex-1 items-center gap-2 text-left text-caption font-semibold text-ink transition-colors duration-150 hover:text-ink cursor-pointer"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 text-muted"
              aria-hidden="true"
            >
              <path
                d="M2.5 4h11M2.5 8h11M2.5 12h7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="truncate">
              {activeConversation
                ? activeConversation.title
                : "Nova conversa"}
            </span>
            <span className="shrink-0 rounded-sm border border-border bg-paper px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted">
              {conversations.length}
            </span>
          </button>

          {showHistoryList && (
            <button
              type="button"
              onClick={() => setShowHistoryList(false)}
              className="ml-3 text-caption font-semibold text-muted hover:text-ink cursor-pointer"
            >
              Voltar ao chat
            </button>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start justify-between gap-3 border-b border-danger/30 bg-danger-surface px-5 py-3 text-caption text-danger">
            <span>{error}</span>
            <button
              type="button"
              onClick={onClearError}
              aria-label="Fechar aviso de erro"
              className="shrink-0 font-semibold underline hover:no-underline cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Main Content: Either Conversation History Drawer or Active Thread */}
        {showHistoryList ? (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-label text-ink">
                Conversas recentes
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowHistoryList(false);
                  onStartNewConversation();
                }}
                className="text-caption font-semibold text-ink underline underline-offset-4 hover:decoration-2 cursor-pointer"
              >
                + Nova conversa
              </button>
            </div>

            {loadingConversations ? (
              <p className="py-6 text-center text-caption text-muted">
                Carregando conversas...
              </p>
            ) : conversations.length === 0 ? (
              <p className="py-6 text-center text-caption text-muted">
                Nenhuma conversa anterior registrada nesta instituição.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border rounded-md border border-border bg-paper">
                {conversations.map((conv) => {
                  const isCurrent = conv.id === activeConversationId;
                  return (
                    <li
                      key={conv.id}
                      className={`flex items-center justify-between gap-2 px-3.5 py-3 transition-colors ${
                        isCurrent ? "bg-accent-surface/50" : "hover:bg-surface"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setShowHistoryList(false);
                          void onSelectConversation(conv.id);
                        }}
                        className="flex min-w-0 flex-1 flex-col text-left cursor-pointer"
                      >
                        <span className="truncate font-semibold text-label text-ink">
                          {conv.title}
                        </span>
                        {conv.updated_at && (
                          <span className="text-[11px] text-muted">
                            {new Date(conv.updated_at).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => void onDeleteConversation(conv.id)}
                        aria-label={`Excluir conversa ${conv.title}`}
                        title="Excluir conversa"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:bg-danger-surface hover:text-danger cursor-pointer"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {loadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-caption text-muted">
                  Carregando histórico da conversa...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <StarterPrompts
                role={userRole}
                disabled={isStreaming}
                onSelectPrompt={(prompt) => void onSendMessage(prompt)}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <AssistantMessage
                    key={msg.id}
                    message={msg}
                    isLatestAssistant={
                      msg.role === "assistant" && idx === messages.length - 1
                    }
                    requestStage={requestStage}
                    activeToolQuery={activeToolQuery}
                    onNavigate={onClose}
                  />
                ))}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        )}

        {/* Composer Footer */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-border bg-paper px-5 py-3.5"
        >
          <div className="flex items-end gap-2">
            <label htmlFor="locus-assistant-input" className="sr-only">
              Sua pergunta sobre o Locus
            </label>
            <textarea
              id="locus-assistant-input"
              ref={textareaRef}
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              disabled={isStreaming}
              placeholder="Pergunte como abrir uma chamada, configurar salas..."
              className="min-h-[44px] max-h-32 flex-1 resize-none rounded-sm border border-control-border bg-paper px-3.5 py-2.5 text-body/body text-ink placeholder:text-muted transition-colors duration-150 hover:border-ink disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputValue.trim()}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-sm bg-ink px-4 font-semibold text-label text-on-ink transition-colors duration-150 hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isStreaming ? "Gerando..." : "Enviar"}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted">
            Respostas baseadas nos guias oficiais do Locus · Enter envia,
            Shift+Enter quebra linha
          </p>
        </form>
      </aside>
    </div>
  );
}
