# Segurança

## Modelo

OAuth2 / OpenID Connect — o shell delega autenticação ao Keycloak. Não autentica usuários diretamente.

Fluxo: Usuário → Keycloak (login / emite JWT) → shell-app (valida sessão e extrai roles)

## Keycloak

| Configuração | Valor (desenvolvimento) |
|--------------|------------------------|
| URL | `http://localhost:9999` |
| Realm | `development` |
| Client ID | `shell-app` |
| PKCE | S256 |
| `onLoad` | `login-required` |

- Configuração centralizada em `core/auth/keycloak.init.ts` via `provideKeycloak()`
- Nunca importar `provideKeycloak` diretamente de `keycloak-angular` — usar o wrapper interno

## Roles de Acesso

| Role | Rota protegida | Remote |
|------|---------------|--------|
| `USER` | `/users` | `user-mf` |
| `FINANCE` | `/finance` | `finance-mf` |
| `DASHBOARD` | `/dashboard` | `dashboard-mf` |
| `ADMIN` | acesso global | N/A |

Roles são do tipo `AppRole` definido em `core/auth/auth.service.ts`:
```typescript
export type AppRole = 'USER' | 'FINANCE' | 'DASHBOARD' | 'ADMIN';
```

## Proteção de Rotas

Toda rota restrita DEVE usar `roleGuard` em `canActivate`:

Comportamento do guard:
- Não autenticado → Keycloak redireciona para login (`login-required`)
- Autenticado sem a role → redireciona para `/forbidden`
- Autenticado com a role → acesso liberado

## Bearer Token

O `includeBearerTokenInterceptor` injeta automaticamente o token JWT nas requisições HTTP cujo URL começa com qualquer uma das URLs definidas em `environment.backendUrls`.

Como o `HttpClient` é um **singleton compartilhado** via Native Federation (`shareAll`), o interceptor configurado no shell é herdado automaticamente pelos MFEs. Ou seja, qualquer requisição ao backend feita por um MFE também receberá o Bearer token.

Configurado em `app.config.ts`:
```typescript
{
  provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  useValue: environment.backendUrls.map((url) => ({ urlPattern: new RegExp(`^${url}`) })),
}
```

Para adicionar um novo backend, basta incluir a URL no array `backendUrls` em `environment.ts`.

## Erros de Acesso

| Cenário | Comportamento |
|---------|---------------|
| Não autenticado | Redirecionado para login no Keycloak |
| Autenticado sem role | Redirecionado para `/forbidden` |
| Token expirado | Keycloak renova automaticamente (`updateToken`) |

## Boas Práticas

- Nunca expor dados sensíveis em templates ou console
- Nunca chamar `keycloak.logout()` diretamente — usar `AuthService.logout()`
- Nunca acessar `Keycloak` fora de `AuthService` e `keycloak.init.ts`
- Ao adicionar nova role, atualizar o tipo `AppRole` em `auth.service.ts`
