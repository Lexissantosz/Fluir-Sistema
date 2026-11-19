# Fluir | Ativação segura do login com Google

**Status: código preparado em branch de testes. O botão não aparece até que a configuração OAuth seja concluída.**

## Como funciona

O mesmo componente atende **Entrar com Google**, **Criar conta com Google** e **Vincular Google** em Perfil.

1. O usuário seleciona sua conta Google. No Android, a seleção acontece pelo plugin nativo `@capawesome/capacitor-google-sign-in`, não por uma tela de login dentro da WebView. Na Web/PWA, usamos Google Identity Services.
2. O aplicativo envia **somente o ID token** ao endpoint `POST /api/usuarios/google` pelo HTTPS.
3. O backend verifica a assinatura JWT pelas chaves públicas do Google, o emissor, a audiência (Web Client ID), validade e o e-mail verificado.
4. Um usuário novo recebe conta Fluir + sessão própria e segue **obrigatoriamente para `setup.html`**, com nome preenchido e e-mail sinalizado como verificado; outras preferências ainda são solicitadas.
5. Um usuário já vinculado entra com sua conta e vai ao painel se o onboarding estiver concluído; caso contrário, volta ao onboarding.
6. Uma conta de senha com e-mail já existente **não é vinculada automaticamente**. O titular entra por senha e usa a opção em Perfil, autenticada com Bearer e Google válido, para vincular sua conta.

## O que precisa ser configurado pelo responsável do projeto

1. Em **Google Cloud Console** (console.cloud.google.com), criar/selecionar projeto e configurar a tela de consentimento OAuth, o nome **Fluir**, usuários de teste e escopos `openid email profile`.
2. Criar um cliente OAuth **Web application**, com origens JavaScript autorizadas `https://fluir-sistema.vercel.app` e, se for testar previews, os domínios exatos de pré-visualização autorizados. Guardar o **Web Client ID**.
3. Criar um cliente OAuth **Android**, com package name **`br.com.fluir.sistema`** e a impressão digital **SHA-1 da chave de assinatura**. Na versão de debug gerada pelo GitHub, a chave poderá variar de execução para execução. **Para uso final, configurar assinatura release fixa e SHA-1 dessa chave antes da distribuição.**
4. No Render, na configuração segura do serviço Spring Boot, adicionar `FLUIR_GOOGLE_CLIENT_ID` com o Web Client ID. Não commitar secrets e não enviar chave privada para o ChatGPT.
5. Fazer deploy do backend após aprovação e migração Flyway `V16__adiciona_google_sub_usuario.sql` em PostgreSQL **com backup prévio**.
6. No Android, gerar o APK a partir da branch aprovada e testar em dispositivo real com Google Play Services; no iPhone/PWA, testar Safari.
7. Testar cenários: Google novo -> onboarding; Google existente -> dashboard; conta e-mail/senha igual -> conflito seguro; vínculo autenticado -> passa; vínculo de outra pessoa -> recusado; JWT inválido -> 401; login normal continua funcionando.

## API

- `GET /api/usuarios/google/config`: `{"habilitado":false,"clientId":""}` até configurar variável de ambiente. O botão permanece oculto enquanto desabilitado.
- `POST /api/usuarios/google`: JSON `{"idToken":"..."}` (não incluir em logs).
- `POST /api/usuarios/google/vincular`: JSON acima, **Bearer token** da sessão Fluir.
- `UsuarioResponse` em login Google informa `provedor: "google"` e `emailVerificado: true`; **não** assume que sexo, idade, tom de comunicação, módulos e demais dados vieram do Google.

## Segurança e limitações

- Escopos mínimos. Nunca pedir senha Google ao usuário.
- Não aceitar e-mail só porque o JavaScript diz que foi verificado; é necessário verificar JWT assinado no servidor.
- Não distribuir a versão com cadastro público antes de resolver autorização de tarefas, segregação de dados por usuário e políticas de privacidade.
- A entrega não pode ser considerada funcional até OAuth configurado, migração aplicada, backend atualizado e testes reais aprovados.
