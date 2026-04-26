# Fase 4 — Páginas de conteúdo + modais — Design

**Data:** 2026-04-25
**Pré-requisito:** Fases 1, 2 e 3 entregues.
**Status:** Em execução — aplicar DS §4.3 + §3 nas 7 páginas autenticadas + 2 modais ativos.

## Objetivo

Migrar todas as páginas autenticadas restantes pra estética dark editorial-minimal, encerrando o rollout do DS no app inteiro. Limpar `Footer.tsx` (órfão desde Fase 3).

## Escopo

**Toca:**
- `components/ProfilePage.tsx` — restyle (mantém Supabase fetch + edit/save flow)
- `components/ServicesPage.tsx` — restyle (mantém Supabase fetch + create flow + modal embutido)
- `components/OpportunitiesPage.tsx` — restyle (mantém Supabase fetch + filtros + modal de proposta embutido)
- `components/CoursesPage.tsx` — restyle (mock data; modal de redirect)
- `components/MessagesPage.tsx` — restyle (mock data; layout chat 2-col)
- `components/EventsPage.tsx` — restyle (mock data; modal externo)
- `components/NewsPage.tsx` — restyle (mock data; comments inline)
- `components/EventModal.tsx` — restyle
- `components/PublishOpportunityModal.tsx` — restyle (mantém Supabase insert)
- `components/AppPages.css` — **criar** (CSS compartilhado das páginas de conteúdo)
- `components/Modal.css` — **criar** (CSS compartilhado dos modais)
- `components/MessagesPage.css` — **criar** (chat layout único)
- `components/Footer.tsx` — **deletar** (órfão, não consumido por ninguém)

**Não toca:**
- `EngineeringOnboardingModal.tsx` — importado em `App.tsx` mas **nunca renderizado** (dead code). Deixo como-está com nota de remoção futura. Se quiser eu deleto também, mas pode ser que tenha planos de usar.
- `ProtectedRoute.tsx` — sem visual.
- Lógica de negócio, fetches Supabase, validações — todos preservados.

## Decisões

1. **CSS compartilhado:** `AppPages.css` cobre padrões repetidos (page header, stats grid, cards, lists, badges, tabs, form fields, empty/loading/error). Pages-específicas (chat, news, eventos com banner) recebem CSS adicional curto.
2. **Modal infra unificada:** `Modal.css` define overlay + frame + head/body/foot. Cada modal estende com bits específicos.
3. **Banner gradient na ProfilePage:** trocado por uma faixa sólida `--surface-raised` com glow accent sutil — sem gradiente azul intenso (DS §1.9 proíbe gradientes em UI).
4. **Imagens de cursos/notícias:** mantidas (são conteúdo, não decoração de UI).
5. **Ícones lucide-react:** mantidos (já em uso, sem ganho em remover).
6. **Status colors:** `--status-success` em "Disponível para projetos", "Conta verificada", "Online", "Confirmado". `--status-warning` em "Rascunho". `--status-danger` em delete/error.
7. **Headings sem italic-serif** — DS §4.3 (serifa só em marketing/auth).
8. **Cores de categoria** (Webinar/Palestra/Visita Técnica em EventsPage; Laudo/Projeto/Consultoria em OpportunitiesPage): viram badges em accent + warning + success + info do DS, em vez de blue/orange/emerald hard-coded.

## Critérios de aceite

1. Todas as 7 páginas autenticadas renderizam dark dentro do shell.
2. Modais EventModal e PublishOpportunityModal abrem com overlay + frame dark.
3. Lógica preservada: Supabase fetches funcionam, edits salvam, modais publicam.
4. Footer.tsx deletado, sem referências quebradas em nenhum import.
5. Console limpo, sem regressão funcional.
6. Layouts responsivos em 375 / 768 / 1280.

## Riscos

- **EngineeringOnboardingModal:** deixado como-está (dead code). Pode ser deletado futuramente.
- **ProfilePage.handleSave** chama `supabase.from('profiles').upsert(...)` — preservado mas se o schema mudou, falha. Não testo aqui.
- **MessagesPage** está com data mock — restyle visual sem conectar Supabase (separado em backlog).
- **Volume:** ~2700 linhas de TSX sendo reescritas em uma rodada. Risco de typo ou prop-drilling errado. Mitigado pela estrutura clara das classes do DS.
