import {
  api,
  ApiError,
  clearStoredToken,
  getStoredToken,
  refreshAccessToken,
} from "@/lib/api-client";
import { apiUrl } from "@/lib/env";
import type {
  AssistantStatusStage,
  ConversationDetail,
  ConversationSummary,
  SourceCitation,
  StreamEvent,
  ToolCallTrace,
} from "@/modules/assistant/types";

export type {
  AssistantRequestStage,
  AssistantStatusStage,
  ChatMessage,
  ConversationDetail,
  ConversationSummary,
  SourceCitation,
  StreamEvent,
  ToolCallTrace,
} from "@/modules/assistant/types";

export type CreateConversationParams = {
  title?: string;
};

export type ListConversationsParams = {
  limit?: number;
  offset?: number;
};

export type StreamAssistantMessageParams = {
  conversationId: string;
  content: string;
  currentRoute?: string | null;
  signal?: AbortSignal;
  onEvent: (event: StreamEvent) => void;
};

/**
 * Cria uma nova conversa do assistente na instituição ativa.
 */
export async function createAssistantConversation(
  params: CreateConversationParams = {},
): Promise<ConversationSummary> {
  return api<ConversationSummary>("/assistant/conversations", {
    method: "POST",
    body: params,
  });
}

/**
 * Lista as conversas recentes do usuário autenticado na instituição ativa.
 */
export async function listAssistantConversations(
  params: ListConversationsParams = {},
): Promise<ConversationSummary[]> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.offset !== undefined) query.set("offset", String(params.offset));
  const qs = query.toString() ? `?${query.toString()}` : "";
  return api<ConversationSummary[]>(`/assistant/conversations${qs}`);
}

/**
 * Carrega os metadados e o histórico ordenado de mensagens de uma conversa.
 */
export async function getAssistantConversation(
  conversationId: string,
): Promise<ConversationDetail> {
  return api<ConversationDetail>(`/assistant/conversations/${conversationId}`);
}

/**
 * Remove uma conversa do usuário autenticado.
 */
export async function deleteAssistantConversation(
  conversationId: string,
): Promise<void> {
  return api<void>(`/assistant/conversations/${conversationId}`, {
    method: "DELETE",
  });
}

/**
 * Converte um bloco SSE (`event: ...\ndata: ...`) em um `StreamEvent` tipado.
 */
export function parseSSEFrame(rawBlock: string): StreamEvent | null {
  const trimmed = rawBlock.trim();
  if (!trimmed) return null;

  let eventName = "message";
  const dataLines: string[] = [];

  for (const rawLine of trimmed.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith(":")) continue;

    if (line.startsWith("event:")) {
      eventName = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trim());
    }
  }

  if (dataLines.length === 0) return null;

  try {
    const parsed = JSON.parse(dataLines.join("\n")) as Record<string, unknown>;

    if (eventName === "status") {
      return {
        event: "status",
        data: {
          stage: (parsed.stage as AssistantStatusStage) ?? "searching_docs",
          tool: typeof parsed.tool === "string" ? parsed.tool : undefined,
          query: typeof parsed.query === "string" ? parsed.query : undefined,
        },
      };
    }

    if (eventName === "delta") {
      return {
        event: "delta",
        data: {
          text: typeof parsed.text === "string" ? parsed.text : "",
        },
      };
    }

    if (eventName === "done") {
      return {
        event: "done",
        data: {
          message_id:
            typeof parsed.message_id === "string" ? parsed.message_id : "",
          sources: Array.isArray(parsed.sources)
            ? (parsed.sources as SourceCitation[])
            : [],
          tool_calls_used: Array.isArray(parsed.tool_calls_used)
            ? (parsed.tool_calls_used as ToolCallTrace[])
            : undefined,
        },
      };
    }

    if (eventName === "error") {
      return {
        event: "error",
        data: {
          detail:
            typeof parsed.detail === "string"
              ? parsed.detail
              : "Não foi possível gerar a resposta do assistente.",
        },
      };
    }
  } catch {
    return null;
  }

  return null;
}

async function openAssistantMessageStream(
  conversationId: string,
  body: { content: string; current_route?: string | null },
  signal?: AbortSignal,
  isRetry = false,
): Promise<Response> {
  let token = getStoredToken();
  if (!token && typeof window !== "undefined") {
    try {
      token = await refreshAccessToken();
    } catch {
      // Sem sessão ativa
    }
  }

  const headers = new Headers({
    Accept: "text/event-stream",
    "Content-Type": "application/json",
  });
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${apiUrl}/assistant/conversations/${conversationId}/messages`,
    {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(body),
      signal,
    },
  );

  if (response.status === 401 && !isRetry) {
    try {
      await refreshAccessToken();
      return openAssistantMessageStream(conversationId, body, signal, true);
    } catch {
      clearStoredToken();
      throw new ApiError(401, "Sessão expirada. Faça login novamente.");
    }
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string | { msg?: string }[];
    } | null;

    const detail = payload?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? (detail[0]?.msg ?? response.statusText)
          : response.statusText || "Erro ao comunicar com o Assistente Locus.";

    throw new ApiError(response.status, message);
  }

  return response;
}

/**
 * Envia uma mensagem para uma conversa e consome a resposta em streaming SSE (`ReadableStream`),
 * tratando chunks parciais divididos entre pacotes TCP.
 */
export async function streamAssistantMessage({
  conversationId,
  content,
  currentRoute,
  signal,
  onEvent,
}: StreamAssistantMessageParams): Promise<void> {
  const response = await openAssistantMessageStream(
    conversationId,
    {
      content,
      current_route: currentRoute ?? null,
    },
    signal,
  );

  if (!response.body) {
    throw new ApiError(500, "O servidor não retornou um stream de resposta.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

      let boundaryIndex = buffer.indexOf("\n\n");
      while (boundaryIndex !== -1) {
        const frameBlock = buffer.slice(0, boundaryIndex);
        buffer = buffer.slice(boundaryIndex + 2);

        const parsedEvent = parseSSEFrame(frameBlock);
        if (parsedEvent) {
          onEvent(parsedEvent);
        }

        boundaryIndex = buffer.indexOf("\n\n");
      }
    }

    buffer += decoder.decode().replace(/\r\n/g, "\n");
    if (buffer.trim()) {
      const trailingEvent = parseSSEFrame(buffer);
      if (trailingEvent) {
        onEvent(trailingEvent);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export const assistantService = {
  createConversation: createAssistantConversation,
  listConversations: listAssistantConversations,
  getConversation: getAssistantConversation,
  deleteConversation: deleteAssistantConversation,
  streamMessage: streamAssistantMessage,
};
