# Fluir — Relatório de execução de desempenho JMeter
**Data:** 30/10/2026  
**Ferramenta:** Apache JMeter 5.6.3, execução não gráfica no GitHub Actions.  
**Execução comprovada:** [QA Fluir JMeter](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118512320).

## Cenário e infraestrutura
- Requisição: `GET http://localhost:8080/api/usuarios/teste`.
- Backend: Java 21 / Spring Boot e PostgreSQL 16 **isolado**.
- 2 usuários virtuais, 2 repetições por usuário, 4 amostras totais.
- Rampa de inicialização: 2 segundos.
- Sem dados de produção ou carga no servidor público.

## Resultados obtidos
| Indicador | Resultado |
|---|---:|
| Requisições | **4** |
| Respostas HTTP 200 | **4** |
| Erros | **0** |
| Taxa de erro | **0%** |
| Menor latência de resposta | **2 ms** |
| Maior latência de resposta | **21 ms** |
| Tempo médio | **7 ms** |
| Vazão observada no sumarizador | **3,9 requisições/segundo** |

A média e demais números foram extraídos de `resultados.jtl`, `resumo.json` e do log do JMeter.

## Evidências
- [Arquivo JTL](../evidencias/2026-10-30/jmeter-resultados.jtl).
- [Resumo JSON](../evidencias/2026-10-30/jmeter-resumo.json).
- Dashboard HTML original no artefato `fluir-evidencias-jmeter` do GitHub Actions e no ZIP de evidências de 30/10/2026.

## Análise e conclusão
**Aprovado para este cenário de smoke/performance leve local.** Não é teste de estresse, concorrência elevada, escalabilidade nem laudo de desempenho do Render/Vercel. Para capacidade de produção, seria necessária bateria mais ampla, com ambiente controlado, cargas graduais e percentis de resposta.
