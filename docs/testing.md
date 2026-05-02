# Testes

## Estratégia

- **Unitários (obrigatório)** — serviços e guards com Karma + Jasmine
- **Componentes (obrigatório)** — componentes críticos com `TestBed`

## Escopo Obrigatório

Todo serviço e guard DEVE ter testes cobrindo:
- Comportamento principal (autenticação, roles, rotas)
- Cenários de erro (acesso negado, não autenticado)
- Estado reativo (signals, computed)

## Estrutura

```
src/app/
  app.component.spec.ts
  core/auth/
    auth.service.spec.ts
    role.guard.spec.ts
```

## Nomenclatura

Padrão: `should<ComportamentoEsperado>`

Exemplos:
- `shouldReturnTrueWhenUserHasRole`
- `shouldRedirectToForbiddenWhenRoleMissing`
- `shouldReturnFalseWhenNotAuthenticated`
- `shouldLoadUserProfileAfterAuthentication`

## Regras

- Mockar todas as dependências externas (`Keycloak`, `Router`)
- Sem acesso a Keycloak real nos testes
- Cada teste valida um único comportamento
- Cada teste é independente (sem estado compartilhado entre `it`)
- Usar `TestBed.configureTestingModule` para injeção de dependências

## Antipadrões

- Testar múltiplos comportamentos em um único `it`
- Mockar parcialmente sem isolar dependências
- Testes sem asserções (`expect`)
- Ignorar cenários de acesso negado
