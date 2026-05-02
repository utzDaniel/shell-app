# Arquitetura

## Estilo

Aplicação Angular que atua como **host shell** de uma arquitetura Micro Frontend (MFE). Responsável por autenticação, navegação global e carregamento dinâmico dos remotes via Native Federation.

## Camadas

```
ShellLayoutComponent
  +-- Menubar (PrimeNG)  ← itens filtrados por roles (AuthService)
  +-- <router-outlet>    ← carrega remotes ou páginas locais
        |
        +-- HomeComponent       (local)
        +-- ForbiddenComponent  (local)
        +-- user-mf             (remote — role USER)
        +-- finance-mf          (remote — role FINANCE)
        +-- dashboard-mf        (remote — role DASHBOARD)
```

## Módulos / Camadas do Shell

| Camada | Localização | Responsabilidade |
|--------|-------------|------------------|
| Core / Auth | `src/app/core/auth/` | AuthService, keycloak.init, roleGuard |
| Layout | `src/app/layout/` | ShellLayoutComponent — menubar + router-outlet |
| Pages | `src/app/pages/` | Páginas locais: home, forbidden |
| Config | `src/app/app.config.ts` | Bootstrap de providers (Keycloak, HTTP, PrimeNG) |
| Routes | `src/app/app.routes.ts` | Roteamento com lazy loading dos remotes |

## Dependências Externas

| Serviço | Função | Porta |
|---------|--------|-------|
| Keycloak | IdP — emite JWT / autentica usuários | 8080 |
| API Gateway | Backend BFF — recebe requisições dos remotes | 8090 |
| user-mf | Micro Frontend de usuários | 4201 |
| finance-mf | Micro Frontend financeiro | 4202 |
| dashboard-mf | Micro Frontend de dashboard | 4203 |

## Diagrama

```
 Usuário (navegador)
      |
      v
 shell-app :4200  (Angular Host)
  +-- autentica   --> Keycloak :8080
  +-- carrega     --> remoteEntry.json de cada MFE
  +-- requisições --> API Gateway :8090 (+ Bearer token automático)
       |
       +-- user-mf     :4201
       +-- finance-mf  :4202
       +-- dashboard-mf:4203
```

## Fluxo de Autenticação

1. Aplicação inicia com `onLoad: 'login-required'` — redireciona para Keycloak se não autenticado
2. Keycloak retorna JWT com `realm_access.roles`
3. `AuthService` extrai roles do token e as disponibiliza via Signals
4. `roleGuard` protege rotas e redireciona para `/forbidden` em caso de acesso negado
5. `includeBearerTokenInterceptor` injeta Bearer token em requisições ao `gatewayUrl`
