# FLUIR — QA humano em três trilhas (22/11/2026)

**Branch web do ciclo:** `alex/refino-ciclo-perfis-22-11`
**Prévia do onboarding:** https://fluir-sistema-git-alex-refino-ciclo-perfis-22-11-lexissantosz.vercel.app/docs/prototipo-onboarding-ciclo.html
**Prévia da interface integrada:** https://fluir-sistema-git-alex-refino-ciclo-perfis-22-11-lexissantosz.vercel.app/html/cycle-profiles.html

> Importante: o APK localizado em Downloads/Fluir-Android-Avaliacao-22-11.apk foi gerado em 22/11 às 18:40, antes dos commits da nova versão de ciclos. **Não é a mesma versão da prévia web.** Avaliar Android como aplicativo existente; não reprovar funcionalidades novas que ainda não estão nele. Não usar dados de saúde reais. API pública de ciclos ainda não responde para homologação.

## QA-01 — Alex / PC / Web (protótipo)
1. Abrir o link do onboarding em janela maximizada.
2. Examinar textos, botões, alinhamentos e proporções.
3. Avançar em “Meu próprio ciclo”; voltar.
4. Percorrer “Outra pessoa”, “Meu ciclo e outra pessoa” e “Agora não”.
5. Testar “Prefiro não responder”, apelido, foto de teste e resumo final.
6. Testar janela estreita e zoom de 125%, 150%, 200%.
7. Navegar por Tab, Shift+Tab, Enter, verificar foco visível.
8. Salvar prints e resultado de cada erro observado.

## QA-02 — Dawid / Android instalado (APK de avaliação)
1. Confirmar o APK instalado; se não existir, receber o arquivo diretamente da equipe por canal confiável.
2. Abrir pelo ícone do aplicativo, não pelo Chrome.
3. Inspecionar logo, splash, estabilidade e tempo percebido de abertura.
4. Testar login fictício, retorno ao app e estabilidade da sessão.
5. Percorrer os módulos que existem nessa build e testar toques/voltar.
6. Usar teclado do Android nos formulários; verificar se campos, botões e mensagens continuam acessíveis.
7. Minimizar/reabrir e alternar orientação, quando suportado.
8. Registrar travamentos, telas vazias, erros de sessão e ajustes visuais.
9. O novo compartilhamento de ciclos não está homologado neste APK: marcar N/A, não “erro”.

## QA-03 — Dawid / Site responsivo no celular
1. Abrir o mesmo link do onboarding diretamente no navegador (não no APK).
2. Inspecionar se textos e botões cabem na largura da tela.
3. Testar os quatro caminhos: eu, outra pessoa, ambos, agora não.
4. Testar apelido, foto fictícia, teclado, campos opcionais.
5. Verificar se nada fica sob barras do navegador, recortes ou sobreposições.
6. Testar rolagem e orientação horizontal/vertical, se possível.
7. Comparar a mesma etapa com Alex no PC, sem confundir com APK antigo.
8. Registrar prints e detalhes.

## Modelo de preenchimento
| Trilha | Responsável | Status | Comentários | Evidências |
|---|---|---|---|---|
| QA-01 PC Web | Alex | Não testado |  |  |
| QA-02 Android APK | Dawid | Não testado |  |  |
| QA-03 Web responsiva | Dawid | Não testado |  |  |

**Status permitidos:** aprovado / erro encontrado / dúvida / não testado / bloqueado.

Para cada defeito: trilha, tela, passo exato, resultado esperado, observado, aparelho, navegador (para web), zoom/orientação, criticidade (bloqueador/alta/média/baixa), print sem dados pessoais.

## Próxima etapa após os três resultados
Consolidar divergências entre PC e celular na prévia web, separar os defeitos específicos de APK antigo, priorizar e corrigir em branch isolada. Homologar ciclos reais só depois de API e PostgreSQL de teste, verificação de consentimento e segurança entre contas.
