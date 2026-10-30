# Fluir | Catálogo de casos de teste

**Data da preparação:** 30/10/2026

**Escopo:** 46 casos, baseados na estrutura existente em HTML/CSS/JS, API Java/Spring Boot, PostgreSQL e requisitos em `documentacao/analise.md`.

**Situação:** TODOS inicialmente **NÃO EXECUTADOS**; status não indica aprovação. Os passos, pré-condições, resultados esperados e evidência sugerida de cada CT estão disponíveis na planilha CSV `casos-de-teste.csv` (Excel / LibreOffice / Google Sheets).

## Índice rápido

| ID | Módulo | Tipo | Prioridade | Requisito | Situação |
|---|---|---|---|---|---|
| CT001 | Implantação | Smoke | Alta | RNF04 | Não executado |
| CT002 | API | Smoke | Alta | RNF04 | Não executado |
| CT003 | Integração | Resiliência | Alta | RNF04 | Não executado |
| CT004 | Integração | Desempenho | Alta | RNF04 | Não executado |
| CT005 | Autenticação | Funcional | Crítica | RF01 | Não executado |
| CT006 | Autenticação | Negativo | Alta | RF01 | Não executado |
| CT007 | Autenticação | Validação | Média | RF01 | Não executado |
| CT008 | Cadastro | Validação | Média | RF01 | Não executado |
| CT009 | Cadastro | Negativo | Alta | RF01 | Não executado |
| CT010 | Cadastro | Funcional | Alta | RF01 | Não executado |
| CT011 | Sessão | Regressão | Alta | RF01 | Não executado |
| CT012 | Sessão | Segurança | Alta | RF01 | Não executado |
| CT013 | Onboarding | Funcional | Alta | RF02 | Não executado |
| CT014 | Onboarding | Validação | Média | RF02 | Não executado |
| CT015 | Onboarding | Funcional | Alta | RF02 | Não executado |
| CT016 | Onboarding | Regressão | Alta | RF02 | Não executado |
| CT017 | Dashboard | Funcional | Alta | RF03 | Não executado |
| CT018 | Tarefas | Funcional | Alta | RF04 | Não executado |
| CT019 | Tarefas | Integração | Alta | RF04 | Não executado |
| CT020 | Tarefas | Funcional | Alta | RF04 | Não executado |
| CT021 | Tarefas | Funcional | Média | RF04 | Não executado |
| CT022 | Tarefas | Funcional | Média | RF04 | Não executado |
| CT023 | Tarefas | Validação | Alta | RF04 | Não executado |
| CT024 | Segurança | Autorização | Crítica | RNF03 | Não executado |
| CT025 | Água | Funcional | Alta | RF05 | Não executado |
| CT026 | Água | Funcional | Alta | RF05 | Não executado |
| CT027 | Água | Funcional | Alta | RF05 | Não executado |
| CT028 | Água | Limite | Alta | RF05 | Não executado |
| CT029 | Água | Validação | Alta | RF05 | Não executado |
| CT030 | Água | Limite | Alta | RF05 | Não executado |
| CT031 | Água | Funcional | Média | RF05 | Não executado |
| CT032 | Água | Confirmação | Alta | RF05 | Não executado |
| CT033 | Água | Funcional | Alta | RF05 | Não executado |
| CT034 | Água | Persistência local | Média | RF05 | Não executado |
| CT035 | Conquistas | Funcional | Média | RF06 | Não executado |
| CT036 | Conquistas | Funcional | Alta | RF06 | Não executado |
| CT037 | Conquistas | Interface | Média | RF06 | Não executado |
| CT038 | Responsividade | Visual | Alta | RNF02 | Não executado |
| CT039 | Responsividade | Visual | Média | RNF02 | Não executado |
| CT040 | Responsividade | Regressão | Alta | RNF02 | Não executado |
| CT041 | Responsividade | Regressão | Média | RNF02 | Não executado |
| CT042 | Acessibilidade | Usabilidade | Média | RNF01 | Não executado |
| CT043 | Qualidade | Regressão | Alta | RNF05 | Não executado |
| CT044 | Segurança | Privacidade | Crítica | RNF03 | Não executado |
| CT045 | Deploy | Smoke | Alta | RNF04 | Não executado |
| CT046 | Banco | Integração | Alta | RNF04 | Não executado |

## Convenção de status
- **NÃO EXECUTADO:** apenas definido no plano, sem resultado.
- **PASSOU:** executado, corresponde ao esperado, evidência identificada.
- **FALHOU:** executado, apresenta divergência, defeito associado.
- **BLOQUEADO:** não foi possível executar, informar motivo e dependência.
- **NÃO APLICÁVEL:** cenário não se aplica à versão testada, justificar.

## Critérios mínimos de evidência
Cada execução deve indicar **responsável**, **data/hora**, **ambiente**, **branch/commit**, **resultado obtido** e **caminho do print ou log**. Nunca capturar senhas, cookies ou tokens.

## Revisão importante
Os casos CT024 e CT044 são de autorização/privacidade: **não foram comprovados como aprovados**. O código de `TarefaController` merece atenção por expor ações de tarefas baseadas em IDs sem demonstrar, no próprio controlador, a verificação do usuário da sessão. Não publicar login de demonstração até validar isolamento entre contas.
