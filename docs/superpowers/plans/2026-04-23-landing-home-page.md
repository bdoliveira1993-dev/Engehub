# Landing / Home Page do EngeHub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a rota `/` (hoje `LoginPage`) por uma landing page pública com CTAs **Cadastrar** e **Entrar**, comunicando que o EngeHub vai além de vagas formais — cobrindo também serviços, consultoria, projetos e parcerias.

**Architecture:** Um novo componente `components/HomePage.tsx` (single-file, autossuficiente) renderiza quatro blocos verticais (navbar, hero em 2 colunas, seção de features com 4 cards, CTA final) reutilizando o `Footer` existente. O `App.tsx` é ajustado pra servir `HomePage` em `/`, mover o `LoginPage` atual pra `/login`, e redirecionar usuários autenticados pra `/dashboard` a partir das rotas públicas.

**Tech Stack:** React 19, react-router-dom v7, Tailwind CSS (via CDN — suporta classes arbitrárias), lucide-react (ícones), TypeScript. Sem dependências novas.

**Spec:** [../specs/2026-04-23-landing-home-page-design.md](../specs/2026-04-23-landing-home-page-design.md)

**Observações de contexto:**
- O projeto **não é um repositório git**, portanto não há commits entre tarefas. Os pontos de verificação são funcionais/visuais: rodar `npm run dev` e validar no navegador.
- **Não há infraestrutura de testes automatizados**; a spec declara testes fora de escopo. Cada tarefa encerra com verificação manual.
- Tailwind é carregado via `cdn.tailwindcss.com` no `index.html`, então classes arbitrárias (`rounded-[28px]`, `shadow-blue-100`) funcionam sem configuração extra — o padrão já é usado em `LoginPage.tsx` e `Footer.tsx`.
- Existe uma inconsistência pré-existente em [App.tsx:97](../../../App.tsx#L97): a rota `/register` passa `onSwitchMode` mas `RegisterPage` espera `onSwitchToLogin`. Corrigimos isso na Task 2 como parte do ajuste de roteamento.

---

## File Structure

| Caminho                                        | Ação     | Responsabilidade                                                                        |
|------------------------------------------------|----------|-----------------------------------------------------------------------------------------|
| [components/HomePage.tsx](../../../components/HomePage.tsx) | Criar    | Landing pública completa (navbar, hero, features, CTA). Usa `useNavigate` para CTAs.    |
| [App.tsx](../../../App.tsx)                    | Modificar| Importar `HomePage`; `/` serve `HomePage`; adicionar rota `/login`; guardas de autenticado. |

Nenhum outro arquivo é tocado.

---

## Task 1: Scaffold do HomePage (esqueleto renderizável)

Objetivo: criar o arquivo `HomePage.tsx` com um esqueleto mínimo que já renderiza texto visível e os dois CTAs funcionais, para podermos fiar o roteamento na Task 2 e depois iterar por cima.

**Files:**
- Create: `components/HomePage.tsx`

- [ ] **Step 1: Criar `components/HomePage.tsx` com o esqueleto inicial**

Conteúdo completo do arquivo:

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main>
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-20">
          <h1 className="text-4xl font-black tracking-tight">EngeHub</h1>
          <p className="mt-4 text-slate-500">Landing page — em construção.</p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl"
            >
              Cadastrar
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl"
            >
              Entrar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
```

- [ ] **Step 2: Verificar que o arquivo compila**

Rodar `npm run dev` (se ainda não estiver rodando).
Esperado: o Vite compila sem erros. A página ainda não está roteada, então não aparece nada novo em `/` — isso é esperado.

---

## Task 2: Wire do roteamento em `App.tsx`

Objetivo: fazer `/` servir `HomePage`, mover o `LoginPage` atual pra `/login`, redirecionar usuários logados pra `/dashboard` a partir das rotas públicas, e corrigir a prop `onSwitchMode` → `onSwitchToLogin` do `RegisterPage`.

**Files:**
- Modify: `App.tsx` (import block + `Routes` JSX)

- [ ] **Step 1: Adicionar import do `HomePage`**

Abrir [App.tsx](../../../App.tsx) e adicionar o import junto aos outros imports de componentes (logo após o import do `LoginPage`):

```tsx
import HomePage from './components/HomePage';
```

- [ ] **Step 2: Substituir o bloco `<Routes>` pelo novo roteamento**

Localizar o bloco existente em [App.tsx:95-117](../../../App.tsx#L95-L117) (começa em `<Routes>` e termina em `</Routes>`) e substituir inteiramente por:

```tsx
<Routes>
  <Route
    path="/"
    element={user ? <Navigate to="/dashboard" replace /> : <HomePage />}
  />
  <Route
    path="/login"
    element={
      user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={() => { }} onSwitchMode={() => { }} />
    }
  />
  <Route
    path="/register"
    element={
      user
        ? <Navigate to="/dashboard" replace />
        : <RegisterPage onRegister={() => navigate('/login')} onSwitchToLogin={() => navigate('/login')} />
    }
  />

  <Route
    element={
      <ProtectedRoute user={user}>
        <Layout user={user} onLogout={handleLogout} />
      </ProtectedRoute>
    }
  >
    <Route path="/dashboard" element={<DashboardContent user={user} onNavigate={(path) => navigate(path)} />} />
    <Route path="/profile" element={<ProfilePage user={user} onUpdateUser={(data) => setUser({ ...user, ...data } as User)} />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/opportunities" element={<OpportunitiesPage />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/messages" element={<MessagesPage />} />
    <Route path="/events" element={<EventsPage />} />
    <Route path="/news" element={<NewsPage user={user} />} />
  </Route>

  <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
</Routes>
```

Mudanças em relação ao código anterior:
- `/` agora renderiza `<HomePage />` (antes era `<LoginPage>`).
- `/login` é nova rota que renderiza `LoginPage`.
- Todas as três rotas públicas (`/`, `/login`, `/register`) redirecionam para `/dashboard` se `user` existir.
- `/register` passa `onSwitchToLogin` (antes: `onSwitchMode`, que não bate com a prop esperada pelo componente). O `onRegister` também aponta para `/login` agora (antes: `/`).
- Rotas autenticadas e fallback `*` permanecem idênticas em comportamento.

- [ ] **Step 3: Verificar manualmente no navegador**

Com `npm run dev` rodando, abrir cada URL e confirmar o comportamento:

| URL              | Deslogado                                   | Logado (se tiver sessão)    |
|------------------|---------------------------------------------|-----------------------------|
| `/`              | Mostra o esqueleto do `HomePage`            | Redireciona pra `/dashboard`|
| `/login`         | Mostra o `LoginPage` (Google OAuth)         | Redireciona pra `/dashboard`|
| `/register`      | Mostra o `RegisterPage` (form de cadastro)  | Redireciona pra `/dashboard`|
| `/rota-invalida` | Redireciona pra `/`                         | Redireciona pra `/dashboard`|

No esqueleto do `HomePage`, clicar em **Cadastrar** deve ir pra `/register` e **Entrar** pra `/login`.

Esperado: todas as verificações passam. Caso `/login` não mostre o LoginPage, verificar que o import e a rota foram inseridos corretamente.

---

## Task 3: Navbar pública

Objetivo: substituir o cabeçalho placeholder do `HomePage` por uma navbar pública com logo à esquerda e CTAs Entrar/Cadastrar à direita, fixa no topo, com `backdrop-blur`.

**Files:**
- Modify: `components/HomePage.tsx`

- [ ] **Step 1: Adicionar imports dos ícones**

Substituir a linha de import de `react` por:

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
```

- [ ] **Step 2: Inserir o componente `Navbar` e renderizá-lo**

Substituir o corpo inteiro do `HomePage` (o `return (...)`) por:

```tsx
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="fixed top-0 inset-x-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto h-16 px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
              <Globe size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">EngeHub</span>
          </div>
          <nav className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Cadastrar
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero e demais seções entram nas próximas tasks */}
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-20">
          <h1 className="text-4xl font-black tracking-tight">EngeHub</h1>
          <p className="mt-4 text-slate-500">Hero — em construção.</p>
        </section>
      </main>
    </div>
  );
};
```

Notas:
- Em mobile (<640px), o link "Entrar" fica oculto (`hidden sm:inline-flex`); o CTA principal "Cadastrar" permanece visível. O botão "Entrar" também aparecerá no hero, garantindo acesso em mobile.
- `main` recebe `pt-16` pra compensar a altura da navbar fixa.

- [ ] **Step 3: Verificar no navegador**

Recarregar `/`. Esperado:
- Navbar fixa no topo, com logo azul EngeHub à esquerda.
- À direita: link "Entrar" (≥640px) + botão "Cadastrar" azul.
- Ao rolar, a navbar mantém o fundo translúcido com leve blur.
- Clicar nos botões navega pras rotas corretas.
- Foco visível ao navegar com Tab.

---

## Task 4: Hero — coluna esquerda (texto e CTAs)

Objetivo: substituir o placeholder do hero pela estrutura de duas colunas (flex/grid). Nesta task preenchemos apenas a coluna esquerda; a direita fica com um bloco vazio a ser preenchido na Task 5.

**Files:**
- Modify: `components/HomePage.tsx`

- [ ] **Step 1: Ampliar os imports de ícones**

Atualizar o import do `lucide-react` para:

```tsx
import { Globe, HardHat, ArrowRight } from 'lucide-react';
```

- [ ] **Step 2: Substituir o `<section>` placeholder pelo hero de 2 colunas**

No corpo do `HomePage`, localizar o `<section>` placeholder dentro do `<main>` e substituir por:

```tsx
<section className="relative overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 md:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
        <HardHat size={14} />
        Rede profissional de engenharia
      </span>

      <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
        Conecte sua engenharia a oportunidades que vão{' '}
        <span className="text-blue-600">além do formal.</span>
      </h1>

      <p className="mt-6 text-lg text-slate-500 leading-relaxed font-medium max-w-xl">
        Encontre vagas, feche projetos, ofereça consultoria, elabore propostas e descubra parceiros de negócio — tudo em um só hub.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-2xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Cadastrar
          <ArrowRight size={18} />
        </button>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center justify-center px-6 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Entrar
        </button>
      </div>

      <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        Todas as engenharias num só lugar
      </p>
    </div>

    <div className="relative h-[420px] lg:h-[460px]">
      {/* Mockup flutuante — preenchido na Task 5 */}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verificar no navegador**

Recarregar `/`. Esperado:
- Desktop (≥1024px): layout 2 colunas. Esquerda com pílula azul, headline grande com "além do formal" em azul, subheadline, dois botões (Cadastrar sólido azul com seta, Entrar outline) e linha de prova social.
- Tablet/mobile: vira 1 coluna (texto em cima; coluna direita vazia aparece embaixo — ficará preenchida na Task 5).
- Clicar nos botões navega corretamente.
- Animação sutil de entrada do bloco esquerdo.
- Foco visível via Tab.

---

## Task 5: Hero — coluna direita (mockup de oportunidade + badge)

Objetivo: preencher a coluna direita com um card mockup flutuante rotacionado e um segundo card menor (badge de "engenheiros conectados") com gradiente sutil de fundo, conforme a spec.

**Files:**
- Modify: `components/HomePage.tsx`

- [ ] **Step 1: Ampliar os imports de ícones**

Atualizar o import do `lucide-react` para:

```tsx
import { Globe, HardHat, ArrowRight, Users, Send } from 'lucide-react';
```

- [ ] **Step 2: Substituir o `<div>` comentado pelo mockup**

Localizar o bloco:

```tsx
<div className="relative h-[420px] lg:h-[460px]">
  {/* Mockup flutuante — preenchido na Task 5 */}
</div>
```

E substituir por:

```tsx
<div className="relative h-[420px] lg:h-[460px]">
  <div
    aria-hidden="true"
    className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-blue-100 to-transparent blur-3xl rounded-full pointer-events-none"
  />

  <div
    aria-hidden="true"
    className="absolute bottom-4 left-0 w-64 bg-white border border-slate-100 rounded-[24px] p-5 shadow-xl shadow-slate-200/60 -rotate-3 motion-reduce:rotate-0 hidden md:block"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <Users size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoje</p>
        <p className="text-sm font-black text-slate-900">+240 engenheiros conectados</p>
      </div>
    </div>
  </div>

  <div
    aria-label="Exemplo de oportunidade publicada no EngeHub"
    role="img"
    className="absolute top-0 right-0 md:right-4 w-full max-w-sm bg-white border border-slate-100 rounded-[32px] p-6 shadow-2xl shadow-slate-200 rotate-2 motion-reduce:rotate-0"
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
        AM
      </div>
      <div className="flex-1">
        <p className="text-sm font-black text-slate-900">Ana Martins, PE</p>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
          Engenharia Civil
        </span>
      </div>
    </div>

    <div className="mt-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Oportunidade aberta</p>
      <p className="mt-1 text-base font-black text-slate-900 leading-tight">
        Consultoria — Laudo estrutural
      </p>
      <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
        <span>R$ 4.800</span>
        <span>Prazo: 15 dias</span>
      </div>
    </div>

    <button
      type="button"
      disabled
      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-100 cursor-default"
    >
      <Send size={16} />
      Enviar proposta
    </button>
  </div>
</div>
```

Notas:
- O botão "Enviar proposta" está `disabled` porque é decorativo — é um mockup, não um CTA real.
- O segundo card (badge de conectados) é marcado com `aria-hidden="true"` e escondido em telas menores que `md` (`hidden md:block`) pra evitar poluição em mobile.
- `motion-reduce:rotate-0` remove a rotação se o usuário pedir movimento reduzido.

- [ ] **Step 3: Verificar no navegador**

Recarregar `/`. Esperado:
- Desktop: card branco grande com cabeçalho "Ana Martins, PE", bloco azul "Oportunidade aberta — Consultoria — Laudo estrutural", valor e prazo, botão azul "Enviar proposta" com ícone de avião. Pequena rotação pra direita. Atrás/abaixo à esquerda, outro card menor com ícone + "+240 engenheiros conectados". Halo azul sutil no fundo.
- Tablet (768–1023px): ambos cards visíveis; layout ainda em 1 coluna (hero texto → mockup).
- Mobile (<768px): apenas o card principal aparece (o badge menor está oculto).
- Se `prefers-reduced-motion` estiver ligado no SO, as rotações desaparecem.

---

## Task 6: Seção "O que você encontra" (4 cards)

Objetivo: adicionar a segunda seção (fundo branco, `py-20`) com eyebrow, título, subtítulo e grid de 4 cards de features.

**Files:**
- Modify: `components/HomePage.tsx`

- [ ] **Step 1: Ampliar os imports de ícones**

Atualizar o import do `lucide-react` para:

```tsx
import { Globe, HardHat, ArrowRight, Users, Send, Briefcase, Lightbulb, Handshake } from 'lucide-react';
```

- [ ] **Step 2: Adicionar o array de features antes do `return`**

Dentro da função `HomePage`, logo acima do `return`, inserir:

```tsx
const features = [
  {
    icon: Briefcase,
    title: 'Vagas efetivas',
    description: 'Posições fixas em empresas que valorizam a sua especialidade.',
  },
  {
    icon: Lightbulb,
    title: 'Serviços & consultoria',
    description: 'Ofereça expertise por demanda e feche contratos sob medida.',
  },
  {
    icon: HardHat,
    title: 'Projetos sob demanda',
    description: 'Participe de projetos pontuais e amplie seu portfólio técnico.',
  },
  {
    icon: Handshake,
    title: 'Parcerias e clientes',
    description: 'Encontre sócios, clientes e redes de negócio fora do modelo tradicional.',
  },
];
```

- [ ] **Step 3: Inserir a seção após o hero**

No JSX, logo após o fechamento do `<section>` do hero e antes do fechamento do `<main>`, adicionar:

```tsx
<section className="bg-white py-20">
  <div className="max-w-6xl mx-auto px-6 md:px-8">
    <div className="max-w-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Por que EngeHub</p>
      <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
        Mais do que vagas. Um hub de negócios.
      </h2>
      <p className="mt-4 text-slate-500 font-medium leading-relaxed">
        Seja para conquistar um novo cargo, captar clientes ou montar uma rede de parceiros — todos os caminhos da engenharia moderna convivem no mesmo lugar.
      </p>
    </div>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map(({ icon: Icon, title, description }) => (
        <article
          key={title}
          className="bg-slate-50 border border-slate-100 rounded-[28px] p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
            <Icon size={22} />
          </div>
          <h3 className="mt-5 text-lg font-black text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
        </article>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Verificar no navegador**

Recarregar `/` e rolar. Esperado:
- Logo abaixo do hero, bloco com fundo branco.
- Eyebrow azul em caixa-alta "POR QUE ENGEHUB".
- Título em peso `font-black` e subtítulo em slate-500.
- Grid com 4 cards: cada um tem tile azul com ícone, título e descrição.
- Em desktop: 4 cards por linha. Tablet: 2×2. Mobile: 1 por linha.
- Hover em cada card: leve elevação + sombra (desativado em `prefers-reduced-motion`).

---

## Task 7: CTA final + Footer

Objetivo: adicionar a faixa final com título e botão "Cadastre-se grátis" e anexar o `Footer` existente.

**Files:**
- Modify: `components/HomePage.tsx`

- [ ] **Step 1: Importar o `Footer`**

Adicionar no topo do arquivo, junto aos demais imports:

```tsx
import Footer from './Footer';
```

- [ ] **Step 2: Inserir a seção de CTA final + Footer**

No JSX, logo após o fechamento da `<section>` de "Por que EngeHub" e antes do fechamento do `<main>`, adicionar:

```tsx
<section className="bg-slate-50 py-20">
  <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
      Pronto pra encontrar sua próxima oportunidade?
    </h2>
    <p className="mt-4 text-slate-500 font-medium leading-relaxed">
      Crie seu perfil em minutos e comece a receber propostas alinhadas com a sua engenharia.
    </p>
    <button
      onClick={() => navigate('/register')}
      className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-2xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
    >
      Cadastre-se grátis
      <ArrowRight size={18} />
    </button>
  </div>
</section>
```

- [ ] **Step 3: Mover `</main>` pra fora e anexar `<Footer />`**

Ajustar o bloco final do JSX para que o `Footer` fique fora do `<main>` (mais semântico) e seja o último filho do wrapper raiz. A estrutura final deve ficar:

```tsx
return (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <header> ... </header>
    <main className="pt-16">
      {/* hero */}
      {/* por que EngeHub */}
      {/* CTA final */}
    </main>
    <Footer />
  </div>
);
```

- [ ] **Step 4: Verificar no navegador**

Recarregar `/` e rolar até o fim. Esperado:
- Faixa slate-50 centralizada com título, subtítulo e botão "Cadastre-se grátis" (clique → `/register`).
- Logo abaixo, o `Footer` existente renderiza íntegro (colunas Sobre / Institucional / Suporte / LGPD e rodapé inferior).

---

## Task 8: Revisão de responsividade e acessibilidade

Objetivo: validar pontos finais de responsividade, foco, hierarquia de headings e redução de movimento.

**Files:**
- (nenhuma alteração esperada, a não ser ajustes pontuais se a revisão apontar problemas)

- [ ] **Step 1: Revisar a hierarquia de headings**

Abrir `components/HomePage.tsx` e confirmar:
- Apenas um `<h1>` (dentro do hero).
- `<h2>` nas seções "Mais do que vagas" e "Pronto pra encontrar...".
- `<h3>` nos 4 cards de features.
- Nenhum heading pulado (sem ir de `h1` direto pra `h3` sem `h2`).

Se algo estiver fora do padrão, corrigir.

- [ ] **Step 2: Teste em 3 larguras no navegador**

Usar o DevTools (modo responsivo) para testar em:

| Largura | Esperado                                                                                          |
|---------|---------------------------------------------------------------------------------------------------|
| 375px   | Navbar com logo + Cadastrar. Hero: texto em cima, card principal do mockup embaixo (sem badge menor). Features em 1 coluna. CTAs do hero em coluna (flex-col → sm:flex-row). |
| 768px   | Navbar completa. Hero em 1 coluna ainda (2 colunas só a partir de `lg` = 1024px). Features em 2×2. Badge menor do mockup aparece. |
| 1280px  | Navbar completa. Hero em 2 colunas. Features em 4 colunas. Todos elementos visuais da spec visíveis. |

Se algum elemento quebrar (overflow horizontal, texto cortado, imagem saindo do container), ajustar a classe Tailwind problemática antes de continuar.

- [ ] **Step 3: Teste de foco por teclado**

Clicar no endereço da barra de URL, pressionar `Tab` repetidamente e confirmar que o foco:
- Entra na navbar (Entrar → Cadastrar).
- Desce pro hero (Cadastrar → Entrar).
- Passa pelo botão "Enviar proposta" (está `disabled`, então não recebe foco — ok).
- Desce pros 4 cards de features — cards não são focáveis por padrão, mas se a página tiver links, devem ser focáveis. Neste plano não há links dentro dos cards, então tudo bem.
- Chega no botão "Cadastre-se grátis" do CTA final.
- Entra nos links do footer.

Cada elemento focado deve ter **ring azul visível**. Se algum ficar sem anel de foco, adicionar `focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`.

- [ ] **Step 4: Teste com `prefers-reduced-motion`**

No DevTools: Command Menu → "Emulate CSS prefers-reduced-motion: reduce" (Chrome/Edge) ou equivalente.

Recarregar `/`. Esperado:
- Animação de entrada do hero (`animate-in fade-in`) deixa de rodar.
- Os cards do mockup não rotacionam (`rotate-0`).
- Hover dos cards de feature não aplica `-translate-y-1`.

Se alguma animação persistir, adicionar a variante `motion-reduce:*` correspondente.

---

## Task 9: QA manual final (fluxo ponta a ponta)

Objetivo: garantir que tudo funciona do ponto de vista do visitante real, cobrindo os critérios de aceite da spec.

- [ ] **Step 1: Visitante deslogado no navegador limpo**

Abrir uma aba anônima em `http://localhost:<porta>/`. Esperado:
- Mostra a landing (não o login).

- [ ] **Step 2: Navegação via CTAs**

- Clicar em **Cadastrar** (navbar) → vai pra `/register`. Voltar com o botão do navegador.
- Clicar em **Cadastrar** (hero) → vai pra `/register`. Voltar.
- Clicar em **Cadastre-se grátis** (CTA final) → vai pra `/register`. Voltar.
- Clicar em **Entrar** (navbar, em ≥640px) → vai pra `/login`. Voltar.
- Clicar em **Entrar** (hero) → vai pra `/login`. Voltar.

Esperado: cada um leva à rota correta e a página de destino renderiza sem erro.

- [ ] **Step 3: Fluxo autenticado**

Se a conta de desenvolvimento estiver disponível: entrar via `/login` com Google. Após logar:
- A rota atual vira `/dashboard`.
- Tentar acessar `/` manualmente → redireciona pra `/dashboard`.
- Tentar acessar `/login` manualmente → redireciona pra `/dashboard`.
- Tentar acessar `/register` manualmente → redireciona pra `/dashboard`.

Em seguida, fazer logout. Esperado: volta pra `/` (landing) e redireções cessam.

- [ ] **Step 4: Fallback `*`**

- Deslogado: acessar `/foo-bar` → redireciona pra `/`.
- Logado: acessar `/foo-bar` → redireciona pra `/dashboard`.

- [ ] **Step 5: Checagem dos critérios de aceite da spec**

Marcar mentalmente os 8 critérios listados em `docs/superpowers/specs/2026-04-23-landing-home-page-design.md` → seção "Critérios de aceite". Todos devem passar:

1. [ ] Visitante deslogado vê landing em `/`.
2. [ ] Cadastrar → `/register`.
3. [ ] Entrar → `/login` sem regressão do LoginPage.
4. [ ] Logado redireciona de `/`, `/login` e `/register` pra `/dashboard`.
5. [ ] Layout íntegro em desktop, tablet, mobile.
6. [ ] Footer aparece na landing.
7. [ ] Foco visível via teclado em todos os CTAs.
8. [ ] Nenhuma regressão nas rotas autenticadas existentes.

Se algum falhar, voltar à task correspondente antes de considerar o trabalho concluído.

---

## Notas finais

- **Sem git:** o projeto não é um repositório; mantenha um resumo manual das mudanças feitas (ou combine com a Bruna se quiser inicializar um repositório antes de começar).
- **RegisterPage ↔ Supabase:** permanece desconectado. Se a Bruna quiser tratar, abrir nova spec/plano separado.
- **Dependências:** todos os ícones usados (`Globe`, `HardHat`, `Briefcase`, `Lightbulb`, `Handshake`, `ArrowRight`, `Users`, `Send`) estão na versão do `lucide-react` listada em `package.json` (`^0.564.0`). Nenhum `npm install` novo é necessário.
