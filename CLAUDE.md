# Bisecco V2 — Mémoire Claude Code

> Fichier lu automatiquement à chaque session. Contient le contexte projet et toutes les conventions.

## 🎯 Projet

**Bisecco** = annuaire d'artisans français vérifiés SIREN
- Marketplace 100% gratuite (0% commission)
- Personas : particuliers (recherche artisan) + artisans (visibilité gratuite)
- Société : AGISCO HOLDING SAS · RCS Cannes · fondée 2026 par Laurent Nero
- Domaine prod : **bisecco.eu** (le domaine `bisecco.fr` héberge les emails)
- Repo GitHub : github.com/BISECCO-DEV/bisecco-v2

## 🏗 Stack réel

- **Next.js 15.5** App Router + React 19 + TypeScript strict
- **Supabase** (Postgres + Auth + Storage + Realtime)
- **Tailwind v3** — palette : `brand-500 #f07a2f` (orange), `ink-700 #0d1e4a` (navy)
- **Manrope** (variable font, via next/font)
- **nodemailer** + SMTP o2switch (PAS Resend) — `mail.bisecco.fr:465`
- **Hébergement** : o2switch mutualisé cPanel
  - Build local obligatoire (RAM serveur insuffisante)
  - Phusion Passenger Node 20.20.2
  - Path : `/home5/laurentn/bisecco-v2/`

## 🔑 Variables d'env prod (cPanel)

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bptyryobylxavyhvmkfh.supabase.co` |
| `APP_URL` | `https://bisecco.eu` (runtime, pas baked) |
| `NEXT_PUBLIC_SITE_URL` | `https://bisecco.eu` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `COMING_SOON_ENABLED` | `true` |
| `COMING_SOON_BYPASS_CODE` | `B26-15a3HprE` |
| `SMTP_HOST` | `mail.bisecco.fr` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `contact@bisecco.fr` |
| `SMTP_PASSWORD` | `BiseccoSMTP2026Secure` |
| `MAIL_FROM` | `contact@bisecco.fr` |
| `MAIL_FROM_NAME` | `Bisecco` |
| `CONTACT_INBOX` | `contact@bisecco.fr` |

## 📁 Structure

```
app/
  admin/              Panel admin (utilisateurs, chat-live, signalements, avis, blog, etc.)
  api/                Routes API
  auth/callback/      OAuth + magic link callback
components/
  layout/             Header, Footer, Chatbot, NotificationsDropdown, etc.
  features/           Boutons spécialisés (FavoriteButton, ReviewForm, ReportProfileForm, etc.)
  ui/                 Composants génériques
lib/
  auth/actions.ts     Server actions auth (login, signup, reset password custom)
  mail/
    mailer.ts         sendMail() via nodemailer + SMTP o2switch
    templates.ts      TOUS les templates HTML branded Bisecco
  chat/actions.ts     Chat live (Supabase Realtime)
  contact/actions.ts  Form contact
  emploi/actions.ts   Job postings + applications
  reports/actions.ts  Signalements (profile + generic)
  reviews/actions.ts  Avis
  newsletter/actions.ts  Newsletter double opt-in
  quotes/actions.ts   Devis
  cv/                 CV submissions
  supabase/           Clients (server, client, admin)
  db/                 Helpers DB (artisans, users)
supabase/             Fichiers SQL (à exécuter dans Supabase Dashboard)
scripts/              Scripts utilitaires (deploy.ps1, etc.)
```

## ⚙️ Conventions critiques

### Server actions
- TOUJOURS `"use server"` en tête
- Export uniquement des **async functions** (constantes dans `*/constants.ts`)
- Retour standardisé : `{ ok: true } | { ok: false; error: string }` (sauf redirect)
- Toujours `createSupabaseAdminClient()` dans les actions (bypass RLS)
- Toujours `await requireDbAdmin()` au début des actions admin
- Validation server-side OBLIGATOIRE (longueur, format, regex)

### Emails (10 templates branded existants)
- TOUS les emails via `sendMail()` de `lib/mail/mailer.ts`
- Templates dans `lib/mail/templates.ts` (palette orange + navy)
- **URLs dans les emails** : `process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.eu"`
- **JAMAIS** `process.env.NEXT_PUBLIC_*` seul côté serveur (Next.js inline au build → bug localhost)

### Auth
- Reset password : système custom (table `password_resets`) — pas Supabase email
- Token = 32 bytes hex, hashé en DB, TTL 1h, usage unique, rate limit 3/h par IP
- Vérification email : magic link Supabase → callback `/auth/callback?next=/email-verifie`
- Login bloqué si `validation_status !== "approved"` OU email non confirmé
- Validation admin obligatoire pour TOUS (particulier ET artisan)

### Forms
- Tous les vrais forms appellent une server action (jamais `setTimeout` fake)
- Validation côté serveur même si validé côté client
- State error géré : banner rouge en haut du form

### Design
- Couleurs OKLCH avec `<alpha-value>` placeholder pour opacity modifiers Tailwind
- Anti-patterns interdits : side-stripe borders, gradient text, em-dash `—`, glassmorphism décoratif
- Pas de `Math.random()` ni `Date.now()` pendant le render (React 19 purity)
- Pas de `setState` dans `useEffect` sans guard
- Pas de `<img>` natif (use `next/image`)
- Pas d'`alert()` natif (use toast / banner state)

## 🚀 Workflow déploiement

### Local (build + tar)
```powershell
cd C:\Users\Laurent\Desktop\bisecco-v2
.\scripts\deploy.ps1
```

OU manuel :
```powershell
npm run build
Move-Item .next\cache .next-cache-temp -ErrorAction SilentlyContinue
tar -czf next-build.tar.gz .next
Move-Item .next-cache-temp .next\cache -ErrorAction SilentlyContinue
```

### Serveur (cPanel)
1. File Manager → `/home5/laurentn/bisecco-v2/` → supprime ancien tar → upload nouveau
2. Terminal cPanel :
   ```bash
   source /home5/laurentn/nodevenv/bisecco-v2/20/bin/activate && cd /home5/laurentn/bisecco-v2
   rm -rf .next && tar -xzf next-build.tar.gz && rm next-build.tar.gz
   ```
3. Node.js App → **RESTART**

## 🚫 Anti-patterns à éviter

1. `process.env.NEXT_PUBLIC_*` pour URLs côté serveur → use `APP_URL`
2. `alert()` natif dans les composants client → use toast/banner state
3. `Math.random()` / `Date.now()` pendant le render → calc dans useEffect ou avant render
4. `setState` dans `useEffect` sans condition → ajouter guard
5. Forms `setTimeout` puis success sans logique → connecter à server action
6. Build sur o2switch (RAM insuffisante) → toujours build local
7. Liens auth via `resetPasswordForEmail` Supabase → utiliser système custom token DB
8. Commit `scripts/users-v1.csv` ou `users-v1-migration.sql` → toujours dans .gitignore

## 🔒 Garde-fous critiques

- **JAMAIS** modifier `robots.txt` sans confirmation
- **JAMAIS** désactiver une RLS policy sans migration tracée
- **JAMAIS** exposer `SUPABASE_SERVICE_ROLE_KEY` côté client
- **JAMAIS** retirer le `Disallow: /admin` du robots.txt
- **TOUJOURS** Server Components par défaut (`"use client"` que si interactivité)
- **TOUJOURS** validation Zod ou manuelle côté serveur
- **TOUJOURS** vérifier compatibility MySQL + SQLite pour les migrations (V1 fallback)

## 📚 Fichiers clés

| Fichier | Rôle |
|---|---|
| `middleware.ts` | Coming-soon gate + auth + cookies + security headers |
| `lib/auth/actions.ts` | login/signup/reset password/legacy migration |
| `lib/mail/templates.ts` | TOUS les templates HTML branded |
| `lib/mail/mailer.ts` | sendMail() nodemailer + SMTP o2switch |
| `lib/admin/actions.ts` | approve/reject/suspend users (avec emails) |
| `app/middleware.ts` | NE PAS y mettre de logique métier |
| `app/admin/layout.tsx` | Sidebar nav admin |
| `supabase/*.sql` | Migrations DB à exécuter manuellement |

## 🎨 Identité Bisecco

- **Couleurs** : `brand-500 #f07a2f` orange, `ink-700 #0d1e4a` navy
- **Typo** : Manrope variable
- **Tone of voice** : Direct, professionnel, sans bullshit. Pas d'em dashes (—). Pas de jargon SaaS gratuit.
- **Anti-patterns design** : side-stripe borders, gradient text, hero-metric template, identical card grids

## 🤖 Quand je travaille sur ce projet

1. Toujours vérifier `process.env.APP_URL` pour les URLs dans les emails
2. État `error` géré dans tous les forms (banner rouge)
3. Brancher chaque nouveau form sur une server action (jamais fake)
4. Build + tar local avant de demander à l'utilisateur de déployer
5. RGPD : email obligatoire pour reject/suspend
6. Nouveau template email → toujours dans `lib/mail/templates.ts`, pas inline
7. Jamais déployer sans avoir build local en validation
8. Si modif DB → écrire le SQL dans `supabase/*.sql` ET dire à l'user de l'exécuter

## 🔧 Slash commands disponibles

- `/deploy` — Lance build + tar + affiche instructions cPanel
- `/audit` — Audit complet bugs + améliorations
- `/new-email [nom]` — Génère un nouveau template email branded
- `/new-action [feature]` — Génère un squelette de server action

## 📊 État actuel (mai 2026)

- ✅ V2 déployée en prod sur bisecco.eu
- ✅ Coming-soon avec code `B26-15a3HprE`
- ✅ SMTP custom nodemailer + o2switch (réinit password, contact, vérif email, etc.)
- ✅ Chat live temps réel (Supabase Realtime)
- ✅ Validation admin pour tous les comptes
- ✅ Reset password custom (table `password_resets`)
- ✅ Forms /contact, /signaler, /emploi/poster, /emploi/[id]/postuler tous branchés
- ✅ Emails branded sur : reset, vérif, approve, reject, suspend, devis, avis, CV, newsletter, contact
- 🔲 Pas encore : Stripe checkout, push notifications, vraies stats admin, GitHub Actions CI
