"use client";

import React from "react";

export interface PerfilSecurityProps {
  userEmail?: string;
  resettingPassword: boolean;
  onRequestPasswordReset: () => void;
  onLogout: () => void;
}

export function PerfilSecurity({
  userEmail,
  resettingPassword,
  onRequestPasswordReset,
  onLogout,
}: PerfilSecurityProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start pt-8 border-t border-border">
      {/* Coluna Esquerda: Título da Seção */}
      <div className="md:col-span-4">
        <h2 className="font-sans text-heading font-bold text-ink">
          Segurança & Sessão
        </h2>
        <p className="mt-1 text-caption text-muted leading-relaxed">
          Recuperação de credenciais de login e encerramento da sessão atual no dispositivo.
        </p>
      </div>

      {/* Coluna Direita: Linhas Divididas por Hairline */}
      <div className="md:col-span-8 rounded-xl border border-border bg-white divide-y divide-border shadow-2xs overflow-hidden">
        {/* Linha 1: Redefinição de Senha */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-4">
          <div className="max-w-md">
            <span className="block font-sans text-label font-bold text-ink">
              Redefinir Senha de Acesso
            </span>
            <p className="mt-0.5 text-caption text-muted leading-relaxed">
              Enviaremos um código OTP de uso único para <span className="font-mono text-ink font-semibold">{userEmail}</span> para que você possa cadastrar uma nova senha.
            </p>
          </div>

          <button
            type="button"
            disabled={resettingPassword}
            onClick={onRequestPasswordReset}
            className="shrink-0 flex items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-caption font-bold text-ink transition-colors hover:bg-surface hover:border-ink/40 disabled:opacity-40 cursor-pointer shadow-2xs"
          >
            {resettingPassword ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                <span>Enviando código...</span>
              </>
            ) : (
              <span>Enviar Código OTP</span>
            )}
          </button>
        </div>

        {/* Linha 2: Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-4">
          <div className="max-w-md">
            <span className="block font-sans text-label font-bold text-danger">
              Encerrar Sessão
            </span>
            <p className="mt-0.5 text-caption text-muted leading-relaxed">
              Desconecta sua conta deste navegador e revoga o token de sessão local.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-lg border border-danger/30 bg-white px-3.5 py-2 text-caption font-bold text-danger transition-colors hover:bg-danger-surface hover:border-danger/60 cursor-pointer shadow-2xs"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </section>
  );
}
