# Cypress e JMeter - execução automatizada no GitHub Actions

## Cypress
- [Workflow Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/workflows/qa-cypress.yml).
- Fonte: `testes/cypress/e2e/fluir-smoke.cy.js`, 8 cenários sem dados reais.
- Ambiente: servidor HTTP local 127.0.0.1:5500, runner Ubuntu com Node 20 e Electron do Cypress.
- Evidências: relatórios XML JUnit do Cypress, prints de falhas e log HTTP, reunidos no artefato `fluir-evidencias-cypress`.
- Evidência mínima: copiar link da execução e baixar ZIP do artefato (retido por 14 dias). Se houver falha, registrar os IDs afetados e os prints.

## JMeter
- [Workflow JMeter](https://github.com/Lexissantosz/Fluir-Sistema/actions/workflows/qa-jmeter.yml).
- Fonte: `testes/jmeter/fluir-api-local.jmx`, carga leve de 2 usuários virtuais × 2 requisições = 4 amostras.
- Ambiente: backend Java 21, PostgreSQL 16 temporário e `localhost:8080`; sem tráfego de teste de carga à produção.
- Evidências: `resultados.jtl`, `resumo.json`, painel HTML e log do backend no artefato `fluir-evidencias-jmeter`.
- Atenção: este é apenas teste inicial de disponibilidade/latência sob carga leve, não prova capacidade de produção.

## Registro
Após a conclusão de cada workflow, registrar **execução, commit, testes executados, aprovados/reprovados e link de artefatos** em `testes/relatorios/`. Nunca marcar como aprovado antes da execução.
