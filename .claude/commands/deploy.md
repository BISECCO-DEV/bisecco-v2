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

**c) Extraction durcie (chmod anti "Permission denied" + fallback) :**
```bash
source /home5/laurentn/nodevenv/bisecco-v2/20/bin/activate && cd /home5/laurentn/bisecco-v2
chmod -R u+w .next 2>/dev/null
rm -rf .next
[ -d .next ] && mv .next .next-broken-old
tar -xzf next-build.tar.gz && rm next-build.tar.gz
ls -la .next/server/pages-manifest.json && echo "OK fichier present"
```
→ doit afficher **`OK fichier present`** et **aucune** ligne "Permission denied".

**d) Smoke test AVANT de redémarrer (évite de planter le site en prod) :**
```bash
node server.js
```
→ attendre la ligne `[bisecco-v2] ready on http://...`, puis **Ctrl+C**. Si ça plante ici, le déploiement est mauvais → ne pas redémarrer, corriger d'abord.

**e) Node.js App → RESTART**

## Notes
- Le projet est dans `OneDrive/BISECCO-V2` (PAS `Desktop`).
- Cause racine des pannes connues : upload File Manager tronqué + dossier `.next` passé en lecture seule → `rm` refusé → `.next/server` incomplet → app qui ne démarre pas. Les vérifs ci-dessus couvrent les deux.
