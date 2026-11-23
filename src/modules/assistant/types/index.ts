export type SourceCitation = {
  doc_slug: string;
  section_title: string;
  routes: string[];
};

export type ToolCallTrace = {
  name: string;
  arguments: Record<string, unknown>;
};

export type FeedbackRating = "up" | "down";

export type MessageFeedbackResponse = {
  message_id: string;
  feedback_rating: FeedbackRating | null;
  feedback_comment: string | null;
  feedback_updated_at: string | null;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  sources: SourceCitation[] | null;
  tool_calls_used?: ToolCallTrace[] | null;
  model_name?: string | null;
  tokens_in?: number | null;
  tokens_out?: number | null;
  latency_ms?: number | null;
  feedback_rating?: FeedbackRating | null;
  feedback_comment?: string | null;
  feedback_updated_at?: string | null;
  created_at?: string | null;
};

export type ConversationSummary = {
  id: string;
  tenant_id: string;
  user_id: string;
  title: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ConversationDetail = ConversationSummary & {
  messages: ChatMessage[];
};

export type AssistantStatusStage = "searching_docs" | "querying_data";

export type AssistantRequestStage =
  | "idle"
  | "thinking"
  | "searching_docs"
  | "querying_data"
  | "streaming";

export type StreamEvent =
  | {
      event: "status";
      data: {
        stage: AssistantStatusStage;
        tool?: string;
        query?: string;
      };
    }
  | { event: "delta"; data: { text: string } }
  | {
      event: "done";
      data: {
        message_id: string;
        sources: SourceCitation[];
        tool_calls_used?: ToolCallTrace[];
      };
    }
  | { event: "error"; data: { detail: string } };
