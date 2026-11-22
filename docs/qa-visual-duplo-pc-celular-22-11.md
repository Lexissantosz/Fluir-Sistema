# Fluir | Homologação humana conjunta: PC e celular

**Data da rodada:** 22/11/2026
**Branch:** `alex/refino-ciclo-perfis-22-11`
**Commit:** `7741f7f`
**Alex:** PC, navegador e resolução a registrar
**Dawid:** celular, sistema operacional e navegador a registrar
**Status:** ABERTA, aguardando observações dos dois avaliadores.

## Ambientes verificados
- Protótipo interativo de onboarding: https://fluir-sistema-git-alex-refino-ciclo-perfis-22-11-lexissantosz.vercel.app/docs/prototipo-onboarding-ciclo.html — HTTP 200.
- Nova interface de perfis: https://fluir-sistema-git-alex-refino-ciclo-perfis-22-11-lexissantosz.vercel.app/html/cycle-profiles.html — HTTP 200.
- API no Render em `/api/ciclos/perfis`: HTTP **404** em 22/11/2026. **Não usar a versão pública para testar consentimento, convites ou dados reais**.
- Há diferenças entre o protótipo inicial e a tela integrada. Não confundir avaliação de conteúdo do protótipo com homologação completa do módulo.

## Como registrar
Use **OK** (aprovado), **ERRO** (reproduzível), **DÚVIDA** (texto/fluxo confuso), **N/T** (não testado), **N/A** (não se aplica). Para um erro, anotar o passo exato, comportamento esperado, resultado obtido, tamanho/zoom da tela e print, sem dados privados. Atribuir criticidade: **BLOQUEADOR**, **ALTA**, **MÉDIA**, **BAIXA**.

## Matriz PC × celular
| ID | Cenário / resultado esperado | Alex PC | Dawid celular | Evidência / observação |
|---|---|---|---|---|
| QH-01 | Abrir a prévia correta sem erros visuais | N/T | N/T | |
| QH-02 | Escolher "Meu próprio ciclo" e avançar | N/T | N/T | |
| QH-03 | Escolher "Outra pessoa" sem pergunta indevida sobre menstruar | N/T | N/T | |
| QH-04 | Escolher "Meu ciclo e outra pessoa" | N/T | N/T | |
| QH-05 | Escolher "Agora não" e entender como voltar | N/T | N/T | |
| QH-06 | Entender que "mais de uma pessoa" não é "mais de um ciclo" | N/T | N/T | |
| QH-07 | Escolha "Prefiro não responder" não bloqueia avanço | N/T | N/T | |
| QH-08 | Informar apelido e verificar identificação e confirmação | N/T | N/T | |
| QH-09 | Carregar foto fictícia opcional sem distorção | N/T | N/T | |
| QH-10 | Explicação do código deixar claro que não fornece acesso sozinho | N/T | N/T | |
| QH-11 | Analisar hierarquia, contraste, textos e alinhamento | N/T | N/T | |
| QH-12 | Verificar que não há texto cortado nem rolagem horizontal indevida | N/T | N/T | |
| QH-13 | Testar navegação voltar/continuar e foco de teclado | N/T | N/T | |
| QH-14 | Verificar telas com zoom 150% e 200% | N/T | N/T | |
| QH-15 | Abrir interface integrada sem login; não deve mostrar dados de usuário | N/T | N/T | |
| QH-16 | Entender indicação de perfil selecionado e significado das permissões | N/T | N/T | |
| QH-17 | Avaliar calendário mensal e filtros com dados de teste após staging | N/T | N/T | |
| QH-18 | Avaliar convite/aceite/revogação com contas fictícias após backend staging | N/T | N/T | |
| QH-19 | Avaliar instalação desktop PWA na máquina compatível | N/T | N/T | |
| QH-20 | Avaliar UX final da versão integrada e acessibilidade básica | N/T | N/T | |

## Relatório de defeito (copiar para cada ocorrência)
```text
ID: QH-__
Pessoa: Alex (PC) / Dawid (celular)
Dispositivo:
Sistema/navegador:
Tamanho da tela / zoom:
Passos para reproduzir:
Esperado:
Obtido:
Criticidade: Bloqueador / Alta / Média / Baixa
Print ou vídeo: arquivo/link
Reproduz: sempre / às vezes / uma vez
```

## Etapas de decisão
1. **Rodada A (agora):** QH-01 a QH-14 no protótipo, usando apenas dados fictícios.
2. **Rodada B (agora, limitada):** QH-15 a QH-16 na interface integrada sem login real.
3. **Rodada C (após staging isolado):** QH-17 e QH-18 e testes de autenticação e permissão com duas ou três contas fictícias; executar também automações.
4. **Rodada D:** QH-19 e QH-20; avaliação conjunta, regressões e parecer de aprovação.
5. Consolidar todos os itens ERRO, corrigir em branch própria, repetir cenários e registrar novo commit de homologação.

**Importante:** Não usar dados íntimos verdadeiros. O aplicativo não deve ser lançado com compartilhamento de dados de saúde sem testes end-to-end, revisão de privacidade e validação das permissões.
