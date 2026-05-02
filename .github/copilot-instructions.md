# Instruções do Copilot — Shell App

## Idioma (OBRIGATÓRIO)

- Todas as respostas DEVEM ser em português (pt-BR)
- Termos técnicos podem permanecer em inglês

---

## Projeto

Aplicação Angular que atua como **host shell** de uma arquitetura Micro Frontend (MFE), responsável por autenticação, navegação global e carregamento dinâmico dos remotes.

| Item | Detalhe |
|------|---------|
| Linguagem | TypeScript 5.7 |
| Framework | Angular 19 (standalone components) |
| Federation | `@angular-architects/native-federation` (host) |
| UI | PrimeNG 19 com tema Aura |
| Autenticação | Keycloak via `keycloak-angular` 19 (realm roles) |
| Testes | `ng test` — Karma + Jasmine |
| Build | `ng build` |
| Infra local | `docker-compose.yml` sobe o Keycloak |

---

## Remotes registrados

Definidos em `public/federation.manifest.json`:

| Remote | Porta | Rota protegida |
|--------|-------|----------------|
| `user-mf` | 4201 | `/users` — role `USER` |
| `finance-mf` | 4202 | `/finance` — role `FINANCE` |
| `dashboard-mf` | 4203 | `/dashboard` — role `DASHBOARD` |

O gateway da API está em `environment.gatewayUrl` (`http://localhost:8090`).

---

## Estrutura de pastas

```
src/app/
  core/auth/          # AuthService, keycloak.init, roleGuard
  layout/             # ShellLayoutComponent (menubar + router-outlet)
  pages/              # home/, forbidden/
src/environments/     # environment.ts / environment.production.ts
public/
  federation.manifest.json   # URLs dos remotes
```

---

## Convenções obrigatórias

### Componentes
- Usar **standalone components** — nunca NgModules
- Selector prefixado com `app-` (ex.: `app-shell-layout`)
- Template inline para componentes simples; arquivo `.html` separado quando o template exceder ~20 linhas

### Autenticação e roles
- Roles válidas definidas no tipo `AppRole` em `core/auth/auth.service.ts`: `'USER' | 'FINANCE' | 'DASHBOARD'`
- Proteção de rotas sempre via `roleGuard(...roles)` de `core/auth/role.guard.ts`
- Nunca acessar `Keycloak` diretamente fora de `AuthService` e `keycloak.init.ts`
- Usar `provideKeycloak()` de `core/auth/keycloak.init.ts` — **não** importar `provideKeycloak` de `keycloak-angular` diretamente
- Bearer token injetado automaticamente pelo `includeBearerTokenInterceptor` apenas para URLs que iniciem com `environment.gatewayUrl`
- Para logout, usar `AuthService.logout()` — nunca chamar `keycloak.logout()` diretamente

### Federation (Native Federation)
- Novos remotes devem ser adicionados em `federation.manifest.json` e mapeados em `app.routes.ts` com `loadRemoteModule`
- O shell nunca importa código-fonte dos remotes diretamente
- Convenção de export dos remotes: `loadRemoteModule('remote-name', './Component').then(m => m.AppComponent)`

### Signals e reatividade
- Preferir Angular Signals (`signal`, `computed`, `effect`) a `BehaviorSubject`/`Observable` para estado local de componente
- Usar `inject()` em vez de injeção por construtor

---

## Checklist para cada implementação

Para **toda** nova funcionalidade ou alteração, o Copilot DEVE:

1. **Manter standalone** — não criar ou modificar NgModules
2. **Respeitar o fluxo de auth** — proteger novas rotas com `roleGuard`; se precisar de nova role, adicioná-la ao tipo `AppRole`
3. **Atualizar `federation.manifest.json`** ao registrar um novo remote
4. **Criar testes unitários** com Karma + Jasmine para serviços e guards
   - Padrão de nome: `should<ComportamentoEsperado>`
5. **Garantir que todos os testes passem** — regressões não são permitidas

---

## Fluxo de adição de novo Micro Frontend

```
1. Adicionar entrada em public/federation.manifest.json
2. Criar rota lazy em app.routes.ts com loadRemoteModule
3. Aplicar roleGuard com a role necessária
4. Adicionar item de menu em ShellLayoutComponent (se aplicável)
5. Adicionar nova role em AppRole (se aplicável)
```

---

## Comandos úteis

| Ação | Comando |
|------|---------|
| Iniciar dev server | `ng serve` |
| Build produção | `ng build` |
| Executar testes | `ng test` |
| Subir infra local | `docker compose up -d` |
