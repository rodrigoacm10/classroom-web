"use client";

import React from "react";
import { useConfiguracoes } from "../hooks/use-configuracoes";
import {
  ConfiguracoesHeader,
  ConfiguracoesKpis,
  ConfiguracoesIdentidade,
  ConfiguracoesRegras,
  ConfiguracoesZonaPerigo,
  SuspenderTenantModal,
  ExcluirTenantModal,
} from "../components";

export function ConfiguracoesPage() {
  const {
    tenant,
    profile,
    metrics,
    loading,
    error,
    isAdmin,
    copiedId,
    toastMessage,
    isSuspendModalOpen,
    setIsSuspendModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isActionLoading,
    handleCopyId,
    handleToggleStatus,
    handleDeleteTenant,
    reload,
  } = useConfiguracoes();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* Toast Flutuante de Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-ink px-5 py-3 text-white shadow-2xl animate-fade-in"
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
              toastMessage.type === "success" ? "bg-success" : "bg-danger"
            }`}
          >
            {toastMessage.type === "success" ? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 4.5l-7 7-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-label font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <ConfiguracoesHeader
        tenant={tenant}
        role={profile?.role}
        loading={loading}
      />

      {/* Faixa Integrada de KPIs Institucionais */}
      <ConfiguracoesKpis metrics={metrics} loading={loading} />

      {/* Conteúdo Principal */}
      <main className="flex-1 px-8 py-10 lg:px-10">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-44 w-full rounded-xl bg-surface" />
              <div className="h-56 w-full rounded-xl bg-surface" />
              <div className="h-40 w-full rounded-xl bg-surface" />
            </div>
          ) : error || !tenant ? (
            <div className="rounded-xl border border-border bg-white p-12 text-center shadow-xs">
              <h3 className="font-sans text-heading font-bold text-ink">
                Não foi possível carregar as configurações
              </h3>
              <p className="mt-2 text-body text-muted max-w-md mx-auto">
                {error ?? "Instituição ativa não localizada. Verifique se sua conta possui vínculo com uma instituição."}
              </p>
              <button
                type="button"
                onClick={reload}
                className="mt-6 rounded-lg bg-ink px-5 py-2.5 text-label font-bold text-white shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Bloco 1: Identidade Institucional */}
              <ConfiguracoesIdentidade
                tenant={tenant}
                copiedId={copiedId}
                onCopyId={handleCopyId}
              />

              {/* Bloco 2: Regras Institucionais & Parâmetros Acadêmicos */}
              <ConfiguracoesRegras />

              {/* Bloco 3: Zona de Perigo */}
              <ConfiguracoesZonaPerigo
                tenant={tenant}
                isAdmin={isAdmin}
                onOpenSuspendModal={() => setIsSuspendModalOpen(true)}
                onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modais */}
      <SuspenderTenantModal
        tenant={tenant}
        isOpen={isSuspendModalOpen}
        isLoading={isActionLoading}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleToggleStatus}
      />

      <ExcluirTenantModal
        tenant={tenant}
        isOpen={isDeleteModalOpen}
        isLoading={isActionLoading}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTenant}
      />
    </div>
  );
}
