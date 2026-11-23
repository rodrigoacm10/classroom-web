"use client";

import React, { useEffect, useState } from "react";
import { getMyProfile } from "@/services/user";
import { useAssistantChat } from "@/modules/assistant/hooks/use-assistant-chat";
import { AssistantDrawer } from "./assistant-drawer";

export function AssistantLauncher() {
  const chat = useAssistantChat();
  const [userRole, setUserRole] = useState<
    "admin" | "professor" | "coordenador" | "aluno" | null
  >(null);

  useEffect(() => {
    let mounted = true;
    getMyProfile()
      .then((profile) => {
        if (mounted) {
          setUserRole(profile.role);
        }
      })
      .catch(() => {
        // Perfil carregado sob demanda
      });
    return () => {
      mounted = false;
    };
  }, []);

  // O assistente web V1 é destinado aos usuários do painel (Admin, Coordenador, Professor)
  if (userRole === "aluno") {
    return null;
  }

  return (
    <div className="print:hidden">
      {!chat.isOpen && (
        <button
          type="button"
          onClick={chat.openDrawer}
          aria-label="Abrir Assistente Locus"
          className="fixed bottom-6 right-6 z-40 inline-flex min-h-12 items-center gap-2.5 rounded-full border border-on-ink-border bg-ink pl-3 pr-4 py-2 text-on-ink shadow-[0_12px_28px_rgba(24,25,27,0.24)] transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-extrabold text-label text-ink">
            ?
          </span>
          <span className="font-semibold text-label text-on-ink">
            Ajuda Locus
          </span>
        </button>
      )}

      <AssistantDrawer
        isOpen={chat.isOpen}
        onClose={chat.closeDrawer}
        userRole={userRole}
        conversations={chat.conversations}
        activeConversationId={chat.activeConversationId}
        messages={chat.messages}
        loadingConversations={chat.loadingConversations}
        loadingMessages={chat.loadingMessages}
        requestStage={chat.requestStage}
        activeToolQuery={chat.activeToolQuery}
        isStreaming={chat.isStreaming}
        isSearchingDocs={chat.isSearchingDocs}
        error={chat.error}
        onClearError={chat.clearError}
        onSelectConversation={chat.selectConversation}
        onStartNewConversation={chat.startNewConversation}
        onDeleteConversation={chat.removeConversation}
        onSendMessage={chat.sendMessage}
      />
    </div>
  );
}
