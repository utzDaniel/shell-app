# Plano: Initial Setup

Status: done

Autor: Daniel

Data: 2026-05-02

## TL;DR

Gerar scaffold do `shell-app` com Angular 19 standalone components, Native Federation (host), autenticação via Keycloak (`keycloak-angular` 19), UI com PrimeNG 19 (tema Aura) e configuração inicial dos remotes `user-mf`, `finance-mf` e `dashboard-mf`.

## Steps

1. Criar projeto Angular 19
   - `ng new shell-app --standalone --routing`
   - Configurar `tsconfig.json`, `angular.json`

2. Instalar e configurar Native Federation
   - `@angular-architects/native-federation` como host
   - `federation.config.js` e `public/federation.manifest.json` com os três remotes

3. Instalar e configurar Keycloak
   - `keycloak-angular` 19
   - `keycloak.init.ts` com `provideKeycloak()` (wrapper interno)
   - `AuthService` com Signals (`roles`, `profile`, `isAuthenticated`)
   - `roleGuard` funcional com redirecionamento para `/forbidden`

4. Instalar e configurar PrimeNG 19
   - Tema Aura via `providePrimeNG`
   - `ShellLayoutComponent` com `p-menubar`, `p-avatar`, `p-button`

5. Criar rotas e páginas locais
   - `HomeComponent` e `ForbiddenComponent`
   - `ShellLayoutComponent` com `<router-outlet>`
   - Rotas lazy dos remotes protegidas por `roleGuard`

6. Configurar `app.config.ts`
   - `provideRouter`, `provideHttpClient` com `includeBearerTokenInterceptor`
   - `INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG` limitado ao `gatewayUrl`
   - `provideKeycloak()` e `providePrimeNG()`

7. Infra local
   - `docker-compose.yml` com Keycloak
   - `docker/keycloak/realm-export.json` com realm `development` e client `shell-app`
   - `Dockerfile` + `nginx.conf` para produção

8. Verificações
   - `ng build` sem erros
   - `ng test` todos os testes passando
   - `docker compose up -d` sobe Keycloak corretamente
   - Login funcional e rotas protegidas redirecionando conforme role

## Relevant files (criadas/atualizadas)

- `src/app/app.config.ts`
- `src/app/app.routes.ts`
- `src/app/core/auth/auth.service.ts`
- `src/app/core/auth/keycloak.init.ts`
- `src/app/core/auth/role.guard.ts`
- `src/app/layout/shell-layout.component.ts`
- `src/app/pages/home/home.component.ts`
- `src/app/pages/forbidden/forbidden.component.ts`
- `src/environments/environment.ts`
- `src/environments/environment.production.ts`
- `public/federation.manifest.json`
- `federation.config.js`
- `docker-compose.yml`
- `docker/keycloak/realm-export.json`
- `Dockerfile`
- `nginx.conf`

## Decisions / Assumptions

- Standalone components — sem NgModules
- Signals para estado reativo no `AuthService`
- `inject()` para injeção de dependências
- Roles de realm (não de client) no Keycloak
- Bearer token apenas para `gatewayUrl` (`http://localhost:8090`)
- PKCE S256 para segurança do fluxo OAuth2