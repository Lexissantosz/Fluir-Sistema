# Fluir | Roteiro de apresentação — 10 min + 5 min de perguntas
**Participantes:** Alex e Dawid. **Objetivo:** demonstrar o MVP e seu desenvolvimento, sem prometer funcionalidades não validadas.

| Tempo | Quem | Tópico | O que mostrar |
|---|---|---|---|
| 00:00–01:00 | Alex | Abertura e problema | Nome, propósito, organização fragmentada |
| 01:00–02:00 | Dawid | Solução e público | Conceito modular; módulos por preferência |
| 02:00–03:00 | Alex | Mockup e MVP | Evolução do desenho para versão navegável |
| 03:00–04:00 | Dawid | Tecnologias e arquitetura | HTML/CSS/JS → Java Spring Boot → PostgreSQL |
| 04:00–05:30 | Alex | Demonstração 1 | Login de teste, onboarding e dashboard |
| 05:30–07:00 | Dawid | Demonstração 2 | Tarefas e registro de água, usando dados fictícios |
| 07:00–08:00 | Alex | Personalização e conquistas | Exemplos reais confirmados na versão do dia |
| 08:00–09:00 | Dawid | Qualidade e testes | Plano QA, evidências, limites da versão |
| 09:00–09:40 | Alex | Aprendizados e próximos passos | Integração backend, melhorias e estabilidade |
| 09:40–10:00 | Ambos | Encerramento e QR code | Link do projeto + instrução de login de demonstração |
| 10:00–15:00 | Ambos | Perguntas | Respostas objetivas com exemplos práticos |

## Falas-guia
**Alex, início:** “O Fluir surgiu da dificuldade de organizar várias áreas da rotina em aplicativos diferentes. Nossa proposta é reunir essas áreas num sistema flexível, que cada pessoa adapta às suas necessidades.”

**Dawid, solução:** “O usuário escolhe os módulos mais relevantes para sua rotina. O objetivo não é abrir uma tela cheia de funções que ele nunca usa, mas apresentar o que importa.”

**Alex, mockup/MVP:** “O mockup serviu para planejar estrutura, navegação e aparência. O MVP é a versão mínima que permite testar essa experiência com funcionalidades reais.”

**Dawid, arquitetura:** “A interface usa HTML, CSS e JavaScript; o backend é Java com Spring Boot, e a persistência integrada usa PostgreSQL com migrations Flyway. Parte dos módulos ainda utiliza armazenamento local, então a integração está em evolução.”

**Alex, demonstração:** “Agora vamos mostrar como uma pessoa entra, escolhe módulos e acompanha sua rotina.”

**Dawid, QA:** “Testamos cenários de cadastro, login, navegação, hidratação e responsividade. Registramos defeitos com passos e evidências, sem confundir o que está pronto com melhorias planejadas.”

**Ambos, fim:** “Este é o Fluir. O QR code abre a versão de demonstração. Obrigado! Agora podemos responder às perguntas.”

## Slides recomendados (8)
1. Capa — Fluir / integrantes.
2. Problema + proposta.
3. Mockup e MVP — imagens lado a lado.
4. Áreas e personalização.
5. Arquitetura — diagrama simples.
6. Demonstração — prints e uma ação ao vivo.
7. Testes — casos + evidência + próximos passos.
8. QR code grande, URL legível e conta de teste **apenas após ser criada/validada**.

## Plano B para falhas da internet/API
- Fazer antes da apresentação uma gravação de 60–90s do fluxo aprovado, com conta fictícia.
- Manter capturas do mockup, dashboard e módulo de Água.
- Se o backend não responder, explicar a diferença entre o frontend e a API e apresentar a gravação.
- **Não colar credenciais reais** em slides, Markdown público ou repositório.

## Perguntas prováveis (respostas)
- **É aplicativo de celular?** Hoje é principalmente web responsiva; app nativo fica como evolução.
- **Qual banco?** PostgreSQL, com Flyway para controlar mudanças.
- **Todos os módulos usam backend?** Não; há módulos com dados locais durante migração.
- **Por que usar MVP?** Validar funcionalidades essenciais antes de ampliar o sistema.
- **Como testaram?** Casos reproduzíveis, JUnit, validações no navegador e evidências.
- **E se sair do ar?** Verificamos frontend/API, fazemos monitoramento e levamos gravação de contingência.

## Checklist final
- [ ] Verificar link público e login de demonstração.
- [ ] Fazer ensaio com cronômetro real; cada apresentador respeita sua faixa.
- [ ] Capturar evidências reais; não usar prints com dados pessoais.
- [ ] Colocar QR code legível e testar câmera de pelo menos dois celulares.
- [ ] Confirmar projetor, rede e plano B.
