# Remplace bisecco.eu par bisecco.fr dans tous les fichiers source
$files = @(
    "app/contact/page.tsx",
    "app/sitemap.ts",
    "lib/auth/actions.ts",
    "lib/cv/bank-actions.ts",
    "lib/cv/submit-actions.ts",
    "lib/mail/templates.ts",
    "lib/messages/actions.ts",
    "lib/newsletter/actions.ts",
    "lib/quotes/actions.ts",
    "lib/reviews/actions.ts"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw
        $newContent = $content -replace 'bisecco\.eu', 'bisecco.fr'
        Set-Content -Path $f -Value $newContent -NoNewline
        Write-Host "OK $f" -ForegroundColor Green
    } else {
        Write-Host "MISS $f" -ForegroundColor Yellow
    }
}
