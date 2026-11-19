# Fluir | Avaliação integrada Android + iPhone + Assistente

**Escopo: versão de avaliação, não homologada para distribuição pública em 27/11/2026.**

## O que está implementado

- Android: APK instalável criado com Capacitor 8, com início direto no login e marca Fluir.
- iPhone: PWA com manifesto e ícone Apple; instalar pelo Safari em Compartilhar > Adicionar à Tela de Início, não IPA.
- Backend: Spring Boot + PostgreSQL. PR #36 inclui registros autenticados, tarefas seguras, interpretação e Google preparado. Flyway V16/V17 são aditivas e a tabela nova ativa RLS.
- IA: modos livre, por escolhas e misto; tom do onboarding; leitura de mensagens com múltiplas propostas e confirmação individual antes de gravar.
- Tarefas confirmadas pela IA aparecem no módulo Tarefas. Humor, disposição, diário, água, sono, hábitos, finanças e outras categorias são gravadas em registros do assistente no PostgreSQL, **mas ainda não sincronizam com as tabelas e telas específicas de todos os módulos**.
- Google: endpoints preparados para autenticar com token assinado, vinculando conta somente após autenticação explícita. O botão exige OAuth Google Cloud e variável FLUIR_GOOGLE_CLIENT_ID.
- IA generativa: exige variável FLUIR_GEMINI_API_KEY. Mensagens são enviadas ao provedor somente com opção explícita; a chave fica no Render.
- Quando o provedor de IA não está disponível, o modo guiado mantém as funções locais sem simular respostas do modelo.

## Roteiro para Alex e Dawid

1. Abrir a prévia protegida da Vercel e entrar com contas fictícias de teste.
2. Confirmar onboarding completo e experimentar: "Hoje estou triste e sem energia, crie uma tarefa de estudar biologia, gastei R$ 12 em um lanche".
3. Revisar e confirmar uma proposta, rejeitar outra, consultar histórico do assistente e visitar o módulo Tarefas.
4. Entrar com segunda conta para garantir isolamento de dados.
5. No Android, instalar APK, entrar, concluir onboarding e testar navegação de cada módulo.
6. No Safari do iPhone, testar PWA na Tela de Início, login, navegação e atualização.

## Testes automáticos existentes

- GitHub Actions com PostgreSQL 17 descartável: cadastro, login, tarefa real, idempotência e isolamento entre contas.
- Smoke test: rotas /api/health/live, /api/health/ready, CORS Android e login inválido, sem criar usuários reais.
- Login Google e IA generativa permanecem desabilitados sem credenciais OAuth/API válidas no ambiente.
- Não compartilhar senhas, tokens, dados pessoais reais ou chaves privadas nos prints de QA.

## Pendências para o pacote completo

- Configurar Google Cloud OAuth (Web Client ID, cliente Android com SHA-1 da chave final) e validar em aparelho real.
- Configurar chave da IA generativa no backend, limites de custo e testes de respostas.
- Integração real das demais categorias nas APIs e telas dos módulos, com consentimento por dados sensíveis.
- Revisar segurança de todos os módulos, não apenas Tarefas.
- Assinar e testar APK release, acesso iPhone e carga de três salas no dia.
- Monitor de Render Free não garante 100% de disponibilidade; avaliar instância não suspensa.

**Nenhuma prévia substitui homologação com contas de teste em Android e iPhone reais.**
