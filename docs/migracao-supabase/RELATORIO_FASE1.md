# Fluir | Relatório de execução técnica, fase 1
Data: 24/11/2026
Branch: `alex/migracao-supabase-fase1-24-11`
Diretório de trabalho: `C:\Users\Usuario\Documents\Fluir-Migracao-Supabase-WIP`

## Implementado nesta fase

- Supabase CLI v3 inicializado, com migrations versionadas não aplicadas.
- Estruturas UUID para perfis, papéis, onboarding, tarefas, hábitos, registros e vínculo com IDs legados.
- Políticas RLS para os dados novos; Storage privado; RPC transacional de onboarding e RPC de limite de chamadas Gemini.
- Migration de contenção do acesso `anon` às tabelas legadas, pronta para revisão, **não executada**.
- Cliente TypeScript do Supabase; Supabase Auth para login, signup, logout, reset de senha e restauração de sessão.
- React mobile: demonstração isolada, controle explícito de erros, onboarding, tarefas CRUD, configurações salvas e interface da IA.
- Serviços de arquivos privados com upload, URL assinada e exclusão.
- Edge Function Gemini autenticada com JWT e consentimento, com segredo somente no servidor (ainda não implantada).
- Auditoria do IgrejaViagens em modo leitura, inventário do Fluir e plano de migração/rollback.

## Testes locais da versão atual

| Verificação | Resultado | Limitação |
|---|---|---|
| `npm run build` em mobile | 0 erros TypeScript, Vite build sucesso | não prova funcionamento no Supabase real |
| `npm run lint` em mobile | sucesso, `LINT_EXIT=0` | valida código, não backend |
| `node --test tests/security-contracts.test.mjs` | 8/8 testes estáticos | não substitui RLS no Postgres |
| `npm run test:e2e` em mobile | 6/6 Chrome em localhost | sem conta real nem Supabase remoto |
| Parser `pglast` em 3 SQL | 3/3 sintaxes válidas | não prova que constraints/policies aplicam |
| pgTAP `supabase test db` | **NÃO EXECUTADO** | Docker daemon não disponível |
| Supabase Auth com usuário real | **NÃO EXECUTADO** | nenhum usuário Auth no projeto atual |
| Storage com duas contas JWT | **NÃO EXECUTADO** | falta ambiente staging e migrations |
| Gemini real | **NÃO EXECUTADO** | Edge Function não publicada; segredo não configurado |
| Publicação Vercel | **NÃO EXECUTADA** | autorização expressa exigida |

**Não declare a migração concluída com base nesses testes.**

## Bloqueios e riscos

**Crítico:** inspeção read-only confirmou permissões `anon` em todas as 18 tabelas legadas (incluindo `usuarios` e `sessoes_login`), 17 com RLS desativado. A contenção deve ser revisada e aplicada em mudança autorizada, depois de backup e checagem do impacto no Java/usuários.

Há 19 usuários na tabela legada, nenhum em `auth.users`. A migração de credenciais e de dados locais por usuário precisa de processo de vinculação seguro, sem correspondência automática apenas por e-mail.

O frontend principal (HTML/CSS/JS da Vercel) ainda chama o Render. O React modificado é o protótipo `mobile/`, não substitui sozinho o site em produção. Os módulos financeiros, saúde, ciclo, diário, timeline e anexos ainda dependem da adaptação do armazenamento local e de testes de ownership.

## Próxima fronteira de trabalho autorizável

1. Criar/autorizar um projeto Supabase staging separado com dados fictícios e legado de teste.
2. Executar migrations + pgTAP, consertar erros reais de constraints/policies e testar contas A e B.
3. Implementar rotina de migração de identidades antigas sob verificação do titular.
4. Integrar o site principal gradualmente com Supabase, preservando telas e módulos.
5. Ativar Edge Function e Storage em staging; executar QA real.
6. Somente após validação e autorização: novo deploy Vercel e corte coordenado do Render.

Não houve alteração nos dados remotos, deploy, merge ou remoção do backend antigo.
