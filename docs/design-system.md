# EngeHub Design System

**Versão:** 1.0 (2026-04-25)
**Status:** Canônico. Substitui o `engehub-design-system-research.md` (era exploração).
**Implementado em:** `tokens.css` (raiz) — fonte única da verdade pra todas as telas.

> Quando este doc e o código discordarem, **o `tokens.css` ganha**. Se você precisa mudar uma decisão, mude o doc primeiro, depois o token, depois os consumidores.

---

## 1. Princípios

Esses são os pilares. Tudo o que vem depois deriva deles.

1. **Editorial-industrial.** Rigor técnico de ferramenta de engenharia + acabamento tipográfico de revista. A plataforma é séria, não é dashboard porn.
2. **Dark-first.** O usuário-padrão é um engenheiro em sessão prolongada (cronograma, lista de insumos, propostas). Dark é menos cansativo. Light theme entra mais tarde, se vier.
3. **Uma cor de accent.** `--accent` é lavanda-azul sóbrio. **Resista** a adicionar uma segunda cor de marca. Status colors (success/warning/danger/info) existem mas são separados de marca.
4. **Tipografia carrega o tom, não a decoração.** Headlines em sans + uma palavra-chave em serifa itálica. Mono pra labels, IDs, números técnicos. Sem cores diferentes em texto.
5. **Pill em botões, sharp em containers.** A única coisa com raio na interface é botão e nav-cta. Cards, painéis, tabelas, modais — sharp.
6. **Bordas alpha-on-white.** `rgba(255,255,255,0.06/0.10/0.18)` em vez de cinzas. Sobrevivem ao mudar de superfície.
7. **Motion é funcional, nunca decorativo.** Reveal-on-scroll, hover, foco. Zero bounce, zero elastic, zero parallax.
8. **Sem fake-data.** Métricas inventadas, contadores fakes, dashboard porn — proibidos. Quando precisar mostrar números, ou são reais, ou são claramente rotulados como exemplo.
9. **Zero gradiente em UI.** Gradientes só em background ambient (glow do hero). Botões, cards, inputs — sólidos.
10. **Densidade adaptada ao contexto.** Marketing/landing é generoso (`--space-12` a `--space-20`). Dashboards e listagens são densos (`--space-3` a `--space-4`).

---

## 2. Tokens

Todos vivem em `tokens.css` (raiz do projeto), importado uma vez no `index.html` antes de qualquer outro CSS.

### 2.1 Cores — superfícies

```css
--surface-base:    #0c0c0d;   /* fundo da página */
--surface-raised:  #111113;   /* cards, painéis */
--surface-overlay: #16161a;   /* modais, dropdowns, hover de feature */
```

Hierarquia de 3 níveis. Mais que isso vira ruído. **Não criar** `--surface-extra`, `--surface-deep`, etc.

### 2.2 Cores — bordas

```css
--border-subtle:  rgba(255,255,255,0.04);   /* divisores internos quase invisíveis */
--border-default: rgba(255,255,255,0.10);   /* cards, inputs */
--border-strong:  rgba(255,255,255,0.18);   /* hover, focus */
```

Alpha-on-white sobrevive a qualquer fundo. Hex de cinza não.

### 2.3 Cores — texto

```css
--text-primary:   #f2f2f3;   /* títulos, dados importantes */
--text-secondary: #9a9aa3;   /* corpo, descrições */
--text-tertiary:  #6a6a74;   /* labels, eyebrows, mono */
--text-faint:     #43434c;   /* placeholders, disabled */
```

Quatro níveis de hierarquia. Use `--text-secondary` como default de corpo, não `--text-primary`. `--text-primary` é pra títulos e dados que precisam pular.

### 2.4 Cor — marca

```css
--accent:        #7aa2ff;   /* lavanda-azul, default */
--accent-strong: #3b82f6;   /* mais saturado, usos secundários (focus ring forte, links inline) */
--accent-warm:   #e8e0d0;   /* cor neutra-quente para serifa itálica em headlines */
```

`--accent` é a cor primária. Usar para: marca, links principais, hover de CTA primário, focus ring.
`--accent-strong` é uma alternativa quando `--accent` parecer fraco demais (ex: contra `--surface-overlay`).
`--accent-warm` é específico do nosso pattern de italic serif — **não usar como cor de UI**.

**Não usar:** roxo, verde, amarelo, vermelho como cores de marca. Os três tokens acima são tudo o que tem.

### 2.5 Cores — status

```css
--status-success: #22c55e;   /* aprovado, em dia */
--status-warning: #f59e0b;   /* atenção, pendente */
--status-danger:  #ef4444;   /* atraso, reprovado, crítico */
--status-info:    #3b82f6;   /* informativo, em análise */
```

Status colors aparecem **só** em contextos semânticos: badges de status, indicadores de obra, alertas. Nunca como cor de UI genérica. Um botão primário **não** é `--status-info`.

### 2.6 Tipografia — famílias

```css
--font-sans:  "Inter Tight", ui-sans-serif, system-ui, sans-serif;
--font-serif: "Instrument Serif", Georgia, "Times New Roman", serif;
--font-mono:  "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

Três famílias, três papéis distintos:

- **`--font-sans` (Inter Tight):** default. Body, UI, headlines. Pesos 400 / 500 / 600.
- **`--font-serif` (Instrument Serif italic):** **só** para ênfase em palavras-chave de headlines. Aplicar via `.s` classe (ver §3.4). Peso 400, sempre italic.
- **`--font-mono` (JetBrains Mono):** eyebrows, kickers, IDs técnicos, códigos de insumo, números tabulares. Pesos 400 / 500. Aplicar via `.mono` classe.

**Não introduzir** uma quarta família sem revisar o DS.

### 2.7 Tipografia — escala

```css
--text-xs:   12px / 1.4;   /* eyebrows, mono pequeno */
--text-sm:   14px / 1.5;   /* labels, links de nav */
--text-base: 15px / 1.55;  /* corpo padrão de UI */
--text-md:   17px / 1.55;  /* lede, corpo de hero/CTA */
--text-lg:   19px / 1.55;  /* lede maior */
--text-xl:   22px / 1.3;   /* h3 de feature */
--text-2xl:  28px / 1.15;  /* h2 de seção (mobile) */

/* Headlines fluidas via clamp (não viram tokens fixos) */
/* h1 hero:    clamp(48px, 7vw, 104px), line-height 1.02, letter-spacing -0.04em */
/* h2 cta:     clamp(40px, 5.2vw, 72px), line-height 1.02, letter-spacing -0.035em */
/* h2 feature: clamp(28px, 3.4vw, 44px), line-height 1.1, letter-spacing -0.025em */
```

Headlines grandes não são tokens — são `clamp()` inline porque cada seção tem ratio próprio. Tokens cobrem tipografia de UI/corpo.

### 2.8 Espaçamento

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
--space-32:  128px;
```

Escala de 4px. **Use generoso em marketing** (`--space-12` a `--space-24`). **Use denso em UI operacional** (`--space-3` a `--space-4`). Nunca misture os dois no mesmo container.

### 2.9 Raios

```css
--radius-none: 0;        /* default — containers, cards, inputs */
--radius-sm:   2px;      /* tags, badges */
--radius-pill: 999px;    /* botões, nav-cta, pills */
```

Default é zero. **Botões são pill.** Tags/badges podem ter 2px. **Não introduzir** `--radius-md`, `--radius-lg`, etc. — não cabem no DS.

### 2.10 Motion

```css
--motion-fast:  120ms;   /* hover, focus, micro-interações */
--motion-base:  200ms;   /* transitions de estado */
--motion-slow:  320ms;   /* entrada de modais, drawers */
--motion-reveal: 700ms;  /* reveal-on-scroll */

--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

Motion default: `--motion-base` + `--ease-out`. Reveals usam `--motion-reveal`. **Zero bounce, zero elastic.**

Sempre respeitar `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

### 2.11 Efeitos

```css
--glow-accent: radial-gradient(closest-side, rgba(122,162,255,0.10), transparent 70%);
```

Único efeito permitido em background. Aplicar em um `<div className="glow" aria-hidden>` fixed no canto, blur ~8px. **Não** colocar glow em cards, botões ou painéis de UI.

---

## 3. Componentes — anatomia

### 3.1 Botões

Três tamanhos × dois estilos. Sempre pill.

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-2);
  padding: 14px 22px;
  font: 500 var(--text-base) var(--font-sans);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  background: transparent;
  border-radius: var(--radius-pill);
  transition: border-color var(--motion-base) var(--ease-out),
              background var(--motion-base) var(--ease-out);
}
.btn:hover { border-color: var(--border-strong); background: var(--surface-overlay); }

.btn-primary {
  background: var(--text-primary);   /* sim, fica branco no dark — alto contraste intencional */
  color: var(--surface-base);
  border-color: var(--text-primary);
}
.btn-primary:hover {
  background: var(--accent);
  color: var(--surface-base);
  border-color: var(--accent);
}

.btn-sm  { padding: 9px 16px; font-size: var(--text-sm); }
.btn-lg  { padding: 16px 28px; font-size: var(--text-md); }
```

**Regras:**
- Botão primário é claro sobre dark. Dois primários na mesma seção é erro — sempre 1 primário + 1 ghost.
- Botão com seta (`<Arrow />`) tem a seta animada no hover (`transform: translateX(4px)`).
- Loading state: trocar conteúdo por spinner mono (não desabilitar visualmente; manter dimensões).
- Disabled: `opacity: 0.5; cursor: not-allowed;` — sem mudança de cor.

### 3.2 Links de navegação

```css
.nav-link {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  transition: color var(--motion-fast) var(--ease-out);
}
.nav-link:hover { color: var(--text-primary); }

.nav-cta {  /* ver §3.1, equivale a .btn-primary em tamanho sm */ }
```

### 3.3 Eyebrow (mono pequena com dot ou hífen)

Padrão visual de "categoria/contexto" antes de um headline. Sempre mono.

```html
<span className="eyebrow mono">Em pré-lançamento · rede profissional</span>
```

```css
.eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-3);
  font: 500 var(--text-xs) var(--font-mono);
  color: var(--text-tertiary);
  letter-spacing: 0.02em;
}
.eyebrow::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(122,162,255,0.12);
}
```

Variante `kicker` (similar mas com hífen em vez de dot) usa o mesmo padrão tipográfico.

### 3.4 Pattern: italic-serif emphasis

**A assinatura visual do EngeHub.** Headlines em sans + uma única palavra-chave em serifa itálica.

```html
<h1>O hub da <span className="s">engenharia</span> brasileira.</h1>
<h2>Quatro formas de fazer sua engenharia <span className="s">acontecer</span>.</h2>
<h3>Vagas que pedem <span className="s">sua</span> engenharia.</h3>
```

```css
.s {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--accent-warm);   /* tom quente sutil, não accent */
  letter-spacing: -0.02em;
}
```

**Regras:**
- **Uma palavra por headline.** Duas palavras serifadas viram poluição.
- Não destacar palavras genéricas (`do`, `de`, `que`). Destacar substantivos/verbos significativos: `engenharia`, `sua`, `acontecer`, `perfil`, `parceiros`.
- A cor `--accent-warm` é específica desse pattern. Não usar em UI fora dele.

### 3.5 Cards (feature, insumo, projeto, etc.)

```css
.card {
  background: var(--surface-base);
  padding: var(--space-10) var(--space-9);  /* generoso em marketing; ajustar para denso em UI */
  border-radius: var(--radius-none);
  transition: background var(--motion-base) var(--ease-out);
}
.card:hover { background: var(--surface-raised); }
```

Em grids, usar `gap: 1px` + `background: var(--border-subtle)` no container pai (cria divisor sem precisar de borda explícita por card).

### 3.6 Brand mark

```html
<div className="brand-mark" aria-hidden>
  <svg width="10" height="10" viewBox="0 0 10 10">
    <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" />
    <rect x="3" y="3" width="4" height="4" fill="currentColor" />
  </svg>
</div>
```

```css
.brand-mark {
  width: 22px; height: 22px;
  display: grid; place-items: center;
  border: 1px solid var(--text-faint);
  color: var(--accent);   /* SVG herda via currentColor */
}
```

Container quadrado com borda de 1px sutil. SVG interno em accent. Sem padding extra.

### 3.7 Nav sticky

```css
.nav {
  position: sticky; top: 0; z-index: 40;
  background: rgba(12,12,13,0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-subtle);
}
```

Backdrop blur cria continuidade visual ao rolar. Borda inferior em `--border-subtle` (quase invisível).

---

## 4. Anatomia de telas

### 4.1 Padrão landing (página pública)

- `glow` decorativo em fixed, top-left
- `nav` sticky (brand + 3-4 links + 1 cta)
- `<main>` com seções:
  - Hero textual (eyebrow → h1 → lede → CTAs → foot mono)
  - Features (h2 centralizada → grid 2×2 ou 4×1 de cards)
  - CTA (kicker → h2 → p → 2 botões → nota mono)
- `footer` minimal (brand + 4 links mono)

**Cobertura:** `landing v3` (`HomePage.tsx`).

### 4.2 Padrão auth (LoginPage, RegisterPage) — Fase 2

- Fundo: `--surface-base` com `glow` decorativo (mesmo padrão da landing).
- Container central: `max-width: 440px`, centralizado vertical e horizontalmente.
- Brand mark + wordmark no topo (link para `/`).
- Headline curto (`Entrar` / `Criar perfil`) com eventual italic-serif.
- Form: inputs sharp, label mono em cima, espaçamento generoso, foco visível com `--accent`.
- CTA primário pill ocupando largura total do form.
- Link secundário mono pra trocar de modo (`Não tem conta? Criar perfil →`).

### 4.3 Padrão dashboard / app autenticado — Fase 3

- Layout shell: sidebar fina à esquerda (logo + nav vertical + perfil compacto no rodapé) ou top-nav densa.
- Conteúdo principal em `--surface-base` com `--space-6` de padding.
- Cards de métricas em `--surface-raised` com bordas em `--border-default`.
- Tabelas/listagens densas: `--space-3` padding, mono em IDs e timestamps, status colors em badges.
- Headings de seção usam `--text-xl` e `--text-2xl`, **sem** italic-serif (a serifa é signature de marketing/auth, não de UI operacional).

---

## 5. Acessibilidade

Não negociável.

- **Contraste:** `--text-primary` sobre `--surface-base` atende AAA (>14:1). `--text-secondary` atende AA. `--text-tertiary` é só pra texto pequeno (mono ≤14px) — verifique caso a caso.
- **Foco visível:** sempre. Token `:focus-visible { outline: 1px solid var(--accent); outline-offset: 3px; }` é o default global em `tokens.css`. Componentes com background colorido podem precisar de `outline-color: var(--text-primary)` localmente.
- **Hierarquia de headings:** uma `h1` por página, `h2` por seção, `h3` por subseção. Nunca pular níveis.
- **`prefers-reduced-motion`:** todo `.reveal`, hover translate, animação contínua, deve respeitar. Token padrão em `tokens.css`.
- **Navegação por teclado:** todo CTA, link, tab, menu deve ser alcançável via `Tab`. `Enter` ativa.
- **Texto via texto, não via imagem:** wordmark "engehub." é texto puro com `<span class="brand-dot">.</span>` em accent — não é PNG/SVG.
- **`aria-hidden`:** decorativos (glow, brand-mark redundante com texto, divisores) recebem.
- **Botões disabled:** `aria-disabled="true"` em vez de só `disabled` quando o botão precisa permanecer focável (ex: tooltip explicando porque está desabilitado).

---

## 6. Don'ts

Compilação dos erros que matam o DS.

| ❌ Errado | ✅ Certo |
|----------|----------|
| `border-radius: 8px` em card | `--radius-none` (sharp) |
| `border-radius: 4px` em botão | `--radius-pill` (999px) |
| Duas cores de marca (azul + laranja) | Uma só (`--accent`) |
| `box-shadow: 0 4px 12px rgba(0,0,0,0.3)` em card | Nenhuma sombra; usar `--surface-raised` se precisar elevação |
| `linear-gradient(...)` em botão | Cor sólida |
| Métricas inventadas em hero | Sem dashboard ou rótulo claro de exemplo |
| Headline 100% serifada | Sans com 1 palavra serifada (`.s`) |
| `color: #888` em texto secundário | `--text-secondary` |
| `transition: all 0.5s` | `--motion-base` + propriedade específica |
| `bounce`, `cubic-bezier(0.6, ..., 1.6, ...)` | `--ease-out` |
| Dois botões primários adjacentes | Um primário + um ghost |
| `font-family: Roboto` em uma página | Sempre as 3 famílias do DS |

---

## 7. Migração das telas existentes (faseamento)

| Fase | Arquivos | Foco | Status |
|------|---------|------|--------|
| 1 | `tokens.css`, `index.html`, `HomePage.tsx`, `HomePage.css`, `docs/design-system.md` | Infraestrutura + landing | **Em execução** (2026-04-25) |
| 2 | `LoginPage.tsx`, `RegisterPage.tsx` | Front door | Aguardando aprovação da Fase 1 |
| 3 | `Layout.tsx`, `DashboardContent.tsx` | Esqueleto + tela mais usada | Pendente |
| 4 | `ProfilePage.tsx`, `ServicesPage.tsx`, `OpportunitiesPage.tsx`, `CoursesPage.tsx`, `MessagesPage.tsx`, `EventsPage.tsx`, `NewsPage.tsx`, `Footer.tsx`, modais (`EngineeringOnboardingModal`, `EventModal`, `PublishOpportunityModal`), `EngineeringSelector.tsx` | Conteúdo + utilitários | Pendente |

Cada fase tem sua spec datada em `docs/superpowers/specs/`. Cada fase tem seu plano em `docs/superpowers/plans/`. **Nenhuma fase começa sem revisão da anterior.**

---

## 8. Próximas decisões em aberto

Itens que vão precisar de decisão à medida que o app cresce. Documentar aqui pra não esquecer.

- **Light theme:** ainda não existe. Quando vier, replicar todos os tokens com prefixo `--light-*` ou usar `prefers-color-scheme`. Fica decidido em Fase 5+.
- **Tabela densa (DataGrid):** patterns de tabela ainda não existem. Quando criarmos a primeira tela autenticada com tabela (provavelmente OpportunitiesPage na Fase 4), padronizar aqui.
- **Charts:** ainda sem padrão. Quando precisar, escolher 1 lib (Recharts ou ECharts) e padronizar paleta com status colors do DS.
- **Form inputs:** existem hoje em `RegisterPage` mas no estilo antigo (Tailwind, light, rounded-2xl). Reescrever em Fase 2 e formalizar aqui.
- **Toasts / notificações:** sem padrão. Definir quando precisar (provavelmente Fase 3 quando dashboard tiver feedback de ações).

---

## 9. Referências

- Research doc original (já obsoleto, mas útil como contexto): `engehub-design-system-research.md` (compartilhado em conversa, não está versionado)
- Inspiração editorial: páginas atuais de Vercel, Linear, Anthropic.
- Inspiração italic-serif emphasis: Stripe (em alguns hero blocks), Apple keynote slides.
- Tokens base: Radix Colors (escala de 12 steps), Geist tokens (Vercel).
