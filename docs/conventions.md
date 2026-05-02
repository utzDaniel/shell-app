# Convenções

## Regras Gerais

- Usar **standalone components** — nunca NgModules
- Injeção de dependência via `inject()` — nunca por construtor
- Preferir Angular Signals (`signal`, `computed`, `effect`) a `BehaviorSubject`/`Observable` para estado local
- Selector de componente sempre prefixado com `app-` (ex.: `app-shell-layout`)
- Template inline para componentes simples; arquivo `.html` separado quando exceder ~20 linhas

---

## Nomenclatura

| Artefato | Padrão | Exemplo |
|----------|--------|---------|
| Component | `<Feature>Component` | `ShellLayoutComponent` |
| Service | `<Feature>Service` | `AuthService` |
| Guard (fn) | `<feature>Guard` | `roleGuard` |
| Arquivo | `<feature>.component.ts` | `shell-layout.component.ts` |
| Spec | `<feature>.component.spec.ts` | `app.component.spec.ts` |

---

## Componentes

- Sempre `standalone: true`
- Importar apenas o necessário no array `imports`
- Não criar NgModules

---

## Serviços e Injeção

- Usar `inject()` no corpo da classe
- `providedIn: 'root'` para serviços singleton

---

## Signals e Reatividade

- Estado local: `signal()`
- Estado derivado: `computed()`
- Efeitos colaterais: `effect()`
- Expor estado somente via `.asReadonly()`

---

## Autenticação e Roles

- Roles válidas definidas no tipo `AppRole` em `core/auth/auth.service.ts`
- Proteger rotas sempre com `roleGuard(...roles)` de `core/auth/role.guard.ts`
- Nunca acessar `Keycloak` diretamente fora de `AuthService` e `keycloak.init.ts`
- Para logout, usar `AuthService.logout()`

---

## Federation

- Novos remotes registrados em `public/federation.manifest.json`
- Rotas lazy criadas em `app.routes.ts` com `loadRemoteModule`
- O shell nunca importa código-fonte dos remotes diretamente
- Convenção de export: `loadRemoteModule('remote-name', './Component').then(m => m.AppComponent)`
