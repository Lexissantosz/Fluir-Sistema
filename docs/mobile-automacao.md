# Fluir | automacao Android e iPhone (PWA)

Esta branch cria um APK Android **real** usando Capacitor 8, Java 21 e GitHub Actions.
O iPhone usa uma PWA adicionada à Tela de Início pelo Safari. Nenhum projeto iOS nativo ou App Store foi configurado.

## Geracao automatica do APK (debug)

No GitHub: **Actions > Fluir | Android APK e verificacao PWA**. Cada push na branch configurada executa a montagem; tambem existe **Run workflow**. Quando o job terminar com sucesso, abra a execucao e baixe o artefato **Fluir-Android-APK-Debug**. Descompacte o ZIP para obter `app-debug.apk`.

Nao entregue o APK de debug como versao final de centenas de participantes. Antes, valide seguranca, login, navegacao, permissoes e testes reais e gere um APK de release assinado com chave mantida em segredo. Artefatos de debug expiram apos 14 dias.

## Desenvolvimento local

1. `npm install`
2. `npm run prepare:web`
3. `npm run check:web`
4. `npx cap add android` (somente se a pasta `android/` nao existir)
5. `npx cap sync android`
6. Abra `android/` no Android Studio ou rode `cd android && gradlew.bat assembleDebug` no Windows.

A pasta `www/` e gerada, e `android/` e gerado no runner do GitHub. **Se voce ja tem alteracoes locais na branch antiga `alex/android-apk-fluir`, nao sobrescreva nem troque branches sem preserva-las.** A branch desta automacao e independente para evitar conflitos.

## iPhone

Depois de aprovar o PR e publicar a alteracao no site oficial, abra `https://fluir-sistema.vercel.app` no Safari do iPhone, toque em Compartilhar e **Adicionar à Tela de Início**. O icone PNG proprio e servido com apple-touch-icon e manifest do Fluir. A instalacao e uma PWA, nao um arquivo IPA ou um aplicativo da App Store.

O service worker guarda **apenas CSS, JavaScript, fontes e imagens publicas**. Nunca armazena HTML, dados de diario, financas, respostas de API ou paginas privadas. Funcionalidades que dependem do backend continuam precisando de internet.

## Limites e validacoes pendentes

- O APK debug compilar nao comprova funcionamento do login e dos modulos no Android.
- Origin do Capacitor Android deve ser validada junto ao CORS e a autenticacao do Spring Boot antes de distribuicao.
- Testar abertura e navegacao no Android fisico, mais Safari/iPhone real.
- Revisar seguranca das tarefas e segregacao dos dados locais por usuario antes de convidar muitas pessoas.
- O backend gratuito pode suspender; providenciar contingencia real e testar carga para tres salas.
- A branch so se torna producao depois de PR aprovado/merge e deploy web; esta automacao nao publica o site sozinha.
