# Fluir — Matriz de cobertura: o que foi testado e o que falta
**Data:** 30/10/2026 • **Plano geral:** 46 casos em [casos-de-teste.csv](../casos-de-teste.csv).

## Casos com comprovação automatizada de interface — 8 de 46
- **CT001** — Tela de login e formulário renderizam. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- **CT007** — Formulário vazio apresenta validação. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- **CT038** — Login cabe em 320 × 568. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- **CT025** — Atalho +200ml atualiza total e percentual; recarga preserva. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- **CT026** — Atalho +250ml incrementa consumo. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- **CT029** — Registro personalizado acima de 1000ml é recusado. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- **CT035** — Filtros de conquistas reagem e ficam ativos. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).
- **CT037** — Modal de conquistas abre e fecha. Evidência no [reteste Cypress](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086).

## Evidências complementares (não contar como execução completa dos outros 38)
- **JUnit/Mockito:** 23 métodos Java verificados, incluindo testes com IDs similares aos CT005/006/007/008/009/010, mas **em nível de unidade/validação**, não na interface.
- **Postman/Newman:** 8 requisições e 11 asserções; valida o contrato e cenários de API local, mas não prova todos os passos do fluxo do usuário.
- **Swagger:** 8 rotas e 8 operações documentadas; valida documentação, não regras de negócio.
- **JMeter:** 4 amostras de `GET /api/usuarios/teste`; valida estabilidade desse endpoint sob carga muito pequena.

## Pendências prioritárias antes do QR code público
| Prioridade | Casos | O que comprovar | Evidência necessária |
|---|---|---|---|
| Crítica | CT024 e CT044 | Isolamento entre duas contas e bloqueio de acesso cruzado | HTTP/status com dados fictícios, log e defeito se falhar |
| Alta | CT005 e CT011–CT012 | Login, persistência de sessão e saída no frontend publicado | Capturas com URL e conta fictícia (sem token/senha) |
| Alta | CT010 e CT013–CT017 | Cadastro, onboarding e dashboard ponta a ponta | Prints antes/depois e vídeo curto |
| Alta | CT018–CT022 | Criar, concluir e excluir tarefa com persistência real | Evidência após recarga + estado no backend |
| Alta | CT030–CT034 | Limite diário de água, reset, meta e persistência | Prints e registros de teste |
| Média | CT039–CT043 | Viewports 375/430/938/1440, teclado e console | Screenshots por viewport e console sem erros |

## Como documentar a próxima execução
Para cada caso, registrar na planilha: `status`, `data_hora_iso`, `executor`, `branch_commit`, `ambiente`, `resultado_obtido`, `caminho_da_evidencia` e `id_defeito` quando houver divergência.

**Observação:** a planilha de 46 casos foi criada como plano; não registrar “46 aprovados” enquanto os 38 demais não tiverem execução correspondente.
