# Fluir — Integração real do Ciclo Menstrual no onboarding clássico
Data: 22/11/2026 | Branch: `alex/integrar-ciclo-onboarding-real-22-11`

## Contexto e decisão
Substituir o protótipo roxo como caminho de implementação. O onboarding original de quatro etapas permanece; o módulo Ciclo Menstrual aparece **dentro de Preferências (Etapa 3)** quando ativado em Funcionalidades (Etapa 2). A estética usa o tema clássico do Fluir: preto, branco, cinza, cards e componentes originais; o arquivo `docs/prototipo-onboarding-ciclo.html` não foi recolorido.

## Correções solicitadas
| Erro do QA anterior | Correção integrada | Observação |
|---|---|---|
| QA-01: "mais de uma pessoa" sem campos suficientes | `Quem você deseja acompanhar?`, botão Sim/Não para quantidade, identificação dinâmica de até 5 outras pessoas | 1 vaga gratuita para outra pessoa; demais vagas são **rascunhos planejados**, não acessos pagos ativos |
| QA-02: "Recomeçar" preservava dados | Adicionados reinício integral do onboarding e reinício específico do ciclo; zeram seleções, rascunhos e fotos não salvas | Não apagam contas ou registros já salvos |
| QA-03: Foto não aparecia no card | Prévia da foto própria e de cada perfil; foto também aparece nos cards da revisão final | Foto própria pode ser persistida após autenticação; fotos de terceiros NÃO são enviadas ao backend sem autorização |
| Inconsistência visual | Nova tela real de ciclos com paleta Fluir clássica; onboarding original preservado | Aplicação desktop nativa e temas alternativos fora do escopo desta correção |
| Perguntas sobre sexo atribuído ao nascer | Fluxo do ciclo não assume gênero/sexo para determinar quem menstrua | O onboarding geral ainda possui pergunta própria com opção de não informar |
| Problema de armazenamento local | Configuração nova do ciclo não é adicionada ao objeto `fluir-setup` no localStorage | Demais módulos seguem seu comportamento atual |
| Contagem de caracteres | Nova migração V20 amplia resposta "prefiro-nao-responder" para 32 caracteres | Necessário homologar Flyway no PostgreSQL de teste |

## Implementação de persistência
- `PUT /api/ciclos/configuracao-inicial`: autenticação obrigatória, modo self/other/both/later, campos de ciclo próprio, foto própria JPEG validada, rascunhos com apelido/possuiFluir/sincronização desejada; sem aceitar IDs de outros usuários como prova de identidade.
- `GET /api/ciclos/rascunhos` e `DELETE /api/ciclos/rascunhos/{id}`: listagem e remoção restritas ao visitante autenticado.
- Migracões V19 e V20. **Rascunho nunca é autorização de acesso.** Para realmente visualizar ciclo de outra pessoa, seguem necessários o convite, aprovação e permissões do titular.
- Se a API do ciclo falhar após o onboarding original ser salvo, exibir erro e permitir nova tentativa, sem refazer o POST original.
- O plano pago ainda não foi implementado; vagas extras continuam desativadas para acesso real e cobrança.

## Evidências automatizadas
- Backend Java 21: compilação BUILD SUCCESS.
- Testes do backend: `CicloOnboardingControllerTest` e `CicloPerfisControllerTest` com JUnit/Mockito (**18/18 aprovados, sem erros**); resultados em `backend/target/surefire-reports`.
- Browser real (Chrome + Playwright): `tests/onboarding-cycle.e2e.cjs`; cobre manutenção do onboarding de quatro etapas, escolha de múltiplos perfis, aliases com HTML não executável, prévia de foto, revisão, reinício total, opção de menstruação, tema clássico, 390px, e retry do backend sem POST duplicado (13 testes aprovados em Chrome/Playwright).
- `tests/relatorio-browser-qa.txt` contém resultado; `tests/evidencia-onboarding-pc.png`, `tests/evidencia-onboarding-mobile.png` e `tests/evidencia-onboarding-mobile-etapa3.png` são capturas geradas no Chrome, NÃO teste em aparelho Android físico.
- Para executar Playwright, iniciar um servidor estático local do repositório em 127.0.0.1:5505, instalar `playwright` como dependência de desenvolvimento na máquina de QA e usar navegador Chrome. Não usar o backend de produção durante testes.

## Limitações importantes
- **Nenhum deploy do backend foi feito.** O Render de produção não possui essas rotas, então salvar o onboarding de ciclos no preview falhará até ser disponibilizado um backend de teste compatível. Não testar com dados reais.
- Não houve avaliação física em Android/iPhone nesta etapa, apenas emulação de viewport móvel no Chrome desktop.
- Não houve testes end-to-end com PostgreSQL real para V19/V20, nem aprovação jurídica de LGPD, cobrança ou auditoria de convites.
- Os protótipos antigos permanecem como referência, não como a implementação definitiva.
- A branch ainda precisa de revisão antes do merge na `main`.

## Próxima validação humana (uma microetapa de cada vez)
1. Alex no PC: abrir `html/setup.html` na prévia da branch, percorrer até Etapa 3 ativando Ciclo Menstrual, observar **somente** se o layout segue o onboarding Fluir e se a pergunta mudou para pessoas.
2. Registrar aprovado/erro e print.
3. Depois Dawid valida o mesmo passo no Android disponível (se o APK não foi reconstruído com esta branch, marcar não testado e usar browser responsivo). Nunca confundir APK antigo com prévia web.
