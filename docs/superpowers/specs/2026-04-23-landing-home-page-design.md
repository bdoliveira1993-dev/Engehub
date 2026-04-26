# Landing / Home page do EngeHub — Design

> ⚠ **DESCONTINUADO em 2026-04-25.** Esta v1 (estética light slate-50, cantos arredondados, mockup de oportunidade) foi implementada e rodou em produção brevemente. Substituída pela v3 editorial-minimal — ver [2026-04-25-landing-home-v3-editorial-minimal.md](./2026-04-25-landing-home-v3-editorial-minimal.md). Mantida como referência histórica.

**Data:** 2026-04-23
**Autor:** Bruna O. + Claude
**Status:** Implementado (v1). Substituído por v3.

## Contexto

Hoje a rota `/` do EngeHub renderiza diretamente o `LoginPage` (Google OAuth). Isso obriga qualquer visitante deslogado a começar pela autenticação, sem oportunidade de entender a proposta do app. O objetivo desta mudança é:

1. Criar uma página inicial pública (`/`) que apresente o EngeHub.
2. Colocar CTAs claros de **Cadastrar** e **Entrar**.
3. Comunicar o posicionamento: conectar engenheiros a oportunidades que vão além do modelo CLT — prestação de serviço, consultoria, projetos, elaboração de propostas, clientes e parcerias de negócio.

A identidade visual existente (Tailwind via CDN, Inter, `blue-600` + slate, cantos muito arredondados, pesos `font-black`/`font-bold`) deve ser preservada — a landing herda o sistema visual do `LoginPage`, `RegisterPage` e `Footer`.

## Escopo

**Dentro do escopo:**
- Nova rota `/` pública com o componente `HomePage`.
- Mover `LoginPage` de `/` para `/login`.
- Ajustar redirecionamentos no `App.tsx` para usuários autenticados e rota fallback.
- Reaproveitar `Footer` existente.

**Fora do escopo (outras tarefas):**
- Conectar o `RegisterPage` ao Supabase (hoje o `onRegister` não cria usuário).
- Internacionalização.
- Conteúdo dinâmico (depoimentos reais, contadores vindos do banco).
- Testes automatizados de UI.

## Arquitetura e roteamento

Mudanças em [App.tsx](../../../App.tsx):

```tsx
<Routes>
  <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage />} />
  <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={() => {}} onSwitchMode={() => {}} />} />
  <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage onRegister={() => navigate('/login')} onSwitchMode={() => navigate('/login')} />} />

  {/* rotas autenticadas permanecem idênticas */}

  <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
</Routes>
```

Novo componente: `components/HomePage.tsx`. Single-file, autossuficiente, sem props — usa `useNavigate` do `react-router-dom` para os CTAs.

Sem alterações em: `ProtectedRoute`, `Layout`, `Footer`, `lib/supabase.ts`, `types.ts`.

## Estrutura do HomePage

Quatro blocos verticais, nessa ordem:

### 1. Navbar pública (topo)

- Altura `h-16`, largura total, container interno `max-w-6xl`.
- Esquerda: logo EngeHub — ícone `Globe` em tile `bg-blue-600` arredondado + wordmark "EngeHub" (`font-black`).
- Direita (desktop): link **Entrar** (texto, hover azul) + botão **Cadastrar** (sólido `bg-blue-600`, `rounded-2xl`).
- Direita (mobile): só o botão **Cadastrar**; "Entrar" colapsa para dentro de um menu (`Menu` icon do lucide) ou vira o link secundário abaixo do CTA principal no hero.
- Fundo: `bg-white/80 backdrop-blur border-b border-slate-100` (fixa no topo).

### 2. Hero em 2 colunas

**Coluna esquerda (texto + CTAs):**
- Pílula superior: ícone `HardHat` + texto "Rede profissional de engenharia" (`text-xs font-bold uppercase tracking-widest`, `bg-blue-50 text-blue-700 rounded-full`).
- Headline: *"Conecte sua engenharia a oportunidades que vão além do formal."* — `text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]`.
- Subheadline: *"Encontre vagas, feche projetos, ofereça consultoria, elabore propostas e descubra parceiros de negócio — tudo em um só hub."* — `text-lg text-slate-500 leading-relaxed font-medium`.
- Par de CTAs (flex, gap-3):
  - **Cadastrar** → `navigate('/register')`. `bg-blue-600 text-white font-bold rounded-2xl px-6 py-4 shadow-xl shadow-blue-100 hover:bg-blue-700`, ícone `ArrowRight`.
  - **Entrar** → `navigate('/login')`. Outline: `border-2 border-slate-200 text-slate-700 font-bold rounded-2xl px-6 py-4 hover:border-blue-600 hover:text-blue-600`.
- Linha de prova social discreta abaixo dos CTAs: pequenos ícones + texto "Todas as engenharias num só lugar" em `text-xs font-bold text-slate-400 uppercase tracking-widest`.

**Coluna direita (mockup flutuante):**
- Card branco `rounded-[32px]`, sombra `shadow-2xl shadow-slate-200`, rotação sutil `rotate-2`, com:
  - Header: círculo cinza (placeholder de avatar) + nome fictício "Ana Martins, PE" + tag de especialidade "Engenharia Civil" (`bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 text-[10px]`).
  - Corpo: bloco tipo "oportunidade aberta": título "Consultoria — Laudo estrutural", linha com valor estimado e prazo, botão secundário "Enviar proposta".
- Segundo card menor posicionado atrás com `absolute`, deslocado (`-bottom-6 -left-8`), contendo contador fictício: "+240 engenheiros conectados hoje" com ícone `Users`.
- Gradiente radial azul muito sutil atrás dos cards (via `bg-gradient-to-br from-blue-50 to-transparent blur-3xl`) para profundidade sem asset externo.

### 3. Seção "O que você encontra"

- Fundo `bg-white` (quebra visual do `bg-slate-50`), `py-20`.
- Eyebrow: "POR QUE ENGEHUB" (`text-xs font-black uppercase tracking-[0.3em] text-blue-600`).
- Título da seção: "Mais do que vagas. Um hub de negócios." (`text-3xl md:text-4xl font-black text-slate-900`).
- Subtítulo curto (1 linha, `text-slate-500`).
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.
- Cada card (`bg-slate-50 border border-slate-100 rounded-[28px] p-6 hover:-translate-y-1 hover:shadow-xl transition-all`):
  - Tile de ícone `w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100`.
  - Título `text-lg font-black text-slate-900`.
  - Descrição `text-sm text-slate-500 font-medium leading-relaxed`.

Os 4 cards:

| # | Título                   | Ícone       | Descrição                                                                          |
|---|--------------------------|-------------|------------------------------------------------------------------------------------|
| 1 | Vagas efetivas           | `Briefcase` | Posições fixas em empresas que valorizam a sua especialidade.                      |
| 2 | Serviços & consultoria   | `Lightbulb` | Ofereça expertise por demanda e feche contratos sob medida.                        |
| 3 | Projetos sob demanda     | `HardHat`   | Participe de projetos pontuais e amplie seu portfólio técnico.                     |
| 4 | Parcerias e clientes     | `Handshake` | Encontre sócios, clientes e redes de negócio fora do modelo tradicional.           |

### 4. CTA final + Footer

- Faixa `py-16 bg-slate-50`, container centralizado com `max-w-3xl text-center`:
  - Título: "Pronto pra encontrar sua próxima oportunidade?" (`text-3xl md:text-4xl font-black`).
  - Subtítulo: linha curta incentivando o cadastro.
  - Botão grande: **Cadastre-se grátis** → `navigate('/register')`.
- `Footer` existente é reaproveitado logo abaixo — sem alterações.

## Sistema visual e responsividade

**Paleta:** `blue-600` (primário), `blue-50` / `blue-100` (fundos suaves), `slate-50` / `slate-100` / `slate-400` / `slate-500` / `slate-900`.

**Tipografia:** Inter, pesos `font-black` (títulos, labels), `font-bold` (CTAs, nomes), `font-medium` (corpo).

**Raio:** `rounded-2xl` em CTAs, `rounded-[28px]`/`rounded-[32px]` em cards, `rounded-full` em pílulas.

**Espaçamento vertical:** navbar `h-16` → hero `py-20 md:py-28` → seção branca `py-20` → CTA `py-16` → Footer.

**Breakpoints (Tailwind padrão):**
- **Mobile (<768px):** navbar compacta (só logo + Cadastrar); hero 1 coluna (texto, depois mockup sem rotação); CTAs largura total; cards em 1 coluna.
- **Tablet (768–1024px):** hero 2 colunas com mockup menor; cards 2×2.
- **Desktop (≥1024px):** layout completo descrito acima.

**Container:** `max-w-6xl mx-auto px-6 md:px-8`.

## Acessibilidade

- Botões apenas com ícone recebem `aria-label`.
- Hierarquia: `h1` no hero, `h2` na seção "O que você encontra" e CTA final, `h3` nos cards.
- Foco visível: `focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2` em botões e links de navegação.
- `prefers-reduced-motion`: elementos animados (`animate-in`, `rotate-2`, hover translate) usam classes Tailwind que respeitam `motion-reduce:` — adicionar `motion-reduce:transform-none motion-reduce:transition-none` onde aplicável.
- Contraste: azul-600 sobre branco já atende AA.
- Navegação por teclado: tab order natural (top → bottom, left → right).

## Microanimações

- Hero: `animate-in fade-in slide-in-from-bottom-4 duration-700` (mesmo padrão do LoginPage).
- Cards de feature: `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`.
- Botão primário: `hover:bg-blue-700 hover:shadow-2xl transition-all`.
- Card mockup: rotação estática `rotate-2`, sem animação contínua.
- Sem carrossel, parallax ou bibliotecas de animação extra.

## Dependências

Zero novas dependências. Ícones usados (todos já disponíveis no `lucide-react` instalado):

`Globe`, `HardHat`, `Briefcase`, `Lightbulb`, `Handshake`, `ArrowRight`, `Users`, `Menu`.

## Arquivos afetados

| Arquivo                          | Mudança                                                          |
|----------------------------------|------------------------------------------------------------------|
| `App.tsx`                        | Importa `HomePage`; adiciona `/login`; `/` vira `<HomePage />`; adiciona guardas de autenticado em `/`, `/login`, `/register`. |
| `components/HomePage.tsx`        | **Novo** — landing pública completa.                             |

Nenhum outro arquivo é modificado.

## Critérios de aceite

1. Visitante deslogado que acessa `/` vê a landing (não o login).
2. Botão **Cadastrar** leva para `/register`.
3. Botão **Entrar** leva para `/login` e o `LoginPage` atual aparece lá sem regressão.
4. Usuário autenticado que acessa `/`, `/login` ou `/register` é redirecionado para `/dashboard`.
5. Layout em desktop, tablet e mobile está íntegro (hero, cards 4/2/1, navbar adaptada).
6. Footer renderiza na landing.
7. Todos os CTAs têm foco visível via teclado.
8. Nenhuma regressão nas rotas autenticadas existentes.

## Riscos e observações

- **Tailwind via CDN:** o projeto usa `cdn.tailwindcss.com` no `index.html`, então não há build-time purge. Classes arbitrárias (`rounded-[28px]`, `rounded-[32px]`) funcionam sem configuração adicional, como já é feito em `LoginPage`.
- **RegisterPage desconectado do Supabase:** conhecido, fora do escopo desta spec. O CTA levará o usuário a um formulário que hoje não persiste o cadastro — ficará documentado como próxima tarefa.
- **`LoginPage` espera props `onLogin` e `onSwitchMode`:** manteremos no-ops no wrapper da rota `/login` (como já é feito hoje em `/`). Refatorar a tipagem está fora de escopo.
- **Sem dark mode:** o projeto não tem tema escuro hoje; a landing também não precisa implementá-lo.
