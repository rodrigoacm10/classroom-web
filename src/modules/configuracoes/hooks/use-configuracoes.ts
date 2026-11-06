"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile, type UserProfileResponse } from "@/services/user";
import {
  listMyTenants,
  getMembersMetrics,
  activateTenant,
  deactivateTenant,
  deleteTenant,
  type MyTenantResponse,
  type MembersMetricsResponse,
} from "@/services/tenants";
import type { ToastMessage } from "../types";

export function useConfiguracoes() {
  const router = useRouter();
  const [tenant, setTenant] = useState<MyTenantResponse | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [metrics, setMetrics] = useState<MembersMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modais e ações
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Limpeza de toast automático após 4s
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userProfile, tenantsList, membersMetrics] = await Promise.all([
        getMyProfile(),
        listMyTenants(),
        getMembersMetrics().catch(() => null),
      ]);

      setProfile(userProfile);
      setMetrics(membersMetrics);

      const current = tenantsList.find((t) => t.id === userProfile.tenant_id);
      if (current) {
        setTenant(current);
      } else if (tenantsList.length > 0) {
        setTenant(tenantsList[0]);
      } else {
        setError("Nenhuma instituição ativa vinculada à sua conta.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar configurações da instituição."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Copiar Tenant ID
  const handleCopyId = useCallback(async () => {
    if (!tenant) return;
    try {
      await navigator.clipboard.writeText(tenant.id);
      setCopiedId(true);
      setToastMessage({
        type: "success",
        text: "ID da instituição copiado para a área de transferência.",
      });
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      setToastMessage({
        type: "error",
        text: "Não foi possível copiar o ID automaticamente.",
      });
    }
  }, [tenant]);

  // Alternar ativação / suspensão
  const handleToggleStatus = useCallback(async () => {
    if (!tenant) return;
    setIsActionLoading(true);
    try {
      if (tenant.active) {
        const res = await deactivateTenant(tenant.id);
        setTenant((prev) => (prev ? { ...prev, active: res.active } : null));
        setToastMessage({
          type: "success",
          text: `A instituição "${tenant.name}" foi suspensa temporariamente.`,
        });
      } else {
        const res = await activateTenant(tenant.id);
        setTenant((prev) => (prev ? { ...prev, active: res.active } : null));
        setToastMessage({
          type: "success",
          text: `A instituição "${tenant.name}" foi reativada com sucesso.`,
        });
      }
      setIsSuspendModalOpen(false);
    } catch (err) {
      setToastMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao alterar status da instituição.",
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [tenant]);

  // Excluir Instituição (Soft Delete)
  const handleDeleteTenant = useCallback(async () => {
    if (!tenant) return;
    setIsActionLoading(true);
    try {
      await deleteTenant(tenant.id);
      setToastMessage({
        type: "success",
        text: `Instituição "${tenant.name}" excluída com sucesso.`,
      });
      setIsDeleteModalOpen(false);
      // Redireciona para troca de tenant após exclusão
      setTimeout(() => {
        router.push("/tenants");
      }, 1000);
    } catch (err) {
      setToastMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao excluir instituição.",
      });
      setIsActionLoading(false);
    }
  }, [tenant, router]);

  const isAdmin = profile?.role === "admin" || tenant?.role === "admin";

  return {
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
    reload: loadData,
  };
}
