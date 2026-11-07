"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { EditIcon, TrashIcon } from "@/components/icons";
import type { SubjectClassItem } from "@/lib/api";

export interface TurmaActionsMenuProps {
  turma: SubjectClassItem;
  isAdmin: boolean;
  openUpward?: boolean;
  onToggleActive: (turma: SubjectClassItem) => void;
  onDelete: (turma: SubjectClassItem) => void;
}

export function TurmaActionsMenu({
  turma,
  isAdmin,
  openUpward: forceOpenUpward,
  onToggleActive,
  onDelete,
}: TurmaActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      let isUp = Boolean(forceOpenUpward);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 200) {
          isUp = true;
        }
      }
      setOpenUpward(isUp);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={menuRef}
      className={`relative inline-flex items-center ${isOpen ? "z-50" : "z-10"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Opções da turma"
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
          isOpen
            ? "border-ink bg-surface text-ink"
            : "border-border bg-white text-muted hover:border-ink/30 hover:text-ink hover:bg-surface"
        }`}
      >
        {/* Ícone 3 pontinhos horizontais */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="4.5" cy="10" r="1.8" fill="currentColor" />
          <circle cx="10" cy="10" r="1.8" fill="currentColor" />
          <circle cx="15.5" cy="10" r="1.8" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute right-0 ${
            openUpward
              ? "bottom-full mb-1.5 origin-bottom-right"
              : "top-full mt-1.5 origin-top-right"
          } w-48 rounded-xl border border-border bg-white p-1.5 shadow-xl z-50 text-left animate-in fade-in zoom-in-95 duration-100`}
        >
          {/* 1. Editar Turma */}
          <Link
            href={`/dashboard/turmas/${turma.id}/editar`}
            onClick={() => setIsOpen(false)}
            role="menuitem"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-label font-medium text-ink hover:bg-surface transition-colors"
          >
            <EditIcon size={14} className="text-muted" />
            <span>Editar Turma</span>
          </Link>

          {/* 2. Alternar Status (Ativar / Desativar) */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onToggleActive(turma);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-label font-medium text-ink hover:bg-surface transition-colors cursor-pointer"
          >
            {turma.active ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-muted shrink-0"
                >
                  <rect x="3" y="3" width="3.5" height="10" rx="1" fill="currentColor" />
                  <rect x="9.5" y="3" width="3.5" height="10" rx="1" fill="currentColor" />
                </svg>
                <span>Desativar Turma</span>
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-success shrink-0"
                >
                  <path d="M4 3.5l8.5 4.5-8.5 4.5V3.5z" fill="currentColor" />
                </svg>
                <span className="text-success font-semibold">Ativar Turma</span>
              </>
            )}
          </button>

          {/* 3. Excluir (Exclusivo ADMIN) */}
          {isAdmin && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onDelete(turma);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-label font-semibold text-danger hover:bg-danger-surface transition-colors cursor-pointer"
              >
                <TrashIcon size={14} className="text-danger" />
                <span>Excluir Turma</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
