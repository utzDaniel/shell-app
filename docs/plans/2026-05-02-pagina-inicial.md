# Plan: Redesign Shell Layout & Home Page

Status: done

Autor: Daniel

Data: 2026-05-02

## TL;DR

Substituir o layout horizontal atual (`p-menubar`) pelo design da imagem — sidebar escura colapsável + header com informações do app + home rica com cards de módulos, atividades recentes mockadas e status do sistema via health checks reais.

---

### Phase 1 — Infraestrutura & Dados

**Step 1** — Adicionar `envName` e `healthChecks` em `src/environments/environment.ts` e `environment.production.ts`
- `envName: 'DEV'` / `envName: 'PROD'`
- `healthChecks: { keycloak, gateway, services }` com as URLs para health check

**Step 2** — Criar `src/app/core/system-status/system-status.service.ts`
- Signals por serviço: `keycloakStatus`, `gatewayStatus`, `servicesStatus` com tipo `'online' | 'offline' | 'checking'`
- `checkAll()` usando `HttpClient.get()` + `catchError` para cada URL
- Chama `checkAll()` no constructor; `providedIn: 'root'`

**Step 3** — Criar `src/app/core/system-status/system-status.service.spec.ts` *(paralelo com Step 2)*
- `shouldInitializeWithCheckingStatus`
- `shouldSetStatusToOnlineWhenHealthCheckReturns200`
- `shouldSetStatusToOfflineWhenHealthCheckFails`

---

### Phase 2 — Layout Redesign *(depends on Phase 1)*

**Step 4** — Redesenhar `ShellLayoutComponent` — criar `shell-layout.component.html` + atualizar `shell-layout.component.ts`
- **Sidebar** (escura, 230px / 60px colapsado):
  - Logo: ícone + "Shell-App" + "Portal Corporativo"
  - Seção `MÓDULOS`: Início (sempre), Dashboard (`hasDashboardRole`), Finança (`hasFinanceRole`), Perfil (`hasUserRole`) — com `routerLink`, `routerLinkActive`, `pi pi-chevron-right`
  - Seção `SISTEMA`: Sair (chama `authService.logout()`)
  - Rodapé: botão "Recolher menu" (`pi pi-chevron-left`/`right`)
- **Header** (escuro, full width):
  - Esquerda: `pi pi-bars` para toggle sidebar
  - Centro: "Shell-app v1.0.0" + badge com `environment.envName` + ícone calendário + data/hora atual
  - Direita: `p-avatar` (iniciais) + nome do usuário + `pi pi-bell`
- `sidebarCollapsed = signal(false)` + `toggleSidebar()`
- Remover `MenubarModule`; adicionar `RouterLinkActive`, `DatePipe`, `BadgeModule`

---

### Phase 3 — Home Page Redesign *(depends on Phase 1)*

**Step 5** — Redesenhar `HomeComponent` — criar `home.component.html` + atualizar `home.component.ts`
- **Welcome header**: `👋 Bem-vindo, [firstName]!` + subtítulo
- **Module cards** (row, filtrados por role com `@if`):
  - Dashboard → `/dashboard` (`pi pi-chart-bar`, fundo azul)
  - Finança → `/finance` (`pi pi-dollar`, fundo verde)
  - Perfil → `/users` (`pi pi-user`, fundo roxo) — label "Perfil", link `/users`
- **Painel "Atividades recentes"** (dados mockados via signal de array `RecentActivity[]`)
  - 3 itens: ícone, título, categoria, data, badge "Concluído"
  - Link "Ver todas as atividades" (decorativo por ora)
- **Painel "Status do sistema"** (injeta `SystemStatusService`)
  - 3 linhas com dot colorido (verde/vermelho) baseado nos signals

---

### Phase 4 — Testes *(paralelo com fases 2 e 3)*

**Step 6** — Criar `src/app/layout/shell-layout.component.spec.ts`
- `shouldRenderSidebarWithMenuItems`
- `shouldToggleSidebarOnCollapseButtonClick`
- `shouldShowOnlyPermittedModulesBasedOnRoles`
- `shouldCallLogoutOnSairClick`

**Step 7** — Criar `src/app/pages/home/home.component.spec.ts`
- `shouldDisplayUsernameInWelcomeMessage`
- `shouldShowDashboardCardWhenHasDashboardRole`
- `shouldHideDashboardCardWhenHasNoDashboardRole`
- `shouldDisplaySystemStatusFromService`
- `shouldShowRecentActivities`

---

### Arquivos Modificados / Criados

| Ação | Arquivo |
|------|---------|
| Modificar | `src/environments/environment.ts` |
| Modificar | `src/environments/environment.production.ts` |
| Modificar | `src/app/layout/shell-layout.component.ts` |
| Criar | `src/app/layout/shell-layout.component.html` |
| Criar | `src/app/layout/shell-layout.component.spec.ts` |
| Modificar | `src/app/pages/home/home.component.ts` |
| Criar | `src/app/pages/home/home.component.html` |
| Criar | `src/app/pages/home/home.component.spec.ts` |
| Criar | `src/app/core/system-status/system-status.service.ts` |
| Criar | `src/app/core/system-status/system-status.service.spec.ts` |

---

### Verification

1. `ng test` — 0 falhas em todos os specs
2. `ng build` — build sem erros
3. Manual: sidebar colapsa para ícones, roles filtram itens do menu, data/hora exibida no header, dots de status mudam conforme resposta HTTP

---

### Decisões

- "Perfil" é label visual; rota permanece `/users` com role `USER`
- Atividades recentes: dados estáticos mockados no componente
- Notificações: apenas `pi pi-bell`, sem badge — implementação futura
- Sidebar collapse: ícones visíveis, textos e labels de seção ocultos
