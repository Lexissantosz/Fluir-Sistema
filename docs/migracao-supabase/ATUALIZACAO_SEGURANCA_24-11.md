# Fluir | Atualização de segurança e staging
**Data:** 24/11/2026. **Escopo:** somente Fluir. **IgrejaViagens intocado.**

## Correção aplicada ao Supabase existente

Projeto existente: `xqzxfhodhmlgneudubjm` (São Paulo).

A migration remota `20261124213356_secure_legacy_data_api_phase0` foi **aplicada com sucesso** usando o conector Supabase. A cópia exata do SQL está versionada em
`supabase/migrations/20261124213356_secure_legacy_data_api_phase0.sql`.

Operações executadas: revogar privilégios de `public`, `anon` e `authenticated` sobre as 18 tabelas legadas e sequências no schema `public`; habilitar RLS nas tabelas. Nenhum `DROP`, `TRUNCATE`, `DELETE`, `UPDATE` de registros, criação de usuário ou aplicação da fundação Supabase Auth. **O banco remoto foi alterado para fins de segurança; não dizer que nenhuma migration remota foi aplicada.**

### Evidências pós-mudança (read-only)

| Métrica | Resultado |
|---|---|
| Tabelas legadas em `public` | 18 |
| Sem RLS | 0 |
| `anon` consegue `SELECT` | 0 |
| `authenticated` consegue `SELECT` | 0 |
| Usuário PostgreSQL `postgres` consegue `SELECT` | 18 |
| `public.usuarios` | 33 registros |
| `auth.users` | 0 |
| `public.tarefas` | 1 |
| `public.habitos` | 0 |

Os 33 usuários são o inventário atual, superior aos 19 da auditoria anterior. Não inferir que as contas foram convertidas: são todas legadas neste momento.

### Smoke tests do Render após a mudança

- `GET /api/health/live`: HTTP 200.
- `GET /api/health/ready`: HTTP 200 (consulta de prontidão do banco).
- `GET /api/usuarios/teste`: HTTP 200.
- `POST /api/usuarios/login` com credenciais fictícias inválidas: HTTP 400.
- `GET /api/tarefas/usuario/1` sem sessão: HTTP 403.
- `GET /api/onboarding/usuario/1` sem sessão: HTTP 403.

Essas verificações **não equivalem** a login de uma conta real, CRUD real ou autorização completa com contas distintas.

## Diferença em relação à documentação inicial

`AUDITORIA_E_PLANO.md` e `RELATORIO_FASE1.md` foram redigidos **antes** desta correção e contêm descrições históricas das permissões inseguras, além do total antigo de 19 contas. A fonte atual para o estado do banco é este adendo.

O advisory `rls_enabled_no_policy` agora aponta as 18 tabelas legadas. É esperado nesta fase porque as tabelas ficaram intencionalmente com acesso público negado. A futura migration `secure_legacy_data_api` prevê políticas por titular verificado, que somente poderão ser habilitadas depois da autenticação nova e do vínculo seguro entre UUID e ID integer.

## Ordem correta das migrations no repositório local

1. `20261124213356_secure_legacy_data_api_phase0.sql` (**já aplicada remotamente**; manter no histórico para staging).
2. `20261124213400_fluir_auth_and_data_foundation.sql` (**somente arquivo local; não aplicada**).
3. `20261124213500_secure_legacy_data_api.sql` (**somente arquivo local; não aplicada**).

Em staging Supabase vazio, a fixture de schema legado `supabase/tests/fixtures/000_legacy_schema_staging_only.sql` é necessária antes de aplicar migrations, pois a fundação referencia FKs das tabelas `usuarios`, `tarefas` e `habitos`. A fixture não possui usuários reais nem credenciais e **não** deve ser aplicada em produção.

## Pendente e dependências

- Novo projeto/branch staging ainda **não criado**: conector Supabase solicitou confirmação explícita de custo. Não autorizar cobrança sem apresentar valor e obter concordância.
- O Supabase CLI está disponível via `npx` no PC, mas o Docker daemon não está funcional; impossibilita banco local/pgtap.
- Não existe nenhum usuário em Supabase Auth; os 33 usuários legados exigem migração segura e consentimento/validação do titular.
- Ainda faltam os módulos principais da interface HTML/JS, transferência dos registros locais, testes reais de RLS, Storage, Gemini, redirecionamentos, Google OAuth e deploy Vercel.

**A arquitetura final Vercel + Supabase não foi homologada nem publicada.**
