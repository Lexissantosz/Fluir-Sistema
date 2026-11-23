# Fluir | Complemento de QA: sessão, privacidade, Desktop e IA

**Data:** 23/11/2026 (Brasília)
**Branch isolada:** `alex/estabilizar-sessao-ia-desktop-23-11`
**Base:** `alex/pwa-dispositivos-dossie-23-11`
**Ambientes testados:** Windows, Chrome/Edge, Java 21, Spring Boot, PostgreSQL 16 temporário Docker, APIs locais (`127.0.0.1:18081`).
**Regra:** **nenhum teste alterou a `main`, o Render ou a base de produção**. As contas A/B/C são fictícias e só existem no PostgreSQL descartável.

## 1. Falha recorrente de sessão: causa adicional corrigida

**Situação anterior:** quando `POST /api/usuarios/login` criava um token válido, mas a leitura seguinte das preferências (`GET /api/onboarding/usuario/{id}`) falhava por rede, CORS, HTTP 403 ou HTTP 503, o `login.js` removia imediatamente `fluir-user`. Parecia sessão expirada, embora o próprio servidor tivesse aceitado o login.

**Correção:** `js/login.js` agora distingue:
- **401**: token rejeitado, limpar sessão e pedir novo login;
- **403, 503 e falha de rede**: manter token recebido e oferecer botão **Tentar carregar preferências novamente**;
- **nova tentativa**: reutilizar token da mesma aba, sem enviar senha novamente nem solicitar segundo login;
- **onboarding ainda não existe**: continuar para configuração.

**Provas (Playwright + Chrome, mock de API):** `tests/sessao-login-retry.e2e.cjs` **6/6 aprovados**. Relatório `tests/relatorio-sessao-retry-23-11.txt`.

**Limitação:** a produção ainda está na `main`, sem esse commit. A sessão continua expirada de verdade após o prazo de 12 horas. Não migramos tokens para `localStorage`, não desativamos autenticação e não criamos renovação não autorizada.

## 2. Integração real de três contas e privacidade do ciclo

Backend local recompilado, Flyway aplicado, PostgreSQL 16 isolado (porta local 55434, só loopback).

`tests/isolamento-ciclos-abc.e2e.cjs`: **38/38 verificações aprovadas, via HTTP real**, incluindo:

- A cria registros sintéticos de período e sintoma.
- B e C recebem bloqueio ao tentar ler dados de A sem consentimento.
- A cria convite com escopo mínimo: calendário sim, sintomas não, notas não, perfil não.
- B informa o código, mas continua sem acesso até aprovação do titular.
- C não consegue aprovar convite de A, ler registros, alterar dados ou revogar compartilhamento alheio.
- A aprova B; B vê apenas registros de período sem notas ou sintomas privados.
- A revoga; B perde acesso imediatamente.
- A atualiza `menstrua=nao` ou `prefiro-nao-responder` com datas antigas no payload; API grava nulos em duração, menstruação e data. Essa regra foi adicionada também ao endpoint de edição de perfil, não só ao onboarding.
- AI sem chave responde HTTP 503; sem autenticação, HTTP 401.
- Google config responde, mas está desabilitado no ambiente de teste.
- CORS local: origens oficiais/preview autorizadas são aceitas; origem externa é rejeitada com HTTP 403.

**Privacidade:** códigos e tokens só existiram na memória do processo, sem serem exibidos nos relatórios. Usou-se apenas dados sintéticos (`example.invalid`).

Relatório: `tests/relatorio-isolamento-abc-23-11.txt`.

## 3. Suíte integral do backend

Após a correção de minimização de dados, foi repetido `mvn -o -f backend/pom.xml test` com PostgreSQL 16 isolado:
**66 testes executados, 66 aprovados, 0 falhas, 0 erros e BUILD SUCCESS**.

Os testes unitários adicionais foram incluídos em `CicloPerfisControllerTest.java`. A compilação do JAR Spring Boot também passou. Não houve operação no banco Render.

## 4. Desktop PWA no Microsoft Edge

`tests/pwa-edge-desktop.e2e.cjs`: **8/8 verificações aprovadas** no Edge para:
- login, manifesto standalone, start URL e ícones HTTP 200;
- Service Worker ativo em origem segura local;
- viewport de 1440 px, 1024 px e 768 px sem overflow horizontal no login;
- onboarding com cinco etapas em modo `?qa=1`;
- ausência de exceções JavaScript nessas telas.

Screenshot: `tests/evidencia-edge-desktop-23-11.png`, relatório `tests/relatorio-edge-desktop-23-11.txt`.

**Atenção:** teste automatizado em Edge **não equivale à instalação da PWA no menu Iniciar do Windows**. Falta abrir Edge → Aplicativos → Instalar este site como aplicativo, verificar atalho/ícone e registrar evidência humana. Não foi criada uma instalação falsa ou atalho que se passasse por app instalado.

## 5. Gemini / IA generativa e Google

Backend possui `POST /api/assistente/chat` e `POST /api/assistente/interpretar` com autenticação obrigatória e limites de mensagem. Em QA isolado, chave Gemini está deliberadamente vazia, portanto HTTP 503 foi o resultado correto. **Ainda não é possível afirmar que o Gemini respondeu de verdade em produção**; a presença de uma variável no Render não comprova funcionamento do modelo.

Google OAuth segue desabilitado na API pública conforme auditoria anterior. Configuração real de OAuth (origens/autorização) precisa de revisão humana e teste controlado. Não colocar chaves em prints, chat, commits ou documentação.

**Pendência de privacidade da IA:** verificar no frontend opt-in explícito, ausência de envio automático de informações sensíveis, confirmação antes de registrar ações e limite de uso. Não homologar somente com teste de disponibilidade.

## 6. Pipeline CI atualizado

`.github/workflows/fluir-multiplataforma-qa.yml` agora testa também a branch desta rodada e, além de Maven/JUnit, inicia API com PostgreSQL temporário no GitHub Actions e executa o fluxo A/B/C; o relatório de integração é guardado por sete dias. Não há deploy automático de backend nesse workflow.

## 7. Prioridades e critérios para conclusão

| Prioridade | Item | Estado |
|---|---|---|
| P0 | Correção de sessão 401 versus falha transitória | Código e 6/6 testes locais aprovados; deploy staging pendente |
| P0 | CORS das prévias Vercel e local | 38/38 HTTP local inclui testes; Render produção ainda sem hotfix |
| P0 | Consentimento e isolamento de ciclo | 38/38 HTTP local aprovados; homologação em staging ainda pendente |
| P0 | Privacidade das datas quando a pessoa não menstrua | Corrigido no backend e testado |
| P1 | PWA Windows/Edge | 8/8 automatizados, falta instalação real |
| P1 | Android | APK debug compilado na branch anterior; falta aparelho físico |
| P1 | iPhone/Safari | PWA preparada; falta iPhone real |
| P1 | Gemini | Falha segura 503 validada; resposta real com chave não validada |
| P1 | Google Login | Configuração ainda desabilitada |
| P2 | Desktop nativo Electron/Tauri e IPA iOS | Não implementados; requerem projetos/infraestrutura próprios |

**Definição de pronto:** testes locais + staging aprovado + dispositivo físico quando aplicável + aceite humano + documentação atualizada. A branch não será mesclada na `main` sem revisão; o Render acompanha automaticamente essa branch de produção.
