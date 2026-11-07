"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  acceptInvite,
  getInvite,
  listMyTenants,
  login,
  registerUser,
  setStoredToken,
  switchTenant,
  type InviteStatusResponse,
} from "@/lib/api";
import { buttonClass, fieldClass, textLinkClass } from "@/components/ui/interactive";

type Phase =
  | "form"
  | "registering"
  | "authenticating"
  | "accepting_invite"
  | "resolving_tenants"
  | "switching"
  | "success_empty";

type RegisterFormProps = {
  initialToken?: string;
  initialEmail?: string;
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
  coordenador: "Coordenador",
};

export function RegisterForm({ initialToken = "", initialEmail = "" }: RegisterFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteToken, setInviteToken] = useState(initialToken);
  const [showInviteField, setShowInviteField] = useState(Boolean(initialToken));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [inviteDetails, setInviteDetails] = useState<InviteStatusResponse | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");

  // Validate invite if token was present in URL params on mount
  useEffect(() => {
    const trimmed = initialToken.trim();
    if (!trimmed) return;

    let isMounted = true;
    getInvite(trimmed)
      .then((data) => {
        if (!isMounted) return;
        setInviteDetails(data);
        if (data.email) {
          setEmail((prev) => prev || data.email);
        }
        if (data.status === "expired") {
          setInviteError("Este convite já expirou. Peça um novo envio à coordenação.");
        } else if (data.status === "revoked") {
          setInviteError("Este convite foi revogado pela administração.");
        } else if (data.status === "accepted") {
          setInviteError("Este convite já foi aceito anteriormente.");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setInviteDetails(null);
        setInviteError("Código de convite não encontrado ou inválido.");
      });

    return () => {
      isMounted = false;
    };
  }, [initialToken]);

  async function handleVerifyInvite(tokenToVerify: string) {
    const trimmed = tokenToVerify.trim();
    if (!trimmed) {
      setInviteDetails(null);
      setInviteError(null);
      return;
    }

    setLoadingInvite(true);
    setInviteError(null);

    try {
      const data = await getInvite(trimmed);
      setInviteDetails(data);
      if (data.email) {
        setEmail((prev) => prev || data.email);
      }
      if (data.status === "expired") {
        setInviteError("Este convite já expirou. Peça um novo envio à coordenação.");
      } else if (data.status === "revoked") {
        setInviteError("Este convite foi revogado pela administração.");
      } else if (data.status === "accepted") {
        setInviteError("Este convite já foi aceito anteriormente.");
      }
    } catch {
      setInviteDetails(null);
      setInviteError("Código de convite não encontrado ou inválido.");
    } finally {
      setLoadingInvite(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const cleanToken = inviteToken.trim();

    // Client-side validations
    if (trimmedName.length < 2) {
      setError("Por favor, informe seu nome completo (mínimo de 2 caracteres).");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas digitadas não coincidem.");
      return;
    }

    // If invite email was loaded, ensure registration matches it
    if (inviteDetails?.email && inviteDetails.email.toLowerCase() !== trimmedEmail) {
      setError(
        `Este convite foi emitido especificamente para o e-mail ${inviteDetails.email}. Utilize esse endereço para continuar.`,
      );
      return;
    }

    setPending(true);
    setPhase("registering");

    try {
      // 1. Create User
      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      // 2. Authenticate user to obtain session token
      setPhase("authenticating");
      const loginRes = await login(trimmedEmail, password);
      const baseToken = loginRes.access_token;
      setStoredToken(baseToken);

      // 3. If invite token is present and valid, accept it
      if (cleanToken && (!inviteDetails || inviteDetails.status === "pending")) {
        setPhase("accepting_invite");
        try {
          await acceptInvite(cleanToken, baseToken);
        } catch (inviteErr) {
          console.warn("Falha ao aceitar convite imediatamente:", inviteErr);
        }
      }

      // 4. Resolve tenants
      setPhase("resolving_tenants");
      const tenants = await listMyTenants(baseToken);
      const activeTenants = tenants.filter((t) => t.active && !t.deleted);

      if (activeTenants.length === 1) {
        // Auto-switch to their single institution
        setPhase("switching");
        const switched = await switchTenant(activeTenants[0].id, baseToken);
        setStoredToken(switched.access_token);
        router.replace("/dashboard");
        return;
      }

      if (activeTenants.length > 1) {
        router.push("/tenants");
        return;
      }

      // 5. Usuário não possui instituição vinculada: redireciona para criar a instituição
      router.push("/tenants/nova");
      return;
    } catch (cause) {
      setPending(false);
      setPhase("form");

      if (cause instanceof ApiError) {
        if (cause.status === 409 || cause.message?.includes("já cadastrado")) {
          setError(
            "Este e-mail já possui uma conta no Locus. Se esta conta for sua, você pode entrar direto.",
          );
        } else {
          setError(cause.message);
        }
      } else {
        setError(
          "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        );
      }
    }
  }

  // Success view when user has no institution yet
  if (phase === "success_empty") {
    return (
      <div className="mt-8 flex flex-col gap-6">
        <div className="rounded-sm border border-border bg-surface p-6 sm:p-7">
          <div className="flex items-center gap-3 text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-bold text-ink">
              ✓
            </span>
            <h2 className="text-heading/heading font-bold tracking-tight">
              Conta criada com sucesso!
            </h2>
          </div>

          <p className="mt-4 text-body/body text-muted">
            Bem-vindo(a), <strong className="text-ink">{name.trim()}</strong>. Seu acesso foi
            registrado com o e-mail <strong className="text-ink">{email.trim()}</strong>.
          </p>

          <div className="mt-6 flex flex-col gap-3 rounded-sm border border-border bg-paper p-4 text-body/body">
            <p className="font-semibold text-ink">Próximos passos:</p>
            <ul className="flex flex-col gap-2.5 text-label leading-[18px] text-muted">
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-ink">•</span>
                <span>
                  <strong>Já foi convidado(a) por e-mail?</strong> Abra o link de convite enviado pela
                  sua instituição para vincular sua turma e salas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-ink">•</span>
                <span>
                  <strong>Ainda aguarda inclusão?</strong> Informe à coordenação que sua conta já
                  está ativa com o e-mail informado.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-ink">•</span>
                <span>
                  <strong>Quer levar o Locus para sua faculdade ou escola?</strong> Nossa equipe
                  configura a primeira turma e as salas georreferenciadas para você.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className={buttonClass({
                variant: "ink",
                size: "md",
                className: "flex-1 sm:flex-none",
              })}
            >
              Ir para o Login
            </Link>
            <a
              href={`mailto:contato@locus.app?subject=${encodeURIComponent(
                "Quero ativar o Locus na minha instituição",
              )}`}
              className={buttonClass({
                variant: "outline",
                size: "md",
                className: "flex-1 sm:flex-none",
              })}
            >
              Falar com o suporte
            </a>
          </div>
        </div>
      </div>
    );
  }

  const buttonLabel =
    phase === "registering"
      ? "Criando sua conta…"
      : phase === "authenticating"
        ? "Autenticando…"
        : phase === "accepting_invite"
          ? "Vinculando convite…"
          : phase === "resolving_tenants" || phase === "switching"
            ? "Conectando à instituição…"
            : "Criar conta";

  const isEmailExistingConflict = error?.includes("já possui uma conta");

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
      {/* Invite Detected Banner */}
      {inviteDetails && !inviteError ? (
        <aside className="flex flex-col gap-2 rounded-sm border border-accent bg-accent-surface p-4 text-ink">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold tracking-caps text-caption/caption uppercase">
              Convite identificado
            </span>
            <span className="rounded-sm bg-ink px-2 py-0.5 font-mono text-[11px] font-semibold text-on-ink uppercase">
              {roleLabels[inviteDetails.role] ?? inviteDetails.role}
            </span>
          </div>
          <p className="text-body/body">
            Você está se cadastrando para ingressar em{" "}
            <strong>{inviteDetails.tenant_name}</strong>.
          </p>
        </aside>
      ) : null}

      {/* Invite Error Notice */}
      {inviteError ? (
        <aside className="rounded-sm border border-warn bg-surface p-4 text-label leading-[18px] text-ink">
          <p className="font-semibold text-warn">Aviso sobre o convite:</p>
          <p className="mt-1 text-muted">{inviteError}</p>
          <p className="mt-2 text-caption/caption text-muted">
            Você ainda pode prosseguir criando sua conta normalmente abaixo.
          </p>
        </aside>
      ) : null}

      {/* Full Name */}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-label/caption text-ink">Nome completo</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          required
          disabled={pending}
          placeholder="Ex: Prof. Helena Matos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass()}
        />
      </label>

      {/* Email */}
      <label className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-label/caption text-ink">
            E-mail institucional ou pessoal
          </span>
          {inviteDetails?.email ? (
            <span className="text-caption/caption text-muted">E-mail do convite</span>
          ) : null}
        </div>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          disabled={pending || (Boolean(inviteDetails?.email) && !inviteError)}
          placeholder="seu.email@instituicao.edu.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass({ invalid: Boolean(error) })}
        />
      </label>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="reg-password" className="font-semibold text-label/caption text-ink">
            Senha de acesso
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-label/caption text-muted transition-colors hover:text-ink"
            tabIndex={-1}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            disabled={pending}
            placeholder="Mínimo de 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass()}
          />
        </div>
        <p className="text-caption/caption text-muted">
          Use no mínimo 8 caracteres com letras e números para maior segurança.
        </p>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="reg-confirm-password" className="font-semibold text-label/caption text-ink">
            Confirmar senha
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-label/caption text-muted transition-colors hover:text-ink"
            tabIndex={-1}
          >
            {showConfirmPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <input
          id="reg-confirm-password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          autoComplete="new-password"
          required
          disabled={pending}
          placeholder="Digite a mesma senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={fieldClass({
            invalid: Boolean(confirmPassword && password !== confirmPassword),
          })}
        />
        {confirmPassword && password !== confirmPassword ? (
          <p className="text-caption/caption text-danger">As senhas não coincidem.</p>
        ) : null}
      </div>

      {/* Optional Invite Token accordion */}
      <div className="flex flex-col gap-2 pt-1">
        {!showInviteField ? (
          <button
            type="button"
            onClick={() => setShowInviteField(true)}
            className="self-start text-label/caption font-medium text-muted transition-colors hover:text-ink hover:underline underline-offset-4"
          >
            + Já possui um código ou token de convite?
          </button>
        ) : (
          <div className="flex flex-col gap-2 rounded-sm border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <label htmlFor="reg-invite-token" className="font-semibold text-label/caption text-ink">
                Token de convite da instituição (opcional)
              </label>
              {loadingInvite ? (
                <span className="text-caption/caption text-muted">Validando…</span>
              ) : null}
            </div>
            <div className="flex gap-2">
              <input
                id="reg-invite-token"
                type="text"
                name="inviteToken"
                disabled={pending}
                placeholder="Cole o código do convite aqui"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                onBlur={() => handleVerifyInvite(inviteToken)}
                className={fieldClass({ className: "flex-1" })}
              />
              <button
                type="button"
                onClick={() => handleVerifyInvite(inviteToken)}
                disabled={pending || !inviteToken.trim() || loadingInvite}
                className={buttonClass({
                  variant: "outline",
                  size: "md",
                  className: "shrink-0",
                })}
              >
                Validar
              </button>
            </div>
            <span className="text-caption/caption text-muted">
              Se você recebeu um link com token, ele vincula sua conta automaticamente à
              instituição após o cadastro.
            </span>
          </div>
        )}
      </div>

      {/* Terms acknowledgement */}
      <p className="text-caption/caption text-muted">
        Ao criar sua conta, você concorda com os{" "}
        <Link href="/termos" className="text-ink underline underline-offset-4">
          Termos de Uso
        </Link>{" "}
        e com a{" "}
        <Link href="/privacidade" className="text-ink underline underline-offset-4">
          Política de Privacidade
        </Link>{" "}
        do Locus.
      </p>

      {/* Error alert */}
      <div aria-live="polite">
        {error ? (
          <div
            id="register-error"
            className="flex flex-col gap-2 rounded-sm border border-danger bg-danger-surface px-4 py-3 text-label leading-[18px] text-ink"
          >
            <p>{error}</p>
            {isEmailExistingConflict ? (
              <Link
                href={`/login?email=${encodeURIComponent(email)}`}
                className={textLinkClass({
                  className: "font-semibold underline underline-offset-4 text-ink",
                })}
              >
                Clique aqui para entrar com esta conta →
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className={buttonClass({
          variant: "ink",
          size: "lg",
          className: "mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink",
        })}
      >
        {buttonLabel}
      </button>

      {/* Direct link to login */}
      <p className="mt-2 text-center text-label/caption text-muted">
        Já tem uma conta no Locus?{" "}
        <Link
          href="/login"
          className={textLinkClass({
            className: "font-semibold text-ink underline underline-offset-4",
          })}
        >
          Fazer login
        </Link>
      </p>
    </form>
  );
}
