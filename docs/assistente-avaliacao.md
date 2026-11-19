# Fluir | Prévia do Assistente Inteligente

## Situação

**Prévia para avaliação de Alex e Dawid. Não está em produção e não constitui integração final de todos os módulos.**

Esta branch tem como base as branches Android e Google. A experiência funciona em:
- Modo **livre**: texto livre e interpretação simples de comandos.
- Modo **por escolhas**: opções guiadas com botões.
- Modo **misto**: ambos.
- Tom `calmo`, `direto`, `motivador` ou `neutro`, trazido do onboarding quando há sessão válida.

O modo de avaliação local funciona **sem backend e sem chave de IA**. Interpreta frases simples e propõe confirmações de tarefa, humor, disposição e diário. Nada é registrado antes do usuário confirmar. Histórico e registros ficam **apenas neste navegador/dispositivo**, separados por usuário ou por demonstração. Não entram nos módulos nem no PostgreSQL ainda; mensagens da prévia não são aconselhamento clínico.

## Como testar

Use a prévia automática da Vercel para a branch `alex/assistente-ia-fluir-19-11`. Navegue até `/html/assistente.html?demo=1` para testar sem login.

1. Teste uma frase com vários pedidos: `Estou triste e sem energia, crie uma tarefa de estudar química`.
2. Confira as sugestões separadas e confirme somente um dos registros; descarte outro.
3. Altere o tom, repita um pedido e compare a resposta.
4. Selecione `Por escolhas` e faça um registro apenas por botões.
5. Use `Ver meu resumo` e confirme que só contabiliza os registros aprovados.
6. Abra o modo de demonstração em uma nova aba/dispositivo. Os registros não devem ser confundidos com os de uma conta real.
7. Sem backend autenticado, a IA generativa permanece desativada e todas as respostas da prévia são do **modo guiado**.
8. Teste o APK em Android físico; verifique a logo, o cabeçalho, o login sem landing e o acesso ao assistente quando autenticado.

## Quando a IA generativa estará ativa

O backend inclui `POST /api/assistente/chat` autenticado por token Fluir. Ele usa o `tomComunicacao` do perfil do usuário e chama o Gemini pelo servidor. Para ativar, o responsável adiciona, diretamente no painel secreto do ambiente de backend, `FLUIR_GEMINI_API_KEY` e, se necessário, `FLUIR_AI_MODEL`. **Nunca colocar a chave no app, no Git, nos prints ou em mensagens do chat.**

O usuário precisa marcar a caixa explícita de consentimento para enviar sua mensagem à IA. Nenhum diário, finanças, saúde ou histórico são anexados automaticamente. Se a IA ou o backend falhar, o assistente mantém o modo local guiado, sem fingir que um modelo generativo respondeu.

## Segurança

O endpoint `/api/assistente/**` exige autenticação. O módulo Tarefas recebeu verificações de proprietário e header Bearer na mesma branch, com testes de autorização.

A permanência no armazenamento local não satisfaz o requisito final de sincronização ou LGPD. Antes de distribuir aos participantes, migrar os registros para APIs por usuário e consentimento por categoria, oferecer exclusão e política de retenção, reforçar segurança dos demais módulos e criar testes de carga.

## O que falta para a versão completa

- Backend ativo e estável, banco acessível e CORS Android homologado.
- Cadastro/login Google com clientes OAuth reais e SHA-1 da chave de assinatura Android definitiva.
- API persistente para diário, humor, disposição e demais registros, por usuário.
- Leitura/escrita autorizadas de **todos** os módulos via ferramentas de IA com confirmação.
- Testes em Android/iPhone, carga simultânea, backend de contingência e APK release assinado.
- PRs revisados e merge/deploy após aprovação de QA. Não usar a `main` para experimentos.

## Testes automatizados

`npm run check:assistant` (parser e privacidade básica), `npm run check:web`, `npm run check:auth`, `node --check ...` e `./mvnw -Dtest=TarefaControllerSecurityTest test` (dentro de backend). O GitHub Actions executa essas etapas antes de publicar o APK Debug.
