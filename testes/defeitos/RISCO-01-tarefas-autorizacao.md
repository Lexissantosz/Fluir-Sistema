# RISCO-01 | Tarefas — ausência de verificação de sessão e propriedade
**Identificação:** 30/10/2026  
**Origem:** revisão estática do código, **sem executar requisições contra produção**  
**Casos relacionados:** CT024 (acesso cruzado), CT044 (privacidade)  
**Severidade potencial:** CRÍTICA • **Prioridade:** ALTA, antes do QR code público  
**Estado:** vulnerabilidade indicada pelo código; **exploração e comportamento em ambiente publicado ainda não testados**.

## Evidências de código
- `backend/src/main/java/com/fluir/backend/config/SecurityConfig.java`: `.anyRequest().permitAll()`; somente `/api/onboarding/**` exige autenticação.
- `backend/src/main/java/com/fluir/backend/controller/TarefaController.java`: `GET /api/tarefas/usuario/{usuarioId}` usa o ID da URL para buscar tarefas, sem comparar com o usuário autenticado.
- `POST /api/tarefas`: confia em `request.usuarioId()` para identificar o dono da tarefa.
- `PUT /api/tarefas/{id}/status` e `DELETE /api/tarefas/{id}`: alteram/excluem por ID sem verificar propriedade.
- `js/tasks.js`: as chamadas de tarefas observadas não enviam o cabeçalho `Authorization: Bearer ...`, o que exige alteração coordenada de frontend/backend antes de ativar a proteção.

## Comportamento esperado (requisito)
- Usuários não autenticados não podem listar, criar, alterar nem excluir tarefas privadas.
- Usuário B não pode acessar ou alterar tarefas de A, mesmo conhecendo os IDs.
- Os endpoints obtêm/verificam a identidade pela sessão validada no servidor, não por um campo controlado pelo cliente.

## Verificação necessária em ambiente isolado
1. Subir backend e PostgreSQL temporários.
2. Criar contas fictícias A e B, sem dados pessoais.
3. Autenticar A, criar tarefa de A e salvar ID fictício.
4. Sem autenticação, tentar listar tarefas de A e modificar a tarefa.
5. Autenticar B, repetir tentativas de leitura, alteração e exclusão de A.
6. Conferir que todos os acessos de B ou anônimos são rejeitados com 401/403 e que dados de A permanecem intactos.
7. Guardar status HTTP e logs com tokens/senhas removidos, sem acessar produção.

## Parecer
O código da branch analisada **não demonstra os controles necessários** para proteger as tarefas. Não disponibilizar login de demonstração pública com dados reais. Antes de liberar o QR code, realizar teste CT024/CT044, corrigir autenticação/autorização por proprietário e testar a integração do frontend com token de sessão.

**Correção:** ainda não aplicada neste documento. **Reteste:** pendente. **Evidência executada:** pendente.
