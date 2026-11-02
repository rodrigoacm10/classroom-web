# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Administradores, Coordenadores e Professores de instituições de ensino acadêmico e técnico. Utilizam o Locus Web para gestão de membros, convites, turmas, salas, chamadas ao vivo e relatórios de frequência.

## Product Purpose
Plataforma de gestão acadêmica, controle de presença via geofencing e onboarding de membros (alunos, professores, coordenadores e administradores) com convites por e-mail e links diretos com pré-vínculo de turmas.

## Positioning
Locus Classroom: gestão de presença e membros multi-tenant sem burocracia ou hardware dedicado, com auditoria em tempo real e fluxo de convites integrado.

## Operating Context
Dashboard web responsivo (desktop/tablet), consumindo API FastAPI assíncrona com autenticação multi-tenant baseada em JWT com claims enriquecidas por instituição ativa.

## Capabilities and Constraints
- Envio de convites com papéis: ALUNO, PROFESSOR, COORDENADOR, ADMIN.
- Pré-vinculação de turmas para convites de alunos.
- Listagem paginada de convites com filtros de status (`pending`, `accepted`, `expired`, `revoked`), papel e busca por e-mail.
- Ações sobre convites: copiar link direto de ativação, reenviar e-mail e revogar convite pendente.
- Acesso à gestão de convites da instituição requer perfil com permissão adequada (ADMIN/COORDENADOR para convites institucionais).

## Brand Commitments
Identidade visual "Locus": design editorial premium, estética Ink/Paper de alto contraste, tipografia sans moderna, tons quentes e acento visual vibrante (accent amarelo/dourado escuro), microinterações táteis e feedback claro de status.

## Evidence on Hand
- Rotas existentes: `/dashboard/alunos`, `/dashboard/turmas`, `/dashboard/chamadas`, `/dashboard/salas`.
- Modais e componentes existentes: `ConvidarAlunoModal`, `PageHeader`, `CallBanner`.
- Endpoints de convites na API: `POST /tenants/{tenant_id}/invites`, `GET /tenants/{tenant_id}/invites`, `DELETE /tenants/{tenant_id}/invites/{invite_id}`.

## Product Principles
1. **Clareza de Status**: O administrador deve saber instantaneamente quem foi convidado, se o convite foi aceito, expirou ou se precisa ser reenviado.
2. **Onboarding Ágil**: Permitir envio unitário ou em lote, cópia de link imediata e atribuição automática de turmas/papel.
3. **Consistência de Sistema**: Integrar perfeitamente ao ecossistema e à Sidebar global do Locus sem quebrar a harmonia visual.
