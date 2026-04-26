# Fase 3 — App Shell + Dashboard — Design

**Data:** 2026-04-25
**Pré-requisito:** Fases 1 (landing v3) e 2 (auth) entregues
**Status:** Em execução — aplicar DS §4.3 (Padrão dashboard / app autenticado).

## Objetivo

Migrar o esqueleto autenticado (`Layout.tsx`) e a tela mais usada (`DashboardContent.tsx`) para o novo Design System. O `EngineeringSelector` entra junto porque é renderizado direto no header do Layout e ficaria visualmente quebrado se deixado pra Fase 4.

## Escopo

**Toca:**
- `components/Layout.tsx` — reescrita completa
- `components/EngineeringSelector.tsx` — reescrita
- `components/DashboardContent.tsx` — reescrita
- `components/Layout.css` — criar (CSS do shell)
- `components/Dashboard.css` — criar (CSS da página dashboard)

**Não toca (fica pra Fase 4):**
- `ProfilePage`, `ServicesPage`, `OpportunitiesPage`, `CoursesPage`, `MessagesPage`, `EventsPage`, `NewsPage`
- `Footer.tsx` — removido do `Layout` mas o arquivo permanece (será deletado/reescrito na Fase 4)
- Modais (`EngineeringOnboardingModal`, `EventModal`, `PublishOpportunityModal`)

**Comportamento preservado:**
- Roteamento via `<Outlet />` — outras rotas autenticadas continuam funcionando
- Fetch real do Supabase em DashboardContent
- Estado loading / error / empty
- EngineeringSelector com 7 opções (do enum `EngineeringType`)
- Logout (`onLogout` chama `supabase.auth.signOut`)

## Decisões

1. **Layout: sidebar à esquerda + header no topo + main scrollável** — herda da estrutura atual, sem inventar novidade. Sidebar 280px desktop, vira drawer no mobile.
2. **Footer dentro do Layout removido** — apps autenticados não usam footer (padrão Linear/Notion). `Footer.tsx` continua existindo por enquanto.
3. **Headings sem italic-serif** — serifa é signature de marketing/auth (DS §4.3).
4. **Lucide-react mantido** — não há ganho em remover; outras páginas usam.
5. **Active state da nav:** background `--surface-overlay`, texto `--accent`, borda esquerda 2px `--accent` (signature).
6. **Stat cards:** sharp, `--surface-raised`, ícone em tile pill `--surface-overlay`, valor grande sans, label mono.
7. **Lista de oportunidades:** linhas separadas por `--border-subtle`, hover muda fundo pra `--surface-raised`, ID mono, categoria como pill mono.
8. **EngineeringSelector** vira dropdown sharp com opções em `--surface-raised`, hover em `--surface-overlay`, item ativo com texto `--accent` e borda esquerda.
9. **Body dark** quando o app shell está montado: regra `body:has(.app-shell)` em `Layout.css`.
10. **LGPD badge no Dashboard** vira pill mono em `--status-success` translúcido.

## Estrutura visual

```
┌─────────┬────────────────────────────────────────────┐
│         │  ┌──────────────────────────────────────┐  │
│  ▣      │  │ [Search]    [Eng Selector]  [💬][🔔] │  │
│         │  └──────────────────────────────────────┘  │
│ engehub │  ┌──────────────────────────────────────┐  │
│         │  │                                      │  │
│ PAINEL  │  │  Olá, Bruna.       [✓ LGPD]          │  │
│ ── Dash │  │  Bem-vinda ao painel central.        │  │
│ ── Perf │  │                                      │  │
│ ── Serv │  │  [Stat][Stat][Stat][Stat]            │  │
│         │  │                                      │  │
│ OPORT.  │  │  ┌─────────────────────────────────┐ │  │
│ ── ART  │  │  │ OPORTUNIDADES RECENTES   ver→   │ │  │
│ ── Proj │  │  ├─────────────────────────────────┤ │  │
│ ── Empr │  │  │ ▦  Laudo X · CIV  · 2026-04-23 │ │  │
│         │  │  │ ▦  Projeto Y · ELE · ...        │ │  │
│ REDE    │  │  └─────────────────────────────────┘ │  │
│ ── Edu  │  │                                      │  │
│ ── Even │  │                                      │  │
│ ── News │  └──────────────────────────────────────┘  │
│         │                                            │
│ ─────── │                                            │
│ [usr]   │                                            │
│ Sair    │                                            │
└─────────┴────────────────────────────────────────────┘
```

## Anatomia do shell

### Sidebar (desktop)
- Fixa, 280px, fundo `--surface-base`, borda direita `--border-subtle`.
- Brand no topo (mesmo brand mark da home, clicável → `/dashboard`).
- 3 grupos de nav, cada um com label mono em caixa-alta (`PAINEL CENTRAL`, `OPORTUNIDADES`, `REDE`) e itens com ícone + label.
- Item ativo: `bg: --surface-overlay`, `color: --accent`, borda esquerda 2px `--accent`.
- Item hover: `bg: --surface-raised`, `color: --text-primary`.
- Rodapé: avatar + nome + especialidade (mono em `--accent`) + botão `Sair` em `--status-danger`.

### Sidebar (mobile)
- Drawer da esquerda. Botão flutuante no canto inferior direito quando colapsada (`--accent` background, ícone hambúrguer).
- Quando aberta, ocupa 280px e overlay no resto da tela.

### Top header
- Altura 68px, fundo `--surface-base`, borda inferior `--border-subtle`.
- Search input à esquerda: sharp, `--surface-raised`, ícone lupa em `--text-tertiary`. Placeholder "Buscar no EngeHub…".
- Direita: EngineeringSelector + grupo de ícones (mensagens, notificações) separado por divisor vertical.

### Main content
- Scroll vertical, padding `--space-8` (40px) desktop, `--space-5` (20px) mobile.
- Container interno `max-width: 1180px`, centralizado.
- Render `<Outlet />` — rota atual entrega o conteúdo.
- **Sem footer.**

## Anatomia do Dashboard

- **Header de boas-vindas:** h1 "Olá, {nome}." (sans, sem itálica), lede em `--text-secondary`.
- **LGPD badge:** pill mono pequena, fundo `rgba(34,197,94,0.10)`, borda `rgba(34,197,94,0.25)`, texto `--status-success`. Ícone shield à esquerda.
- **Stat cards (4):** grid responsivo (1/2/4 colunas). Cada card: ícone em tile sharp `--surface-overlay`, label mono em caixa-alta, valor grande em sans 28px.
- **Lista de oportunidades:**
  - Container sharp, fundo `--surface-raised`, sem borda (gap interno via divisores).
  - Header: título em sans, eyebrow mono ("DADOS EM TEMPO REAL VIA SUPABASE"), botão "Ver todos →" à direita.
  - Linhas: padding `--space-4`, hover `--surface-overlay`, ícone tile, título sans, metadata em mono.
  - Loading state: spinner SVG centralizado.
  - Error state: ícone alert + mensagem + botão "Recarregar".
  - Empty state: texto curto centralizado.

## Acessibilidade

- Sidebar com landmark `<aside aria-label="Navegação principal">`.
- Header com `<header>` semântico.
- Main com `<main>`.
- Estado ativo do nav-item via `aria-current="page"`.
- Ícones decorativos com `aria-hidden="true"`.
- Drawer mobile: foco move pra dentro quando abre, escape fecha.

## Critérios de aceite

1. Navegando para `/dashboard`, o shell renderiza dark com sidebar à esquerda e header no topo.
2. Nav ativa destacada com cor accent + borda esquerda.
3. EngineeringSelector abre dropdown sharp dark com 7 opções.
4. Stats do dashboard renderizam com tiles sharp e valores grandes.
5. Lista de oportunidades busca do Supabase, mostra loading → resultados (ou empty/error).
6. Logout funciona (chama `supabase.auth.signOut`, redireciona pra `/`).
7. Body fica dark enquanto o app shell está montado, volta ao bg-slate-50 nas rotas públicas (Home v3 já é dark direto, Login/Register também via Auth.css).
8. Mobile: sidebar colapsa, botão flutuante abre drawer.
9. Console limpo, sem regressão visual nas outras rotas autenticadas (que ainda renderizam light dentro do shell dark — esperado até Fase 4).

## Riscos e observações

- **Páginas internas light dentro do shell dark:** ProfilePage, ServicesPage, etc., continuam usando Tailwind light/slate-50. Vai aparecer um cartão/conteúdo light sobre fundo dark — visualmente incoerente, mas funcional. Resolvido na Fase 4.
- **Search input sem ação:** input continua decorativo (não há fluxo de busca implementado). Mantenho visual mas com `aria-disabled` true caso a busca não seja implementada em sequência.
- **EngineeringSelector onChange noop:** o callback `onChange` do selector vem do Layout como `() => { }`. A "visão atual" de engenharia que ele exibe é só visual; trocar engineering type não persiste em lugar nenhum hoje. Mantenho o comportamento.
- **Notificações count "3" hard-coded:** badge vermelho com 3 mensagens — fake data. Vou trocar por contador real (aponta pra `messages` do Supabase) ou esconder o badge quando 0. Decisão durante implementação: manter visual com `0` se não houver dado real, e remover o badge quando 0 (visual padrão de inbox vazia).
