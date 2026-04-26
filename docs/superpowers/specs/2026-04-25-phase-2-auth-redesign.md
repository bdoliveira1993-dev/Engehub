# Fase 2 — Auth (LoginPage + RegisterPage) — Design

**Data:** 2026-04-25
**Pré-requisito:** Fase 1 entregue ([landing v3](./2026-04-25-landing-home-v3-editorial-minimal.md), [tokens.css](../../../tokens.css), [docs/design-system.md](../../design-system.md))
**Status:** Em execução — aplicar DS §4.2 (Padrão auth) nas duas telas.

## Objetivo

Restyle visual das duas telas de auth para alinhar ao novo Design System. Sem mudança funcional: Google OAuth continua sendo o único método de login; formulário de cadastro mantém os 4 campos existentes; o bug pré-existente `RegisterPage` ↔ Supabase **não é resolvido** nesta fase (separado em task futura).

## Escopo

**Toca:**
- `components/LoginPage.tsx` — reescrever
- `components/RegisterPage.tsx` — reescrever
- `components/Auth.css` — criar (CSS compartilhado entre as duas)

**Não toca:**
- `App.tsx` — interface das props (`onLogin`, `onSwitchMode`, `onRegister`, `onSwitchToLogin`) preservada
- `lib/supabase.ts` — sem mudanças
- `EngineeringSelector.tsx`, `EngineeringOnboardingModal.tsx` — fora do fluxo de auth direto, ficam pra Fase 3/4 se necessário

## Decisões

1. **LoginPage continua Google-OAuth-only** — sem adicionar email+senha. Refatorar fluxo de login é tarefa separada se vier.
2. **RegisterPage mantém 4 campos** — Nome, E-mail, Especialidade, Senha. Mesma estrutura de dados (`EngineeringType` enum em `types.ts`).
3. **RegisterPage NÃO grava no Supabase** — bug pré-existente, fora de escopo aqui.
4. **Italic-serif emphasis:** `Criar <span class="s">perfil</span>.` no Register. Login mantém `Entrar` (uma palavra só, sem necessidade de ênfase).
5. **Google button colorido sobre fundo dark** — preserva convenção OAuth (logo do Google é exigido pela própria Google nas brand guidelines).
6. **Brand mark no topo de cada página** vira link para `/`.
7. **Body dark** quando qualquer auth page está montada (regra `body:has(.auth-shell)` em `Auth.css`, mesmo padrão do `body:has(.home-shell)` da Fase 1).
8. **Switch entre modos:** `LoginPage` mostra `Não tem conta? Criar perfil →` em mono pequeno; `RegisterPage` mostra `Já é da rede? Entrar →`.

## Estrutura visual (DS §4.2)

```
┌─────────────────────────────────────────┐
│  [glow ambient — top-left]              │
│                                         │
│        ╭───────────────────────╮        │
│        │                       │        │
│        │   ▣ engehub.          │        │  ← brand → link para /
│        │                       │        │
│        │   Entrar              │        │  ← h1
│        │   Acesse seu hub.     │        │  ← lede curta
│        │                       │        │
│        │   [erro, se houver]   │        │
│        │                       │        │
│        │   [G  Entrar com Goog]│        │  ← btn outline
│        │                       │        │
│        │   Não tem conta?      │        │  ← switch link mono
│        │   Criar perfil →      │        │
│        │                       │        │
│        │   LGPD note           │        │  ← rodapé mono pequeno
│        ╰───────────────────────╯        │
│                                         │
└─────────────────────────────────────────┘
   Container max-width 440px, centralizado
   vertical (flex) e horizontal (margin auto)
```

`RegisterPage` tem o mesmo wrapper, com formulário no lugar do botão Google.

## Anatomia dos componentes

### Page shell
- `<div class="auth-shell">` — fundo `--surface-base`, `min-height: 100vh`, flex column centralizado, padding generoso (`var(--space-12)` mobile / `var(--space-16)` desktop).
- `<div class="glow" aria-hidden>` — mesmo glow da home.
- `<a class="auth-brand" href="/">` — brand mark + wordmark, decorativo + link.

### Form fields (RegisterPage)
- `<div class="field">`
  - `<label class="field-label mono">` — caps mono pequena, `--text-tertiary`.
  - `<input class="field-input">` ou `<select class="field-select">` — fundo `--surface-raised`, borda 1px `--border-default`, sharp (radius 0), padding `var(--space-4)`, focus → borda em `--accent`.
- Erros via `<small class="field-error">` em `--status-danger`.

### Auth CTA (primário)
- `<button class="btn btn-primary">` — pill, full-width dentro do form.

### Google OAuth button
- `<button class="btn btn-google">` — pill, fundo `--surface-raised`, borda 1px `--border-default`, full-width.
- Logo colorido do Google à esquerda + texto `Entrar com Google`.
- Hover: borda `--border-strong`, fundo `--surface-overlay`.
- Loading: substitui logo por spinner SVG inline (sem lucide-react).

### Switch link
- `<p class="auth-switch mono">` — texto pequeno mono, `--text-tertiary`. Pergunta + link sublinhado em `--accent`.

### LGPD note
- `<small class="auth-lgpd mono">` — `--text-faint`, `--text-xs`, mono.

## Acessibilidade

- `<a class="auth-brand">` recebe `aria-label="Voltar para a página inicial"` (o brand mark é decorativo).
- `<form>` com `aria-describedby` apontando para erro genérico, se houver.
- Inputs com `aria-required` e `aria-invalid` quando apropriado.
- Labels conectados via `htmlFor`.
- Foco visível: token global em `tokens.css` cobre.
- `prefers-reduced-motion`: animação de entrada (`animate-in fade-in slide-in-from-bottom`) **removida** desta fase — clean state, sem animação. Pode voltar quando o DS formalizar pattern de motion para auth.

## Critérios de aceite

1. `/login` mostra o novo layout dark editorial-minimal.
2. `/register` idem, com formulário em estilo sharp inputs.
3. Brand mark no topo de ambas leva à `/` (página inicial).
4. CTAs preservam comportamento atual:
   - Login: Google OAuth funciona (chama `supabase.auth.signInWithOAuth`).
   - Register: submit chama `onRegister` (que em App.tsx hoje navega para `/login` — mantém comportamento bugado por escopo).
5. Foco visível por teclado em todos os campos e botões.
6. `prefers-reduced-motion`: nenhuma animação visível.
7. Layout em 375 / 768 / 1280 sem overflow nem texto cortado.
8. `console` limpo, sem warnings novos.
9. Sem regressão em `/`, `/dashboard` ou outras rotas.
10. `tokens.css` continua sendo a única fonte de cor/spacing — zero hex hard-coded em `Auth.css`.

## Riscos e observações

- **Bug RegisterPage → Supabase:** continua presente. Submit do form gera log mas não cria usuário. Documentar como TODO de Fase 3 ou Fase pós-MVP.
- **Google logo brand guidelines:** mantenho o logo multicolor — a Google exige isso em integrações OAuth. Se a usuária quiser monocromático, precisa documentar em desvio de brand guidelines.
- **EngineeringType enum:** atualmente tem 7 valores (`Civil`, `Elétrica`, `Mecânica`, `Química`, `Produção`, `Computação`, `Ambiental`). Outras telas (especialmente landing v3) mencionam mais disciplinas; alinhar virou backlog.
- **Continuidade visual:** quando a usuária clica `Entrar com Google` no Login, o redirect leva pra OAuth do Google (tela do Google, fora do nosso controle), depois volta para `/dashboard` (Fase 3, ainda light). Há um salto visual nesse fluxo — esperado, será resolvido na Fase 3.
