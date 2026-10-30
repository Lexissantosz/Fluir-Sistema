# Fluir — Dossiê técnico de QA, 30/10/2026
**Equipe:** Alex e Dawid

## O que entregar para a professora
O Fluir possui **seis ferramentas de QA executadas com sucesso** no ambiente isolado: JUnit, Mockito, Swagger/OpenAPI, Postman/Newman, Cypress e JMeter. Foram documentados 46 cenários de teste, com **8 cenários de interface aprovados por Cypress**, e 23 testes Java aprovados. Os demais cenários do catálogo **não foram todos executados**.

## Relatórios detalhados
1. [Fechamento das seis ferramentas](../relatorios/fechamento-6-ferramentas-2026-10-30.md)
2. [JUnit/Mockito: 23 métodos e critérios](../relatorios/relatorio-detalhado-junit-mockito.md)
3. [Cypress: execução, falha e reteste](../relatorios/relatorio-regressao-cypress.md)
4. [JMeter: resultados e interpretação](../relatorios/relatorio-desempenho-jmeter.md)
5. [Swagger + Postman](../relatorios/execucao-swagger-postman-2026-10-30.md)
6. [Rastreabilidade dos 46 casos e pendências](../relatorios/matriz-cobertura-real.md)
7. [Plano de testes](../plano-de-testes.md)
8. [Registro consolidado](../relatorios/relatorio-execucao.md)

## Dados originais e anexos
- [XML do Cypress aprovado](cypress-junit.xml)
- [JMeter JTL](jmeter-resultados.jtl) e [JSON](jmeter-resumo.json)
- [Resumo Swagger](swagger-relatorio.md) e [resumo Postman](postman-relatorio.md)
- [Resumo JUnit/Mockito](junit-mockito-resumo.md)
- Logs completos, screenshots e dashboards gráficos estão nos [artefatos dos respectivos workflows](../relatorios/fechamento-6-ferramentas-2026-10-30.md), sujeitos à retenção do GitHub Actions.

## Risco e honestidade metodológica
Não tratar “ferramenta executada” como “sistema inteiro aprovado”. O acesso cruzado entre usuários e a conta de demonstração pública ainda precisam ser validados. Esta documentação foi produzida com base nas execuções reais e não contém prints fabricados.
