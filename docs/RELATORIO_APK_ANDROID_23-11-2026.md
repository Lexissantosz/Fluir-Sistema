# Fluir | Registro de APK Android de qualidade (debug)

**Data:** 23/11/2026
**Branch de origem:** `alex/pwa-dispositivos-dossie-23-11`
**App ID:** `br.com.fluir.sistema`
**Nome do aplicativo:** Fluir
**Versão Android nativa (aapt):** `versionCode=1`, `versionName=1.0`
**SDK mínimo:** Android API 24
**SDK alvo e de compilação:** API 36
**Ferramentas:** Capacitor 8.6.2, Android SDK, Gradle 8.14.3, Java 21, Node.js 24.
**Resultado Gradle:** `BUILD SUCCESSFUL`, 71 tarefas, após configurar `ANDROID_HOME`.

## Arquivo gerado na máquina do Alex

```text
C:\Users\Usuario\Documents\Fluir-Ciclo-UX-22-11\android\app\build\outputs\apk\debug\app-debug.apk
```

Tamanho: **5.329.399 bytes**.
SHA-256:

```text
1EEA0D335FB8CEAA78F3238580A1C4DC40244A757DCECB4E45E809B80F5DB286
```

Conteúdo inspecionado dentro do arquivo: `assets/public/html/login.html`, `assets/public/html/setup.html`, `assets/public/js/setup.js`, `assets/public/js/setup-cycle.js`, `assets/public/js/setup-plans.js`, `assets/public/manifest.webmanifest`. Os arquivos de `.env`, código de backend e lockfile não foram encontrados nos recursos empacotados.

Permissões observadas no manifesto: `android.permission.INTERNET` e `br.com.fluir.sistema.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`. Não houve descoberta de outras permissões solicitadas na inspeção rápida.

**Não há aparelho Android conectado via ADB.** Instalação, login e comportamento em celular **NÃO TESTADOS**. Não publicar em loja nem compartilhar como versão estável.

## Para Dawid validar com segurança

1. Receber APK pela fonte autorizada e verificar SHA-256.
2. Anotar modelo, versão Android, data e tamanho do arquivo.
3. Usar **somente conta fictícia** e, se necessário, backup antes de instalar sobre versão antiga. Não apagar dados reais.
4. Abrir o app; verificar que inicia no login.
5. Testar toque, teclado, menu e botão Voltar, depois ciclo e planos.
6. Registrar prints, erros e status. Não usar informações íntimas ou reais.

**Importante:** autenticação real e persistência devem ser homologadas com backend de staging. A versão pública do Render ainda restringe algumas origens de preview por CORS até aplicação do hotfix separado.

## Repetir build no Windows

Com Android SDK, Java 21 e Node.js instalados:

```powershell
npm ci
npm run android:prepare       # Somente a primeira vez, se android/ estiver ausente
npm run android:debug:windows
```

O script `scripts/build-android-windows.cjs` detecta o Android SDK do Windows sem precisar configurar uma variável global. **O APK é de debug; não é release assinado para Play Store.**
