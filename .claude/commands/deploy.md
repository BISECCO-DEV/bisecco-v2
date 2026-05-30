---
description: Build local + tar + génère les instructions cPanel pour déployer
---

Tu dois déployer le code actuel sur o2switch. Procédure :

1. **Build local** : `cd c:/Users/Laurent/Desktop/bisecco-v2 && npm run build`
2. **Vérifier qu'il n'y a PAS d'erreur** dans la sortie (warnings OK, errors NON)
3. **Tar du build** :
   ```powershell
   Move-Item .next\cache .next-cache-temp -ErrorAction SilentlyContinue
   tar -czf next-build.tar.gz .next
   Move-Item .next-cache-temp .next\cache -ErrorAction SilentlyContinue
   ```
4. **Afficher la taille** du tarball (`(Get-Item next-build.tar.gz).Length / 1MB`)
5. **Donner à l'utilisateur les 3 étapes cPanel** :
   - Upload `next-build.tar.gz` dans `/home5/laurentn/bisecco-v2/` (remplace l'ancien)
   - Terminal cPanel :
     ```bash
     source /home5/laurentn/nodevenv/bisecco-v2/20/bin/activate && cd /home5/laurentn/bisecco-v2
     rm -rf .next && tar -xzf next-build.tar.gz && rm next-build.tar.gz
     ```
   - Node.js App → RESTART

Si build échoue : copier les erreurs et proposer un fix avant de réessayer.

Si le tar est >10 MB : alerter sur la taille anormale (possible cache resté dedans).
