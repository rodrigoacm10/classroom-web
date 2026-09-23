# Classroom Web

Painel web (professor e admin) do Classroom — sistema de chamada acadêmica com validação por geolocalização.

O aluno usa o app mobile. Este projeto consome a [classroom-api](../classroom-api) em FastAPI.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Como rodar

Na raiz deste repositório:

```bash
cp .env.example .env.local   # se ainda não existir
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A API precisa estar em [http://localhost:8000](http://localhost:8000) — a CORS da API já libera essa origem.

## Variáveis

| Variável | Padrão | Uso |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Base da classroom-api |
