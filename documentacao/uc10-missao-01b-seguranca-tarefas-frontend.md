# UC10 · Missão 01B · Segurança das Tarefas (Frontend)

**Responsável:** Dawid  
**Data:** 04/11/2026  
**Branch:** `dawid/seguranca-tarefas-frontend-uc10`  
**Base:** `alex/entrega-documentacao-qa-30-10` (`14c4ef97`)  
**Card:** https://trello.com/c/LeH61rBp

## Objetivo e escopo

Enviar o token da sessão em todas as operações da API de tarefas e tratar 401/403, sem alterar layout, Java, SecurityConfig, branch main ou ambiente publicado.

## Alterações

- `js/tasks.js`: leitura do token em `sessionStorage["fluir-user"]`, validação básica da sessão e inclusão de `Authorization: Bearer <token>` no wrapper `requestTaskApi`.
- Reutilização do wrapper em GET (`/usuario/{id}`), POST (`/api/tarefas`), PUT (`/{id}/status`), DELETE (`/{id}`) e exclusão em lote.
- POST mantém `Content-Type: application/json`.
- 401: avisa, remove somente `fluir-user` da sessão e direciona para `login.html`. 403: avisa sobre acesso negado sem remover a sessão.
- Operações só atualizam tarefas e timeline após resposta de sucesso; sem sessão não há requisições.
- Falhas de carregamento não apagam o estado de tarefas em memória. Em exclusões em lote com falha não autorizativa, uma nova leitura tenta reconciliar o estado (o lote pode ter sido parcialmente aplicado).
- `testes/cypress/e2e/tarefas-seguranca.cy.js`: 9 cenários de interface com `cy.intercept`, sem requisições de tarefas para produção.
- `js/login.js` e arquivos Java **não alterados**.

## Evidências de teste

### Executado: validação isolada com funções simuladas em JavaScript

Em 04/11/2026, a versão do `tasks.js` foi compilada via `new Function` e submetida a verificações com DOM, armazenamento, `fetch`, alert e navegação simulados, sem requisições reais.

| Cenário | Resultado |
|---|---|
| GET envia Bearer e mapeia resposta | PASSOU |
| POST envia Bearer e JSON, mantendo usuário | PASSOU |
| PUT altera status após sucesso | PASSOU |
| DELETE individual remove após sucesso | PASSOU |
| DELETE em lote usa Bearer em cada requisição | PASSOU |
| Sem token bloqueia fetch e redireciona | PASSOU |
| 401 informa, remove sessão e redireciona | PASSOU |
| 403 informa e preserva tarefa/sessão | PASSOU |
| Lote com 403 não limpa estado local indevidamente | PASSOU |

**Limite da evidência:** testes de lógica em ambiente simulado não substituem Cypress real nem teste de integração Java/Spring. Não houve impressão de token real, criação de usuários de produção ou ações destrutivas.

### Executado: Cypress em navegador Electron, com APIs simuladas

Arquivo: `testes/cypress/e2e/tarefas-seguranca.cy.js`

**Execução informada por Dawid em 04/11/2026**, no Windows, com servidor local `python -m http.server 5500 --bind 127.0.0.1`.

Comando executado dentro da pasta `testes/`:

```powershell
npx cypress run --browser electron --spec "cypress/e2e/tarefas-seguranca.cy.js"
```

Relatório do terminal fornecido por Dawid:

- Cypress: `13.15.0`; navegador: `Electron 118 (headless)`; Node: `v24.16.0`
- Especificações executadas: **1**
- Cenários: **8 aprovados, 0 falhas, 0 pendentes, 0 ignorados**
- Casos CT-SEG-01 a CT-SEG-08: GET, POST, PUT, DELETE, DELETE em lote, ausência de sessão, 401 e 403
- Duração mostrada pelo Cypress: **2 segundos** no resumo de execução (linha `8 passing (3s)`)
- Processo encerrado com `exit code 0` e mensagem `All specs passed!`
- Screenshots: **0**; vídeo: desativado

**Limite da evidência:** testes Cypress rodaram com interceptações `cy.intercept`, sem backend protegido real e sem persistência efetiva no banco. A integração com Alex permanece pendente. Não foram capturados screenshots ou vídeo dessa execução.

## Pendências de integração (Alex + Dawid)

- Confirmar contrato final de `/api/tarefas/**` com backend protegido, incluindo CORS para `Authorization`, expiração do token, 401/403 e identificação de proprietário.
- Registrar evidência do resumo do Cypress (saída do terminal já recebida) e, se necessário, gerar artefatos JUnit em futura execução de QA.
- Em ambiente isolado com **dois usuários fictícios**, testar criar/listar/concluir/excluir apenas tarefas próprias e rejeitar acesso a tarefas do outro usuário.
- Rever exclusão em lote com resposta parcialmente aplicada e a sinalização ao usuário.
- Revisar o PR independente de Dawid contra a branch combinada apropriada; nenhuma integração à `main` ou deploy antes de aprovação.

## Commits

1. `fb2590d` — `fix(tasks): autenticar requisicoes e tratar 401/403`
2. `219a64a` — `test(tasks): cobrir autenticacao Bearer e respostas 401/403 no Cypress`

**Status:** implementação frontend concluída para o escopo previsto e 9/9 testes Cypress de segurança com rede simulada aprovados; integração com backend protegido ainda pendente.

## Regressão funcional independente (04/11/2026)

Dawid executou localmente a suíte pré-existente `testes/cypress/e2e/fluir-smoke.cy.js`, com servidor estático em `127.0.0.1:5500` e navegador Electron 118 (headless):

```powershell
$env:DEBUG=""; npx cypress run --browser electron --spec "cypress/e2e/fluir-smoke.cy.js"
```

Saída do terminal fornecida por Dawid: **8 passing (3s)**, **0 falhas**, mensagem **All specs passed!** e duração reportada de 3 segundos. Casos aprovados: CT001, CT007, CT038 (login), CT025, CT026, CT029 (hidratação) e CT035, CT037 (conquistas). Não foram produzidos screenshots; vídeo desativado.

**Consolidado atualizado:** 17/17 cenários Cypress aprovados nas duas suítes (9 segurança de tarefas + 8 smoke). A execução ocorreu no frontend local; a integração de autorização com o backend protegido ainda não foi comprovada.


## Auditoria de dependências da suíte de testes (04/11/2026)

Dawid executou localmente, em `testes/`, os comandos `npm audit --omit=dev`, `npm audit` e `npm audit fix --dry-run`. A saída fornecida mostrou:

- `npm audit --omit=dev`: **0 vulnerabilidades** nas dependências classificadas como produção **deste pacote de testes**, sem constituir auditoria do backend nem de todo o Fluir.
- `npm audit`: **8 vulnerabilidades (6 moderadas, 2 altas)** em dependências de desenvolvimento/transitivas, envolvendo `extract-zip`, `glob`, `minimatch`, `qs`, `uuid` e dependências relacionadas ao Cypress/Mocha.
- `npm audit fix --dry-run`: continuou reportando **8 vulnerabilidades**; nenhuma atualização foi aplicada nessa simulação.
- Para algumas vulnerabilidades, a ferramenta recomenda `npm audit fix --force`, que instalaria `cypress@16.2.1`, mudança potencialmente incompatível com a versão `13.15.0` usada na validação.

**Decisão:** não executar `--force` nem atualizar dependências sem revisão e regressão. Tratar as vulnerabilidades identificadas como pendência de segurança da cadeia de desenvolvimento, considerando especialmente o uso de arquivos ZIP de fontes confiáveis. Reavaliar correções e compatibilidade em etapa própria. Nenhuma mudança em `package.json` foi feita nesta análise via GitHub. Confirmar `git status -sb` local após a auditoria.


### Nova execução: CT-SEG-09 e regressão da segurança (04/11/2026)

Após acrescentar o cenário CT-SEG-09 ("sessão removida após carregar bloqueia criação") no arquivo `testes/cypress/e2e/tarefas-seguranca.cy.js`, Dawid sincronizou a branch e executou novamente:

```powershell
npx cypress run --browser electron --spec "cypress/e2e/tarefas-seguranca.cy.js"
```

Saída do terminal compartilhada: **9 passing (4s)**; **9 testes, 9 aprovações, 0 falhas, 0 pendentes, 0 ignorados**, mensagem **All specs passed!**. Cypress 13.15.0, Electron 118 headless, Node v24.16.0. O resumo tabular indicou duração de 3 segundos. O novo cenário verificou que retirar `fluir-user` de `sessionStorage` após o carregamento bloqueia POST e redireciona ao login. Nenhuma requisição real à API de tarefas foi realizada pela suíte, pois utiliza interceptações.

**Total atualizado das suítes executadas localmente:** **17/17 aprovados** (9 segurança + 8 smoke). **Integração real de autorização no backend do Alex continua pendente**.


## Execução consolidada final das duas suítes (04/11/2026)

**Comando executado por Dawid**, no diretório `testes/`, com servidor HTTP local na porta 5500:

```powershell
npx cypress run --browser electron --spec "cypress/e2e/tarefas-seguranca.cy.js,cypress/e2e/fluir-smoke.cy.js"
```

**Saída do terminal recebida:**

- `tarefas-seguranca.cy.js`: **10/10 PASSOU** (CT-SEG-01 a CT-SEG-10).
- `fluir-smoke.cy.js`: **8/8 PASSOU** (CT001, CT007, CT038, CT025, CT026, CT029, CT035, CT037).
- **Total: 18 testes, 18 aprovações, 0 falhas, 0 pendentes, 0 ignorados**, mensagem `All specs passed!`.
- Cypress **13.15.0**, Electron **118 (headless)**, Node.js **v24.16.0**, **2 especificações**.
- Resumo final com duração **00:07**; screenshots 0, vídeo desativado.
- **CT-SEG-10:** POST recebe 401 simulado, remove a sessão, redireciona para login e não cria evento na timeline.

**Escopo da evidência:** os 10 testes de segurança usam interceptações para simular as respostas HTTP, sem testar autorização real no backend ou persistência no banco. O teste de dois usuários e a integração com as correções do Alex continuam pendentes.

**Estado do backend no GitHub após conferência:** a branch `alex/correcao-seguranca-tarefas-uc10` não tinha commits à frente de `alex/entrega-documentacao-qa-30-10` no momento da consulta. Não presumir que o trabalho local do Alex esteja concluído ou ausente.
