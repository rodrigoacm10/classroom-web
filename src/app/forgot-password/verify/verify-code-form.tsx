"use client";

import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, forgotPassword, verifyResetCode } from "@/lib/api";
import { buttonClass, textLinkClass } from "@/components/ui/interactive";
import { setResetSessionToken } from "@/lib/reset-session";

type VerifyCodeFormProps = {
  initialEmail?: string;
  initialCode?: string;
};

export function VerifyCodeForm({
  initialEmail = "",
  initialCode = "",
}: VerifyCodeFormProps) {
  const router = useRouter();

  const [email] = useState(initialEmail);
  const [codeDigits, setCodeDigits] = useState<string[]>(() => {
    const clean = initialCode.replace(/\D/g, "").slice(0, 6);
    if (clean.length === 6) {
      return clean.split("");
    }
    return ["", "", "", "", "", ""];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasAutoValidated = useRef(false);

  // Redirect if no email found
  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Validation function
  const validateAndProceed = useCallback(
    async (codeToValidate: string, emailToUse: string) => {
      const cleanEmail = emailToUse.trim().toLowerCase();
      if (!cleanEmail) {
        router.replace("/forgot-password");
        return;
      }

      if (codeToValidate.length !== 6) {
        setError("Digite o código de verificação completo de 6 dígitos.");
        return;
      }

      setLoading(true);
      setError(null);
      setResendNotice(null);

      try {
        const { reset_token } = await verifyResetCode(cleanEmail, codeToValidate);
        // OTP destruído no backend. Guarda o token temporário em memória RAM protegida
        // e redireciona sem expor o JWT em query string (CWE-598 / OWASP ASVS).
        setResetSessionToken(reset_token);
        router.push("/reset-password");
      } catch (cause) {
        if (cause instanceof ApiError) {
          setError(cause.message);
          // If code is wrong or expired, focus first box
          digitInputRefs.current[0]?.focus();
        } else {
          // If network error, still allow going to reset-password or retry
          setError(
            "Não foi possível validar o código com o servidor. Verifique sua conexão e tente novamente.",
          );
        }
        setLoading(false);
      }
    },
    [router],
  );

  // Auto-validate if code came complete in URL
  useEffect(() => {
    const cleanInitialCode = initialCode.replace(/\D/g, "").slice(0, 6);
    if (
      !hasAutoValidated.current &&
      cleanInitialCode.length === 6 &&
      email.trim()
    ) {
      hasAutoValidated.current = true;
      validateAndProceed(cleanInitialCode, email);
    } else {
      // Focus first empty box
      const firstEmpty = codeDigits.findIndex((d) => !d);
      digitInputRefs.current[firstEmpty === -1 ? 0 : firstEmpty]?.focus();
    }
  }, [initialCode, email, codeDigits, validateAndProceed]);

  // Handle digit changes
  function handleDigitChange(index: number, value: string) {
    const cleanChar = value.replace(/\D/g, "");
    if (!cleanChar && value !== "") return;

    const nextDigits = [...codeDigits];
    nextDigits[index] = cleanChar ? cleanChar.slice(-1) : "";
    setCodeDigits(nextDigits);
    setError(null);

    // If digit typed, advance to next box
    if (cleanChar && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }

    // If this completed all 6 digits and we have email, auto-validate
    const fullCode = nextDigits.join("");
    if (fullCode.length === 6 && email.trim()) {
      validateAndProceed(fullCode, email);
    }
  }

  // Handle keyboard navigation
  function handleDigitKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      if (!codeDigits[index] && index > 0) {
        const nextDigits = [...codeDigits];
        nextDigits[index - 1] = "";
        setCodeDigits(nextDigits);
        digitInputRefs.current[index - 1]?.focus();
      } else {
        const nextDigits = [...codeDigits];
        nextDigits[index] = "";
        setCodeDigits(nextDigits);
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  }

  // Handle paste
  function handleDigitPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").trim();
    const numericChars = pasted.replace(/\D/g, "").slice(0, 6);

    if (numericChars.length === 0) return;

    const nextDigits = [...codeDigits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = numericChars[i] || "";
    }
    setCodeDigits(nextDigits);
    setError(null);

    if (numericChars.length === 6 && email.trim()) {
      validateAndProceed(numericChars, email);
    } else {
      const lastFilled = Math.min(numericChars.length, 5);
      digitInputRefs.current[lastFilled]?.focus();
    }
  }

  // Handle Resend
  async function handleResendCode() {
    if (resendCooldown > 0 || loading) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Informe seu e-mail para receber um novo código.");
      return;
    }

    setError(null);
    setResendNotice(null);
    setLoading(true);

    try {
      await forgotPassword(cleanEmail);
      setResendCooldown(60);
      setCodeDigits(["", "", "", "", "", ""]);
      setResendNotice("Novo código de 6 dígitos enviado para seu e-mail.");
      digitInputRefs.current[0]?.focus();
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError("Não foi possível reenviar o código. Tente novamente em instantes.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle form submission
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = codeDigits.join("");
    validateAndProceed(code, email);
  }

  const isAttemptsExceeded =
    error?.toLowerCase().includes("tentativas excedido") || false;

  const filledCount = codeDigits.filter(Boolean).length;
  const isComplete = filledCount === 6;

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
      {/* Email context display if not already shown in page header */}
      {email && !initialEmail ? (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label/caption text-muted">
          <span>Código enviado para</span>
          <strong className="font-semibold text-ink">{email}</strong>
          <Link
            href={`/forgot-password?email=${encodeURIComponent(email)}`}
            className="font-medium text-ink underline underline-offset-4 hover:opacity-75"
          >
            (Alterar)
          </Link>
        </div>
      ) : null}

      {/* OTP Segmented Input */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-label/caption text-ink">
            Código de 6 dígitos
          </span>
          <span className="flex items-center gap-1.5 text-caption/caption text-muted">
            {/* Clock icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-3.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Expira em 15 min
          </span>
        </div>

        <div
          role="group"
          aria-label="Código de verificação de 6 dígitos"
          className="grid grid-cols-6 gap-2.5 sm:gap-3"
        >
          {codeDigits.map((digit, index) => {
            const isFilled = Boolean(digit);
            const hasError = Boolean(error && error.toLowerCase().includes("código"));

            return (
              <input
                key={index}
                ref={(el) => {
                  digitInputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                autoComplete="one-time-code"
                aria-label={`Dígito ${index + 1} de 6`}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(index, e)}
                onPaste={index === 0 ? handleDigitPaste : undefined}
                disabled={loading}
                className={`h-14 w-full rounded-sm border text-center font-mono text-xl font-bold tracking-code transition-all sm:h-16 sm:text-2xl ${
                  hasError
                    ? "border-danger bg-danger-surface text-ink"
                    : isFilled
                      ? "border-ink bg-paper text-ink"
                      : "border-control-border bg-paper text-ink hover:border-ink"
                } focus:border-ink focus:outline-2 focus:outline-ink focus:outline-offset-1 disabled:opacity-50`}
              />
            );
          })}
        </div>

        {/* Progress dots */}
        <div
          role="presentation"
          aria-hidden="true"
          className="flex justify-center gap-1.5 pt-0.5"
        >
          {codeDigits.map((digit, index) => (
            <span
              key={index}
              className={`size-1.5 rounded-full transition-colors duration-150 ${
                digit ? "bg-ink" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div aria-live="polite" className="flex flex-col gap-3">
        {resendNotice && !error && (
          <p className="flex items-center gap-2.5 rounded-sm border border-success bg-success-surface px-4 py-3 text-label leading-[18px] text-ink">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-4 shrink-0 text-success"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {resendNotice}
          </p>
        )}

        {error && (
          <div className="flex flex-col gap-2 rounded-sm border border-danger bg-danger-surface px-4 py-3 text-label leading-[18px] text-ink">
            <p>{error}</p>
            {isAttemptsExceeded && (
              <button
                type="button"
                onClick={handleResendCode}
                className="self-start font-semibold text-ink underline underline-offset-4 hover:opacity-80"
              >
                Solicitar novo código agora
              </button>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !isComplete || !email.trim()}
        aria-busy={loading}
        className={buttonClass({
          variant: "ink",
          className: "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink",
        })}
      >
        {loading ? "Validando código…" : "Continuar para nova senha"}
      </button>

      {/* Resend Code Section */}
      <div className="flex flex-col items-center gap-2 border-t border-border pt-5 text-center">
        <span className="text-label/caption text-muted">
          Não recebeu o código ou o código expirou?
        </span>
        {resendCooldown > 0 ? (
          <span className="text-label/caption text-muted">
            Reenviar em{" "}
            <span className="font-mono font-semibold tabular-nums text-ink">
              {resendCooldown}s
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            disabled={loading}
            className="font-semibold text-label/caption text-ink underline underline-offset-4 transition-opacity hover:opacity-75 disabled:opacity-50"
          >
            Reenviar código por e-mail
          </button>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className={textLinkClass({
            className: "text-label/caption text-muted hover:text-ink",
          })}
        >
          Cancelar e voltar para o login
        </Link>
      </div>
    </form>
  );
}
