# Fluir | Central de Qualidade e Testes
**Data:** 30/10/2026 • Equipe: Alex e Dawid

## Resultado das seis ferramentas
**JUnit, Mockito, Swagger, Postman, Cypress e JMeter tiveram execuções aprovadas em ambiente de QA.** Consulte o [fechamento com números e links de evidência](relatorios/fechamento-6-ferramentas-2026-10-30.md). Não confunda isso com liberação para produção.

## Arquivos importantes
| Arquivo | Finalidade |
|---|---|
| [Casos de teste: 46 cenários](casos-de-teste.csv) | Catálogo de testes documentados |
| [Matriz de rastreabilidade](matriz-rastreabilidade.csv) | Requisitos x casos |
| [Registro manual](execucao/registro-de-execucao.csv) | Pendências para execução integral |
| [Execução automática de interface](execucao/execucao-automatica-2026-10-30.csv) | 8 testes Cypress aprovados no ambiente local |
| [Relatório consolidado](relatorios/relatorio-execucao.md) | Síntese e decisão |
| [Fechamento das seis ferramentas](relatorios/fechamento-6-ferramentas-2026-10-30.md) | Resultados confirmados e links GitHub Actions |
| [Evidências preservadas](evidencias/2026-10-30/) | XML, JTL, JSON e resumos textuais |
| [Defeitos](relatorios/relatorio-defeitos.md) | Histórico, riscos e modelo |
| [Guia das seis ferramentas](GUIA-6-FERRAMENTAS.md) | Como repetir as execuções |
| [Guia Cypress e JMeter](GUIA-CYPRESS-JMETER.md) | Como repetir e interpretar resultados |

## Regras de registro
Registre **status, executor, ambiente, commit, data, passos e evidência** ao executar um caso de teste. Anote defeitos reproduzíveis em `defeitos/registro-defeitos.csv`. Nunca envie tokens, senhas ou dados reais. Os artefatos completos do GitHub Actions expiram; resumos e evidências textuais relevantes foram preservados nesta branch.
