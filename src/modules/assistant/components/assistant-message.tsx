"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  AssistantRequestStage,
  ChatMessage,
  SourceCitation,
  ToolCallTrace,
} from "@/modules/assistant/types";

export interface AssistantMessageProps {
  message: ChatMessage;
  isLatestAssistant?: boolean;
  requestStage?: AssistantRequestStage;
  activeToolQuery?: string | null;
  onNavigate?: () => void;
}

const INTERNAL_ROUTE_EXACT = /^(\/dashboard(?:\/[a-zA-Z0-9_-]+)*|\/tenants)$/;

const INLINE_TOKEN_REGEX =
  /(\[([^\]]+)\]\((\/dashboard(?:\/[a-zA-Z0-9_-]+)*|\/tenants)\)|`([^`]+)`|\*\*([^*]+)\*\*|(?<![a-zA-Z0-9_])(\/dashboard(?:\/[a-zA-Z0-9_-]+)*|\/tenants)(?![a-zA-Z0-9_/-]))/g;

function RouteLinkChip({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="inline-flex items-center gap-1 rounded-sm bg-accent-surface px-1.5 py-0.5 font-mono text-caption font-semibold text-ink underline decoration-ink/40 underline-offset-4 transition-colors duration-150 hover:bg-accent hover:decoration-ink"
    >
      <span>{label ?? href}</span>
      <svg
        width="11"
        height="11"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function renderInlineMarkdown(
  text: string,
  onNavigate?: () => void,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(INLINE_TOKEN_REGEX.source, "g");
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [, , mdLinkLabel, mdLinkHref, codeContent, boldContent, bareRoute] =
      match;
    const key = `${match.index}-${match[0]}`;

    if (mdLinkLabel && mdLinkHref) {
      nodes.push(
        <RouteLinkChip
          key={key}
          href={mdLinkHref}
          label={mdLinkLabel}
          onNavigate={onNavigate}
        />,
      );
    } else if (codeContent !== undefined) {
      const trimmedCode = codeContent.trim();
      if (INTERNAL_ROUTE_EXACT.test(trimmedCode)) {
        nodes.push(
          <RouteLinkChip
            key={key}
            href={trimmedCode}
            onNavigate={onNavigate}
          />,
        );
      } else {
        nodes.push(
          <code
            key={key}
            className="rounded-sm border border-border bg-paper px-1.5 py-0.5 font-mono text-caption font-medium text-ink"
          >
            {codeContent}
          </code>,
        );
      }
    } else if (boldContent !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {boldContent}
        </strong>,
      );
    } else if (bareRoute !== undefined) {
      nodes.push(
        <RouteLinkChip key={key} href={bareRoute} onNavigate={onNavigate} />,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderMarkdownBlocks(
  content: string,
  onNavigate?: () => void,
): React.ReactNode {
  const lines = content.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("### ") || line.startsWith("## ")) {
      const headingText = line.replace(/^#{2,3}\s+/, "");
      blocks.push(
        <h4
          key={`h-${index}`}
          className="mt-2 font-bold tracking-tight text-label text-ink"
        >
          {renderInlineMarkdown(headingText, onNavigate)}
        </h4>,
      );
      index += 1;
      continue;
    }

    if (/^[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*•]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*•]\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul
          key={`ul-${index}`}
          className="flex list-disc flex-col gap-1.5 pl-5 text-body/body text-ink"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>{renderInlineMarkdown(item, onNavigate)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol
          key={`ol-${index}`}
          className="flex list-decimal flex-col gap-1.5 pl-5 text-body/body text-ink"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>{renderInlineMarkdown(item, onNavigate)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !lines[index].trim().startsWith("## ") &&
      !lines[index].trim().startsWith("### ") &&
      !/^[-*•]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`} className="text-body/body text-ink">
        {renderInlineMarkdown(paragraphLines.join(" "), onNavigate)}
      </p>,
    );
  }

  return <div className="flex flex-col gap-3">{blocks}</div>;
}

function ToolCallTraceBadge({
  toolCalls,
  isRunning,
  activeQuery,
}: {
  toolCalls: ToolCallTrace[];
  isRunning: boolean;
  activeQuery?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const primaryCall = toolCalls[toolCalls.length - 1];
  const queryArg =
    activeQuery ??
    (typeof primaryCall?.arguments?.query === "string"
      ? primaryCall.arguments.query
      : null);

  return (
    <div className="mb-3 rounded-sm border border-border bg-paper px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {isRunning ? (
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse"
              aria-hidden="true"
            />
          ) : (
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 text-success"
              aria-hidden="true"
            >
              <path
                d="M2.5 7.5L5.5 10.5L11.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="font-mono text-[11px] font-semibold text-ink">
            search_locus_docs
          </span>
          <span className="truncate text-caption text-muted">
            {isRunning
              ? "Consultando base de conhecimento híbrida..."
              : "Consulta na documentação concluída"}
          </span>
        </div>

        {queryArg && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="shrink-0 text-[11px] font-semibold text-muted underline underline-offset-2 hover:text-ink cursor-pointer"
          >
            {expanded ? "Ocultar" : "Ver busca"}
          </button>
        )}
      </div>

      {(expanded || isRunning) && queryArg && (
        <div className="mt-1.5 border-t border-border pt-1.5 font-mono text-[11px] text-muted">
          consulta: <span className="text-ink">&quot;{queryArg}&quot;</span>
        </div>
      )}
    </div>
  );
}

function SourcesAccordion({
  sources,
  onNavigate,
}: {
  sources: SourceCitation[];
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 border-t border-border pt-2.5">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-muted transition-colors duration-150 hover:text-ink cursor-pointer"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
          aria-hidden="true"
        >
          <path
            d="M2.5 3A1.5 1.5 0 0 1 4 1.5h6A1.5 1.5 0 0 1 11.5 3v8A1.5 1.5 0 0 1 10 12.5H4A1.5 1.5 0 0 1 2.5 11V3z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M5 4.5h4M5 7h4M5 9.5h2.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <span>
          {sources.length === 1
            ? "1 fonte consultada"
            : `${sources.length} fontes consultadas`}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 transition-transform duration-150 ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path
            d="M3.5 5.5L7 9l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <ul className="mt-2 flex flex-col gap-2">
          {sources.map((source, idx) => (
            <li
              key={`${source.doc_slug}-${idx}`}
              className="flex flex-col gap-1.5 rounded-sm border border-border bg-paper px-3 py-2"
            >
              <span className="font-semibold text-caption text-ink">
                {source.section_title}
              </span>
              {source.routes && source.routes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {source.routes.map((route) => (
                    <RouteLinkChip
                      key={route}
                      href={route}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AssistantMessage({
  message,
  isLatestAssistant = false,
  requestStage = "idle",
  activeToolQuery = null,
  onNavigate,
}: AssistantMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-md bg-ink px-4 py-3 text-body/body text-on-ink">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  const hasToolCalls =
    (message.tool_calls_used && message.tool_calls_used.length > 0) ||
    (isLatestAssistant && requestStage === "searching_docs");
  const isActiveThinking =
    isLatestAssistant &&
    (requestStage === "thinking" ||
      (requestStage === "searching_docs" && !message.content));

  if (
    !message.content &&
    !hasToolCalls &&
    !isActiveThinking &&
    (!message.sources || message.sources.length === 0)
  ) {
    return null;
  }

  return (
    <div className="flex justify-start">
      <div className="w-full rounded-md border border-border bg-surface px-4 py-3.5">
        {hasToolCalls && (
          <ToolCallTraceBadge
            toolCalls={message.tool_calls_used ?? []}
            isRunning={isLatestAssistant && requestStage === "searching_docs"}
            activeQuery={isLatestAssistant ? activeToolQuery : null}
          />
        )}

        {isLatestAssistant && requestStage === "thinking" && !message.content && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 py-1 text-caption font-semibold text-muted"
          >
            <span className="inline-flex items-center gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/60 animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/30 animate-pulse" />
            </span>
            <span>Analisando sua pergunta...</span>
          </div>
        )}

        {isLatestAssistant &&
          requestStage === "searching_docs" &&
          !message.content && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 py-1 text-caption font-medium text-muted"
            >
              <span>
                Recuperando trechos relevantes (pgvector + busca textual)...
              </span>
            </div>
          )}

        {message.content && renderMarkdownBlocks(message.content, onNavigate)}

        {message.sources && message.sources.length > 0 && (
          <SourcesAccordion sources={message.sources} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}
