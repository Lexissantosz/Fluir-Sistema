# FLUIR | Lançamento Vercel + Supabase
Status atualizado: 25/11/2026

## Intenção
O usuário autorizou promover para oficial a arquitetura Vercel (site) + Supabase (PostgreSQL/Auth/Storage/Edge Functions). Este documento registra o estado REAL, sem declarar funcionalidades pendentes como concluídas.

## Concluído e conferido
- PR #44: integração do PR #42 (fundação Supabase) + PR #43 (QA Android Web); `main` preservada.
- Supabase: migrations de segurança, fundação Auth com tabelas RLS, buckets privados, RPCs e ponte de compatibilidade, aplicadas sem excluir usuários.
- Supabase Edge Function `fluir-api` ACTIVE v2 com login BCrypt legado, sessões com hash e operações controladas por usuário. Recursos que dependem de segredos configurados, como Gemini e Google, precisam de QA antes de disponibilizar.
- O frontend principal passou a usar a URL da função Supabase para login, cadastro, onboarding, tarefas e assistente. A Vercel criou uma prévia do branch.
- GitHub CI de rota pública da Edge e de fluxo não autenticado passou; QA Web Android passou 16/16 em Chrome simulado.

## Data API corrigida e QA real aprovado
- O usuário ativou a Data API do Supabase em 25/11/2026.
- Execução https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/45683952040: 11/11 fluxos reais aprovados, incluindo cadastro, login, onboarding, tarefas e bloqueio entre usuários.
- Extensão do teste https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/45686902545: 12/12 verificações aprovadas.
- O diagnóstico confirmou que login Google permanece sem integração e Gemini retorna HTTP 503 (requer configurar os segredos e validar).
- QA Web Android https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/45686917518 aprovado.
- Supabase Auth nativo ainda não tem usuários; a ponte das contas antigas está ativa e autentica no Supabase via Edge, com sessões legadas verificadas no banco. Não chamar a migração de Supabase Auth concluída.

## Próximas verificações obrigatórias
1. Aprovado: workflow `fluir-supabase-live-e2e.yml` com cadastro/login, onboarding, tarefas e bloqueio entre usuários; repetir após mudanças de autenticação.
2. Verificar e, se necessário, configurar no Supabase Secrets `FLUIR_GEMINI_API_KEY` e `FLUIR_GOOGLE_CLIENT_ID`; não publicar os valores. Testar Gemini e Google realmente.
3. Verificar preservação de contas existentes e registros locais, não misturar usuários, testar desktop/Android e política de RLS.
4. Revisar PR #44, habilitar release somente após testes. A versão com ponte customizada de sessões antigas é TRANSITÓRIA; conversão completa Supabase Auth ainda falta.
5. Depois do QA: fazer merge/release aprovado pela autorização já dada, confirmar o domínio oficial e a ausência de chamadas Render, manter rollback.
6. Desligar Render somente quando nenhum recurso depende mais dele. Não excluir banco nem arquivos.

## Proibições
- Não apagar usuários legados, hashes, finanças, dados de ciclo/saúde/diário ou tarefas.
- Não copiar IgrejaViagens nem alterar esse repositório.
- Não tratar deploy READY de prévia como ambiente oficial homologado.
