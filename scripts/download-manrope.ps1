# Télécharge Manrope variable font depuis fontsource (CDN jsDelivr fiable)
# Évite la dépendance Google Fonts au build (qui fail parfois).

$fontDir = "public\fonts"
$fontFile = "$fontDir\Manrope.woff2"

if (-not (Test-Path $fontDir)) {
    New-Item -ItemType Directory -Path $fontDir -Force | Out-Null
}

$urls = @(
    "https://cdn.jsdelivr.net/fontsource/fonts/manrope:vf@latest/latin-wght-normal.woff2",
    "https://fonts.gstatic.com/s/manrope/v19/xn7gYHE41ni1AdIRggexSg.woff2"
)

$success = $false
foreach ($url in $urls) {
    try {
        Invoke-WebRequest -Uri $url -OutFile $fontFile -UseBasicParsing -TimeoutSec 30
        $size = [math]::Round((Get-Item $fontFile).Length / 1KB, 1)
        Write-Host "OK : Manrope.woff2 telecharge ($size KB) depuis $url" -ForegroundColor Green
        $success = $true
        break
    } catch {
        Write-Host "FAIL : $url" -ForegroundColor Yellow
    }
}

if (-not $success) {
    Write-Host "ERREUR : aucune source n'a repondu" -ForegroundColor Red
    exit 1
}
