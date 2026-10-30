# Fluir | Relatório e acompanhamento de defeitos
**Preparado:** 30/10/2026

## Estados dos registros
- **Histórico/revisão:** problema relatado anteriormente ou risco observado no código. Não equivale a falha reproduzida hoje.
- **Confirmado:** defeito reproduzido, ambiente e evidência registrados.
- **Resolvido:** código ajustado, aguardando reteste.
- **Fechado:** reteste aprovado e evidência associada.

## Histórico e pontos de atenção (não confundir com defeitos reabertos)
| ID | Origem | Área | Descrição | Situação |
|---|---|---|---|---|
| HIST-01 | Revisão visual anterior | Água | Card Últimos registros estreito em ~938px | Correção informada/aprovada pela equipe; reteste CT040 pendente |
| HIST-02 | Revisão visual anterior | Sidebar | Texto da navegação quebrava em algumas páginas | Correção informada/aprovada; reteste CT041 pendente |
| RISCO-01 | Análise estática de código | Segurança/API | Controlador de tarefas recebe ID do usuário/da tarefa sem validação explícita de propriedade no método; conferir filtros globais e isolamento com CT024/CT044 | Investigação obrigatória, **não classificado como bug confirmado** |
| RISCO-02 | Integração | Hospedagem | Backend pode demorar a responder após inatividade | Medir em CT002 e CT004 |
| RISCO-03 | Integração | Onboarding | Verificar mapeamento efetivo do método de salvamento no controlador | Reproduzir CT013–CT016 |

## Quadro de defeitos da execução atual
**Nenhum defeito novo confirmado até haver execução registrada.**

| Defeito | Caso relacionado | Severidade | Prioridade | Responsável | Status | Evidência |
|---|---|---|---|---|---|---|
| A preencher | CTxxx | A definir | A definir | A atribuir | Não registrado | `testes/evidencias/` |

## Severidade versus prioridade
- Crítica: compromete privacidade, segurança ou uso essencial do sistema.
- Alta: bloqueia função importante ou causa perda de dados.
- Média: função disponível com problema relevante de uso ou visual.
- Baixa: detalhe cosmético sem impacto material.
Prioridade depende de urgência, prazo, frequência e risco da demonstração, não apenas da severidade.

## Modelo obrigatório de defeito
Preencher a planilha `../defeitos/registro-defeitos.csv` e criar `../defeitos/DEF-xxx.md` a partir de `../defeitos/modelo-defeito.md`. Inclua ID, título objetivo, pré-condições, passos, esperado, obtido, ambiente, severidade, prioridade, frequência, evidência, responsável e status.
