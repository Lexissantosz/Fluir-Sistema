# Fluir | Relatório consolidado de execução de testes
**Equipe:** Alex e Dawid • **Preparado em:** 30/10/2026
**Versão sob planejamento:** branch `alex/entrega-documentacao-qa-30-10` (código-base `dawid/realoca-atalhos-calendario-agua-19-10`).

## Resumo executivo
O plano possui **46 casos de teste definidos**, com passos, pré-condições, dados, resultado esperado e evidência sugerida. **Não foi realizada uma execução comprovada desses 46 casos nesta entrega.** Assim, não há base para afirmar taxa de aprovação, cobertura funcional real ou prontidão da versão para produção.

| Indicador | Quantidade |
|---|---:|
| Casos planejados | 46 |
| Casos executados documentados | 0 |
| Aprovados | 0 |
| Reprovados | 0 |
| Bloqueados | 0 |
| Não executados | 46 |
| Evidências novas coletadas nesta etapa | 0 |
| Defeitos novos confirmados pela execução | 0 |

## Escopo
Cadastro, autenticação e sessão; onboarding; dashboard; tarefas; água; conquistas; responsividade; acessibilidade; API; segurança; deploy e banco. Fontes: `../casos-de-teste.csv`, `../matriz-rastreabilidade.csv` e `../execucao/registro-de-execucao.csv`.

## Critérios de entrada
- Deploy definido, URL e commit anotados.
- Backend e banco acessíveis (ou falha documentada).
- Conta fictícia de teste, sem dados reais.
- Navegador/viewport anotados e capturas habilitadas.

## Critérios de saída sugeridos
- Executar smoke e cenários críticos; nenhuma falha crítica aberta.
- Falhas altas com análise de impacto e correção priorizada.
- Evidências anexadas e resultados consistentes com casos executados.
- Isolamento de dados entre usuários validado antes de compartilhar QR code com credenciais.

## Observações e riscos
1. Frontend Vercel `READY` não comprova disponibilidade do backend Render.
2. A documentação não substitui resultados de teste ou log real.
3. Recomenda-se investigar autorização por usuário em endpoints de tarefas.
4. O onboarding e a persistência dos módulos devem ser testados ponta a ponta.

## Decisão de liberação
**AINDA NÃO AVALIADA — SEM EVIDÊNCIAS SUFICIENTES.**
A recomendação só deve ser emitida após preencher a tabela de execução e associar arquivos de evidência reais.

## Próximas ações
1. Começar pelos CT001, CT002, CT005, CT006, CT010, CT017, CT018, CT024, CT025 e CT038.
2. Registrar PASSOU/FALHOU/BLOQUEADO com evidência e ambiente.
3. Abrir defeitos com ID e severidade para cada divergência.
4. Atualizar este relatório com números reais e decisão justificada.
