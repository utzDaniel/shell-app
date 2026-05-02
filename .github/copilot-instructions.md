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

## Documentação de referência

Consulte sempre antes de implementar:

- [Arquitetura](docs/architecture.md) — camadas, módulos, dependências externas e diagrama
- [Convenções](docs/conventions.md) — standalone, signals, inject(), nomenclatura de artefatos
- [Segurança](docs/security.md) — Keycloak, roles, roleGuard, Bearer token
- [Federation](docs/federation.md) — Native Federation, remotes registrados, fluxo de adição
- [Testes](docs/testing.md) — Karma + Jasmine, estrutura, nomenclatura, antipadrões

---

## Checklist para cada implementação

Para **toda** nova funcionalidade ou alteração, o Copilot DEVE:

1. **Manter standalone** — não criar ou modificar NgModules → [Convenções](docs/conventions.md)
2. **Respeitar o fluxo de auth** — proteger novas rotas com `roleGuard`; se precisar de nova role, adicioná-la ao tipo `AppRole` → [Segurança](docs/security.md)
3. **Atualizar `federation.manifest.json`** ao registrar um novo remote → [Federation](docs/federation.md)
4. **Criar testes unitários** com Karma + Jasmine para serviços e guards → [Testes](docs/testing.md)
   - Padrão de nome: `should<ComportamentoEsperado>`
5. **Garantir que todos os testes passem** — regressões não são permitidas
6. **Atualizar `docs/plans/README.md`** se um plano de execução foi concluído

---
