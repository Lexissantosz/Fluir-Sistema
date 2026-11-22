# Relatório técnico | Fluir Ciclo Menstrual
Data: 22/11/2026 | Branch local: alex/refino-ciclo-perfis-22-11
Status: **implementação em branch, aguardando homologação e revisão de segurança. Não implantado.**

## Escopo implementado
- Interface independente do armazenamento legado: escolha própria/outra/ambas/pular; preferência salva no backend.
- Perfil próprio com nome/apelido, foto JPEG redimensionada, resposta opcional sobre menstruação, durações e última data.
- Perfis separados e calendário mensal com navegação entre meses, filtro por dia, destaques de menstruação e sintomas e estimativa simples apenas do próprio ciclo.
- Histórico separado por titular no PostgreSQL: criação, consulta e exclusão restritas à conta proprietária.
- Convite de alta entropia, SHA-256 do token no banco, validade de dez minutos, pedido pendente, aprovação/negação pelo titular.
- Permissões para calendário, sintomas, notas e sincronização de nome/foto; revogação e apelido local para visitante.
- Limite gratuito de um compartilhamento ativo por titular e um perfil alheio por visitante, confirmado também por índices únicos no banco.
- PWA desktop: manifest + service worker apenas para recursos públicos; ainda não foi instalado/testado em uma máquina real.
- Código legado acessível por histórico do Git; nenhum dado antigo é apagado do navegador, mas não é mostrado ou migrado automaticamente, devido à falta de vínculo confiável com contas.

## Evidências de execução
1. Maven/Java 21: compilação da nova API em BUILD SUCCESS.
2. JUnit/Mockito: execução final dedicada passou, **10/10**, sem falhas nem erros (22/11/2026, 20:32 BRT).
3. Node: 8/8 verificações de contrato passou, sem falhas.
4. Verificação de sintaxe: `node --check js/menstrual-profiles.js` e `node --check service-worker.js` sem erro.
5. Suíte Java geral: 44 testes, 43 aprovados, 1 erro de ambiente (Spring contextLoads). Causa verificada: **conexão recusada em localhost:5432**; PostgreSQL local indisponível, não falha de asserção funcional.
6. Não realizado: PostgreSQL end-to-end, Cypress visual, Postman real com 3 contas, JMeter, teste de instalação PWA, executável desktop e deploy.

## Pendências impeditivas
- Executar migração V18 e testes funcionais somente em banco PostgreSQL **de teste**, com contas fictícias.
- Revisar LGPD, consentimento explícito, retenção, exportação, exclusão, auditoria e combate a abuso do endpoint de convites.
- Implementar e revisar plano de cobrança real antes de disponibilizar mais de um compartilhamento; não há pagamentos fictícios nem desbloqueio pago por parâmetro do cliente.
- Resolver recuperação segura de registros locais antigos (não podem ser atribuídos automaticamente a outra conta).
- Avaliar suporte offline, atualização, navegação e instalação PWA em Windows e outros navegadores.
- Validar aparência no celular, desktop, teclado/zoom e leitor de tela.
- Reavaliar consistência das preferências menstruais antigas com a nova tabela; migrar quando houver autorização técnica.
- Ajustar testes/escopos conforme resultado da auditoria de segurança.

## Política de entrega
Sem push, merge ou deploy automático. `main` preservada. O branch fica disponível localmente para revisão.
Consulte `docs/qa-ciclo-22-11-2026.md` para todos os roteiros de teste.
