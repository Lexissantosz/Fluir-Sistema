# Fluir | Central de Qualidade e Testes
**Preparação:** 30/10/2026 • Equipe: Alex e Dawid

## Onde está cada coisa
| Arquivo | Descrição |
|---|---|
| [plano-de-testes.md](plano-de-testes.md) | Estratégia e condições de liberação |
| [casos-de-teste.md](casos-de-teste.md) | Índice dos 46 casos |
| [casos-de-teste.csv](casos-de-teste.csv) | 46 casos com passos, dados e resultado esperado |
| [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) | Relação requisitos × casos |
| [execucao/registro-de-execucao.csv](execucao/registro-de-execucao.csv) | Planilha para execução de cada CT |
| [relatorios/relatorio-execucao.md](relatorios/relatorio-execucao.md) | Indicadores, cobertura e parecer de liberação |
| [relatorios/relatorio-defeitos.md](relatorios/relatorio-defeitos.md) | Histórico, riscos e defeitos |
| [defeitos/registro-defeitos.csv](defeitos/registro-defeitos.csv) | Tabela de defeitos da execução |
| [defeitos/modelo-defeito.md](defeitos/modelo-defeito.md) | Modelo de relatório de defeito reproduzível |
| [evidencias/README.md](evidencias/README.md) | Procedimento para guardar prints e logs |
| [monitoramento.md](monitoramento.md) | Plano de disponibilidade |
| [monitorar-fluir.mjs](monitorar-fluir.mjs) | Verificador de frontend e API |

## Como executar e documentar
1. Escolha CT no catálogo, anote ambiente e commit.
2. Siga os passos sem pular pré-condições.
3. Selecione PASSOU, FALHOU, BLOQUEADO ou NÃO APLICÁVEL.
4. Anexe evidência real e registre resultado obtido em `execucao/registro-de-execucao.csv`.
5. Abra um DEF quando houver falha, usando o modelo.
6. Atualize relatórios e só então faça a decisão de liberação.

**Nota metodológica:** o catálogo é um plano, não é relatório de aprovação; nesta entrega ainda não foram executados os 46 casos. Diferencie claramente evidências históricas e evidências deste ciclo.
