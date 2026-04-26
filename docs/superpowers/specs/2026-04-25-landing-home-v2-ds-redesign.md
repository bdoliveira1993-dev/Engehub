# Landing v2 — Redesign DS-aligned (dark CAD) — Design

> ⚠ **DESCONTINUADO em 2026-04-25 (mesmo dia).** Esta v2 (dark CAD com painel-dashboard e ticker animado) foi aprovada mas nunca implementada. A usuária pivotou pra um direcionamento minimal-editorial — ver [2026-04-25-landing-home-v3-editorial-minimal.md](./2026-04-25-landing-home-v3-editorial-minimal.md). Mantida como referência histórica.

**Data:** 2026-04-25
**Substitui:** [2026-04-23-landing-home-page-design.md](./2026-04-23-landing-home-page-design.md) (a v1 light/rounded é descontinuada)
**Status:** Substituído por v3 (não foi implementado).

## Contexto

A v1 da landing (clara, slate-50, cantos muito arredondados) está sendo descontinuada em favor de uma identidade alinhada ao **EngeHub Design System Research** (estética CAD-like / blueprint, dark-first, sharp edges, tokens semânticos). A pasta `claude design/` no root do projeto traz a estrutura visual de partida (Nav, Hero com painel interativo, Strip, Features, CTA, Footer); esta spec define as **adaptações** necessárias para alinhar à filosofia do DS e integrar ao stack do app.

A v2 só toca a rota `/` (página pública). Login, Register, Dashboard e demais páginas autenticadas permanecem na estética clara atual; a migração delas será objeto de spec separada se/quando virar prioridade.

## Decisões confirmadas

| # | Decisão | Valor |
|---|---------|-------|
| 1 | Cor de accent | `#3B82F6` (azul, mantém continuidade com `blue-600` do app atual) |
| 2 | Métricas do hero panel | Reenquadrado como "EXEMPLO · DASHBOARD DO ENGENHEIRO" com stats em escala individual |
| 3 | Escopo | Só `HomePage.tsx`. Outras páginas inalteradas. |
| 4 | Localização dos tokens | `tokens.css` global na raiz, importado via `index.html` |

Decisões secundárias (apoiadas pelo DS doc):
- Tipografia: **Geist** + **Geist Mono** (substituem Inter Tight + JetBrains Mono do Claude Design)
- Raio: **0** (CAD puro)
- Bordas: alpha-on-white (`rgba(255,255,255,0.06/0.10/0.18)`)
- Spacing: escala 4px, generoso (space-12 a space-20) na home
- Motion: 120/200/320ms, `cubic-bezier(0.16, 1, 0.3, 1)`, zero bounce
- Status colors definidos em tokens (success/warning/danger/info), mas só amber+verde aparecem na home (no ticker)

## Sistema de tokens (`tokens.css`)

Adoção integral do conjunto da seção 3 do research doc, com `--accent` fixado em `#3B82F6`. Tokens são puramente semânticos (não cromáticos): `--surface-base`, `--border-default`, `--text-primary` etc. — assim, futuras páginas reaproveitam sem refatorar componentes.

Camadas:
- 4 níveis de superfície (base, raised, overlay) — dark
- 3 níveis de borda (subtle, default, strong) em alpha branca
- 4 níveis de texto (primary, secondary, tertiary, disabled)
- 1 cor de marca + variações (--accent, --accent-hover, --accent-ink)
- 4 cores semânticas de status (success, warning, danger, info)
- Escala tipográfica modular (ratio ~1.2)
- Escala de espaçamento (4px base)
- Raios (`--radius-none: 0` como default)
- Tokens de motion

## Arquitetura

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `tokens.css` (raiz) | **Criar** | Tokens semânticos globais (única fonte da verdade) |
| `index.html` | Modificar | Adicionar Geist + Geist Mono via Google Fonts; importar `tokens.css` |
| `components/HomePage.tsx` | **Reescrever completo** | Componente raiz da landing (estrutura: Nav, Hero, Strip, Features, CTA, Footer minimal). `useNavigate` para CTAs. `IntersectionObserver` para `.reveal`. |
| `components/HomePage.css` | **Criar** | Estilos específicos da página (consome tokens). Porta de `claude design/styles.css` com hex → tokens. |
| `components/HomePageHeroPanel.tsx` | **Criar** | Painel interativo do hero (clock LIVE, countup, ticker animado). Porta de `claude design/hero.jsx` com **conteúdo reenquadrado** (decisão 2b). |
| `components/HomePageIcons.tsx` | **Criar** | SVGs custom técnicos. Porta de `claude design/icons.jsx` para TSX (sem `window.Icon`). |

Arquivos **não tocados**: `App.tsx` (roteamento da v1 já está correto), `LoginPage`, `RegisterPage`, `ProtectedRoute`, `Layout`, `Footer.tsx` antigo (não mais usado pela HomePage v2 mas mantido caso `Layout` precise — sanity-check durante implementação).

## Adaptações do Claude Design

Em relação ao código bruto de `claude design/`:

1. **Fontes:** Inter Tight → Geist; JetBrains Mono → Geist Mono. Atualizar `--font-sans` e `--font-mono` em `tokens.css`. Atualizar `<link>` em `index.html`.
2. **Cores hard-coded → tokens semânticos:** todo hex em `claude design/styles.css` é substituído por `var(--token-*)` em `HomePage.css`. Ex.: `#0a0a0b` → `var(--surface-base)`, `#3b82f6` → `var(--accent)`, `#f5f5f6` → `var(--text-primary)`.
3. **Gradiente proibido:** o `linear-gradient(180deg, rgba(59,130,246,0.05), transparent 30%)` no `.hero-panel` é removido. Substituído por borda 1px solid `var(--border-strong)` + faixa horizontal de 1px no topo em `var(--accent)` (assinatura técnica).
4. **Globals → ESM:** `window.Icon = Icon`, `window.HeroPanel = HeroPanel`, `ReactDOM.createRoot(...)` removidos. Tudo vira módulos TS com `import`/`export default`.
5. **`React.useEffect`/`React.useState`/`React.useRef` → hooks importados** explicitamente.
6. **Babel-in-browser** descartado: o app usa Vite + TS, então JSX vira TSX com tipagem.
7. **Footer reescrito como minimal inline** (substitui o `Footer` original do Claude Design): `ENGEHUB · 2026 · BETA · feedback@engehub.com` em mono, sem marcas tipo "BUILD 2.4.17" (informação fake).
8. **CTAs cadastro/criar perfil/contratar empresa → `/register`**; CTAs entrar → `/login`. Anchor links (`#oportunidades`, `#sistema`, `#empresas`) viram scroll dentro da página (mantidos como `id` nas seções).
9. **Pré-existente:** `App.tsx` da v1 já redireciona logado para `/dashboard` em todas as rotas públicas e já corrigiu o bug `onSwitchMode` → `onSwitchToLogin`. Sem mudança em roteamento.

## Reframe do hero panel (decisão 2b)

O painel mantém **a mesma estrutura visual** (header de status, 2 linhas de stats, ticker, footer) mas com conteúdo **claramente identificado como exemplo** e numa escala plausível para um engenheiro individual.

| Elemento | Antes (Claude Design) | Depois (v2) |
|----------|----------------------|-------------|
| Pill esquerda do header | `NODE · SP-01` / `UPTIME 99.98%` | `EXEMPLO · DASHBOARD DO ENGENHEIRO` |
| Cor do live-dot | `var(--accent)` (azul) | `var(--warning)` (amber) — convenção universal "preview/em construção" |
| Live clock | mantido (real, sem objeção) | mantido |
| Stat 01 | `Engenheiros ativos` (14.820) | `Propostas enviadas` (14) |
| Stat 02 | `Oportunidades abertas` (312) | `Oportunidades elegíveis` (23) |
| Stat 03 | `Volume em cotação · 30d` (R$ 4,82M) | `Cotação ativa` (R$ 47k) |
| Stat 04 | `Ticket médio` (R$ 7,4k) | `Score técnico` (94 / 100) |
| Ticker header | `FEED · /opportunities/live` | `FEED · OPORTUNIDADES ELEGÍVEIS` |
| Panel footer left | `Σ 8 de 312 ativos` | `Σ 8 de 23 · DEMO — DADOS DE EXEMPLO` |
| Panel footer right | `VER FEED COMPLETO ›` | `ABRIR PAINEL COMPLETO ›` (clicável → `/register`) |

O countup das stats continua animando — agora chega aos números acima em vez dos números fake. O ticker continua atualizando a cada 4,2s com escopos da pool existente em `INCOMING_POOL` (são exemplos plausíveis de oportunidades, ok).

## Estrutura de copy (mantida do Claude Design, com micro-ajustes)

- **Hero h1:** `A infraestrutura de oportunidades que a engenharia brasileira [não tinha] precisava.` (riscado em "não tinha" mantido)
- **Hero lede:** mantém literal.
- **Hero CTAs:** `Cadastrar engenheiro` (primário) + `[ Contratar equipe ]` (ghost). Ambos → `/register`.
- **Strip:** mantém literal (12 disciplinas).
- **Section "Sistema · 02 / 04":** título e lede mantidos.
- **4 features:** títulos, bodies, tags e CTAs textuais mantidos. CTAs textuais (`Ver vagas abertas`, `Abrir oferta de serviço`, etc.) **não são clicáveis** nesta v2 — viram label "→" decorativo. Razão: as páginas de destino não existem como rotas públicas.
- **CTA section "Handshake · 04 / 04":** mantém. Botão `Criar perfil de engenheiro` → `/register`. Botão `Cadastrar empresa` → `/register` (TODO: separar fluxo empresa quando o produto evoluir; documentado em comentário).
- **Footer:** simplificado — `ENGEHUB · 2026 · BETA · feedback@engehub.com` à esquerda, `BUILD · BETA · BR` à direita (ou simplesmente 2 linhas mono mute, sem fake-marks).

## Acessibilidade

- `prefers-reduced-motion` respeitado: `.reveal` não anima, `.strip-track` não rola, `.live-dot` não pulsa, ticker não tem flash, hero panel não tem countup (mostra valor final direto). DS doc: "Motion técnico é funcional, não decorativo".
- Foco visível: usar `--focus-ring: var(--accent)` com `outline: 1px solid var(--focus-ring); outline-offset: 2px` em todos os botões/links interativos.
- Hierarquia de headings: 1× `h1` (hero), 2× `h2` (Features e CTA section), 4× `h3` (cards de feature).
- `aria-hidden` nos elementos decorativos (`.bg-grid`, `.bg-noise`, ticks dos cantos do painel, divisores).
- Contraste: tokens `--text-primary` (#F5F5F7) sobre `--surface-base` (#0A0B0D) atende AAA. `--text-secondary` (#A1A1AA) atende AA.
- `<button>` `disabled` ou decorativo recebe `aria-disabled` quando aplicável.

## Critérios de aceite

1. `tokens.css` importado e disponível globalmente; CSS variables resolvem em qualquer página do app.
2. `/` carrega a landing dark; cantos vivos; tipografia Geist; sem nenhum hex hard-coded em `HomePage.css`.
3. **Sem fake-data global** no painel: header diz `EXEMPLO`, stats são personal-scale, footer do painel diz `DEMO`.
4. CTAs roteiam: cadastro variants → `/register`, "Entrar" → `/login`. Funcionam após autenticação (redirect `/dashboard`).
5. Strip rola horizontalmente; ticker atualiza a cada ~4s; clock LIVE atualiza a cada 1s.
6. `prefers-reduced-motion`: revelações, scroll do strip, pulso do dot, countup, e flash do ticker pausam.
7. Layout em 375 / 768 / 1280 sem overflow horizontal nem texto cortado.
8. Sem regressão em `/login`, `/register`, `/dashboard` ou demais rotas autenticadas.
9. Sem erros no console; sem warnings de React (chaves faltando, hooks fora de ordem, etc.).
10. Geist e Geist Mono carregam corretamente (verificar via DevTools → Network).

## Riscos e observações

- **Mismatch de tema com `/login`:** decisão consciente da usuária (3a). Visitante que clica "Entrar" sai do tema dark e cai numa tela clara. Aceitável por enquanto; resolver em spec futura.
- **Babel runtime no `claude design/index.html`** não é usado — só serve como referência visual. O `index.html` real do app continua usando Vite/TS.
- **Custom SVG icons** são preferidos sobre lucide-react para preservar a estética técnica (linhas finas, sharp). Lucide continua disponível para outras páginas.
- **Tailwind via CDN coexiste com `tokens.css`:** tokens não conflitam com Tailwind; outras páginas continuam usando classes utility, e a HomePage usa CSS dedicado (`HomePage.css`). Sem `tailwind.config.js` para sincronizar (não há build pipeline customizado).
- **Pre-existing `Footer.tsx`** não é mais consumido por `HomePage`; verificar durante implementação se algum outro componente o usa antes de qualquer remoção (não está no escopo remover, só verificar).
- **Performance:** `setInterval` do ticker (4,2s) e do clock (1s) rodam enquanto a landing está aberta. Sem paginação nem virtualização — não há risco em uma página com 8 linhas. Cleanup via `clearInterval` no return do `useEffect` (já presente em `claude design/hero.jsx`).
