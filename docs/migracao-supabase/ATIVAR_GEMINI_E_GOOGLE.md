# Fluir | Integração real de Gemini e Google
Atualizado em 25/11/2026.

## Preparação técnica concluída
- Edge Function `fluir-api` V3 no Supabase. O status da função e os endpoints públicos são testados no CI.
- IA só aceita `POST /assistente/chat` depois de sessão autenticada, consentimento explícito no corpo e validação do tamanho da mensagem. Limite temporário por conta no servidor.
- Modelo padrão: `gemini-3.5-flash-lite` (o `gemini-2.5-flash` foi descontinuado para novos usuários). É possível configurar `FLUIR_AI_MODEL` sem alterar código, mas apenas valores reconhecidos pela API.
- Verificação do Google ID Token com assinatura RS256 via JWKS oficial, audience igual ao Client ID, emissor Google e expiração, nunca confiar no token sem verificar.
- Botões oficiais Google Identity Services são exibidos só se `FLUIR_GOOGLE_CLIENT_ID` estiver configurado; sem ele, login com senha segue disponível. Vínculo no Perfil exige sessão ativa e mesmo e-mail.
- Testes mockados de navegador verificam ausência de botão com integração desligada, botão ligado, rejeição de token falso, vínculo duplicado e consentimento.
- A chave de API não deve ser enviada por chat, inserida em HTML/JS ou commitada no repositório.

## Ativação 1: Gemini
1. Na sua conta Google, abra https://aistudio.google.com/apikey e crie/consulte uma chave para Gemini API. Confira cotas, disponibilidade e eventual cobrança do projeto.
2. Acesse **Supabase > Fluir > Edge Functions > Secrets**:
   https://supabase.com/dashboard/project/xqzxfhodhmlgneudubjm/functions/secrets
3. Adicione o segredo `FLUIR_GEMINI_API_KEY` com o valor da chave e salve. Não publique valor nem chave no chat.
4. `GET https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api/assistente/status` deve retornar `{"configurado":true}`; isso só confirma que a configuração existe, não que a chave tem permissão ou quota. Testar uma resposta autenticada real com consentimento depois.

## Ativação 2: Login Google (após Gemini)
1. No Google Cloud Console, criar um Client ID OAuth 2.0 do tipo aplicativo Web e configurar tela de consentimento.
2. Adicionar origem JavaScript autorizada `https://fluir-sistema.vercel.app`; para domínio adicional, registrar explicitamente a origem, sem curingas. Quando estiver em teste de OAuth e for necessário, configurar usuários de teste no projeto Google.
3. Salvar o Client ID (não o Client Secret) no Supabase Secrets com a chave `FLUIR_GOOGLE_CLIENT_ID`.
4. Verificar que `/usuarios/google/config` retorna `habilitado:true`, testar botão na página oficial (não usar credenciais reais no CI) e registrar origem, callback e vínculo com conta legada existente.

## Situação
- Nenhuma das duas credenciais foi criada/recebida pelo ChatGPT.
- Não configurar segredo em repositório GitHub nem Vercel: a função consome as variáveis no Supabase.
- A versão Web usa uma ponte de identidade legada no Supabase e não é uma migração completa para Supabase Auth.
- Sem chave, a IA indica configuração pendente e não simula uma resposta como se viesse do Gemini.
- Sem Client ID, o login Google fica oculto; login por senha continua funcionando.

Fontes:
- https://aistudio.google.com/docs/api-key
- https://supabase.com/docs/guides/functions/secrets
- https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
- https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
