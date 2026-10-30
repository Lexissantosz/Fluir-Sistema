# Fluir | Plano de testes e evidências
**Versão:** 30/10/2026 • **Objetivo:** demonstrar qualidade com casos reproduzíveis, sem inventar execução.

## Ambiente para teste
- Browser Chrome/Edge, desktop e viewport 320, 375 e 430px.
- Frontend: `https://fluir-sistema.vercel.app/` ou preview de branch aprovado.
- API: `https://fluir-sistema.onrender.com` (confirmar disponibilidade).
- Dados: conta fictícia exclusiva para demonstração, sem informações pessoais.
- Ferramentas: Chrome DevTools, console do navegador, Cypress (quando configurado), Maven/JUnit, opcional Postman, JMeter e Swagger **somente se configurado**.

## Catálogo completo e registro de execuções

A matriz abaixo é um conjunto inicial de **14 casos prioritários**. O catálogo completo contém **46 casos**, com pré-condições, dados, passos e resultados esperados, em [`casos-de-teste.csv`](casos-de-teste.csv) e [`casos-de-teste.md`](casos-de-teste.md). O registro dos resultados reais fica em [`execucao/registro-de-execucao.csv`](execucao/registro-de-execucao.csv), e os resumos em [`relatorios/relatorio-execucao.md`](relatorios/relatorio-execucao.md).

## Matriz de casos
| ID | Área | Passos resumidos | Esperado | Resultado |
|---|---|---|---|---|
| CT01 | Site | Abrir URL publicada | Página carrega sem erro crítico | Não executado |
| CT02 | API | GET `/api/usuarios/teste` | HTTP 200 e texto de funcionamento | Não executado |
| CT03 | Cadastro | Cadastrar usuário de teste com dados válidos | Cadastro confirmado | Não executado |
| CT04 | Login | Autenticar conta de teste | Sessão válida e navegação correta | Não executado |
| CT05 | Segurança | Login com senha errada | Erro de autenticação, sem dados da conta | Não executado |
| CT06 | Onboarding | Preencher, concluir e voltar | Dados/etapa conforme regra implementada | Não executado |
| CT07 | Tarefas | Criar, concluir e recarregar tarefa | Estado consistente com API | Não executado |
| CT08 | Água | Adicionar 200/250/300/500ml | Somatório correto, limite por registro respeitado | Não executado |
| CT09 | Água | Alterar meta e consultar histórico | Meta e registros coerentes | Não executado |
| CT10 | Conquistas | Criar registros e revisar progresso | Desbloqueio calculado corretamente | Não executado |
| CT11 | Responsividade | Abrir 320, 375, 430px e desktop | Sem corte ou sobreposição em áreas essenciais | Não executado |
| CT12 | Sessão | Recarregar após período ocioso | Comportamento de sessão documentado | Não executado |
| CT13 | Autorização | Usuário A tenta acessar tarefa do B | Acesso negado, sem vazamento | Não executado |
| CT14 | Regressão | Navegar entre módulos e recarregar | Sem erro fatal ou quebra de navegação | Não executado |

## Evidência por caso
Guardar em `testes/evidencias/` os arquivos `CT01-descricao.png`, `CT02-resposta-api.txt` etc. Registrar data, navegador, URL, commit testado, resultado obtido e referência do defeito.
**Nunca** fotografar ou publicar senhas, tokens, cookies, dados reais de usuários ou segredos do servidor.

## Modelo de defeito
- ID:
- Título: [Tela] • [O que acontece] • [Condição]
- Ambiente: navegador, resolução, branch, commit
- Pré-condições:
- Passos para reproduzir:
- Esperado:
- Obtido:
- Severidade / Prioridade:
- Frequência:
- Evidência:
- Responsável / Status:

## Critérios de liberação para apresentação
- CT01–CT05 e CT07–CT11 executados e revisados.
- CT13 deve ser validado antes de divulgar login de demonstração publicamente.
- API disponível e fallback de vídeo/imagens offline em caso de falha.
- Caso um teste falhe, registrar como defeito e limitar a demonstração às partes aprovadas.

## Comandos sugeridos
```bash
cd backend
./mvnw test
# Windows: .\mvnw.cmd test
```
```powershell
curl.exe -i https://fluir-sistema.onrender.com/api/usuarios/teste
```
Resultados **não foram fabricados**: a equipe deve registrar resultados reais ao executar.
