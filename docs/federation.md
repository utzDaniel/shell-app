# Micro Frontend Federation

## Modelo

Native Federation (`@angular-architects/native-federation`) — o shell atua como **host** e cada aplicação remota expõe um `remoteEntry.json`.

## Remotes Registrados

Definidos em `public/federation.manifest.json`:

| Remote | URL do remoteEntry | Porta | Role |
|--------|--------------------|-------|------|
| `user-mf` | `http://localhost:4201/remoteEntry.json` | 4201 | `USER` |
| `finance-mf` | `http://localhost:4202/remoteEntry.json` | 4202 | `FINANCE` |
| `dashboard-mf` | `http://localhost:4203/remoteEntry.json` | 4203 | `DASHBOARD` |

## Carregamento de Remotes

Remotes são carregados via `loadRemoteModule` em rotas lazy em `app.routes.ts`:

```typescript
{
  path: 'finance',
  canActivate: [roleGuard('FINANCE')],
  loadComponent: () =>
    loadRemoteModule('finance-mf', './Component').then(m => m.AppComponent),
}
```

Convenção obrigatória de export: `loadRemoteModule('<remote-name>', './Component').then(m => m.AppComponent)`

## Fluxo de Adição de Novo Remote

```
1. Adicionar entrada em public/federation.manifest.json
2. Criar rota lazy em app.routes.ts com loadRemoteModule
3. Aplicar roleGuard com a role necessária
4. Adicionar item de menu em ShellLayoutComponent (se aplicável)
5. Adicionar nova role em AppRole em core/auth/auth.service.ts (se aplicável)
```

## Regras

- O shell nunca importa código-fonte dos remotes diretamente
- Toda rota de remote DEVE ser protegida com `roleGuard`
- O arquivo `federation.manifest.json` é a fonte da verdade para URLs dos remotes
- Em produção, as URLs devem ser atualizadas via variável de ambiente ou CI/CD
