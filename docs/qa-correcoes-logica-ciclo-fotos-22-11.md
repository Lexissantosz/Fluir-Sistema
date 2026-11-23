# Fluir — Correções QA-01 do onboarding de Ciclo Menstrual
Data da correção: 22/11/2026 (Brasília)
Branch: `alex/corrige-logica-ciclo-fotos-22-11`

## Correções solicitadas nos três prints
1. **Quantidade primeiro:** a primeira pergunta agora é “Você deseja acompanhar o ciclo menstrual de mais de uma pessoa?” com opções **Não, apenas uma**, **Sim, mais de uma** e **Agora não**.
2. **Uma pessoa não significa necessariamente “meu ciclo”:** escolher Não permite *Meu próprio ciclo* (padrão) **ou** *O ciclo de outra pessoa*. Isso mantém o fluxo utilizável por quem não menstrua e quer acompanhar somente a companheira ou outra pessoa.
3. **Várias pessoas:** escolher Sim permite *Meu ciclo e outras pessoas* ou *Só outras pessoas*. Na segunda opção, criam-se automaticamente duas identificações; ao reduzir para Não, apenas uma permanece na configuração.
4. **Perguntas condicionais:** ao selecionar o próprio ciclo, “Você menstrua atualmente?” recebe **Sim** como valor inicial, mas pode ser alterado. A resposta **Não** ou **Prefiro não responder** oculta datas, durações e lembretes; o backend também descarta tais campos quando a resposta não é Sim. O perfil próprio pode continuar existindo, pois não menstruar atualmente não implica querer perder o histórico.
5. **Foto:** substituído o seletor nativo exibido pelo botão visual do Fluir, com estado “Nenhuma foto selecionada”/“Foto selecionada”, prévia e ação de remover foto apenas quando houver uma.
6. **Identidade e privacidade:** mantém as cores e a estrutura do onboarding original. Fotos de terceiros são prévias locais, não enviadas ao backend; nomes não criam autorização de acesso.

## Matriz de caminhos esperados
| Primeira resposta | Segunda resposta | Perfis configurados | Dados de menstruação próprios |
|---|---|---|---|
| Não, apenas uma | Meu próprio ciclo | Meu ciclo | Somente se responder Sim |
| Não, apenas uma | O ciclo de outra pessoa | 1 pessoa | Não solicitados |
| Sim, mais de uma | Meu ciclo e outras pessoas | Meu ciclo + 1 ou mais pessoas | Somente se responder Sim |
| Sim, mais de uma | Só outras pessoas | 2 ou mais pessoas | Não solicitados |
| Agora não | Nenhuma | Sem configuração | Não solicitados |

## Testes automatizados concluídos
- Chrome/Playwright: **18 cenários aprovados** em desktop e viewport móvel simulada (390 px). Caminhos incluem escolha inicial, mudança de Sim para Não, perfil de terceiros, validação e prévia de foto, prevenção de injeção de HTML, reinício, campos menstruais condicionais, modo Agora não, layout móvel e recuperação de falha da API.
- JUnit/Mockito: **19 testes aprovados**, sem falhas, incluindo isolamento de dados e descarte dos campos de duração/datas quando a pessoa informa que não menstrua.
- Não foi realizado teste em telefone físico nem integração ponta a ponta com PostgreSQL. O backend atualizado não foi implantado.

## Próxima microetapa humana
Alex avalia somente a nova ordem das perguntas e a escolha “Não, apenas uma” no onboarding real. Envia print antes de avançarmos ao Dawid. Não cadastrar dados de saúde reais.
