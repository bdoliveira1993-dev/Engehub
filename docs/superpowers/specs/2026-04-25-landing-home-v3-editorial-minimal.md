# Landing v3 — Editorial-Minimal — Design

**Data:** 2026-04-25
**Substitui:** [v1 light/rounded](./2026-04-23-landing-home-page-design.md) e [v2 dark-CAD](./2026-04-25-landing-home-v2-ds-redesign.md)
**Status:** Aprovado pela usuária — Fase 1 do rollout do novo Design System
**Fonte visual:** `claude design/` (versão 2026-04-25 — minimal-editorial, sem dashboard, sem fake data)

## Contexto

Este é o terceiro direcionamento da landing em três dias. As versões anteriores foram pedagógicas — exploraram extremos opostos (light/friendly em v1, dark/dashboard-rich em v2) e ajudaram a usuária a calibrar a identidade visual do produto.

A v3 firma a direção: **editorial-industrial**. Rigor técnico de plataforma de engenharia + acabamento tipográfico de revista. Dark, sóbria, com uma assinatura visual distintiva — **serifa itálica em palavras-chave de headlines sans-serif**, criando contraste de peso e tom. Sem painéis dramáticos, sem métricas inventadas, sem CAD-puro radical.

Esta spec é também o **ponto de partida do novo Design System do EngeHub**, formalizado em [docs/design-system.md](../../design-system.md). A landing é a primeira página a aplicá-lo; LoginPage, RegisterPage, Layout, Dashboard e demais telas serão atualizadas em fases posteriores.

## Princípios visuais (resumo do DS)

1. **Editorial-industrial:** rigor técnico + tipografia de revista.
2. **Dark-first** (`#0c0c0d` como surface base).
3. **Uma cor de accent:** `#7aa2ff` (lavanda-azul, sóbrio, não chama mais atenção que o conteúdo).
4. **Três fontes:** `Inter Tight` (sans default), `Instrument Serif` italic (ênfase em headlines), `JetBrains Mono` (eyebrows, kickers, labels técnicas).
5. **Pill em botões, sharp em containers:** únicos elementos com raio são botões e nav-cta (`border-radius: 999px`); cards de feature, painéis, footer — todos sharp (raio 0).
6. **Bordas alpha-on-white:** invisíveis mas estruturais.
7. **Glow ambiente:** uma única fonte de luz radial no canto superior esquerdo (decoração permitida em background, nunca em UI).
8. **Motion técnico:** revealing on scroll, hover transitions, zero bounce.
9. **Sem fake-data:** stats inventadas, contadores fakes, métricas globais — todos proibidos. Quando precisar de números, usar dados reais ou rotular como exemplo.

## Decisões herdadas (confirmadas anteriormente, agora baseadas na v3)

| # | Decisão | Valor |
|---|---------|-------|
| 1 | Cor de accent | `#7aa2ff` (lavanda-azul); `#3b82f6` mantido como `--accent-strong` para usos secundários |
| 2 | Conteúdo do hero | **Sem painel-dashboard.** Hero textual puro com eyebrow, h1, lede, CTAs e foot-note. |
| 3 | Escopo desta fase | Apenas `HomePage.tsx` + infraestrutura de DS (tokens, fontes). Outras telas em fases posteriores. |
| 4 | Localização dos tokens | `tokens.css` global na raiz, importado via `index.html` (precede Tailwind para que os tokens estejam disponíveis em qualquer CSS dedicado). |

## Arquitetura

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `tokens.css` (raiz) | **Criar** | Tokens semânticos globais (cor, tipografia, espaçamento, raios, motion). Fonte única da verdade pra todas as telas. |
| `docs/design-system.md` | **Criar** | Doc canônico do DS — princípios, anatomia de componentes, do's & don'ts. Orienta as próximas fases. |
| `index.html` | Modificar | Importar `tokens.css`; trocar Inter Google Font por `Inter Tight + Instrument Serif + JetBrains Mono`. |
| `components/HomePage.tsx` | **Reescrever** | Single-file component com Nav, Hero, Features (4 cards 2×2), CTA, Footer minimal. Usa `useNavigate` + `IntersectionObserver` para reveal-on-scroll. |
| `components/HomePage.css` | **Criar** | Estilos da página, consumindo `tokens.css`. Porta de `claude design/styles.css` com hex → tokens. |

Arquivos **não tocados** nesta fase: `App.tsx` (roteamento da v1 já está correto), `LoginPage.tsx`, `RegisterPage.tsx`, `Layout.tsx`, `Footer.tsx` antigo (deixado intacto, ainda não consumido pela landing v3 mas inalterado por enquanto).

Nesta fase **não criamos** `HomePageHeroPanel.tsx` nem `HomePageIcons.tsx` — a v3 é simples o suficiente pra caber em um único arquivo TSX. O ícone Arrow é o único SVG, vive inline.

## Estrutura da landing (porta direta de `claude design/app.jsx`)

1. **Glow** — `<div className="glow">` decorativo, fixed no canto superior esquerdo, blur radial em `--accent` com 10% de opacidade. Marcado `aria-hidden`.
2. **Nav sticky** — brand mark (square SVG) à esquerda + 3 links (`Como funciona`, `Para empresas`, `Entrar`) + CTA pill (`Criar perfil`).
3. **Hero textual** — eyebrow mono (`Em pré-lançamento · rede profissional`), h1 grande com serifa itálica em "engenharia", lede curta, dois CTAs (`Criar meu perfil` primário + `Contratar engenheiros` ghost), foot mono (`Cadastro gratuito`).
4. **Features section** (id=`como`) — título centralizado com itálica em "acontecer", grid 2×2 de cards. Cada card: numeração mono (`01`–`04`), h3 com serifa itálica em uma palavra-chave, body curto, link `→` que **nesta fase é decorativo** (não navega — as páginas internas correspondentes ainda não são públicas).
5. **CTA section** (id=`cadastrar`) — kicker mono (`Comece agora`), h2 com serifa itálica em "perfil", parágrafo, dois botões (`Sou engenheiro` primário + `Sou empresa` ghost), nota mono.
6. **Footer minimal** — brand mark + nome à esquerda; 4 links mono à direita (`Sobre`, `Contato`, `Privacidade`, `Termos`). Borda 1px `--line-soft` no topo.

## Mapeamento de CTAs

| Botão / Link | Destino |
|-------------|---------|
| Nav: `Criar perfil` | `/register` |
| Nav: `Entrar` | `/login` |
| Nav: `Como funciona` | `#como` (anchor in-page) |
| Nav: `Para empresas` | `#cadastrar` (anchor in-page para a CTA section) |
| Hero: `Criar meu perfil` (primário) | `/register` |
| Hero: `Contratar engenheiros` | `/register` (TODO: separar fluxo empresa quando produto evoluir) |
| Feature links (`Ver vagas`, `Abrir oferta`, etc.) | **Decorativos nesta fase** — sem `href`, apenas hover state |
| CTA: `Sou engenheiro` (primário) | `/register` |
| CTA: `Sou empresa` | `/register` (mesmo TODO) |
| Footer: `Sobre`, `Contato`, `Privacidade`, `Termos` | `href="#"` (placeholders — páginas serão criadas separadamente) |

## Adaptações de `claude design/` para o stack do app

1. **Babel runtime → Vite TS:** `<script type="text/babel">` descartado. JSX vira TSX, hooks importados explicitamente (`useEffect`, `useRef`).
2. **`ReactDOM.createRoot(...)` removido:** o componente `HomePage` é exportado como default; o root rendering continua acontecendo em `index.tsx` via `App.tsx`.
3. **Hex → tokens:** todo `#0c0c0d`, `#7aa2ff`, `#f2f2f3` etc. de `claude design/styles.css` vira `var(--surface-base)`, `var(--accent)`, `var(--text-primary)` etc. em `HomePage.css`.
4. **Fontes:** atualização do `<link>` no `index.html` para incluir as três famílias (Inter Tight 400/500/600, Instrument Serif italic, JetBrains Mono 400/500). Inter (do app antigo) é mantido em paralelo até as outras telas migrarem — Inter Tight é o default do DS, Inter ainda é usado por Tailwind nas páginas legadas (overlap aceitável durante migração).
5. **Brand mark SVG:** `stroke="#7aa2ff"` e `fill="#7aa2ff"` viram `currentColor` no SVG, e o wrapper `.brand-mark` recebe `color: var(--accent)`. Permite trocar accent sem refatorar SVG.
6. **`useNavigate`:** todas as ações de cadastro/entrar saem de `<a href="...">` ou `<button>` neutro e passam a usar `navigate('/register')` / `navigate('/login')`. Anchor links (`#como`, `#cadastrar`) ficam como `<a href="#...">` (scroll nativo).
7. **`IntersectionObserver` para `.reveal`:** porta literal de `claude design/app.jsx` linhas 183–199; cleanup correto no return.
8. **Tailwind via CDN coexiste:** o `tokens.css` é importado **antes** do script do Tailwind no `index.html`, e a landing v3 não usa classes Tailwind — apenas `HomePage.css`. Outras páginas continuam usando Tailwind até serem migradas.

## Acessibilidade

- `prefers-reduced-motion`: `.reveal` aparece imediatamente; sem transitions.
- Hierarquia de headings: 1× `h1` (hero), 2× `h2` (Features e CTA), 4× `h3` (cards).
- Focus visível: `:focus-visible { outline: 1px solid var(--accent); outline-offset: 3px; }` em `tokens.css` cobre todos os interativos.
- `aria-hidden` no `.glow` e nos `.brand-mark` decorativos (texto adjacente carrega o significado).
- Contraste: `--text-primary` (#f2f2f3) sobre `--surface-base` (#0c0c0d) atende AAA. `--text-dim` (#9a9aa3) atende AA pra texto normal.
- `<a>` decorativos dos features ficam como `<a>` (são âncoras placeholder), mas se vierem a ser totalmente inertes, viram `<span>`. Decisão durante implementação.

## Critérios de aceite

1. Visitante deslogado em `/` vê a landing v3 (editorial-minimal, dark).
2. `tokens.css` está disponível globalmente — `var(--accent)` resolve em qualquer arquivo CSS do projeto.
3. Fontes Inter Tight, Instrument Serif e JetBrains Mono carregam (verificável via DevTools → Network → Fonts).
4. Headlines `engenharia`, `sua`, `acontecer`, `perfil` aparecem em itálico serifado distinto do texto sans circundante.
5. CTAs roteiam: `/register` e `/login` levam às páginas certas; redirect logado pra `/dashboard` continua funcionando.
6. Anchor links de nav rolam para as seções (`#como`, `#cadastrar`).
7. `prefers-reduced-motion`: nenhuma animação; conteúdo aparece direto.
8. Layout em 375 / 768 / 1280 sem overflow horizontal nem texto cortado.
9. Sem regressão em `/login`, `/register`, `/dashboard` ou demais rotas autenticadas.
10. Console limpo (sem erros, sem warnings novos).
11. Doc `docs/design-system.md` existe e cobre tokens, tipografia, componentes, do's & don'ts.

## Riscos e observações

- **Migração de fontes:** Inter (app legado) e Inter Tight (DS novo) carregam simultaneamente até as outras telas migrarem. Custo: ~2 fontes extras no primeiro load. Mitigação: as fontes legadas são removidas na Fase 4.
- **Pre-existing `Footer.tsx`:** continua existindo e não é consumido pela landing v3 nem pelo `Layout` (verificado durante implementação). Será reescrito na Fase 4 para alinhar ao DS.
- **Tailwind CDN coexiste com `tokens.css`:** sem conflito imediato — `tokens.css` define CSS variables e classes globais utilitárias (`.mono`, `.serif`); Tailwind classes continuam funcionando nas outras páginas. Quando a Fase 4 acabar, dá pra avaliar remoção do Tailwind.
- **Mismatch visual `/` ↔ `/login`:** consciente. O usuário que clica "Entrar" sai do dark editorial e cai numa tela light slate-50. Resolvido na Fase 2.
- **Feature links decorativos:** se a usuária quiser deep-linking dos cards (ex: `Ver vagas` → `/opportunities` mesmo logado), basta trocar a renderização condicional. Por enquanto, as páginas internas são autenticadas e a landing é pública.
- **Empresas não têm fluxo separado:** `Sou empresa` / `Contratar engenheiros` apontam pra `/register` por enquanto. Quando o produto suportar conta-empresa, separar em `/register?type=company` ou rota dedicada.
