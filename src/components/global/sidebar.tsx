"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";
import { getMyProfile, type UserProfileResponse } from "@/services/user";
import { getInitials } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  exact?: boolean;
  privilegedOnly?: boolean;
};

function InvitesIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke={stroke} strokeWidth="1.6" />
      <path d="M3 6.5l6.3 4.4a1.2 1.2 0 0 0 1.4 0L17 6.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M3 8.5L10 3l7 5.5V16a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V8.5z"
        stroke={active ? "var(--color-accent)" : "var(--color-on-ink-muted)"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClassesIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="3" y="4" width="6" height="6" rx="1.2" stroke={stroke} strokeWidth="1.6" />
      <rect x="11" y="4" width="6" height="6" rx="1.2" stroke={stroke} strokeWidth="1.6" />
      <rect x="3" y="12" width="6" height="4" rx="1.2" stroke={stroke} strokeWidth="1.6" />
      <rect x="11" y="12" width="6" height="4" rx="1.2" stroke={stroke} strokeWidth="1.6" />
    </svg>
  );
}

function AttendanceIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="10" cy="10" r="7" stroke={stroke} strokeWidth="1.6" />
      <path d="M10 6.5v4l2.5 1.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function RoomsIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M10 2.5a5.5 5.5 0 0 1 5.5 5.5c0 4-5.5 9.5-5.5 9.5S4.5 12 4.5 8A5.5 5.5 0 0 1 10 2.5z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="1.8" stroke={stroke} strokeWidth="1.6" />
    </svg>
  );
}

function StudentsIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="7" cy="7" r="2.4" stroke={stroke} strokeWidth="1.6" />
      <circle cx="13.2" cy="7" r="2.4" stroke={stroke} strokeWidth="1.6" />
      <path d="M3.5 15.5c.6-2.2 2.2-3.4 4.5-3.4s3.9 1.2 4.5 3.4M12 12.2c1.6 0 3 .8 3.6 2.3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MembersIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="3.5" y="3" width="13" height="14" rx="2" stroke={stroke} strokeWidth="1.6" />
      <circle cx="10" cy="8" r="2" stroke={stroke} strokeWidth="1.5" />
      <path d="M7 13.5c.6-1.2 1.7-1.8 3-1.8s2.4.6 3 1.8M8.5 3v-1M11.5 3v-1" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReportsIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4 15V9M10 15V5M16 15v-3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="10" cy="10" r="2.2" stroke={stroke} strokeWidth="1.6" />
      <path d="M10 3.5v1.6M10 14.9v1.6M3.5 10h1.6M14.9 10h1.6M5.4 5.4l1.1 1.1M13.5 13.5l1.1 1.1M14.6 5.4l-1.1 1.1M6.5 13.5l-1.1 1.1" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: (active) => <HomeIcon active={active} />, exact: true },
  { href: "/dashboard/turmas", label: "Turmas", icon: (active) => <ClassesIcon active={active} /> },
  { href: "/dashboard/chamadas", label: "Chamadas", icon: (active) => <AttendanceIcon active={active} /> },
  { href: "/dashboard/salas", label: "Salas", icon: (active) => <RoomsIcon active={active} /> },
  { href: "/dashboard/alunos", label: "Alunos", icon: (active) => <StudentsIcon active={active} /> },
  { href: "/dashboard/membros", label: "Membros", icon: (active) => <MembersIcon active={active} /> },
  { href: "/dashboard/convites", label: "Convites", icon: (active) => <InvitesIcon active={active} />, privilegedOnly: true },
  { href: "/dashboard/relatorios", label: "Relatórios", icon: (active) => <ReportsIcon active={active} /> },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: (active) => <SettingsIcon active={active} /> },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMyProfile()
      .then((profile) => {
        if (isMounted) setUserRole(profile.role);
      })
      .catch(() => { });
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleNavItems = navItems.filter((item) => {
    if (!item.privilegedOnly) return true;
    // Oculta "Convites" para quem tem papel exclusivo de Professor ou Aluno
    if (userRole === "professor" || userRole === "aluno") return false;
    return true;
  });

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between bg-ink px-[18px] pb-5 pt-7">
      {/* Top: logo + nav */}
      <div className="flex flex-col gap-9">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-accent">
            <span className="font-extrabold tracking-tight text-heading text-ink leading-none">L</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold tracking-tight text-on-ink text-heading leading-body">Locus</span>
            <span className="font-medium tracking-caps uppercase text-on-ink-muted text-caption leading-caption">
              Professor
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1" aria-label="Navegação principal">
          {visibleNavItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-11 w-full items-center gap-3 rounded-md px-3 transition-colors duration-150 ${active ? "bg-on-ink-border" : "hover:bg-on-ink-border/50"
                  }`}
              >
                {item.icon(active)}
                <span
                  className={`text-body/body ${active
                      ? "font-semibold text-accent"
                      : "font-medium text-on-ink-muted"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: user card */}
      <UserCard onLogout={logout} />
    </aside>
  );
}


function UserCard({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getMyProfile()
      .then((profile) => {
        if (isMounted) setUser(profile);
      })
      .catch(() => {
        // Tratamento não obstrutivo caso perfil ainda esteja carregando
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fechar popover ao clicar fora ou apertar Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const displayName = user?.name ?? "Professor";
  const initials = user?.name ? getInitials(user.name) : "PR";

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ─── Menu Popover Suspenso para cima ───────────────────────────────── */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          className="absolute bottom-full mb-2.5 left-0 w-full overflow-hidden rounded-xl border border-on-ink-border bg-[#182234] p-1.5 shadow-2xl backdrop-blur-md animate-fade-in z-50 text-left"
        >
          {/* Header do Usuário no Popover */}
          <div className="border-b border-on-ink-border px-3 py-2.5">
            <span className="block truncate font-semibold text-on-ink text-label">
              {displayName}
            </span>
            <span className="block truncate text-caption text-on-ink-muted">
              {user?.email ?? "Carregando..."}
            </span>
            {user?.role && (
              <span className="mt-1.5 inline-flex items-center rounded bg-accent-surface/20 border border-accent/30 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-caps text-accent">
                {user.role}
              </span>
            )}
          </div>

          {/* Itens de Navegação */}
          <div className="py-1">
            <Link
              href="/dashboard/perfil"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-label text-on-ink hover:bg-on-ink-border/60 transition-colors"
              role="menuitem"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 text-on-ink-muted group-hover:text-accent transition-colors"
              >
                <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-label">Meu Perfil</span>
                <span className="text-[11px] text-on-ink-muted">Ver cadastro e segurança</span>
              </div>
            </Link>

            <Link
              href="/tenants"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-label text-on-ink hover:bg-on-ink-border/60 transition-colors"
              role="menuitem"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 text-on-ink-muted group-hover:text-accent transition-colors"
              >
                <path d="M3 8.5L10 3l7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 9v7M9 9v7M13 9v7M17 9v7M3 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-label">Alternar Instituição</span>
                <span className="text-[11px] text-on-ink-muted">Trocar de faculdade</span>
              </div>
            </Link>
          </div>

          <div className="my-1 h-px bg-on-ink-border" />

          {/* Botão de Logout */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-label text-danger hover:bg-danger-surface/20 transition-colors cursor-pointer"
            role="menuitem"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 text-danger"
            >
              <path d="M7 17H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-label">Sair da conta</span>
          </button>
        </div>
      )}

      {/* ─── Gatilho do Card de Usuário ────────────────────────────────────── */}
      <button
        id="user-menu-button"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Abrir menu da conta"
        className={`group flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors duration-150 cursor-pointer ${
          isOpen
            ? "border-accent bg-on-ink-border/80"
            : "border-on-ink-border hover:border-on-ink-control-border"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-on-ink-border">
          <span className="font-bold text-accent text-label/caption">{initials}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-semibold text-on-ink text-label/caption truncate">{displayName}</span>
          {user?.role ? (
            <span className="text-on-ink-subtle text-caption/caption uppercase truncate font-mono">
              {user.role}
            </span>
          ) : null}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 text-on-ink-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-accent" : "group-hover:text-on-ink"
          }`}
        >
          <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
