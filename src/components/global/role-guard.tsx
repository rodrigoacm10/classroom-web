"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { getMyProfile } from "@/services/user";

type RoleGuardProps = {
  /** Papéis sem permissão para ver o conteúdo. */
  deniedRoles: string[];
  children: ReactNode;
};

/**
 * Exibe mensagem de acesso negado quando o papel do usuário não pode ver a rota,
 * mesmo que ele digite a URL manualmente. A API continua sendo a fonte da verdade (403).
 */
export function RoleGuard({ deniedRoles, children }: RoleGuardProps) {
  const [role, setRole] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMyProfile()
      .then((profile) => {
        if (mounted) setRole(profile.role);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!loaded) return null;

  if (role && deniedRoles.includes(role)) {
    return (
      <div
        role="alert"
        className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      >
        <h1 className="text-heading font-bold text-ink">Acesso negado</h1>
        <p className="max-w-md text-caption text-muted leading-relaxed">
          Seu perfil não tem permissão para acessar esta página. Procure um administrador
          da instituição se precisar dessa funcionalidade.
        </p>
        <Link href="/dashboard" className="text-caption font-medium text-accent underline">
          Voltar ao painel
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
