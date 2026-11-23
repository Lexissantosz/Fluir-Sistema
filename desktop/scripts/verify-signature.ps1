param(
  [Parameter(Mandatory=$true)][string]$Installer
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path -LiteralPath $Installer)) { throw "Instalador não encontrado." }
$signature = Get-AuthenticodeSignature -FilePath $Installer
if ($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid) {
  throw "Assinatura inválida ou ausente (status: $($signature.Status)). Não publicar como versão estável."
}
if (-not $signature.SignerCertificate -or $signature.SignerCertificate.NotAfter -lt (Get-Date)) {
  throw "Certificado de assinatura ausente ou expirado."
}
Write-Output "Assinatura Authenticode válida. Publicador: $($signature.SignerCertificate.Subject)"
Write-Output "SHA256: $((Get-FileHash -LiteralPath $Installer -Algorithm SHA256).Hash)"
