# Fluir | Fechamento das seis ferramentas de QA
**Data:** 30/10/2026 • **Equipe:** Alex e Dawid
**Branch:** `alex/entrega-documentacao-qa-30-10`

## Resultado geral: todas as seis ferramentas executadas com sucesso
| Ferramenta | Execução comprovada | Resultado | Evidência |
|---|---|---|---|
| JUnit 5 | 23 testes Java (em conjunto com Mockito) | 23 passaram, 0 falhas, 0 erros, 0 ignorados | [Workflow](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845088) |
| Mockito | 3 testes específicos de serviço, incluídos nos 23 do JUnit | 3 passaram | [Workflow](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845088) |
| Swagger/OpenAPI | 8 rotas e 8 operações na especificação 3.1.0 | Validação aprovada | [Workflow](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845089) |
| Postman + Newman | 8 requisições e 11 verificações | 0 falhas | [Workflow](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845151) |
| Cypress | 8 testes de interface e regras de Água/Conquistas | 8 passaram, 0 falhas | [Workflow](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086) |
| JMeter | 2 usuários × 2 loops = 4 requisições GET locais | 4 sucessos, 0 erros; média 7 ms | [Workflow](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118512320) |

## Evidências permanentes no GitHub
- [Relatório JUnit + Mockito](../evidencias/2026-10-30/junit-mockito-resumo.md).
- [Especificação e validação Swagger](../evidencias/2026-10-30/swagger-relatorio.md).
- [Resumo da execução Postman/Newman](../evidencias/2026-10-30/postman-relatorio.md).
- [XML original do Cypress](../evidencias/2026-10-30/cypress-junit.xml).
- [JTL original do JMeter](../evidencias/2026-10-30/jmeter-resultados.jtl) e [JSON de estatísticas](../evidencias/2026-10-30/jmeter-resumo.json).
- [Tabela de execução automática com oito cenários de interface](../execucao/execucao-automatica-2026-10-30.csv).

## Histórico de falhas e correções
1. Ambiente local do SENAC estava com Java 11; backend requer Java 21. Execuções no GitHub Actions contornaram o bloqueio sem instalação local.
2. Swagger/Postman tinham falhas no startup da API. Após correção da inicialização e atualização do Spring Boot para 3.5.16, os fluxos foram aprovados.
3. Cypress inicialmente executou 8 testes com 1 falha. O teste CT037 esperava a classe `active` no modal; o código real utiliza `show`. Ajuste apenas na asserção. Reteste (commit `fae81b9af76c46a9be7b69082a0bc020655eef9d`): 8/8.

## Limites importantes
- **46 casos do plano geral** são um catálogo independente; não foram todos executados nem devem ser apresentados como 46 aprovações.
- JUnit contabiliza os testes Mockito; não somar 23 + 3.
- Swagger testou geração de OpenAPI e acesso à interface; não prova todas as operações de negócio.
- JMeter avaliou apenas o endpoint de saúde no **localhost** com quatro amostras; não é laudo de capacidade ou desempenho em produção.
- Testes com dados fictícios e banco temporário não provam segurança entre usuários, nem disponibilidade da aplicação publicada.
- A aprovação de todas as seis ferramentas **não equivale à aprovação do produto para produção**. Seguem pendentes testes ponta a ponta, revisão de autorização e validação do login de demonstração.

## Artefatos originais de CI (expiram)
- [JUnit e Mockito](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845088).
- [Swagger com screenshot](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845089).
- [Postman](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845151).
- [Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- [JMeter com dashboard HTML](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118512320).

**Parecer para entrega escolar:** evidências suficientes para mostrar que as **seis ferramentas foram utilizadas** e que os cenários automatizados descritos passaram. **Não emitir parecer irrestrito de liberação para produção**.
