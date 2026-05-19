# Déploiement Bisecco V2 sur Vercel

## ⏱️ Temps total : ~15 min (1ère fois) | 30 sec (les fois d'après)

---

## 📋 Pré-requis

- [x] Compte GitHub (gratuit) — pour héberger le code
- [x] Compte Vercel (gratuit) — pour héberger le site
- [x] Projet Supabase configuré ✅ (déjà fait)
- [x] `.env.local` rempli avec les bonnes clés ✅ (déjà fait)

---

## 🚀 Étape 1 — Pousser le code sur GitHub (5 min)

### Si tu n'as pas encore de repo GitHub pour le V2 :

```powershell
cd c:\Users\Laurent\Desktop\bisecco-v2

# Initialise git si pas fait
git init
git add .
git commit -m "feat: Bisecco V2 + Supabase backend"
```

Puis sur [github.com/new](https://github.com/new) :
- **Repository name** : `bisecco-v2`
- **Private** ✅ (recommandé, car .env.local contient des secrets… mais .gitignore l'exclut)
- Crée le repo

Récupère l'URL HTTPS du repo (genre `https://github.com/laurentn/bisecco-v2.git`) puis :

```powershell
git remote add origin https://github.com/TON_USER/bisecco-v2.git
git branch -M main
git push -u origin main
```

---

## 🚀 Étape 2 — Connecter à Vercel (5 min)

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Clique **"Continue with GitHub"** (1ère fois)
3. Autorise Vercel à voir ton GitHub
4. Sélectionne **`bisecco-v2`** dans la liste de tes repos
5. Vercel détecte automatiquement Next.js → laisse les options par défaut

---

## 🔐 Étape 3 — Variables d'environnement (3 min)

Avant de cliquer "Deploy", **ajoute tes variables** dans Vercel :

Section **"Environment Variables"** :

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bptyryobylxavyhvmkfh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (ta clé anon depuis Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | (ta clé service_role) |
| `NEXT_PUBLIC_SITE_URL` | `https://ton-projet.vercel.app` *(à mettre à jour après 1er deploy)* |

> 💡 **Astuce** : Tu peux copier-coller le contenu de ton `.env.local` d'un coup en cliquant sur **"Paste from .env file"** ou en collant ligne par ligne.

Clique sur **"Deploy"** → ça build pendant ~2 min.

---

## ✅ Étape 4 — Premier deploy

Vercel te donne une URL type **`https://bisecco-v2-xxx.vercel.app`**

### Vérifie que ça marche :
- [ ] Page d'accueil charge
- [ ] `/supabase-test` → 4 checks verts + métiers chargés
- [ ] `/artisans/macon/meaux` → tes artisans réels apparaissent
- [ ] `/inscription` → formulaire affiche
- [ ] `/connexion` → page affiche

### Si une erreur :
1. Va dans **Vercel Dashboard → ton projet → Deployments → clique le dernier**
2. Onglet **"Build Logs"** → cherche l'erreur exacte
3. **Onglet "Functions"** → si erreur runtime (Supabase, etc.)
4. Copie-colle l'erreur ici, je te débloque

---

## 🌐 Étape 5 — Pointer ton domaine bisecco.fr (optionnel, plus tard)

**⚠️ ATTENTION** : Si tu fais ça, le **bisecco.fr** actuel (V1 Laravel sur o2switch) cesse de fonctionner.

### Stratégie sans casse — sous-domaine d'abord
1. Sur o2switch → DNS Manager → Ajoute un record :
   - **Type** : `CNAME`
   - **Name** : `nouveau` (ou `v2`)
   - **Value** : `cname.vercel-dns.com`
2. Sur Vercel → ton projet → Settings → Domains → Add `nouveau.bisecco.fr`
3. Tu testes pendant 1-2 semaines sur `nouveau.bisecco.fr`
4. Quand tu es prêt : ajoute `bisecco.fr` au lieu de `nouveau.bisecco.fr`

---

## 🔄 Étape 6 — Les déploiements suivants (automatique)

Après le 1er deploy, chaque fois que tu pushes du code :

```powershell
cd c:\Users\Laurent\Desktop\bisecco-v2
git add .
git commit -m "fix: ajout fonctionnalité X"
git push
```

→ Vercel détecte le push et redéploie automatiquement en ~1-2 min. **Tu n'as rien d'autre à faire.**

---

## 🆘 Erreurs courantes

### `Build failed: TypeScript error`
→ Lance `npx tsc --noEmit` en local d'abord, corrige les erreurs, puis push.

### `Build succeeded but site shows "Configuration incomplète"`
→ Tu as oublié de mettre les variables d'environnement Supabase dans Vercel.

### `Build succeeded but `/artisans/...` montre 0 artisans`
→ RLS policies pas posées sur Supabase. Re-exécute `supabase/rls_public_read.sql`.

### `Cannot find module '@supabase/ssr'`
→ Vercel n'a pas installé les deps. Vérifie que `package.json` est bien commit + push.

---

## 🎯 Checklist post-déploiement

- [ ] **Rotation clés Supabase** (les clés du chat sont compromises)
- [ ] **Configurer OAuth Google** dans Supabase → Authentication → Providers
- [ ] **SMTP** dans Supabase → Email Templates (sinon les emails de confirmation ne partent pas)
- [ ] **Ajouter `https://ton-app.vercel.app`** dans Supabase → Authentication → URL Configuration → Site URL
- [ ] **Test inscription artisan** avec un vrai SIREN sur la prod
- [ ] **Lighthouse audit** : `npx unlighthouse --site https://ton-app.vercel.app`
