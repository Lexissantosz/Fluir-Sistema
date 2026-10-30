# Fluir — Evidência real da execução JUnit e Mockito

**Data:** 30/10/2026, execução via GitHub Actions

- **Workflow:** [QA Fluir - JUnit e Mockito (Java 21)](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41116157960)
- **Run:** 1 (ID 41116157960)
- **Commit testado:** `a67285296474f6e22418f316fda6cdd3781359a6`
- **Branch:** `alex/entrega-documentacao-qa-30-10`
- **Ambiente:** runner ubuntu-latest, JDK 21 Temurin, PostgreSQL 16 isolado para CI
- **Comando:** `bash ./mvnw -B test` no diretório `backend`
- **Resultado:** `BUILD SUCCESS`
- **Total:** **23 testes**, **0 falhas**, **0 erros**, **0 ignorados**

## Resultado por classe (extraído do log da execução)

| Classe | Testes | Falhas | Erros | Ignorados |
|---|---:|---:|---:|---:|
| `UsuarioServiceQaMockitoTest` | 3 | 0 | 0 | 0 |
| `AuthSessionServiceTest` | 4 | 0 | 0 | 0 |
| `OnboardingServiceTest` | 5 | 0 | 0 | 0 |
| `BackendApplicationTests` | 1 | 0 | 0 | 0 |
| `OnboardingRequestValidationTest` | 7 | 0 | 0 | 0 |
| `CadastroLoginQaTest` | 3 | 0 | 0 | 0 |
| **Total** | **23** | **0** | **0** | **0** |

## Evidências
- [Registro da execução e logs no GitHub](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41116157960)
- **Artefato gerado:** `fluir-relatorios-junit-mockito` (arquivos `target/surefire-reports/*.xml` e `*.txt`, disponível na página do workflow, retenção de 14 dias até 13/11/2026).
- Logs comprovaram as etapas `Configurar Java 21`, `Executar testes JUnit e Mockito` e `Guardar relatorios reais do Maven` com conclusão **success**.

## Interpretação e limites
- Os **23 testes Java** cobrem unidade, validação e inicialização de contexto; não devem ser marcados como os 46 testes de interface/API da matriz manual.
- A execução do runner foi aprovada, mas ainda faltam resultados executados de Swagger, Postman, Cypress, JMeter, segurança entre contas e fluxo real do usuário.
- Após este commit de documentação, o GitHub Actions pode iniciar uma execução adicional; esse registro refere-se **exclusivamente ao commit e run acima**.
