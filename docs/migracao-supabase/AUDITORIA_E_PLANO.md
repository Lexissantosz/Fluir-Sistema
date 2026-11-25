# Fluir | Migração controlada Vercel + Supabase
**Data da auditoria:** 24/11/2026
**Escopo:** Fluir-Sistema, branch LOCAL `alex/migracao-supabase-fase1-24-11`
**Referência técnica em modo leitura:** https://github.com/joaorikelme1/IgrejaViagens
**Status:** Fase 1 em implementação, **NÃO HOMOLOGADA**. Nenhum deploy, merge, migração remota ou alteração em dados reais.

## 1. Inventário da arquitetura original

- **Site principal em produção:** `index.html`, `html/*.html`, `css/*.css`, `js/*.js`: HTML, CSS, JavaScript sem framework. Hospedagem Vercel. Layout e identidade preservados: não substituídos nesta fase.
- **API legada:** `backend/`: Java, Spring Boot, Spring Security, JPA/Hibernate, Flyway, Maven; hospedada no Render.
- **Persistência já existente:** PostgreSQL hospedado no Supabase; `usuarios.id` integer; contas/sessões **não** usam Supabase Auth.
- **Protótipo React separado:** `mobile/`: React + TypeScript + Vite. Antes apontava para `localhost:8080`, com fallback indevido para demonstração ao falhar login.
- **Autenticação legada:** BCrypt em `usuarios.senha`, token aleatório associado a hash em `sessoes_login`, validade de 12h, Google customizado; ainda precisa de plano de conversão de contas.
- **IA:** Java `AssistenteChatService` chama API Gemini usando chave exclusiva do servidor.
- **Dados locais:** muitos módulos guardam registros sob chaves `fluir-*` em `localStorage`. Isso exige exportação por usuário com consentimento e deduplicação; banco SQL não contém esses registros automaticamente.

### APIs do Spring identificadas

| Grupo | Rotas/responsabilidades | Nova responsabilidade |
|---|---|---|
| Usuários | cadastro, login, Google, vinculação, sessão | Supabase Auth + OAuth; processo seguro de vinculação do legado |
| Onboarding | salvar, buscar por usuário, criar dados iniciais | `fluir_onboarding` + RPC transacional validada |
| Tarefas | listar/criar/concluir/excluir + ownership | `fluir_tasks` + RLS com `auth.uid()` |
| Assistente | chat Gemini, interpretação, registros, exclusão | Edge Function autenticada com segredo do Gemini + RLS |
| Saúde da API | live/ready | observabilidade do Supabase, sem API Java |
| Hábitos | serviço e modelo JPA + estado local | `fluir_habits` + RLS, UI adaptada |
| Preferências | perfil, módulos e muitas `preferencias_*` | `fluir_profiles`, `fluir_onboarding` e tabelas específicas por módulo |

### Mapa funcional módulo a módulo

| Módulo | Estado atual verificado | Destino e estratégia | Nesta fase |
|---|---|---|---|
| Landing/login | JS estático, POST Java | Supabase Auth; manter layout | Cliente React protótipo ligado ao Auth; site estático ainda legado |
| Perfil/configurações | `fluir-profile`, `fluir-setup`, Postgres perfil | `fluir_profiles` e preferências por usuário | tabela, RLS e serviço inicial |
| Onboarding | `js/setup.js` + Java/Postgres | RPC transacional `fluir_complete_onboarding` | SQL e integração React |
| Dashboard | JS agrega registros locais | consultas agregadas por usuário e RLS | não migrado no site principal |
| Tarefas | Spring `TarefaController` + tabela legada `tarefas` | `fluir_tasks` + Supabase SDK | tabela, políticas e serviço React |
| Hábitos | `fluir-habits`, modelo/tabela legado | `fluir_habits` e checagens | tabela/RLS, UI principal pendente |
| Água | `fluir-water` + preferências SQL | registros vinculados ao usuário e metas | ponte `fluir_records`; UI pendente |
| Sono | `fluir-sleep-logs` + preferências | registros sensíveis isolados por usuário | ponte; UI pendente |
| Finanças | `fluir-finances` local + preferências | tabelas financeiras específicas; RLS | descoberta documentada; migração pendente |
| Diário | `fluir-diary` local + preferências | registros privados e controle de retenção | descoberta documentada; pendente |
| Saúde física | `fluir-physical-health` local | tabelas privadas e segurança reforçada | descoberta; pendente |
| Ciclo menstrual | `fluir-menstrual-cycle` local | perfis compartilhados com consentimento + RLS | descoberta; pendente |
| Nutrição | `fluir-nutrition` local | registros privados e validação | descoberta; pendente |
| Timeline | `fluir-timeline-events` local | eventos vinculados ao usuário | descoberta; pendente |
| Conquistas | local e derivadas de hábitos/tarefas | cálculo consistente/consultas RPC | pendente |
| Anexos | `fluir-attachments` local; arquivos no cliente | bucket privado + metadados/URLs assinadas | buckets/policies + serviço TS; UI pendente |
| IA | serviço Java/Gemini | Edge Function privada; confirmação antes de escrita | Edge Function e tela React criadas; publicação e integração do site principal pendentes |
| Planos | referência de `localhost:8080/users/{userId}/subscription` no JS | modelagem e cobrança com segurança | pendente de validação de regras reais |
| Android/iPhone/Windows | PWA e protótipos parciais | consumo compartilhado de Supabase SDK | protótipo React parcial; builds específicos pendentes |

## 2. Aprendizados do IgrejaViagens

Arquivos examinados: `frontend/package.json`, `frontend/src/infrastructure/supabase/client.ts`,
`frontend/src/features/auth/api/authApi.ts`, `frontend/src/features/auth/context/AuthProvider.tsx`,
`frontend/vercel.json`, `supabase/migrations`, `supabase/functions/provision-user`,
`supabase/functions/assistant-chat`, `supabase/tests/database/001_schema_and_rls.sql`.

Decisões reutilizáveis: cliente Supabase no frontend usando somente chave publicável; Auth com sessão renovável; RLS por linha; RPC para operações atômicas; Edge Functions para IA e ações privilegiadas; Storage privado; migrations e testes SQL; Vercel para frontend. A pasta Java legada também permanece no repositório de referência. **Não copiar** CPF como login, tabelas de viagens, regras de cobrança ou permissões administrativas desse projeto.

## 3. Segurança crítica no banco existente

Projeto Supabase conectado: `xqzxfhodhmlgneudubjm` (sa-east-1). Consulta read-only confirmou:
- 19 contas na tabela legada `public.usuarios`, zero identidades em `auth.users`.
- 18 tabelas públicas existentes; 17 sem RLS; as 18 concediam `SELECT/INSERT/UPDATE` a `anon` na inspeção de 24/11.
- Isso inclui `usuarios.senha` (hash), `sessoes_login`, `preferencias_financas`, `tarefas` e informações de saúde/ciclo. **Risco crítico de acesso indevido via Data API**, dependendo de sua exposição/configuração.
- Nenhuma policy pública existente foi identificada; nenhuma Edge Function existente, e nenhum bucket encontrado.
- **Nenhuma mudança executada no projeto remoto**.

Preparada separadamente `supabase/migrations/*_secure_legacy_data_api.sql`: remove grants `anon`, habilita RLS e vincula ownership a `fluir_identity_links`. A aplicação depende de backup, autorização e testes de compatibilidade; ativá-la cegamente pode quebrar outras integrações. Separar execução em janela de manutenção.

## 4. Nova arquitetura alvo

```
Vercel (site principal HTML/CSS/JS modernizado gradualmente + build React quando adequado)
  -> @supabase/supabase-js, publishable key e JWT da conta
     -> Supabase Auth (cadastro, login, OAuth, recuperação, refresh)
     -> Supabase PostgREST (Tarefas, Perfil, Onboarding, Registros) com RLS
     -> Supabase RPC (gravações transacionais, confirmações)
     -> Supabase Storage (avatares/anexos privados, URL temporária)
     -> Supabase Edge Functions (Gemini e ações administrativas)
                 segredo de IA/service key SOMENTE no servidor
```

Nenhum novo backend Java/Render. **Backend antigo continua** até o último endpoint ter equivalente real em Supabase e testes de autorização.

## 5. Plano de migração das identidades antigas

Os IDs antigos são inteiros, os UUIDs do Auth são UUID. Nunca igualar automaticamente contas por e-mail ou confiar em IDs fornecidos pelo navegador.
1. Backup da base e inventário dos 19 usuários (sem imprimir hashes/tokens).
2. Definir estratégia: validação da senha legada em função privilegiada transitória e verificação de titularidade, **ou** redefinição de senha por e-mail comprovadamente verificado.
3. Criar identidade em Auth com permissões mínimas e registrar vínculo `fluir_identity_links` **somente após verificação**, usando operação administrativa no servidor.
4. Associar dados legados ao novo UUID sem alterar IDs originais e sem duplicar dados; validar contagens/checksums.
5. Testar contas A/B: proibir ler, inserir, alterar, excluir dados de B usando a sessão de A.
6. Desativar a rota de login antiga apenas após corte validado, revogação de sessões antigas e aprovação.

Para usuários vindos apenas de Google, validar identidade com OAuth real e vinculação segura. Não importar hashes BCrypt para `auth.users` via SQL direto.

## 6. Arquivos e escopo já implementados na branch local

- `supabase/migrations/20261125191326_fluir_auth_and_data_foundation.sql`: schema novo, Auth trigger, privilégios, RLS, tarefas/hábitos, onboarding, Storage.
- `supabase/migrations/20261125192500_secure_legacy_data_api.sql`: contenção dos grants legados (**NÃO APLICADA**).
- `mobile/src/infrastructure/supabase.ts`: cliente autenticado, sem service role.
- `mobile/src/services/api.ts`: Auth, senha, sessão, RPC onboarding.
- `mobile/src/services/tasks.ts`: tarefas sob Auth + RLS.
- `mobile/src/services/assistant.ts` e `mobile/src/screens/AssistantScreen.tsx`: invocação autenticada e consentida da Edge Function; ainda não implantada.
- `supabase/functions/fluir-assistant-chat/index.ts`: Gemini com JWT, CORS restrito, consentimento, limite atômico por usuário; requer segredo e staging.
- `mobile/src/services/storage.ts`: validação MIME/tamanho, upload privado, URLs assinadas.
- `mobile/src/App.tsx`, `mobile/src/screens/LoginScreen.tsx`, `SettingsScreen.tsx`, `TasksScreen.tsx`: fluxo inicial sem sucesso fingido, alterações progressivas de UI.
- `mobile/src/types/fluir.ts`: UUID em vez de integer.
- `mobile/.env.example` e dependência `@supabase/supabase-js` com lockfile.

**Ainda não implementado:** conversão dos módulos do site principal, importação real de dados locais, implantação e validação real da Edge Function Gemini, testes de RLS em PostgreSQL, upload/download pela UI de anexos, builds distribuídos, OAuth real, normalização completa, administração e mecanismo seguro de atribuição de papéis.

## 7. Validação e deploy

Na fase 1, `npm run build` e `npm run lint` de `mobile/` são obrigatórios; a verificação de migrações SQL por parser NÃO substitui testes Postgres. A máquina de desenvolvimento tem Docker instalado, mas o daemon não estava ativo na auditoria. **Nenhuma migration foi executada no projeto remoto.**

Sequência de homologação futura:
1. Copiar **somente schema/dados fictícios** para ambiente Supabase local/staging com Docker; testar migrations, rollback, RLS e Storage com A/B.
2. Testar cadastro, login, recuperação, reentrada, autorização, onboarding, CRUD e uploads reais.
3. Importar dados legados após consentimento, comparar contagens e impedir duplicações.
4. Testar módulo por módulo em navegador e dispositivos reais, UX e acessibilidade.
5. Configurar Vercel com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (apenas públicos).
6. Configurar Edge Function com `FLUIR_GEMINI_API_KEY` em secrets do Supabase; nunca levar para Vercel/frontend.
7. Fazer staging com commit/testes validados; aprovação do usuário; depois promover produção de forma reversível.
8. Revalidar domínio, notificações, comportamento offline e limites do plano Supabase/Vercel.
9. Só remover Render/Spring após último endpoint sem tráfego e dados totalmente homologados.

**Bloqueadores conhecidos:** RLS do banco atual; contas legadas 19 vs Auth 0; dados locais sensíveis e anexos; frontend principal ainda vanilla; impossibilidade de testar Postgres local enquanto Docker daemon estiver desligado.

Nenhum deploy será feito sem autorização expressa.
