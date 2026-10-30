# Fluir | Evidências de QA: Swagger e Postman/Newman

**Data:** 30/10/2026 • **Equipe:** Alex e Dawid

## Ambiente e versão
- **Branch:** `alex/entrega-documentacao-qa-30-10`
- **Commit testado:** `59c259a970b171487d3e9de9332cd8860bbc2aab`
- **Ambiente:** GitHub Actions (Linux), Java 21, PostgreSQL 16 temporário e API local (porta 8080, perfil QA).
- **Segurança:** não foram usadas contas pessoais nem banco de produção.

## Swagger/OpenAPI — aprovado
- **Workflow:** [Swagger #6 — conclusão success](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41117778491)
- **Artefato:** [fluir-evidencias-swagger](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41117778491/artifacts/13007256114)
- **Especificação:** OpenAPI **3.1.0**
- **Rotas documentadas:** **8**
- **Operações documentadas:** **8**
- **Verificações:** `GET /api/usuarios/teste`, `POST /api/usuarios/login`, documentação `/v3/api-docs` e HTML do Swagger UI acessíveis.
- **Evidências existentes no artefato:** `openapi.json`, `swagger-ui.html`, `swagger-ui.png`, `health.txt`, `relatorio-swagger.md` e log do backend QA.

## Postman/Newman — aprovado
- **Workflow:** [Postman #1 no commit corrigido — conclusão success](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41117778496)
- **Artefato:** [fluir-evidencias-postman](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41117778496/artifacts/13005899102)
- **Requisições executadas:** **8**
- **Asserções/verificações:** **11**
- **Falhas de requisição:** **0**
- **Falhas de asserção:** **0**
- **Evidência presente no artefato:** `resumo.md`, emitido pelo runner a partir do relatório Newman.
- **Coleção versionada:** `testes/postman/Fluir-QA.postman_collection.json`.

## JUnit + Mockito — aprovado na mesma revisão
- [Execução JUnit/Mockito — conclusão success](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41117778436)
- **23 testes Java concluídos, 0 falhas, 0 erros, 0 ignorados**, conforme logs da execução.

## Como interpretar
1. Os resultados acima são **comprovados pelo GitHub Actions** e pelos arquivos dos artefatos correspondentes, não dados inventados.
2. O Swagger validou estrutura da API e acesso técnico ao HTML; a interação manual da UI ainda pode ser demonstrada separadamente.
3. O Newman executou a coleção contra uma **instância isolada**, não testou a produção.
4. O catálogo de **46 casos de teste do sistema** continua sendo uma matriz de execução independente; não somar 23+11+8 como se fossem os mesmos casos.
5. Para completar a exigência da professora, ainda devem ser verificadas as evidências **Cypress** e **JMeter**.
6. Artefatos do GitHub Actions têm retenção limitada; salve cópia com o projeto antes de expirarem. Este relatório Markdown permanece versionado.
