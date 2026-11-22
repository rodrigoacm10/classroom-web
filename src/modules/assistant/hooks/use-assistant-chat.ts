"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  createAssistantConversation,
  deleteAssistantConversation,
  getAssistantConversation,
  listAssistantConversations,
  streamAssistantMessage,
} from "@/services/assistant";
import type {
  AssistantRequestStage,
  ChatMessage,
  ConversationSummary,
  ToolCallTrace,
} from "@/modules/assistant/types";

function deriveOptimisticTitle(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "Nova conversa";
  return cleaned.length <= 120 ? cleaned : `${cleaned.slice(0, 119).trimEnd()}…`;
}

export function useAssistantChat() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [requestStage, setRequestStage] =
    useState<AssistantRequestStage>("idle");
  const [activeToolQuery, setActiveToolQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasInitializedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isStreaming = requestStage !== "idle";
  const isSearchingDocs = requestStage === "searching_docs";

  const selectConversation = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      setError(null);
      setActiveConversationId(conversationId);
      const detail = await getAssistantConversation(conversationId);
      setMessages(detail.messages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as mensagens da conversa.",
      );
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const loadConversations = useCallback(
    async (autoSelectMostRecent = true) => {
      try {
        setLoadingConversations(true);
        setError(null);
        const list = await listAssistantConversations({ limit: 20, offset: 0 });
        setConversations(list);

        if (
          autoSelectMostRecent &&
          list.length > 0 &&
          !activeConversationId
        ) {
          await selectConversation(list[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar suas conversas.",
        );
      } finally {
        setLoadingConversations(false);
      }
    },
    [activeConversationId, selectConversation],
  );

  // Carrega conversas recentes automaticamente na primeira abertura da gaveta
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      void loadConversations(true);
    }
  }, [isOpen, loadConversations]);

  // Cancela stream pendente ao desmontar
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const startNewConversation = useCallback(() => {
    abortControllerRef.current?.abort();
    setActiveConversationId(null);
    setMessages([]);
    setRequestStage("idle");
    setActiveToolQuery(null);
    setError(null);
  }, []);

  const removeConversation = useCallback(
    async (conversationId: string) => {
      try {
        setError(null);
        await deleteAssistantConversation(conversationId);
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));

        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
          setMessages([]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível excluir a conversa.",
        );
      }
    },
    [activeConversationId],
  );

  const sendMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || requestStage !== "idle") return;

      const nowIso = new Date().toISOString();
      const optimisticUserId = `user-${Date.now()}`;
      const optimisticAssistantId = `assistant-${Date.now()}`;
      const tempConvId = activeConversationId ?? "pending";

      // Exibe a mensagem do usuário e o estado "Analisando sua pergunta..." imediatamente (0ms de atraso)
      setError(null);
      setRequestStage("thinking");
      setActiveToolQuery(null);

      const userMsg: ChatMessage = {
        id: optimisticUserId,
        conversation_id: tempConvId,
        role: "user",
        content,
        sources: null,
        created_at: nowIso,
      };

      const assistantPlaceholder: ChatMessage = {
        id: optimisticAssistantId,
        conversation_id: tempConvId,
        role: "assistant",
        content: "",
        sources: null,
        tool_calls_used: null,
        created_at: nowIso,
      };

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);

      let targetConversationId = activeConversationId;
      const isFirstMessageInThread =
        !targetConversationId || messages.length === 0;

      try {
        if (!targetConversationId) {
          const created = await createAssistantConversation();
          targetConversationId = created.id;
          setActiveConversationId(created.id);
          setConversations((prev) => [
            created,
            ...prev.filter((c) => c.id !== created.id),
          ]);
        }

        const convId = targetConversationId;

        if (isFirstMessageInThread) {
          const derivedTitle = deriveOptimisticTitle(content);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId && c.title === "Nova conversa"
                ? { ...c, title: derivedTitle, updated_at: nowIso }
                : c,
            ),
          );
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        await streamAssistantMessage({
          conversationId: convId,
          content,
          currentRoute: pathname,
          signal: controller.signal,
          onEvent: (event) => {
            if (event.event === "status") {
              if (event.data.stage === "searching_docs") {
                setRequestStage("searching_docs");
                const queryText = event.data.query ?? content;
                setActiveToolQuery(queryText);

                const newTrace: ToolCallTrace = {
                  name: event.data.tool ?? "search_locus_docs",
                  arguments: { query: queryText },
                };

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === optimisticAssistantId
                      ? {
                          ...msg,
                          conversation_id: convId,
                          tool_calls_used: [
                            ...(msg.tool_calls_used ?? []),
                            newTrace,
                          ],
                        }
                      : msg,
                  ),
                );
              }
            } else if (event.event === "delta") {
              setRequestStage("streaming");
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === optimisticAssistantId
                    ? {
                        ...msg,
                        conversation_id: convId,
                        content: msg.content + event.data.text,
                      }
                    : msg,
                ),
              );
            } else if (event.event === "done") {
              setRequestStage("idle");
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === optimisticAssistantId
                    ? {
                        ...msg,
                        id: event.data.message_id || msg.id,
                        conversation_id: convId,
                        sources:
                          event.data.sources && event.data.sources.length > 0
                            ? event.data.sources
                            : null,
                        tool_calls_used:
                          event.data.tool_calls_used &&
                          event.data.tool_calls_used.length > 0
                            ? event.data.tool_calls_used
                            : msg.tool_calls_used,
                      }
                    : msg,
                ),
              );
            } else if (event.event === "error") {
              setRequestStage("idle");
              setError(event.data.detail);
              setMessages((prev) =>
                prev.filter(
                  (msg) =>
                    msg.id !== optimisticAssistantId || msg.content.length > 0,
                ),
              );
            }
          },
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível enviar sua mensagem ao assistente.",
        );
        setMessages((prev) =>
          prev.filter(
            (msg) =>
              msg.id !== optimisticAssistantId || msg.content.length > 0,
          ),
        );
      } finally {
        setRequestStage("idle");
        setActiveToolQuery(null);
      }
    },
    [activeConversationId, messages.length, pathname, requestStage],
  );

  return {
    isOpen,
    setIsOpen,
    openDrawer: () => setIsOpen(true),
    closeDrawer: () => setIsOpen(false),
    toggleDrawer: () => setIsOpen((prev) => !prev),
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
    clearError: () => setError(null),
    loadConversations,
    selectConversation,
    startNewConversation,
    removeConversation,
    sendMessage,
  };
}
