param(
    [string]$Api = "https://fluir-sistema.onrender.com",
    [string]$Output = "tests/relatorio-api-publica-23-11.txt"
)
$ErrorActionPreference = "Stop"
$lines = New-Object System.Collections.Generic.List[string]
$now = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss zzz")
$lines.Add("Fluir - verificacao publica SEM contas/credenciais - $now")
$lines.Add("API: $Api")
foreach ($endpoint in @("/api/health/live", "/api/health/ready", "/api/usuarios/teste")) {
    try {
        $response = Invoke-WebRequest -Uri ($Api + $endpoint) -UseBasicParsing -TimeoutSec 30
        $lines.Add(("GET {0} = HTTP {1}" -f $endpoint, [int]$response.StatusCode))
    } catch {
        $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "SEM_RESPOSTA" }
        $lines.Add(("GET {0} = {1}" -f $endpoint, $status))
    }
}
try {
    $config = Invoke-RestMethod -Uri ($Api + "/api/usuarios/google/config") -TimeoutSec 30
    $lines.Add(("Google OAuth configurado: {0}" -f [bool]$config.habilitado))
    $lines.Add("O Client ID publico NAO foi gravado no relatorio.")
} catch { $lines.Add("Google OAuth: verificacao indisponivel") }
$origins = @(
    "https://fluir-sistema.vercel.app",
    "https://fluir-sistema-git-alex-onboarding-planos-personalizados-22-11-lexissantosz.vercel.app",
    "http://127.0.0.1:5505",
    "https://evil.vercel.app"
)
foreach ($origin in $origins) {
    $header = @{
        "Origin" = $origin;
        "Access-Control-Request-Method" = "POST";
        "Access-Control-Request-Headers" = "authorization,content-type";
    }
    $status = "SEM_RESPOSTA"
    $allowed = ""
    try {
        $response = Invoke-WebRequest -Method Options -Uri ($Api + "/api/onboarding/salvar") -UseBasicParsing -TimeoutSec 30 -Headers $header
        $status = [int]$response.StatusCode
        $allowed = [string]$response.Headers["Access-Control-Allow-Origin"]
    } catch {
        if ($_.Exception.Response) {
            $status = [int]$_.Exception.Response.StatusCode
            $allowed = [string]$_.Exception.Response.Headers["Access-Control-Allow-Origin"]
        }
    }
    if (-not $allowed) { $allowed = "(ausente)" }
    $lines.Add(("CORS {0} = HTTP {1}; Allow-Origin {2}" -f $origin, $status, $allowed))
}
$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root $Output
$parent = Split-Path -Parent $target
if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
$lines | Out-File -FilePath $target -Encoding UTF8
$lines | ForEach-Object { Write-Output $_ }
Write-Output "Relatorio salvo: $target"
