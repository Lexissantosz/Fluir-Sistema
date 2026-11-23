# Fluir | Roteiro de homologação por pessoa e dispositivo

**Data:** 23/11/2026. **Nenhum dado real de saúde, foto pessoal, conta ou cartão deve ser usado.**
**Regra de execução humana:** um cenário por vez; marcar o resultado e anexar evidência antes do próximo.

## Regras gerais

Contas fictícias necessárias na base de **staging**: `A (titular)`, `B (convidado)`, `C (não autorizado)`. Não usar contas pessoais. Senhas e tokens ficam fora dos prints e relatórios. Não executar migrations destrutivas em produção. Se staging não estiver disponível, marcar testes de API reais como **BLOQUEADO**, sem simular aprovação.

Para cada caso, registrar **Aprovado / Reprovado / Bloqueado / Não testado**, data/hora, aparelho/navegador, origem, branch/versão, resultado esperado, observado e print ou vídeo sem dados privados.

## Trilha A | Alex no PC (Windows + Chrome ou Edge)

| ID | Ação passo a passo | Resultado esperado | Estado inicial |
|---|---|---|---|
| PC-01 | Abrir a prévia de QA; conferir origem e branch antes de usar | Tela Fluir, logo correto, sem sobreposição | Não testado humano |
| PC-02 | Abrir DevTools → Application → Manifest | Ícones 192/512, start_url login, standalone | Automatizado; falta humano |
| PC-03 | Instalar PWA pelo navegador, abrir pelo menu Iniciar | Janela própria Fluir; abre login, não landing | Não testado |
| PC-04 | Com conta fictícia A, fazer login e atualizar a página | Sessão mantida na mesma janela, sem erro falso | Bloqueado por staging |
| PC-05 | Abrir o mesmo site em nova aba ou outra origem | Ausência de login informada sem alegar expiração | Automatizado; falta humano |
| PC-06 | Ir em Preferências → Ciclo → múltiplas pessoas | Apelidos/fotos não misturados, sem dados reais | Automatizado; falta humano |
| PC-07 | Escolher Pessoal 2x + Completo 1x; remover Completo | Sugestão altera de Completo para Pessoal | Automatizado; falta humano |
| PC-08 | Remover as escolhas pagas e avançar ao resumo | Gratuito e nenhum pagamento disparado | Automatizado; falta humano |
| PC-09 | Abrir PWA sem internet após primeira instalação | Mensagem Sem conexão, sem dados privados em cache | Automatizado; falta humano |
| PC-10 | Reativar internet e repetir login da conta fictícia | Login funciona sem dados duplicados | Não testado |
| PC-11 | Verificar zoom 125/150%, teclado, tab e setas | Nada fica ilegível ou fora da área visível | Não testado |

## Trilha D | Dawid no Android físico

**Pré-condição:** instalar somente o APK *debug* desta branch, já compilado e validado; conferir data/hash do arquivo. Não confundir com APK antigo de 19/11. Não desinstalar o app anterior com dados reais sem consentimento/backup.

| ID | Ação | Resultado esperado | Estado inicial |
|---|---|---|---|
| AND-01 | Anotar fabricante, modelo, versão Android e arquivo APK | Origem e versão rastreáveis | Não testado |
| AND-02 | Instalar APK de debug por fonte autorizada de testes | Abre sem avisos de permissões inadequadas | Não testado |
| AND-03 | Abrir pelo ícone Fluir | Tela de login, identidade correta, sem página em branco | Não testado |
| AND-04 | Fazer login com conta fictícia A no staging | Token e onboarding válidos; sem erro falso | Bloqueado por staging |
| AND-05 | Fechar e reabrir o app | Comportamento de sessão documentado; novo login quando necessário | Não testado |
| AND-06 | Navegar módulos por barra/menu e botão Voltar do Android | Não fecha inesperadamente nem perde estado | Não testado |
| AND-07 | Testar ciclo, foto válida, foto inválida, perfis A/B | Layout e validações, sem acesso cruzado | Não testado |
| AND-08 | Alterar recursos do Pessoal/Completo e remover 1 item | Recomendação correta; sem cobrança | Não testado |
| AND-09 | Alternar retrato/paisagem e aumentar fonte do sistema | Controles acessíveis e sem sobreposição | Não testado |
| AND-10 | Desligar dados/Wi-Fi e tentar ação remota | Erro claro; não alegar salvamento | Não testado |
| AND-11 | Reativar rede e repetir a ação | Recuperação sem duplicar registros | Não testado |
| AND-12 | Usar navegador Chrome e instalar PWA separadamente | Comparação PWA vs APK registrada, não presumir equivalência | Não testado |

## Trilha I | iPhone / Safari PWA

**Pré-condição:** iPhone disponível; versão iOS anotada. **Não existe IPA nesta entrega.**

| ID | Ação | Resultado esperado | Estado |
|---|---|---|---|
| IOS-01 | Abrir site oficial ou prévia autorizada pelo Safari | Login e estilos corretos | Não testado |
| IOS-02 | Compartilhar → Adicionar à Tela de Início | Ícone oficial do Fluir | Não testado |
| IOS-03 | Abrir ícone instalado | Abre como web app; valida sessão no novo contexto | Não testado |
| IOS-04 | Login fictício A, recarregar, fechar e reabrir | Estado correto sem falsa expiração | Bloqueado por staging |
| IOS-05 | Ciclo: seletores, fotos, rolagem, Safe Area e teclado | Campos visíveis, sem cortes | Não testado |
| IOS-06 | Escolhas Pessoal/Completo e resumo | Indicação correta, sem contratação | Não testado |
| IOS-07 | Desligar Wi-Fi/dados e abrir novamente | Aviso offline; não expor dados anteriores | Não testado |
| IOS-08 | Ativar VoiceOver/zoom de texto | Formulários alcançáveis e legíveis | Não testado |

## Trilha B | Backend / QA automatizado, preferencialmente com Dawid

| ID | Execução | Critério de aceite | Estado |
|---|---|---|---|
| API-01 | `mvn -f backend/pom.xml test` com PostgreSQL 16 isolado | Nenhuma falha JUnit/Mockito | **64/64 aprovados**, BUILD SUCCESS |
| API-02 | `node tests/pwa-dispositivos.e2e.cjs` | Cache público, offline e PWA verdes | 10/10 automático |
| API-03 | `node tests/onboarding-cycle.e2e.cjs` | Ciclo, reinício, foto, sessão falsa e real | 21/21 automático |
| API-04 | `node tests/onboarding-plans.e2e.cjs` | Plano inferido, remoções, gratuito | 17/17 automático |
| API-05 | `node --test tests/pwa-static.test.cjs` | Ícones, metadados, Capacitor, proteção cache | 6/6 automático |
| API-06 | Repetir preflight CORS depois do deploy de staging | Origens aprovadas 200, externas 403 | Bloqueado |
| API-07 | Três contas A/B/C e convites | B só vê campos autorizados; C não vê nada | Bloqueado |
| API-08 | Flyway V19/V20/V21 em PostgreSQL de teste | Migração não perde dados; rollback planejado | Bloqueado |
| API-09 | Postman + Swagger com token válido/inválido | 401/403 coerentes; sem recursos indevidos | Bloqueado |
| API-10 | JMeter com contas fictícias e limites | Latência/carga documentadas, sem saturar produção | Não testado |
| API-11 | Gemini com consentimento ligado/desligado | Resposta real apenas com opt-in; falha segura | Bloqueado |
| API-12 | Login Google | Só habilitar quando OAuth estiver configurado e auditado | Desabilitado hoje |
| API-13 | APK CI e inspeção de manifesto/permissões | Build, appId e integração coerentes | Execução desta rodada em andamento |

## Ficha de registro para cada caso

```text
FLUIR QA-ID:
Data/hora e fuso:
Responsável:
Dispositivo / SO / navegador:
Branch ou SHA / URL do ambiente:
Conta fictícia:
Pré-condições:
Passo executado:
Resultado esperado:
Resultado observado:
Status: APROVADO / REPROVADO / BLOQUEADO / NÃO TESTADO
Gravidade, se falhou: P0 / P1 / P2
Evidência: print/video sem dados pessoais
Issue/branch de correção:
Próximo passo:
```

## Ordem recomendada

Primeiro **sessão + CORS** em staging (API-06, PC-04). Depois **ciclo + autorização A/B/C** (API-07), então Android físico (AND-01 em diante), iPhone (IOS-01 em diante), desktop instalado (PC-03 em diante), Gemini e Google login. Não iniciar testes de persistência real enquanto a API de staging não estiver homologada.
