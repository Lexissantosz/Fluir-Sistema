# Fluir — Relatório detalhado JUnit 5 e Mockito
**Emissão:** 30/10/2026 • **Equipe:** Alex e Dawid  
**Origem dos resultados:** relatórios Surefire XML/TXT da execução verificada do [GitHub Actions](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845088).  
**Commit da execução:** `fae81b9af76c46a9be7b69082a0bc020655eef9d`  
**Ambiente:** Java 21, Spring Boot 3.5.16 e PostgreSQL 16 de teste.

## Resumo
| Indicador | Valor |
|---|---:|
| Testes unitários/integração de contexto | **23** |
| Passaram | **23** |
| Falharam | 0 |
| Erros | 0 |
| Ignorados | 0 |
| Testes de serviço com Mockito (incluídos nos 23) | **3** |

**Não somar Mockito como mais 3 testes além dos 23**. Trata-se da mesma suíte executada por JUnit.

## Relação nominal dos 23 testes executados
| Nº | Classe | Método testado | Área | Resultado |
|---:|---|---|---|---|
| 1 | `BackendApplicationTests` | `contextLoads` | Inicialização Spring Boot | **PASSOU** |
| 2 | `CadastroLoginQaTest` | `ct008EmailInvalido` | Cadastro | **PASSOU** |
| 3 | `CadastroLoginQaTest` | `ct010CadastroValido` | Cadastro | **PASSOU** |
| 4 | `CadastroLoginQaTest` | `ct007LoginSemEmail` | Login | **PASSOU** |
| 5 | `OnboardingRequestValidationTest` | `deveRejeitarDataDaUltimaMenstruacaoNoFuturo` | Onboarding | **PASSOU** |
| 6 | `OnboardingRequestValidationTest` | `deveRejeitarCamposObrigatoriosAusentes` | Onboarding | **PASSOU** |
| 7 | `OnboardingRequestValidationTest` | `deveAceitarOnboardingComDadosBasicosValidos` | Onboarding | **PASSOU** |
| 8 | `OnboardingRequestValidationTest` | `deveRejeitarNomeVazio` | Onboarding | **PASSOU** |
| 9 | `OnboardingRequestValidationTest` | `deveRejeitarIdadeAbaixoDe13Anos` | Onboarding | **PASSOU** |
| 10 | `OnboardingRequestValidationTest` | `deveRejeitarRendaMensalNegativa` | Onboarding | **PASSOU** |
| 11 | `OnboardingRequestValidationTest` | `deveRejeitarIdadeAcimaDe120Anos` | Onboarding | **PASSOU** |
| 12 | `AuthSessionServiceTest` | `deveRetornarUsuarioQuandoTokenForValido` | Sessão | **PASSOU** |
| 13 | `AuthSessionServiceTest` | `deveRetornarNullQuandoTokenNaoExistir` | Sessão | **PASSOU** |
| 14 | `AuthSessionServiceTest` | `deveCriarESalvarSessaoPersistida` | Sessão | **PASSOU** |
| 15 | `AuthSessionServiceTest` | `deveExcluirSessaoExpirada` | Sessão | **PASSOU** |
| 16 | `OnboardingServiceTest` | `deveFalharQuandoUsuarioNaoExistir` | Onboarding | **PASSOU** |
| 17 | `OnboardingServiceTest` | `deveFalharAoBuscarOnboardingInexistente` | Onboarding | **PASSOU** |
| 18 | `OnboardingServiceTest` | `deveFalharQuandoUsuarioIdNaoForInformado` | Onboarding | **PASSOU** |
| 19 | `OnboardingServiceTest` | `deveSalvarPerfilBasicoEConcluirOnboarding` | Onboarding | **PASSOU** |
| 20 | `OnboardingServiceTest` | `deveSalvarPreferenciasComplexasDoOnboarding` | Onboarding | **PASSOU** |
| 21 | `UsuarioServiceQaMockitoTest` | `ct006RecusaSenhaIncorreta` | Mockito / Login | **PASSOU** |
| 22 | `UsuarioServiceQaMockitoTest` | `ct005LoginValidoGeraToken` | Mockito / Login | **PASSOU** |
| 23 | `UsuarioServiceQaMockitoTest` | `ct009RecusaEmailDuplicado` | Mockito / Cadastro | **PASSOU** |

## Critério e evidência
Cada classe possui relatório `TEST-com.fluir...xml` e `.txt` no artefato **fluir-relatorios-junit-mockito** da execução mencionada. As informações correspondem aos relatórios originais do Maven, não a uma captura simulada.

## Limites
Esses testes cobrem lógica, validação, mocks e inicialização do backend de QA; **não são 23 testes visuais de usuário**. Não garantem autorização de todas as rotas, persistência real dos módulos de interface ou ausência de defeitos em produção.
