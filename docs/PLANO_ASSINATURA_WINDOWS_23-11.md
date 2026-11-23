# Fluir | Distribuição segura do aplicativo Windows

**Estado em 23/11/2026:** aplicativo Electron compilado, instalador NSIS de QA disponível, **mas sem assinatura digital**. O Windows SmartScreen apresentou “Fornecedor desconhecido”. A verificação do arquivo local retornou `NotSigned`.

## Problema real

- O download do `.exe` foi concluído e seu SHA-256 coincidiu com o publicado na release de avaliação.
- Isso confirma a integridade em relação ao arquivo lançado, **não a identidade verificada do publicador**.
- O SmartScreen também considera a reputação de aplicativos e certificados. **Assinar não elimina obrigatoriamente o alerta na primeira versão.**
- Não desativar Defender, SmartScreen, Smart App Control, nem recomendar “Executar assim mesmo” a usuários finais.

## Dois caminhos de distribuição legítima

### Caminho A — Microsoft Store (recomendado para primeiro lançamento ao público)

A Microsoft permite publicar um **pacote MSIX** e o assina após a certificação na Store. A pessoa instala pela Loja e não precisa de um certificado particular para a assinatura do MSIX na Store.

**Ainda não executado:** criar conta de desenvolvedor, preparar metadados/arte do aplicativo, identidade do publicador, empacotar MSIX, submeter à certificação e ser aprovado. A Loja requer atos do titular da conta. Não confundir o instalador NSIS `.exe` atual com um MSIX.

Referência: https://learn.microsoft.com/windows/apps/package-and-deploy/code-signing-options

### Caminho B — Download direto do .exe (preferência atual)

Para um `.exe` público com fornecedor verificável, o responsável pelo projeto precisa obter uma credencial de **assinatura de código emitida por autoridade confiável** e mantê-la protegida. Quando disponível, configurar as credenciais no pipeline de build e assinar o `.exe` e seu executável interno.

Para desenvolvedores no Brasil, a alternativa de certificado OV de uma autoridade certificadora com emissão internacional pode ser mais aplicável que Azure Artifact Signing, cuja elegibilidade de indivíduos é geograficamente limitada. Custos, identidade e aprovação dependem do fornecedor. Reputação SmartScreen nova ainda pode produzir alertas.

**Não enviar chave privada, certificado PFX, senha ou segredo pelo chat.** Usar controles de segredos próprios do GitHub ou fornecedor.

Referências:
- https://learn.microsoft.com/windows/apps/package-and-deploy/code-signing-options
- https://learn.microsoft.com/windows/apps/package-and-deploy/smartscreen-reputation
- https://www.electron.build/docs/features/code-signing/

## Proteção de lançamento implementada

- O workflow `.github/workflows/fluir-desktop-installer.yml` foi reorganizado.
- Versões públicas futuras com tag `desktop-v*` **exigem credencial de assinatura**.
- Sem assinatura confiável, a publicação fica bloqueada antes de criar uma nova release.
- Após o build, `desktop/scripts/verify-signature.ps1` exige `Get-AuthenticodeSignature = Valid` no instalador e no executável e rejeita certificado expirado.
- As credenciais de assinatura não são gravadas nem exibidas pelo repositório.
- Execuções manuais do workflow podem gerar **apenas artefatos de QA**, sem uma release estável.
- A release anterior `desktop-qa-v0.1.0` permanece explicitamente identificada como **experimental sem assinatura**. A landing agora informa que o Windows pode bloquear esse instalador.
- O link de download público final só deve apontar para a release assinada e homologada após concluir uma das opções de distribuição.

## Ação humana indispensável

Escolher a estratégia de distribuição (Store/MSIX ou certificado para `.exe`) e completar a verificação de identidade/cadastro junto ao fornecedor. Não é uma ação que o código consegue executar sozinho. Depois disso, reexecutar o workflow, comprovar assinatura/reputação e homologar instalação/atualização no Windows.

**Status:** mecanismo de prevenção de release sem assinatura preparado; aviso SmartScreen do instalador antigo **não resolvido**.
