# Execução obrigatória por ferramenta

**Status: arquivos preparados, execução ainda não comprovada.** Não usar prints de outras atividades como evidências do Fluir.

| Ferramenta | Arquivo | Comando / URL local | Evidência obrigatória |
|---|---|---|---|
| Swagger UI | `backend/pom.xml`, perfil `qa` | `cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=qa` → `http://localhost:8080/swagger-ui.html` | Tela Swagger + operação GET /api/usuarios/teste |
| Postman | `postman/Fluir-QA.postman_collection.json` | Importar no Postman; baseUrl `http://localhost:8080`; executar e exportar resultados | Print dos testes e respostas sem tokens |
| Cypress | `cypress/e2e/fluir-smoke.cy.js` | Na pasta `testes`, `npm install`, `npm run cy:open` (Live Server `127.0.0.1:5500`) | Runner com contagem de sucessos/falhas |
| Mockito | `backend/src/test/.../UsuarioServiceQaMockitoTest.java` | `cd backend && ./mvnw test` | Relatório Surefire do teste |
| JUnit | `backend/src/test/.../CadastroLoginQaTest.java` | `cd backend && ./mvnw test` | Relatório Surefire/JUnit XML |
| JMeter | `jmeter/fluir-api-local.jmx` | `jmeter -n -t testes/jmeter/fluir-api-local.jmx -l testes/execucao/jmeter-resultados.jtl -e -o testes/execucao/jmeter-html` | JTL + relatório HTML + print do Summary Report |

**Cuidado:** Swagger pode expor estrutura de rotas; perfil `qa` só em ambiente local. Postman usa conta fictícia. JMeter tem somente 2 usuários virtuais e 2 loops, apontando **sempre para localhost**. A pasta de evidências não deve conter senhas ou tokens.

## Cobertura mapeada
- **Swagger:** CT002 e inspeção de contrato.
- **Postman:** CT002, CT006, CT007 e CT023.
- **Cypress:** CT001, CT007, CT025 (estrutura dos atalhos), CT035 e CT038 (login responsivo).
- **Mockito:** CT005, CT006, CT009 em unidade.
- **JUnit:** CT007, CT008, CT010 em validação.
- **JMeter:** CT002, latência e throughput em simulação local.

**Importante:** testes de unidade JUnit/Mockito não substituem os testes integrados do backend; Postman/Cypress/JMeter também não comprovam todas as regras do sistema. Execute e registre resultados reais.
