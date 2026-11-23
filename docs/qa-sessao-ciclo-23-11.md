# Fluir | QA de sessão no onboarding e decisão do fluxo de ciclo
Data de revisão: 22/11/2026 (horário de Brasília)
Branch: `alex/corrige-sessao-onboarding-ciclo-23-11`

## Problemas diagnosticados
1. A mensagem "Sua sessão expirou. Faça login novamente." no `js/setup.js` era exibida tanto para **token genuinamente expirado** como para **token ausente em sessionStorage**. Abrir a prévia em `127.0.0.1:5505` não herda a sessão autenticada do Vercel. Nem uma nova aba nem um domínio diferente devem presumir compartilhamento de `sessionStorage`.
2. A validade real do token de sessão continua definida no backend em 12 horas. O frontend **não pode** contornar, renovar por conta própria nem inventar um token.
3. No caminho "Meu ciclo e outras pessoas", a pergunta "Você menstrua atualmente?" era redundante segundo a regra de UX aprovada pelo time. Agora fica oculta e o estado é marcado como "sim". A resposta pode ser revisitada nas configurações; o caminho "Meu próprio ciclo" continua permitindo Sim, Não ou Prefiro não responder.

## Correções no código
- `js/setup.js`: detecção de sessão presente válida estruturalmente; mensagem antecipada de **login ausente neste endereço**, antes do formulário; CTA para login. Formulário não autenticado fica inerte, evitando preencher tudo e só descobrir no final.
- **Modo QA estritamente local**: `http://127.0.0.1:5505/html/setup.html?qa=1` ou `http://localhost:5505/html/setup.html?qa=1`, disponível somente em loopback. Permite percorrer o onboarding e finalizar visualmente **sem envio, token falso, banco ou gravação local**. Qualquer domínio remoto ignora `qa=1`.
- `SecurityConfig.java`: resposta JSON HTTP 401 para recursos protegidos quando a autenticação estiver ausente/inválida; sem expor credenciais. A autorização e a expiração real continuam obrigatórias.
- Na API de onboarding: 401 é distinguido de 403 (identidade sem permissão), 404 (backend defasado) e falhas de rede.
- `js/setup-cycle.js`: no caminho "Meu ciclo e outras pessoas", a pergunta sobre menstruação é ocultada e a resposta é "sim", sem eliminar a configuração das outras pessoas. Nos demais caminhos, a pergunta continua disponível quando pertinente.

## Testes realizados no computador
- **21/21 cenários Playwright/Chrome aprovados**, incluindo PC, viewport de celular 390 px, mensagem de login ausente, simulação local sem salvar, resposta HTTP 401 simulada, retry sem duplicar POST do onboarding, novo comportamento do fluxo e proteção básica contra HTML.
- **19/19 testes JUnit/Mockito aprovados**; Maven BUILD SUCCESS.
- **8/8 verificações de contrato estático** da API de ciclos (suíte existente).
- Backend público respondeu **HTTP 200** em `/api/usuarios/teste` e **HTTP 200** em `/api/health/ready`, com `database=UP` e `status=UP`.
- GitHub Actions: workflow `fluir-render-keepalive.yml` presente na `main`, programado entre 19/11 e 30/11. Consultadas cinco execuções recentes; todas `completed/success`, incluindo execução do dia 22/11/2026 às 23:56 UTC. Esse vigia mantém/checa a disponibilidade do Render, mas **não gerencia sessões**.

## Limites desta entrega
- A correção do backend ainda **não foi implantada** no Render; a implantação exige revisão, testes de integração e autorização para merge/deploy.
- O modo de avaliação local não comprova login real e não deve ser usado como ambiente de armazenamento de dados de saúde.
- Testes reais de sessão entre navegador + Render + PostgreSQL em staging, testes Android/iPhone físicos e auditoria de privacidade continuam pendentes.
- Sessões realmente expiradas após 12 horas devem exigir novo login. A correção evita chamar de "expiração" a ausência de login na origem.

## Fila após a aprovação do ciclo
1. Android: revisar pipeline de compilação APK, permissões, instalação e fluxo real no dispositivo do Dawid.
2. iPhone: homologar PWA/Safari e eventual empacotamento, incluindo armazenamento e responsividade.
3. Assistente de IA: verificar Gemini por resposta real, controles de autorização, segurança, modo tradicional e modo generativo.
4. Desktop: instalação PWA em Chrome/Edge, atualização, offline, ícones e testes no Windows; distribuição como aplicativo nativo somente se for realmente implementada.

## Próxima microetapa humana
Abrir no PC `http://127.0.0.1:5505/html/setup.html?qa=1`, preencher com **dados fictícios**, ativar Ciclo Menstrual, escolher "Sim, mais de uma" → "Meu ciclo e outras pessoas" e confirmar que a pergunta "Você menstrua atualmente?" não aparece. **Parar e enviar um print antes de prosseguir.**
