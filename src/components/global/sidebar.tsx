"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";
import { getMyProfile } from "@/services/user";
import { getInitials } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  exact?: boolean;
};

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

function ReportsIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4 15V9M10 15V5M16 15v-3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EvidencesIcon({ active }: { active: boolean }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-on-ink-muted)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="3" y="5.5" width="14" height="11" rx="2" stroke={stroke} strokeWidth="1.6" />
      <path d="M7 5.5l1.2-2h3.6L13 5.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="11" r="2.4" stroke={stroke} strokeWidth="1.6" />
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
  { href: "/dashboard/relatorios", label: "Relatórios", icon: (active) => <ReportsIcon active={active} /> },
  { href: "/dashboard/evidencias", label: "Evidências", icon: (active) => <EvidencesIcon active={active} /> },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: (active) => <SettingsIcon active={active} /> },
];

export function DashboardSidebar() {
  const pathname = usePathname();

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
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-11 w-full items-center gap-3 rounded-md px-3 transition-colors duration-150 ${
                  active ? "bg-on-ink-border" : "hover:bg-on-ink-border/50"
                }`}
              >
                {item.icon(active)}
                <span
                  className={`text-body/body ${
                    active
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
  const [user, setUser] = useState<{ name: string; role?: string | null } | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMyProfile()
      .then((profile) => {
        if (isMounted) setUser({ name: profile.name, role: profile.role });
      })
      .catch(() => {
        // Tratamento não obstrutivo caso perfil ainda esteja carregando
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = user?.name ?? "Professor";
  const initials = user?.name ? getInitials(user.name) : "PR";

  return (
    <button
      type="button"
      onClick={onLogout}
      title="Sair"
      className="group flex w-full items-center gap-3 rounded-md border border-on-ink-border p-3 text-left transition-colors duration-150 hover:border-on-ink-control-border"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-on-ink-border">
        <span className="font-bold text-accent text-label/caption">{initials}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold text-on-ink text-label/caption truncate">{displayName}</span>
        {/* NOTA: Informações de departamento/curso ("Sistemas de Informação") não existem nas rotas da API */}
        {/* <span className="text-on-ink-subtle text-caption/caption truncate">Sistemas de Informação</span> */}
        {user?.role ? (
          <span className="text-on-ink-subtle text-caption/caption uppercase truncate font-mono">
            {user.role}
          </span>
        ) : null}
      </div>
    </button>
  );
}
