# Fluir | Diagnóstico de sessão e CORS — 23/11/2026

**Branch de correção:** `alex/hotfix-cors-sessao-23-11`
**Base:** `alex/onboarding-planos-personalizados-22-11`
**Ambiente:** computador local e preflight de API pública (sem autenticação, sem dados reais)
**Status:** alteração em branch, revisão e deploy pendentes. **Não é homologação definitiva da sessão real.**

## Evidência reproduzida

Requisição preflight OPTIONS para `https://fluir-sistema.onrender.com/api/onboarding/salvar` com `Access-Control-Request-Method: POST` e header `Access-Control-Request-Headers: authorization,content-type`:

| Origem | HTTP em 23/11 | Access-Control-Allow-Origin |
|---|---|---|
| `https://fluir-sistema.vercel.app` | 200 | Origem de produção |
| Prévia da branch de planos `https://fluir-sistema-git-alex-onboarding-planos-personalizados-22-11-lexissantosz.vercel.app` | 403 | Ausente |
| Prévia da branch de sessão `https://fluir-sistema-git-alex-corrige-sessao-onboa-b0c120-lexissantosz.vercel.app` | 403 | Ausente |
| `http://127.0.0.1:5505` | 403 | Ausente |

**Interpretação:** o backend de produção bloqueia essas origens, mesmo antes de validar token. Essa falha CORS é distinta de um HTTP 401 de token inválido/expirado. O front-end não deve interpretar falha de CORS ou ausência de login como expiração comprovada.

## Código corrigido
- `backend/src/main/java/com/fluir/backend/config/SecurityConfig.java`: mantida lista explícita de origens confiáveis, incluindo produção, Android Capacitor `https://localhost` e desenvolvimento local. Adicionados `localhost:5505` e `127.0.0.1:5505`.
- Adicionadas duas famílias restritas de **origens de prévia Vercel do projeto na conta da equipe** por `setAllowedOriginPatterns`, para não manter URLs individuais a cada nova branch. **Não** foi configurado `*` nem `*.vercel.app`; `allowCredentials` continua falso.
- Outros sites, domínios falsos e portas não autorizadas continuam recusados.
- `backend/src/test/java/com/fluir/backend/config/AndroidCorsConfigurationTest.java`: testes novos para previews da equipe, prévia de origem diferente, lookalike com sufixo malicioso e portas locais.

## Testes
`mvn -o -f backend/pom.xml -Dtest=AndroidCorsConfigurationTest,AuthSessionServiceTest test` em Java 21:
- **8 testes executados; 8 aprovados; 0 erros; BUILD SUCCESS.**
- 4 testes CORS e 4 testes de serviço de sessões, incluindo token válido/expirado.

## Não confundir com correção definitiva da sessão
- `sessionStorage` pertence à origem/aba. Login no site de produção não autentica automaticamente o domínio da prévia ou a aba independente.
- Tokens atuais têm validade de 12h no `AuthSessionService`; uma expiração genuína continua exigindo novo login.
- A correção do backend **não foi implantada em produção**; o preflight ainda retornará 403 até integrar e implantar a nova configuração.
- Restam testes de integração real após deploy em staging: login com conta fictícia na mesma origem, carregamento do onboarding, simulação de sessão ausente, autenticação válida, expiração de token, Android WebView e Safari.
- Nenhuma credencial ou token deve aparecer em captura, commit ou relatório.

## Próxima micro-missão
Revisar essa branch e submeter a QA de staging. Após deploy do backend de teste, repetir preflight para origens autorizadas e não autorizadas e realizar login com conta fictícia **na mesma URL do frontend**.
