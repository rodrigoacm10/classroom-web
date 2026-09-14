import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-sm font-semibold tracking-wide">Classroom</p>
        <Link
          href="/login"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Entrar
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
          Painel do professor e admin
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Chamada acadêmica com validação por geolocalização.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          Abra a janela de presença, gere o código do dia e acompanhe quem
          confirmou na sala. O aluno usa o app; este painel é o lado da
          instituição.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Acessar o painel
          </Link>
          <a
            href="http://localhost:8000/docs"
            className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium transition-colors hover:bg-white"
          >
            Ver API
          </a>
        </div>
      </main>
    </div>
  );
}
