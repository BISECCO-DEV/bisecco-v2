---
description: Build local + tar vérifié + instructions cPanel durcies (anti-pannes o2switch)
---

Déployer le code actuel sur o2switch, en **vérifiant à chaque étape** (les pannes passées venaient d'un upload tronqué et d'un `.next` en lecture seule sur le serveur). Ne jamais sauter une vérif.

## 1. Build local
```powershell
cd c:/Users/Laurent/OneDrive/BISECCO-V2
npm run build
```
- Vérifier qu'il n'y a **aucune erreur** (warnings OK, "Compiled successfully" attendu, pages générées sans `Error`).
- Si le build échoue : copier les erreurs, proposer un fix, **ne pas continuer**.

## 2. Tar du build (sans le cache)
```powershell
Move-Item .next\cache .next-cache-temp -ErrorAction SilentlyContinue
tar -czf next-build.tar.gz .next
Move-Item .next-cache-temp .next\cache -ErrorAction SilentlyContinue
```

## 3. Vérifier l'intégrité du tarball local (NOTER ces chiffres)
```powershell
$len = (Get-Item next-build.tar.gz).Length
Write-Host ("Taille : {0:N2} MB  ({1} octets)" -f ($len/1MB), $len)
Write-Host ("Entrees : {0}" -f (tar -tzf next-build.tar.gz | Measure-Object -Line).Lines)
tar -tzf next-build.tar.gz > $null; if ($?) { "gzip OK" }
```
- **Donner à l'utilisateur la taille exacte en octets + le nombre d'entrées** : il devra les comparer côté serveur.
- Si > 10 MB → alerter (cache probablement resté dans le tar).

## 4. Donner les étapes cPanel (avec vérifs)

**a) Upload** `next-build.tar.gz` dans `/home5/laurentn/bisecco-v2/` (remplace l'ancien). Attendre la fin **complète** de l'upload.

**b) Vérifier que l'upload est complet AVANT d'extraire :**
```bash
cd /home5/laurentn/bisecco-v2
ls -la next-build.tar.gz
tar -tzf next-build.tar.gz | wc -l
```
→ la taille en octets et le nombre d'entrées doivent **correspondre exactement** au local. Si plus petit → réuploader (essayer FTP/FileZilla si le File Manager tronque).

**c) Extraction BLINDÉE (gère le bug OneDrive des dossiers en lecture seule) :**
```bash
source /home5/laurentn/nodevenv/bisecco-v2/20/bin/activate && cd /home5/laurentn/bisecco-v2
# 1. Pousser l'ancien .next hors du chemin (mv marche même s'il est verrouillé)
[ -d .next ] && mv .next ".next-old-$(date +%s)"
# 2. --delay-directory-restore : crée les dossiers MODIFIABLES d'abord, sinon les
#    sous-dossiers à crochets [slug]/[ville]/[id] ne s'extraient pas (OneDrive
#    marque les dossiers read-only → mkdir refusé → 500 MODULE_NOT_FOUND)
tar --delay-directory-restore -xzf next-build.tar.gz
chmod -R u+w .next 2>/dev/null
rm -f next-build.tar.gz
# 3. LE vrai test : un fichier à CROCHETS doit exister (pas juste pages-manifest)
test -f ".next/server/app/metiers/[slug]/[ville]/page.js" && echo "OK build complet" || echo "ECHEC : fichiers a crochets manquants, recommencer l'extraction"
```
→ doit afficher **`OK build complet`**. Si "ECHEC" → relancer ce bloc.

> ⚠️ Ne PAS se contenter de vérifier `pages-manifest.json` : il s'extrait toujours en premier. Le vrai canari, c'est un fichier dans un dossier à crochets (`[slug]`, `[id]`), qui sont les derniers extraits et les premiers à sauter si l'extraction échoue.

**d) Smoke test AVANT de redémarrer (évite de planter le site en prod) :**
```bash
node server.js
```
→ attendre la ligne `[bisecco-v2] ready on http://...`, puis **Ctrl+C**. Si ça plante ici, le déploiement est mauvais → ne pas redémarrer, corriger d'abord.

**e) Node.js App → RESTART**

## Notes — causes racines des pannes connues
- Le projet est dans `OneDrive/BISECCO-V2` (PAS `Desktop`).
- **Upload File Manager tronqué** → comparer taille (octets) + nb d'entrées local vs serveur AVANT d'extraire.
- **OneDrive marque les dossiers `.next` en lecture seule** (mode `dr-xr-xr-x` dans le tar) → sans `--delay-directory-restore`, le serveur ne peut pas créer les sous-dossiers à crochets (`[slug]`, `[id]`) → ils manquent → erreur 500 `Cannot find module '.next/server/app/metiers/[slug]/[ville]/page.js'` (MODULE_NOT_FOUND) sur TOUTES les pages dynamiques. → l'extraction blindée (4c) règle ça.
- **Ancien `.next` non supprimable** (read-only) → `mv` aside au lieu de `rm` (mv marche toujours).
- Diagnostic 500 en prod : `( source .../activate && cd .../bisecco-v2 && COMING_SOON_ENABLED=false node server.js ) > /tmp/srv.log 2>&1 &` puis `curl -H "Host: bisecco.fr" -H "x-forwarded-proto: https" http://localhost:3000/<page>` puis `tail /tmp/srv.log` → montre la vraie erreur (coming-soon + redirection domaine masquent sinon le rendu).
