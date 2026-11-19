# Vigia do Fluir: disponibilidade do Render

O projeto Fluir utiliza um backend Spring Boot em **Render Free**. Esse plano suspende serviços depois de 15 minutos sem receber tráfego, reiniciando na próxima requisição.

A automação `.github/workflows/fluir-render-keepalive.yml` consulta `GET /api/usuarios/teste` a cada dez minutos para reduzir o risco de suspensão e, após seu deploy, também testa `GET /api/health/ready` (PostgreSQL) e preflight CORS com origem `https://localhost`.

## Status da instalação

- O agendamento `schedule` do GitHub Actions **só é executado a partir da branch padrão**. Enquanto esta alteração estiver em branch, o agendamento NÃO está ativo.
- O gatilho `push` desta branch valida a configuração sem alterar o backend de produção.
- O deploy do Render é automático para `main`; somente um merge revisado dispara a publicação.
- As verificações de readiness e CORS ocorrem quando o workflow roda na `main`.
- A automação programada está limitada até **30/11/2026, 23:59 no horário de Brasília**. Depois dessa data, as execuções agendadas não enviam pings; é preciso revisar horas gratuitas e atualizar a estratégia.

## Cuidados

O Render Free oferece **750 horas por workspace por mês**, e o workspace do Fluir tem outro serviço gratuito. Mantê-los simultaneamente ativos 24/7 pode esgotar o limite. Pings também não são garantia de disponibilidade: GitHub Actions pode atrasar execuções, Render pode reiniciar instâncias, e o banco/rede podem falhar.

Para **27/11/2026**, manter o backend ativo previamente, testar login com contas de teste, realizar testes de carga e monitorar a execução em tempo real. Uma instância paga não suspensa é a opção mais confiável para apresentação pública.

## Próximas validações

1. Aprovar PR e conferir o deploy do backend.
2. Executar `workflow_dispatch` na `main` e verificar HTTP 200 em `/api/usuarios/teste`, `/api/health/ready` e CORS Android.
3. Testar criação de conta e login reais no APK, sem divulgar senhas, depois onboarding completo.
4. Testar ao menos dois Androids com usuários distintos e tarefas isoladas.
5. Testar módulos, relatórios, Google OAuth e IA com integrações reais; compilação isolada não comprova funcionamento.
