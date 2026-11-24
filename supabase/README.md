# Fluir | Infraestrutura Supabase (fase 1, NÃO PUBLICADA)

A fonte da verdade desta fase é o repositório local `Fluir-Migracao-Supabase-WIP`.
O banco remoto existente **continua em produção com Spring Boot**; não executar migrations nele sem aprovação.
Esta pasta não cria uma aplicação implantada nem substitui o Java por si só.

## Migrations

1. `20261124213400_fluir_auth_and_data_foundation.sql`: novas estruturas UUID do Auth, perfis, papéis protegidos, onboarding, tarefas/hábitos, ponte de registros e buckets privados.
2. `20261124213500_secure_legacy_data_api.sql`: revoga acesso anônimo às tabelas antigas e ativa RLS com vínculo verificado entre Supabase Auth UUID e ID legado inteiro.

**Pré-requisito:** essas migrations foram concebidas para a base Fluir existente, cuja tabela `public.usuarios` já existe. Um projeto Supabase vazio precisa receber um schema *de desenvolvimento* equivalente antes de aplicá-las. Não executar diretamente em banco recém-criado sem resolver essa dependência.

### Testes de preparação

- Verificar sintaxe SQL com parser PostgreSQL (não substitui execução).
- Iniciar Supabase local com o Docker ativo; preparar esquema legado fictício, nunca exportar hashes reais para o ambiente de testes sem proteção.
- Aplicar ambas as migrations apenas no ambiente local/staging.
- Executar `npx supabase test db` para testar `tests/database/001_fluir_rls.sql`; conferir que A não pode ler ou escrever dados de B.
- Testar RPC de onboarding, idempotência e integridade da FK legado/UUID.
- Testar Storage com dois JWTs distintos para uploads, leitura, URL assinada, exclusão e limites de tamanho/MIME.
- Revisar logs e auditorias sem expor conteúdo de finanças, diário, saúde/ciclo.

**Estado atual:** Docker CLI estava instalado, mas o daemon não estava disponível no computador; os testes reais de banco ainda NÃO foram executados.

## Variáveis de ambiente (nunca commitar as reais)

No protótipo React `mobile/.env.local`, definir apenas:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SUBSTITUIR
```

A Vercel precisa receber os mesmos valores públicos apenas no ambiente e projeto corretos. **Nunca** usar `service_role`, chave secreta `sb_secret_*` ou conexão SQL privilegiada em variáveis `VITE_*`.

Edge Functions, quando implementadas, receberão `FLUIR_GEMINI_API_KEY` via Supabase Secrets. Google OAuth deve ser configurado em Supabase Auth com callback e domínios permitidos, não implementado como client secret no navegador.

## Edge Function Gemini (preparada, NÃO implantada)

Código: `functions/fluir-assistant-chat/index.ts`. O endpoint recebe JWT do Supabase Auth,
mensagem e `consentimento: true`. Confere a identidade, aplica a RPC
`fluir_ai_reserve_call()` (5 mensagens por usuário/minuto) e envia somente a
mensagem e o tom de comunicação ao Gemini. Não envia automaticamente dados de
finanças, saúde ou diário. O segredo Gemini permanece fora do frontend.

Configurações necessárias **apenas em Supabase Secrets**, após validação:

```dotenv
FLUIR_GEMINI_API_KEY=CONFIGURAR_NO_SUPABASE_SECRETS
FLUIR_AI_MODEL=gemini-2.5-flash
FLUIR_ALLOWED_ORIGINS=https://fluir-sistema.vercel.app
```

`FLUIR_ALLOWED_ORIGINS` admite uma lista separada por vírgulas de origens exatas
de produção/staging. O projeto deve manter a verificação de JWT da Edge Function
habilitada. Não usar `--no-verify-jwt`; não abrir `*` em CORS.
A configuração acima é **somente um exemplo sem credencial válida**.

## Plano para colocar em produção, somente com autorização

1. Backups verificados do projeto Supabase existente e exportação dos dados locais consentidos.
2. Migração em staging, testes A/B, logins reais fictícios, verificação de isolamento e comparação de dados.
3. Proteção do Data API legado (risco crítico verificado) em mudança controlada, sem interromper Spring antes de teste.
4. Preparar nova UI principal com mesmo visual Fluir. O protótipo React `mobile/` não pode substituir automaticamente o site principal.
5. Revisar Edge Function do Gemini, migrations de finanças/ciclo/anexos, importação local e permissões por usuário.
6. Homologar todas as rotas e dispositivos, com dados verdadeiros de QA e não simulações.
7. **Após autorização expressa:** configurar Vercel, cadastrar variáveis públicas, publicar staging e depois produção.
8. Conferir URL definitiva, CORS/Auth OAuth redirect, logs, RLS, expiracão de sessão, reset de senha, funções e Storage.
9. **Somente após todas as verificações:** desativar Spring/Render e excluir suas referências do código.

Não há ambiente de produção novo nesta fase.
