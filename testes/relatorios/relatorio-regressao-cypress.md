# Fluir — Relatório de execução, defeito de teste e reteste Cypress
**Data:** 30/10/2026  
**Ferramenta:** Cypress 13.15.0, Electron em runner GitHub Actions.  
**Ambiente:** servidor HTTP local `127.0.0.1:5500`, dados fictícios no armazenamento local do navegador.

## Primeiro ciclo — falhou um teste
- [Execução inicial](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118512137): **8 executados, 7 passaram, 1 falhou**.
- Falha no **CT037**: `AssertionError: expected ...achievementModal.show to have class active`.
- **Classificação:** defeito **no script de teste**, não falha comprovada do Fluir. O JavaScript real usa `show` para abrir o modal, mas a asserção procurava `active`.
- **Evidência:** XML JUnit, screenshot de falha e log no artefato `fluir-evidencias-cypress` da primeira execução.
- **Correção:** asserção alterada para classe `show`, sem editar código de negócio.
- **Commit do reteste:** `fae81b9af76c46a9be7b69082a0bc020655eef9d`.

## Segundo ciclo — reteste aprovado
- [Execução do reteste](https://github.com/Lexissantosz/Fluir-Sistema/actions/runs/41118845086): **8 executados, 8 passaram, 0 falhas**.
- Relatório original: [cypress-junit.xml](../evidencias/2026-10-30/cypress-junit.xml).

| Caso | Evidência funcional verificada | Resultado |
|---|---|---|
| CT001 | Tela de login e formulário renderizam | **PASSOU** |
| CT007 | Formulário vazio apresenta validação | **PASSOU** |
| CT038 | Login cabe em 320 × 568 | **PASSOU** |
| CT025 | Atalho +200ml atualiza total e percentual; recarga preserva | **PASSOU** |
| CT026 | Atalho +250ml incrementa consumo | **PASSOU** |
| CT029 | Registro personalizado acima de 1000ml é recusado | **PASSOU** |
| CT035 | Filtros de conquistas reagem e ficam ativos | **PASSOU** |
| CT037 | Modal de conquistas abre e fecha | **PASSOU** |

## Observações
- Um **teste corrigido** não significa que algum defeito de produto tenha sido encontrado ou resolvido.
- Os cenários ocorreram em **frontend local**, não nas URLs de produção.
- O teste CT038 verifica a tela de login em 320px, não valida todas as telas em 320/375/430px.
- O pacote original de falha contém screenshot, mas artefatos do GitHub Actions expiram. Manter o backup de evidências separado se a instituição exigir anexos gráficos permanentes.
