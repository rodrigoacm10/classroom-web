"use client";

import React from "react";
import { usePerfil } from "../hooks";
import {
  PerfilHeader,
  PerfilKpis,
  PerfilUserCard,
  PerfilActiveTenant,
  PerfilTenantsList,
  PerfilSecurity,
} from "../components";

export function PerfilPage() {
  const {
    user,
    tenants,
    activeTenant,
    loading,
    error,
    switchingTenantId,
    resettingPassword,
    toast,
    handleSwitchTenant,
    handleRequestPasswordReset,
    handleLogout,
    refetch,
  } = usePerfil();

  return (
    <div className="flex min-h-full flex-col bg-paper antialiased font-sans">
      {/* ─── Feedback Toast Flutuante ────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-ink px-5 py-3 text-white shadow-2xl animate-fade-in"
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
              toast.type === "success"
                ? "bg-success"
                : toast.type === "error"
                ? "bg-danger"
                : "bg-accent text-ink font-bold"
            }`}
          >
            {toast.type === "success" ? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5l-7 7-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : toast.type === "error" ? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span>!</span>
            )}
          </div>
          <span className="text-label font-medium">{toast.message}</span>
        </div>
      )}

      {/* ─── Cabeçalho da Página ────────────────────────────────────────────── */}
      <PerfilHeader
        userName={user?.name}
        userEmail={user?.email}
      />

      {/* ─── Faixa Integrada de Métricas de Conta ───────────────────────────── */}
      <PerfilKpis
        userRole={user?.role}
        activeTenantName={activeTenant?.name}
        totalTenants={tenants.length}
        createdAt={user?.created_at}
        loading={loading}
      />

      {/* ─── Conteúdo Principal ─────────────────────────────────────────────── */}
      <main className="flex-1 px-8 py-10 lg:px-10">
        <div className="mx-auto max-w-5xl">
          {error && (
            <div className="mb-8 rounded-xl border border-danger/40 bg-danger-surface p-4 text-ink flex items-center justify-between gap-4">
              <span className="text-label font-medium text-danger">{error}</span>
              <button
                type="button"
                onClick={refetch}
                className="rounded-lg bg-white border border-danger/30 px-3 py-1.5 text-caption font-bold text-danger hover:bg-danger hover:text-white transition-colors cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-44 rounded-xl bg-surface" />
              <div className="h-52 rounded-xl bg-surface" />
              <div className="h-48 rounded-xl bg-surface" />
            </div>
          ) : (
            <div className="space-y-12">
              {/* 1. Dados Pessoais e Identidade */}
              <PerfilUserCard user={user} />

              {/* 2. Instituição Ativa & Escopo */}
              <PerfilActiveTenant
                activeTenant={activeTenant}
                userRole={user?.role}
              />

              {/* 3. Minhas Instituições Vinculadas */}
              <PerfilTenantsList
                tenants={tenants}
                activeTenantId={user?.tenant_id}
                switchingTenantId={switchingTenantId}
                onSwitchTenant={handleSwitchTenant}
              />

              {/* 4. Segurança e Sessão */}
              <PerfilSecurity
                userEmail={user?.email}
                resettingPassword={resettingPassword}
                onRequestPasswordReset={handleRequestPasswordReset}
                onLogout={handleLogout}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

