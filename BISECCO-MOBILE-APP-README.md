# 📱 Mode d'emploi — Créer l'app mobile Bisecco

> Guide pas-à-pas pour transformer ton site web en vraie app native Android + iOS.
> Tu n'as **pas besoin** de savoir coder : tu copies-colles dans Antigravity ou Claude Code, l'agent fait tout.

---

## 🎯 Ce que tu vas obtenir

À la fin, tu auras :
- ✅ Une **app Android** prête à publier sur Google Play
- ✅ Une **app iOS** prête à publier sur l'App Store
- ✅ Le même backend que ton site (rien à recréer côté Supabase)
- ✅ Notifications push, deep links, mode hors ligne, design pro

**Budget total** : 25 € (Google Play, une fois) + 99 €/an (Apple Developer) = **124 € la 1ʳᵉ année**.
**Temps de boulot agent** : ~10-15 heures pour la Phase 1 MVP (réparties sur plusieurs sessions).

---

## 📦 Avant de commencer — Liste des choses à préparer (30 min)

### 1. Récupérer la clé Supabase
- Va sur https://supabase.com → connecte-toi
- Sélectionne le projet **bptyryobylxavyhvmkfh**
- Menu **Settings → API**
- Copie la valeur de **"anon public"** (la clé qui commence par `eyJ...`)
- ⚠️ NE PAS prendre la **service_role** (elle est secrète, jamais dans une app mobile)

### 2. Créer un compte Expo (gratuit)
- Va sur https://expo.dev → **Sign up**
- Note ton email + mot de passe

### 3. Créer un compte Google Play Console (25 € one-shot)
- Va sur https://play.google.com/console/signup
- Paye les 25 €, remplis les infos société
- Compte actif sous 48h

### 4. Créer un compte Apple Developer (99 €/an) — uniquement si tu veux iOS
- Va sur https://developer.apple.com/programs/enroll/
- Choisis "Organisation" (besoin du SIREN AGISCO HOLDING)
- 99 €/an, validation sous 48h
- Optionnel : tu peux faire **Android d'abord** et iOS dans 6 mois

### 5. Avoir Antigravity OU Claude Code installé
- **Antigravity** (Google, gratuit) : https://antigravity.google.com → installer
- **Claude Code** (Anthropic) : https://claude.com/claude-code → installer

---

## 🚀 Procédure pas-à-pas

### Étape 1 — Créer le dossier projet

Ouvre l'explorateur Windows, va sur ton bureau, crée un nouveau dossier **`bisecco-mobile`** (à côté de `bisecco-v2`, pas dedans).

### Étape 2 — Ouvrir Antigravity ou Claude Code dans ce dossier

#### Option A : Antigravity
1. Lance Antigravity
2. **File → Open Folder** → sélectionne `bisecco-mobile`
3. Ouvre le panneau Chat (icône à droite)

#### Option B : Claude Code
1. Ouvre PowerShell
2. `cd "C:\Users\Laurent\Desktop\bisecco-mobile"`
3. Tape `claude` et appuie Entrée

### Étape 3 — Coller le prompt complet

1. Ouvre le fichier [BISECCO-MOBILE-APP-PROMPT.md](BISECCO-MOBILE-APP-PROMPT.md) (dans ton dossier `bisecco-v2`)
2. **Sélectionne tout** (Ctrl+A) → **Copie** (Ctrl+C)
3. Retourne dans Antigravity / Claude Code
4. **Colle** (Ctrl+V) dans le chat
5. **Envoie** (Entrée ou bouton Send)

### Étape 4 — Répondre aux questions de l'agent

L'agent va te poser quelques questions au fur et à mesure. Voici les réponses :

| Question | Ta réponse |
|---|---|
| "Quelle est la clé Supabase anon ?" | Colle la clé `eyJ...` (étape 1) |
| "URL Supabase ?" | `https://bptyryobylxavyhvmkfh.supabase.co` |
| "Bundle ID iOS ?" | `eu.bisecco.app` |
| "Package Android ?" | `eu.bisecco.app` |
| "Nom de l'app ?" | `Bisecco` |
| "Logo ?" | Télécharge celui-là : https://bisecco.fr/icon-app.png |
| "Compte Expo ?" | Donne ton email Expo |
| "On commence par Phase 1 (MVP) ?" | **Oui** |

### Étape 5 — Laisser l'agent travailler

L'agent va :
1. Créer le projet Expo (`npx create-expo-app`)
2. Installer toutes les dépendances
3. Coder écran par écran (Auth → Navigation → Accueil → Recherche → Fil → Messagerie → Profil)
4. Tester sur Expo Go au fur et à mesure

**Tu n'as RIEN à coder.** Tu réponds juste aux questions au fur et à mesure et tu valides chaque écran quand l'agent te le présente.

### Étape 6 — Tester sur ton téléphone (en cours de dev)

1. Installe **Expo Go** depuis App Store ou Play Store
2. L'agent va lancer `npx expo start` → un QR code apparaît dans le terminal
3. Scanne le QR avec ton téléphone → l'app se charge
4. Teste les écrans, signale les bugs à l'agent

### Étape 7 — Builder pour les stores (fin de la phase)

Quand tout fonctionne sur Expo Go, demande à l'agent :

```
Build maintenant le .aab Android et le .ipa iOS via EAS Build.
```

L'agent va :
1. Lancer `eas login` → te demande tes identifiants Expo
2. Lancer `eas build:configure`
3. Lancer `eas build --platform android` → 15-25 min de build cloud
4. Lancer `eas build --platform ios` → 15-25 min (besoin du compte Apple Developer)
5. Te donner les URLs de téléchargement des fichiers

### Étape 8 — Soumettre aux stores

#### Android
1. Va sur https://play.google.com/console
2. **Créer une application** → entre les infos (nom, description, catégorie)
3. **Production → Créer un release** → upload le `.aab`
4. Remplis : description courte/longue, screenshots (8 max), icône 512×512, classification âge
5. **Envoyer pour examen** → review Google 1-3 jours
6. ✅ App en ligne sur le Play Store

#### iOS
1. Va sur https://appstoreconnect.apple.com
2. **Mes apps → +** → entre les infos
3. **TestFlight → upload le `.ipa`** (via Transporter ou EAS Submit)
4. Une fois propagé : **Distribution → Préparer pour soumission** → screenshots, description, etc.
5. **Soumettre pour examen** → review Apple 24-48h
6. ⚠️ Apple peut demander des modifications, c'est normal
7. ✅ App en ligne sur l'App Store

---

## 💡 Conseils pour bien gérer le projet

### ✅ Ce qu'il faut FAIRE

- **Une seule chose à la fois** : valide chaque écran avant de passer au suivant
- **Teste sur ton VRAI téléphone**, pas que sur le simulateur
- **Commit régulièrement** : demande à l'agent de commit après chaque écran finalisé
- **Versionne sur GitHub** : crée un repo `bisecco-mobile` privé et pushe
- **Garde le prompt original** sous la main : si tu changes d'agent, tu repars de zéro avec le même brief

### ❌ Ce qu'il faut ÉVITER

- ❌ Demander à l'agent de "tout faire d'un coup" → il va se perdre, casser des trucs
- ❌ Lui dire "fais comme le site exactement" → ce n'est PAS pareil, mobile = ergonomie différente
- ❌ Mettre la `service_role` de Supabase dans le code mobile → sécurité KO
- ❌ Sauter Phase 1 pour Phase 2 → le MVP doit marcher avant les fonctionnalités avancées
- ❌ Builder iOS sans Mac (l'agent t'expliquera) → besoin EAS Build cloud (gratuit ≤ 30 builds/mois)

---

## 📊 Phases du projet

| Phase | Contenu | Temps estimé |
|---|---|---|
| **Phase 1 — MVP** | Auth + 5 onglets + fiche artisan + composer fil + messagerie | ~10-15h agent |
| **Phase 2 — Pro** | Devis complet, jobboard, blog, notifications, paramètres | ~8-12h agent |
| **Phase 3 — Premium** | Mode sombre, recherche vocale, widgets, deep linking avancé | ~5-8h agent |

Démarre par Phase 1, mets en ligne, mesure les retours, et on attaque Phase 2 si la demande est là.

---

## 🆘 En cas de problème

- **L'agent bloque sur une erreur** → copie-colle l'erreur dans le chat, il va débugger
- **L'app crashe à l'ouverture** → vérifie les logs avec `npx expo start --no-dev --minify`
- **Le build EAS échoue** → vérifie les credentials Apple/Google
- **Question sur le code** → reviens me voir avec une capture de l'erreur, je débugge

---

## 📞 Récap rapide

1. ⏱️ **30 min** : préparer les comptes (Expo, Google Play, Apple Dev)
2. 📋 **5 min** : coller le prompt dans Antigravity ou Claude Code
3. 💬 **5 min** : répondre aux questions de l'agent
4. 🤖 **10-15h sur plusieurs jours** : l'agent code, tu valides
5. 🚀 **2-4 jours** : reviews stores Google + Apple
6. 🎉 **Bisecco est sur les stores**

**Tu n'écris pas une ligne de code. Tu valides, tu testes, tu publies.**

Bon courage 🚀
