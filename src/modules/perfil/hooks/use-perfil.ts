"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile, type UserProfileResponse } from "@/services/user";
import { listMyTenants, switchTenant, type MyTenantResponse } from "@/services/tenants";
import { forgotPassword } from "@/services/password-recovery";
import { logout } from "@/services/auth";
import type { ToastState } from "../types";

export function usePerfil() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [tenants, setTenants] = useState<MyTenantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [switchingTenantId, setSwitchingTenantId] = useState<string | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, tenantsData] = await Promise.all([
        getMyProfile(),
        listMyTenants().catch(() => [] as MyTenantResponse[]),
      ]);
      setUser(profileData);
      setTenants(tenantsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as informações do perfil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Limpa toast após 4 segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeTenant = tenants.find((t) => t.id === user?.tenant_id) ?? null;

  const handleSwitchTenant = async (tenantId: string) => {
    if (tenantId === user?.tenant_id) return;
    setSwitchingTenantId(tenantId);
    try {
      await switchTenant(tenantId);
      setToast({
        type: "success",
        message: "Instituição alternada com sucesso. Atualizando contexto...",
      });
      // Recarrega o dashboard com o novo escopo do cookie/token
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 700);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Erro ao alternar instituição.",
      });
      setSwitchingTenantId(null);
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!user?.email) return;
    setResettingPassword(true);
    try {
      await forgotPassword(user.email);
      setToast({
        type: "success",
        message: `Instruções de redefinição enviadas para ${user.email}. Verifique sua caixa de entrada.`,
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Falha ao solicitar código de recuperação.",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    tenants,
    activeTenant,
    loading,
    error,
    switchingTenantId,
    resettingPassword,
    toast,
    setToast,
    handleSwitchTenant,
    handleRequestPasswordReset,
    handleLogout,
    refetch: loadData,
  };
}

