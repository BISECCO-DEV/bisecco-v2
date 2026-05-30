# Bisecco V2 - Script déploiement
# Build + tar + instructions cPanel en un seul script.
# Usage : .\scripts\deploy.ps1 (depuis la racine du projet)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " Bisecco V2 - Deploy" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier qu'on est à la racine
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR : Lance ce script depuis la racine du projet (la ou se trouve package.json)" -ForegroundColor Red
    exit 1
}

# 2. Build
Write-Host "[1/3] Build Next.js..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERREUR : Build echoue. Corrige les erreurs avant de redeployer." -ForegroundColor Red
    exit 1
}

# 3. Tar
Write-Host ""
Write-Host "[2/3] Creation du tarball..." -ForegroundColor Yellow
Remove-Item next-build.tar.gz -ErrorAction SilentlyContinue
Move-Item .next\cache .next-cache-temp -ErrorAction SilentlyContinue
tar -czf next-build.tar.gz .next
Move-Item .next-cache-temp .next\cache -ErrorAction SilentlyContinue

# 4. Taille
$sizeMB = [math]::Round((Get-Item next-build.tar.gz).Length / 1MB, 2)
Write-Host ""
Write-Host "[3/3] Tarball pret : next-build.tar.gz ($sizeMB MB)" -ForegroundColor Green

if ($sizeMB -gt 10) {
    Write-Host "ATTENTION : tarball >10 MB. Le cache n'est probablement pas exclu." -ForegroundColor Yellow
}

# 5. Instructions
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " Etapes manuelles cPanel :" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. cPanel File Manager -> /home5/laurentn/bisecco-v2/" -ForegroundColor White
Write-Host "   - Supprime l'ancien next-build.tar.gz" -ForegroundColor White
Write-Host "   - Upload le nouveau (depuis $(Get-Location))" -ForegroundColor White
Write-Host ""
Write-Host "2. Terminal cPanel - colle ces commandes :" -ForegroundColor White
Write-Host ""
Write-Host "   source /home5/laurentn/nodevenv/bisecco-v2/20/bin/activate && cd /home5/laurentn/bisecco-v2" -ForegroundColor Gray
Write-Host "   rm -rf .next && tar -xzf next-build.tar.gz && rm next-build.tar.gz" -ForegroundColor Gray
Write-Host ""
Write-Host "3. cPanel Node.js App -> RESTART" -ForegroundColor White
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
