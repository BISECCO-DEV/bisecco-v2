# CLAUDE.md — Bisecco V2

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il définit comment travailler sur ce projet.

---

## 🎯 Concept

**Bisecco V2** = le 1ᵉʳ réseau social d'artisans français vérifiés, pensé pour les particuliers.

- Vérification SIREN obligatoire (API gouv.fr)
- Avis vérifiés
- Devis en ligne avec photos
- Réseau social entre artisans validés
- Modèle freemium : Gratuit / Pro 19€ / Premium 49€

---

## 🧱 Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v3** — palette **orange brand uniquement** (couleur `brand-500 = #f07a2f`)
- **Police : Livvic** (4 graisses : 400/500/600/700) via `next/font/google`
- **Supabase** : Auth + PostgreSQL + Storage + Realtime
- **shadcn/ui** : composants (à installer à la demande)
- **lucide-react** : icônes
- **Resend** : emails transactionnels (à intégrer)
- **Stripe** : abonnements (V1.5)

---

## 🗂️ Structure

```
bisecco-v2/
├── app/
│   ├── (public)/           # Pages publiques (home, recherche, profil artisan, blog)
│   ├── (auth)/             # connexion, inscription, recuperation
│   ├── (dashboard)/        # mon-profil, messagerie, devis
│   ├── admin/              # admin protégé
│   ├── api/                # Route Handlers
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui
│   ├── layout/             # Header, Footer
│   ├── features/           # composants métier
│   └── forms/
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Client browser
│   │   ├── server.ts       # Client serveur
│   │   └── middleware.ts   # Refresh session
│   ├── utils.ts            # cn() + helpers
│   └── types.ts            # Types globaux
├── db/                     # Migrations SQL Supabase
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── seed.sql
├── middleware.ts           # Auth + headers sécurité
├── public/
│   ├── robots.txt
│   ├── llms.txt
│   └── og-image.jpg
├── tailwind.config.ts
└── CLAUDE.md
```

---

## 🎨 Design system

### Palette
- **Brand** (orange) : `brand-50` → `brand-950`, principal `brand-500 = #f07a2f`
- **Ink** (neutre marine) : `ink-50` → `ink-900`, principal `ink-700 = #0f1e40`
- **Pas d'autre couleur** (sauf cas exceptionnel validé)

### Typo
- **Livvic** (Google Fonts) — 4 graisses : 400 / 500 / 600 / 700
- Toujours via `font-sans` (la variable `--font-livvic` est appliquée au `<html>`)
- Titres : `font-bold` ou `font-semibold`
- Body : `font-normal` ou `font-medium`

### Composants
- Boutons : classes utilitaires `.btn-primary`, `.btn-secondary`, `.btn-outline` (dans `globals.css`)
- Conteneur : `.container-default` (max-w-7xl + padding responsive)

---

## 🔐 Auth & Sécurité

### Supabase Auth
- **Email + password** + **Google OAuth** (à activer dans Supabase Dashboard → Auth → Providers)
- Session refresh automatique via `middleware.ts`
- Trigger SQL crée auto un `profile` quand un user signup

### Middleware
- Refresh session sur chaque requête
- Redirect `/connexion` → `/mon-profil` si déjà connecté
- Redirect `/mon-profil` `/messagerie` `/admin` → `/connexion` si non auth
- Headers : `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS` (prod)

### RLS (Row Level Security)
- **Activé sur toutes les tables** via `db/002_rls_policies.sql`
- Helper `is_admin()` SQL pour les policies admin
- Pattern : `select` souvent public, `insert/update/delete` restreint à `auth.uid()`

---

## 📐 Règles SEO

- `<title>` 50-60 caractères, mot-clé en début
- `<meta description>` 140-160 caractères avec CTA
- Open Graph + Twitter Card via `metadata` Next.js
- **Pages programmatiques** : `/artisans/[metier]/[ville]` (généré depuis Supabase)
- **Sitemap dynamique** : `app/sitemap.ts` (Next 15)
- **robots.txt** et **llms.txt** dans `public/`
- Schema.org JSON-LD via composant `<JsonLd>` (à créer)

---

## 🚫 Règles non-négociables

1. **JAMAIS** modifier `robots.txt` sans confirmation
2. **JAMAIS** désactiver une RLS policy en prod (toujours via migration tracée)
3. **JAMAIS** mettre une `service_role_key` côté client
4. **JAMAIS** d'inline styles (sauf cas dynamiques justifiés)
5. **JAMAIS** push direct sur `main` (PR obligatoire)
6. **TOUJOURS** typer strictement (pas de `any` sauf cas dûment commenté)
7. **TOUJOURS** Server Components par défaut (`"use client"` uniquement si interactivité)
8. **TOUJOURS** valider les inputs côté serveur (Zod)
9. **TOUJOURS** RLS au lieu de checks app-level pour la sécurité data
10. **TOUJOURS** `next/image` pour les images (jamais `<img>`)

---

## 🔧 Workflow

Quand on demande une feature :

1. **Lire le code existant** concerné
2. **Proposer un plan** (fichiers à créer/modifier, migrations SQL, types)
3. **Attendre validation** avant d'implémenter
4. **Implémenter** par petits diffs review-ables
5. **Types stricts** TypeScript (pas de `any`)
6. **Server Actions** ou Route Handlers selon le cas
7. **Tester** sur localhost (`npm run dev`)
8. **Migration SQL** dans `db/` avec numéro incrémental

### Commits
- Conventional Commits : `feat(scope): ...`, `fix(scope): ...`, etc.
- Petits commits thématiques (pas de monolithique)

---

## 🛠️ Commandes utiles

```bash
npm run dev              # Dev server (http://localhost:3000)
npm run build            # Build prod
npm run start            # Start prod build
npm run lint             # Lint (à configurer)
```

### Supabase
- Dashboard : https://supabase.com/dashboard
- Migrations SQL : copier/coller depuis `db/*.sql` dans SQL Editor
- Types TS auto-générés : `npx supabase gen types typescript --project-id <id> > lib/database.types.ts`

---

## 📋 Roadmap V2

### Sprint 1 — Foundation (semaine 1) ✅ EN COURS
- [x] Scaffold Next.js 15 + TS + Tailwind v3
- [x] Supabase clients (browser/server/middleware)
- [x] Middleware auth + headers sécurité
- [x] Schéma BDD + RLS policies
- [x] Police Livvic + palette orange
- [ ] Header / Footer composants
- [ ] Page d'accueil (hero + features)
- [ ] Connexion / Inscription (email + Google OAuth)

### Sprint 2 — Profils
- [ ] Page mon-profil (édition info + photos)
- [ ] Profil artisan public `/profil/[id]`
- [ ] Liste artisans `/profils`
- [ ] Upload photos (Supabase Storage)

### Sprint 3 — Recherche & SEO
- [ ] Page recherche avec carte Leaflet + filtres
- [ ] Pages métier × ville (programmatique)
- [ ] Sitemap dynamique
- [ ] Schema.org LocalBusiness

### Sprint 4 — Conversion
- [ ] Devis en ligne avec photos
- [ ] Messagerie 1:1 (Supabase Realtime)
- [ ] Emails via Resend

### Sprint 5 — Admin & Monétisation
- [ ] Admin panel (gestion users, validation artisans)
- [ ] Abonnement Stripe
- [ ] Page tarifs

---

## 🤝 Contact

- Owner : Laurent Nero
- Email : bisecco.support@gmail.com
- Repo : (à créer sur GitHub)
