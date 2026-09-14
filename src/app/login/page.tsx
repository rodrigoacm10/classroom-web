import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-md px-6 py-6">
        <Link href="/" className="text-sm font-semibold tracking-wide">
          Classroom
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-20">
        <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
        <p className="mt-2 text-muted">
          Use a conta da instituição. O refresh token fica em cookie HttpOnly.
        </p>
        <LoginForm />
      </main>
    </div>
  );
}
