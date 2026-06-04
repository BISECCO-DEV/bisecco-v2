# Prompt complet — App mobile Bisecco (Android + iOS)

> À coller intégralement dans **Antigravity** ou **Claude Code** dans un nouveau projet vide.
> L'IA construira une app native React Native + Expo qui consomme le backend Supabase existant de bisecco.fr.

---

## 🎯 Mission

Je veux que tu construises **une application mobile native (Android + iOS)** pour Bisecco, un annuaire d'artisans français vérifiés SIREN. Le site web (https://bisecco.fr) existe déjà et fonctionne en production avec Next.js 15 + Supabase. L'app doit consommer le **même backend Supabase** (Auth + PostgreSQL + Storage + Realtime), donc **aucune création d'API** : tu te connectes directement à Supabase depuis l'app mobile.

L'objectif final : publier l'app sur le **Google Play Store** et **Apple App Store** avec une UX native fluide, pas un simple WebView wrapper.

---

## 🏢 Contexte produit

**Bisecco** = annuaire français d'artisans (plombiers, électriciens, maçons, coiffeurs, boulangers, etc.) avec :
- Vérification SIREN automatique via l'API INSEE
- Avis clients authentiques (impossibles à acheter, seuls les vrais clients via messagerie peuvent noter)
- Demandes de devis directes en 2 minutes
- **100 % gratuit pour tous, 0 % commission sur les chantiers**
- Société éditrice : **AGISCO HOLDING SAS**, RCS Cannes 750 463 317, basée 45 Boulevard de la Croisette, 06400 Cannes
- Fondateur : Laurent Nero
- Lancée en 2026
- 176 métiers couverts sur 7 catégories

**Personas** :
- **Particulier** : cherche un artisan vérifié près de chez lui, demande des devis, échange par messagerie, laisse des avis
- **Artisan** : crée son profil pro, reçoit des demandes qualifiées, échange avec les particuliers, publie sur le fil

---

## 🛠 Stack technique imposée

### App mobile (à construire)
- **React Native + Expo SDK 53+** (managed workflow, EAS Build)
- **TypeScript strict**
- **Expo Router** (file-based routing, équivalent du App Router de Next.js)
- **NativeWind** (Tailwind pour React Native — palette identique au site)
- **React Query (TanStack Query)** pour le data fetching + cache
- **Zustand** pour le state global (auth, préférences)
- **react-hook-form + Zod** pour les formulaires et validation
- **Expo Image** pour images optimisées
- **Expo Notifications** pour les push (notifications messagerie, nouvel abonné, etc.)
- **Expo Secure Store** pour stocker le token Supabase de manière sécurisée

### Backend (existant, ne pas recréer)
- **Supabase**
  - URL : `https://bptyryobylxavyhvmkfh.supabase.co`
  - Anon Key : à demander à l'utilisateur (variable env `EXPO_PUBLIC_SUPABASE_ANON_KEY`)
- **Tables PostgreSQL** (déjà migrées en prod, ne JAMAIS modifier le schéma) :
  - `users` (profils utilisateurs, role, validation_status, client_number, referral_code)
  - `artisan_profiles` (extension pour les artisans : company_name, siren, services, etc.)
  - `metiers` (176 métiers, slug, name, category, icon)
  - `feed_posts` (posts du fil : content, images, kind=realisation/conseil/question, link_url/title/desc/image, repost_of_id, status)
  - `feed_likes`, `feed_comments`, `feed_reports`
  - `messages`, `message_threads` (messagerie temps réel)
  - `quote_requests` (demandes de devis)
  - `reviews` (avis clients sur artisans)
  - `user_follows` (système d'abonnement)
  - `app_notifications` (notifications in-app)
  - `blog_posts` (articles éditoriaux)
  - `job_offers`, `cv_submissions` (jobboard)
  - `favorites` (favoris artisans)
- **Storage Bucket** : `user-uploads` (photos profil, photos posts, CVs PDF)
- **Auth Supabase** (email + password) avec validation admin obligatoire
- **Realtime** activé sur `feed_posts`, `feed_likes`, `feed_comments`, `messages`, `user_follows`

### RLS et écritures
Le site actuel utilise des **server actions Next.js avec service_role** (bypass RLS). L'app mobile **ne peut pas faire ça** (service_role doit rester côté serveur). Deux options :
1. **Recommandée** : appeler les endpoints HTTP existants du site (POST /api/...) avec le token utilisateur en Bearer
2. **Alternative** : ajouter des policies RLS write pour permettre aux utilisateurs auth d'écrire eux-mêmes (à valider en sécurité)

Au démarrage, utilise **l'option 1** sur les écritures critiques (créer post, envoyer message, etc.) en appelant `https://bisecco.fr/api/...`. Les lectures publiques (feed, profils, métiers) peuvent passer en direct Supabase avec la clé anon.

---

## 🎨 Identité visuelle

- **Brand color** : orange `#f07a2f` (`brand-500`)
- **Ink color** (texte/fond foncé) : navy `#0d1e4a` (`ink-700`)
- **Police** : Manrope (variable font, à charger via `expo-google-fonts/manrope`)
- **Style** : Direct, professionnel, sans bullshit. Pas d'em dashes (—). Pas de jargon SaaS gratuit.
- **Anti-patterns interdits** : side-stripe borders, gradient text, hero-metric template, identical card grids, glassmorphism décoratif
- **Coins arrondis généreux** (rounded-2xl/3xl), ombres warm subtiles, fond cassé (`#fafbfc`)
- **Tone of voice** : tutoiement avec les utilisateurs, copywriting court et direct

Le logo est dispo à `https://bisecco.fr/icon-app.png` (1024×1024 PNG transparent, molécule orange/turquoise + croissant blanc).

---

## 📱 Écrans à construire (ordre de priorité)

### Phase 1 (MVP, ~2 semaines)

#### Auth
1. **Splash screen** avec logo Bisecco
2. **Onboarding** 3 slides (Pourquoi Bisecco, Comment ça marche, SIREN vérifié)
3. **Connexion** (email + password, "mot de passe oublié")
4. **Inscription** (étape 1 : choix Particulier/Artisan, étape 2 : formulaire avec champs adaptés)
5. **Vérification email** (écran "Email envoyé, clique le lien")
6. **Mot de passe oublié** (saisie email → notification visuelle)
7. **Profil non validé** (écran d'attente avec message "Validation sous 24h")

#### Navigation principale (bottom tabs)
- **Accueil** (`/`)
- **Rechercher** (`/rechercher`)
- **Actu** (`/fil`) — fil social
- **Messages** (`/messagerie`)
- **Profil** (`/mon-profil`)

#### Accueil
- Hero avec mission + 2 CTAs (Trouver un artisan / Créer mon profil pro)
- Bandeau "X artisans inscrits" (live depuis Supabase)
- Top 6 métiers les plus recherchés (cards avec icône emoji)
- Section avis récents (3 derniers avis publiés)
- CTA inviter ses amis
- Section blog (3 derniers articles)

#### Recherche
- Barre de recherche (métier + ville en autocomplete)
- Filtres : SIREN vérifié, note ≥ 4, ouvert maintenant, distance
- Liste résultats (cards artisans avec photo, nom commercial, métier, ville, note, distance)
- Vue carte (Mapbox ou react-native-maps) avec markers
- Toggle Liste / Carte

#### Fiche artisan (`/profil/[client_number]`)
- Cover photo + avatar
- Nom commercial + badge SIREN vérifié
- Note moyenne + nombre d'avis
- Bouton **Suivre** (toggle abonnement avec compteur)
- Bouton **Demander un devis** (orange, gros, sticky bottom)
- Bouton **Contacter** (ouvre la messagerie directement)
- Onglets : À propos · Services · Galerie · Avis
- Bouton signaler (menu ⋯)

#### Fil d'actualité (`/fil`)
- Composer inline en haut (texte + photos + emoji + détection URL → aperçu OG)
- Pull-to-refresh
- Scroll infini (10 par 10)
- Realtime : nouveaux posts apparaissent en haut sans rafraîchir
- Post card : avatar + auteur + kind badge + temps relatif + texte tronqué "voir plus" type LinkedIn + grid images (1/2/3/4+) + aperçu OG + actions (Like / Comment / Share / Repartager / Signaler)
- Filtres : Tout / Réalisations / Conseils / Questions

#### Messagerie (`/messagerie`)
- Liste des conversations avec preview + compteur unread
- Push notification à la réception d'un nouveau message
- Vue conversation : bulles asymétriques (orange à droite pour mes messages, blanc à gauche pour les leurs), input + emoji picker + envoi photo
- Realtime via Supabase Realtime sur `messages`
- Marque lu automatiquement à l'ouverture
- Bouton supprimer conversation

#### Profil (`/mon-profil`)
- Header avatar + nom + rôle + ville + bouton modifier
- Stats : posts publiés, likes donnés, commentaires
- % de complétion de profil avec liste champs manquants
- Sections : Mes devis, Mes avis, Mes favoris, Mes posts, Parrainage, Paramètres
- Bouton **Inviter mes contacts** (utilise Expo Contacts API)
- Bouton **Se déconnecter**

### Phase 2 (post-MVP)

- **Devis** : formulaire complet (métier, description, photos, urgence, budget) + suivi des devis envoyés/reçus
- **Emploi** : jobboard avec liste offres, candidature, dépôt CV (PDF via expo-document-picker)
- **Blog** : liste articles, lecteur d'article avec markdown
- **Notifications** : centre de notifications in-app + push
- **Paramètres** : changer mot de passe, supprimer compte, RGPD export, langue, thème (clair/sombre)
- **Mode sombre** (cohérent avec le brand)

### Phase 3 (nice-to-have)

- Recherche vocale
- Partage natif d'un profil artisan (deep linking)
- Apple Pay / Google Pay pour le futur premium artisan
- Widget iOS / Android (métiers récemment vus)

---

## 🔐 Auth flow détaillé

1. À l'inscription, créer le user via `supabase.auth.signUp({ email, password })` puis insérer une ligne dans `public.users` via un endpoint `POST https://bisecco.fr/api/auth/register` (le site gère la validation SIREN si artisan + envoie l'email de validation custom via SMTP o2switch)
2. À la connexion, `supabase.auth.signInWithPassword()`. Vérifier ensuite `users.validation_status` :
   - `pending` → écran "Compte en attente de validation"
   - `rejected` → écran "Compte refusé, contactez le support"
   - `approved` → accès complet
3. Stocker le token JWT dans **Expo Secure Store** (pas AsyncStorage)
4. Refresh token auto via `supabase.auth.onAuthStateChange()`
5. Logout : `supabase.auth.signOut()` + wipe Secure Store + clear React Query cache

---

## 🔔 Notifications push

- Utiliser **Expo Notifications** + **Expo Push API**
- Au login, demander permission + récupérer le `expoPushToken`
- POST le token à `https://bisecco.fr/api/notifications/register-token` avec l'auth user
- Côté serveur Bisecco (déjà fait), envoyer les push lors de :
  - Nouveau message reçu
  - Nouvel abonné
  - Avis reçu (artisan)
  - Devis reçu (artisan)
  - Post repartagé (auteur original)

L'agent doit créer l'endpoint `/api/notifications/register-token` côté Next.js si pas encore existant.

---

## 🌐 Deep linking + Universal Links

- Schéma custom : `bisecco://`
- Universal Links iOS : `https://bisecco.fr/r/*`, `https://bisecco.fr/profil/*`, `https://bisecco.fr/fil/*`
- App Links Android : configurés via `assetlinks.json` déjà présent à `https://bisecco.fr/.well-known/assetlinks.json`
- Apple AASA déjà présent à `https://bisecco.fr/.well-known/apple-app-site-association`

L'agent doit configurer `app.json` (Expo) en conséquence avec le bon `bundleIdentifier: "eu.bisecco.app"` et `package: "eu.bisecco.app"`.

---

## 📦 Structure de projet attendue

```
bisecco-mobile/
  app/                          # Expo Router routes
    (auth)/                     # Group : routes accessibles non connecté
      login.tsx
      register.tsx
      forgot-password.tsx
    (tabs)/                     # Bottom tabs principal
      _layout.tsx
      index.tsx                 # Accueil
      search.tsx
      feed.tsx
      messages.tsx
      profile.tsx
    artisan/[id].tsx            # Fiche artisan
    conversation/[id].tsx       # Thread messagerie
    devis/new.tsx
    devis/[id].tsx
    _layout.tsx                 # Root layout + providers
  components/
    ui/                         # Buttons, Cards, Inputs primitifs
    auth/                       # SignInForm, SignUpForm
    feed/                       # PostCard, Composer, LikeButton, etc.
    messages/                   # MessageBubble, ConversationItem
    artisan/                    # ArtisanCard, ReviewItem, FollowButton
  lib/
    supabase.ts                 # Client Supabase + types DB
    auth.ts                     # Helpers auth
    api.ts                      # Wrapper fetch vers bisecco.fr/api/*
    queries/                    # React Query hooks (useFeed, useMessages, useArtisan, etc.)
    utils.ts
  stores/
    auth.ts                     # Zustand auth store
    settings.ts                 # User preferences
  hooks/
    useRealtime.ts              # Supabase Realtime subscribe
    usePushNotifications.ts
  constants/
    colors.ts                   # Palette Tailwind synchro avec le site
    theme.ts
  app.json                      # Config Expo (bundle ID, plugins, schemes)
  eas.json                      # EAS Build config
  package.json
  README.md
```

---

## ✅ Critères de validation

L'app est considérée comme "MVP livrée" quand :

1. Je peux **m'inscrire** depuis l'app, recevoir l'email de validation, me connecter
2. Je peux **rechercher** un artisan par métier + ville, voir sa fiche complète
3. Je peux **demander un devis** à un artisan, qui le reçoit en notification push
4. Je peux **échanger des messages** en temps réel avec un artisan via la messagerie
5. Je peux **publier un post** dans le fil (texte + photos), les autres le voient en temps réel
6. Je peux **liker, commenter, repartager** les posts des autres
7. Je peux **suivre / désuivre** un artisan
8. Je peux **modifier mon profil** (photo, bio, ville)
9. Les **deep links** depuis WhatsApp ouvrent l'app sur la bonne page
10. L'app **se build** sur Android (.aab) et iOS (.ipa) via `eas build`

---

## 🚀 Workflow recommandé pour toi (Antigravity / Claude Code)

1. **Init** : `npx create-expo-app@latest bisecco-mobile --template`
2. **Installer les deps** dans l'ordre : Supabase, React Query, Zustand, NativeWind, expo-router, react-hook-form, zod, expo-secure-store, expo-notifications, expo-image, expo-contacts, react-native-maps, manrope fonts
3. **Configurer** `tailwind.config.js` avec la palette brand/ink
4. **Connecter Supabase** en lecture-seule d'abord (anon key), tester avec un fetch sur la table `metiers`
5. **Construire les écrans** dans l'ordre Phase 1 ci-dessus
6. **Tester sur Expo Go** avant chaque commit
7. **Configurer EAS Build** : `eas init`, `eas build:configure`
8. **Build dev preview** : `eas build --profile preview --platform android` puis `--platform ios`
9. **Submit aux stores** : `eas submit --platform android` et `--platform ios`

---

## ⚠️ Pièges à éviter

- **Ne pas recoder le backend** : tout existe déjà sur https://bisecco.fr
- **Ne pas utiliser AsyncStorage** pour le token auth (utiliser Expo Secure Store)
- **Ne pas mettre la `SUPABASE_SERVICE_ROLE_KEY` dans l'app** (exposition publique = compromission totale)
- **Ne pas dupliquer la logique de validation SIREN** : déléguer à l'endpoint Bisecco existant
- **Ne pas créer un design system parallèle** : reprendre les couleurs/typo exactes du site
- **Ne pas faire de WebView** : c'est une vraie app native
- **Tester systématiquement sur device réel** avant chaque build EAS (Expo Go a des limites)

---

## 📋 Infos à demander à l'utilisateur avant de commencer

1. **`EXPO_PUBLIC_SUPABASE_ANON_KEY`** (clé anon Supabase — pas la service role)
2. **Compte Apple Developer** (pour submit iOS) — 99 €/an
3. **Compte Google Play Console** (pour submit Android) — 25 € one-shot
4. **Compte Expo** (gratuit, pour EAS Build)
5. **Logo source** en SVG ou PNG haute résolution (1024×1024 minimum) — dispo à `https://bisecco.fr/icon-app.png`
6. **Texte des emails transactionnels** : le site les envoie déjà via SMTP o2switch, l'app n'a rien à gérer

---

## 🎯 Livrable final attendu

Quand tu auras fini, je dois pouvoir :
- Lancer l'app sur mon Android et iPhone en mode dev (Expo Go)
- Builder un `.aab` et un `.ipa` via EAS Build
- Avoir le projet versionné sur GitHub avec un README clair (installation, dev, build, submit)
- Avoir une checklist de soumission aux stores (screenshots requis, description, privacy policy, age rating)

**Commence maintenant** : pose-moi les questions sur les infos manquantes (clé anon, compte Apple, etc.) puis initie le projet.
