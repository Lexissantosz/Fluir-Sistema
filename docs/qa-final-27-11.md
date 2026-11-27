# QA final - 27/11/2026

- Web: 16/16 cenários da bateria mobile; 13/13 verificações estáticas e de contratos.
- Timeline: todos os dias, hoje, semana, categoria e estado vazio validados com eventos fictícios.
- Lembrar de mim (Web): opcional, cookie HttpOnly/Secure/SameSite=Strict, expiração limitada à sessão do servidor (12h), sem token persistente no localStorage. Logout revoga a sessão e bloqueia restauração; testes simulados de navegador e API passaram. Não usar a opção em computador compartilhado.
- Android: APK de depuração assinado com a mesma chave QA, compilado e verificado. A nova persistência é Web; fechar completamente o aplicativo e reabrir deve ser validado em aparelho real. Não há alegação de homologação total.
- Download do APK: função da Vercel restrita à prévia de QA, URL e expiração configuradas no ambiente Preview da branch, sem binário ou link de acesso no Git público.
- Google Web/Android e recuperação de senha: aprovados nos testes reais anteriormente relatados pelos testadores, com nova regressão simulada.
- Pendências: homologação da versão final em celular real, verificação pública Google, migração dos dados locais para nuvem e instalação definitiva assinada.

Não publicar na main antes da aprovação da equipe.

Observação final: o APK final foi compilado e verificado, mas o link compartilhado do hospedeiro final redirecionou para autenticação Vercel em uma sessão limpa. O botão de download direto foi temporariamente desabilitado para não entregar um link inválido. Distribuição pelo WhatsApp da equipe.
