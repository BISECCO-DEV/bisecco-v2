# Auto-deploy Bisecco V2 — Git → o2switch

> Objectif : zéro clic dans cPanel quand tu pushes du code.

## Architecture

```
local PC  →  git push  →  GitHub  →  webhook  →  o2switch
                                                    ↓
                                               git pull
                                                    ↓
                                               upload .next pre-built
                                                    ↓
                                               restart Phusion
```

## Pré-requis

- ✅ Repo Git cloné sur o2switch (déjà fait via cPanel Git Version Control)
- ✅ Deploy key GitHub configurée (déjà fait, le repo se clone via SSH)
- ⬜ Token API cPanel (à créer)

---

## Option A : cPanel Auto-deploy (simple, sans CI)

cPanel a un fichier `.cpanel.yml` qui se déclenche à chaque `git pull`.

### Étape 1 : Créer `.cpanel.yml` à la racine du projet

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home5/laurentn/bisecco-v2/
    - /bin/cp -R .next $DEPLOYPATH 2>/dev/null || true
    - /bin/touch $DEPLOYPATH/tmp/restart.txt
```

Note : ce fichier ne lance PAS `npm run build` côté serveur (RAM o2switch insuffisante). Le `.next` est buildé en local et committé OU uploadé séparément.

### Problème : `.next` est dans `.gitignore`

Deux solutions :

**A.1 — Retirer `.next` du gitignore** (déconseillé : pollue le repo de fichiers buildés)

**A.2 — Workflow GitHub Actions qui build + commit `.next` sur une branche `production`** (recommandé)

### Étape 2 : Webhook automatique GitHub → cPanel

1. Dans cPanel → **Git Version Control** → Manage repo bisecco-v2
2. Onglet **Pull or Deploy**
3. Active **Auto-deploy on push** (si dispo dans ta version cPanel)
4. Si non dispo : note l'URL du webhook (genre `https://laurentn:TOKEN@ice.o2switch.net:2083/...`)

5. GitHub repo → Settings → Webhooks → **Add webhook**
   - Payload URL : l'URL cPanel
   - Content type : `application/json`
   - Events : `Just the push event`
   - Active

→ À chaque `git push` sur `main`, o2switch fait `git pull` automatiquement.

⚠️ Mais sans build côté serveur, il faut quand même un mécanisme pour avoir `.next` à jour.

---

## Option B : GitHub Actions + SFTP upload (recommandé)

### Étape 1 : Créer une clé SSH pour le déploiement

Sur ton PC local :
```powershell
ssh-keygen -t ed25519 -f bisecco-deploy-key -N ""
```

Tu obtiens 2 fichiers :
- `bisecco-deploy-key` (privée)
- `bisecco-deploy-key.pub` (publique)

### Étape 2 : Ajouter la clé publique à o2switch

1. cPanel → **Accès SSH** → **Gérer les clés SSH** → **Importer**
2. Colle le contenu de `bisecco-deploy-key.pub`
3. **Autorise** cette clé

### Étape 3 : Ajouter les secrets GitHub

1. GitHub repo → Settings → Secrets and variables → **Actions**
2. Ajoute :
   - `O2SWITCH_HOST` = `ice.o2switch.net` (ou l'host SSH de ton cPanel)
   - `O2SWITCH_PORT` = `22` (vérifie dans cPanel SSH Access)
   - `O2SWITCH_USER` = `laurentn`
   - `O2SWITCH_KEY` = contenu de `bisecco-deploy-key` (privée, copie tout)

### Étape 4 : Créer le workflow `.github/workflows/deploy.yml`

```yaml
name: Deploy to o2switch
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build
        env:
          # Variables build-time (NEXT_PUBLIC_*)
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_SITE_URL: https://bisecco.eu

      - name: Tar build
        run: |
          mv .next/cache /tmp/next-cache 2>/dev/null || true
          tar -czf next-build.tar.gz .next
          mv /tmp/next-cache .next/cache 2>/dev/null || true

      - name: Upload via SSH
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.O2SWITCH_HOST }}
          port: ${{ secrets.O2SWITCH_PORT }}
          username: ${{ secrets.O2SWITCH_USER }}
          key: ${{ secrets.O2SWITCH_KEY }}
          source: next-build.tar.gz
          target: /home5/laurentn/bisecco-v2/

      - name: Extract + restart
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.O2SWITCH_HOST }}
          port: ${{ secrets.O2SWITCH_PORT }}
          username: ${{ secrets.O2SWITCH_USER }}
          key: ${{ secrets.O2SWITCH_KEY }}
          script: |
            cd /home5/laurentn/bisecco-v2
            rm -rf .next
            tar -xzf next-build.tar.gz
            rm next-build.tar.gz
            mkdir -p tmp && touch tmp/restart.txt
```

### Résultat

À chaque `git push origin main` depuis ton PC :
1. GitHub Actions build le projet
2. Upload le tarball via SFTP sur o2switch
3. Extract + restart Phusion
4. Site à jour en ~3-5 min sans rien faire côté cPanel

---

## Option C : Le compromis simple (script local PowerShell + SCP)

Tu peux aussi tout faire en local sans GitHub Actions :

```powershell
# scripts/deploy-full.ps1
.\scripts\deploy.ps1
scp -P 22 next-build.tar.gz laurentn@ice.o2switch.net:/home5/laurentn/bisecco-v2/
ssh -p 22 laurentn@ice.o2switch.net "cd /home5/laurentn/bisecco-v2 && rm -rf .next && tar -xzf next-build.tar.gz && rm next-build.tar.gz && touch tmp/restart.txt"
```

Pré-requis : SSH key configurée entre ton PC et o2switch (étape 1-2 de l'Option B).

Puis tu lances `.\scripts\deploy-full.ps1` et c'est terminé.

---

## Ma reco pour toi

**Commencer par Option C** (script local + SCP) → setup en 15 min, ça te fait gagner 80% du temps tout de suite.

**Plus tard, Option B** (GitHub Actions) si tu veux du vrai CI/CD avec validation auto.

L'option A (cPanel auto-deploy) est plus fragile car `.next` n'est pas dans Git.

---

## Setup Option C en 15 min

1. **Génère une clé SSH** (sur PowerShell) :
   ```powershell
   ssh-keygen -t ed25519 -f $HOME\.ssh\bisecco-deploy -N '""'
   cat $HOME\.ssh\bisecco-deploy.pub
   ```

2. **Copie le contenu** affiché (commence par `ssh-ed25519 AAAA...`)

3. **cPanel → Accès SSH → Gérer les clés SSH → Importer une clé**
   - Nom : `bisecco-deploy`
   - Clé publique : colle
   - **Autoriser**

4. **Trouve les infos SSH** :
   - cPanel → Accès SSH (page principale)
   - Note le host (ex: `ice.o2switch.net`) et le port (ex: `22`)

5. **Test la connexion** :
   ```powershell
   ssh -i $HOME\.ssh\bisecco-deploy -p 22 laurentn@ice.o2switch.net "echo ok"
   ```

6. **Crée `scripts/deploy-full.ps1`** :
   ```powershell
   $SSH_HOST = "ice.o2switch.net"
   $SSH_USER = "laurentn"
   $SSH_PORT = 22
   $SSH_KEY = "$HOME\.ssh\bisecco-deploy"

   .\scripts\deploy.ps1
   if ($LASTEXITCODE -ne 0) { exit 1 }

   Write-Host ""
   Write-Host "Upload via SCP..." -ForegroundColor Yellow
   scp -i $SSH_KEY -P $SSH_PORT next-build.tar.gz ${SSH_USER}@${SSH_HOST}:/home5/laurentn/bisecco-v2/

   Write-Host "Extract + restart..." -ForegroundColor Yellow
   ssh -i $SSH_KEY -p $SSH_PORT ${SSH_USER}@${SSH_HOST} "cd /home5/laurentn/bisecco-v2 && rm -rf .next && tar -xzf next-build.tar.gz && rm next-build.tar.gz && mkdir -p tmp && touch tmp/restart.txt"

   Write-Host "Deploy fini !" -ForegroundColor Green
   ```

7. **Usage** :
   ```powershell
   .\scripts\deploy-full.ps1
   ```

→ **Build + upload + extract + restart en une commande**.

---

## Si tu galères avec SSH

Demande-moi de l'aide en disant "Aide-moi setup deploy-full.ps1". Je te débloque.
