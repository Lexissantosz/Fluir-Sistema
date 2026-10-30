# Fluir | Disponibilidade e monitoramento
**Status:** plano de monitoramento preparado. Monitorar **não** significa garantir que o serviço fique ativo.

## Entendimento da arquitetura
- `fluir-sistema.vercel.app`: frontend estático servido por Vercel.
- `fluir-sistema.onrender.com`: backend Java/Spring Boot; a resposta pode demorar se a instância estiver suspensa.
- Falha de login pode ser causada pela API, banco, CORS, sessão ou rede, mesmo com Vercel em estado `READY`.

## Verificações recomendadas
1. Checar `https://fluir-sistema.vercel.app/` com GET/HEAD e exigir HTTP 2xx/3xx.
2. Checar `https://fluir-sistema.onrender.com/api/usuarios/teste` com GET, exigir HTTP 200 e texto esperado.
3. Em falha, registrar status HTTP, duração, timestamp e ambiente, sem tokens.
4. Notificar a equipe; a equipe valida Render, banco e Vercel.
5. Executar login com usuário fictício antes da apresentação.

## Alternativas
- **Melhor:** hospedar o backend numa modalidade sem suspensão por inatividade, com monitoramento e recursos provisionados.
- **Baixo custo:** monitoramento periódico (ver `testes/monitorar-fluir.mjs` e workflow opcional) para identificar falha e gerar relatório.
- **Não recomendado como promessa:** pings para burlar suspensão/limites do plano gratuito. Podem não funcionar, estar sujeitos a limites do provedor e não oferecem SLA.

## Aplicação
O script é somente de leitura, sem credenciais. No GitHub Actions, um cron de 30 minutos pode registrar disponibilidade em logs; em um plano gratuito, há execução sujeita a limites e atrasos. Para alertas reais, configurar serviço de monitoramento próprio ou notificações de falha do workflow conforme permissões e preferências.

## Checklist do dia
- [ ] Abrir a URL pública no celular (rede móvel).
- [ ] Testar `GET /api/usuarios/teste`.
- [ ] Testar login com conta fictícia.
- [ ] Confirmar que o usuário fictício não tem dados reais.
- [ ] Planejar vídeo de fallback caso a API fique lenta.
- [ ] Confirmar com a equipe antes de ativar monitoramento agendado.
