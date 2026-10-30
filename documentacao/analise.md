# Fluir | Análise do sistema
**Projeto Integrador — SENAC-DF**  
**Revisão:** 30/10/2026 • **Equipe:** Alex e Dawid  
**Base documental:** código revisado na branch `dawid/realoca-atalhos-calendario-agua-19-10`. Mudanças de outras branches só serão consideradas após integração e teste.

## 1. Problema e justificativa
Tarefas, hábitos, hidratação, sono, finanças e registros pessoais frequentemente ficam espalhados entre aplicativos e anotações. O Fluir reúne essas informações numa interface modular que pode ser ajustada à rotina do usuário.

## 2. Objetivo geral
Desenvolver uma aplicação web de organização pessoal que centralize módulos de acompanhamento diário, permitindo ao usuário configurar suas preferências e acompanhar progresso.

## 3. Público-alvo
Pessoas que desejam administrar a rotina pessoal, com módulos opcionais de acordo com suas necessidades. O protótipo foi construído com foco em clareza visual, navegação simples e responsividade.

## 4. Escopo do projeto
**Já existem interfaces para:** cadastro/login, configuração inicial (onboarding), dashboard, timeline, tarefas, hábitos, água, sono, finanças, diário, alimentação, saúde física, ciclo menstrual, anexos, conquistas, configurações, perfil e planos.

**Integração de backend identificada no código:** cadastro, login, sessão, onboarding e tarefas. Alguns módulos usam `localStorage` no navegador; **não apresentá-los como totalmente persistidos no servidor**.

**Fora do escopo concluído:** app nativo React Native, integração integral de todos os módulos ao backend e disponibilidade garantida 24/7.

## 5. Requisitos funcionais (RF)
| ID | Requisito | Evidência no projeto |
|---|---|---|
| RF01 | Cadastrar e autenticar usuário | `UsuarioController`, telas login/cadastro |
| RF02 | Configurar dados pessoais e módulos no primeiro acesso | `html/setup.html`, `OnboardingController` |
| RF03 | Consultar dashboard personalizado | `html/dashboard.html` |
| RF04 | Criar, consultar, concluir e excluir tarefas | `TarefaController` |
| RF05 | Registrar quantidades de água e acompanhar a meta | `html/water.html`, `js/water.js` |
| RF06 | Consultar progresso e conquistas | `html/achievements.html`, `js/achievements.js` |
| RF07 | Acessar outras áreas do sistema pela sidebar | `js/sidebar.js`, CSS compartilhado |

## 6. Requisitos não funcionais (RNF)
- **RNF01 — Usabilidade:** conteúdo legível, navegação coerente e feedback das ações.
- **RNF02 — Responsividade:** layouts testados em 320, 375, 430px e desktop.
- **RNF03 — Segurança:** senhas com hash BCrypt, controle de acesso e sessões; revisar autorização de todos os endpoints.
- **RNF04 — Integridade:** persistência do PostgreSQL e evolução controlada por migrations Flyway.
- **RNF05 — Manutenibilidade:** separação de arquivos HTML/CSS/JS, classes Java e testes automatizados.

## 7. Fluxo principal
`Cadastro/Login → Onboarding (quando necessário) → Dashboard → Módulos escolhidos → Registros e acompanhamento`.

## 8. Critérios de aceite para a apresentação
1. Abrir a URL publicada, cadastrar/entrar com **conta de demonstração sem dados pessoais**.
2. Navegar entre dashboard, tarefas, água e conquistas sem erro fatal.
3. Demonstrar uma ação real (ex.: registrar água ou concluir uma tarefa).
4. Mostrar persistência **apenas onde comprovada**. Diferenciar banco de dados e `localStorage`.
5. Abrir o site em viewport mobile sem overflow nos controles essenciais.
6. Exibir documentação, testes e evidências verificáveis.

## 9. Riscos conhecidos
- Se o backend no Render estiver no plano gratuito, pode suspender por inatividade, atrasando login.
- Integração gradual entre armazenamento local e API.
- Divergência entre código de desenvolvimento e o que foi publicado em produção.
- Permissões dos endpoints devem ser auditadas antes de expor uma conta de demonstração.

## 10. Conclusão
O Fluir é um **MVP web modular em evolução**, com interfaces funcionais, backend Spring Boot e banco PostgreSQL. O próximo passo é validar a demonstração ponta a ponta e unificar funcionalidades aprovadas em uma versão estável, somente após revisão da equipe.
