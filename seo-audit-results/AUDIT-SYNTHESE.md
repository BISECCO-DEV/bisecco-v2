# Audit SEO/GEO complet — Bisecco.eu — Juin 2026

## 🎯 Scores globaux

| Dimension | Score | Status |
|---|---|---|
| Contenu / E-E-A-T | 58/100 | ⚠️ Moyen |
| GEO (visibilité IA) | 41/100 | 🔴 Faible |
| SEO Local | 54/100 | ⚠️ Moyen |
| Schema.org | Bug critique domaine | 🔴 |
| Sitemap | 2 bugs critiques | 🔴 |
| Technique | Site inaccessible aux crawlers (coming-soon) | 🔴 Bloquant |

**Score SEO global estimé : 48/100** — fondations en place mais bugs critiques annulent une grande partie des efforts.

---

## 🚨 BUGS CRITIQUES À CORRIGER MAINTENANT (15 min de boulot, gain massif)

### 1. Domaine bisecco.fr partout au lieu de bisecco.eu
**Impact :** Google voit 2 entités distinctes, autorité diluée, schemas invalidés.

**Fichiers à corriger :**
- `public/robots.txt` ligne 21 : `Sitemap: https://bisecco.eu/sitemap.xml`
- `lib/seo/schemas.ts` ligne 6 : `const BASE = "https://bisecco.eu"`
- `app/sitemap.ts` ligne 11 : fallback `"https://bisecco.eu"`
- `public/llms.txt` : remplacer toutes les URLs `bisecco.fr` → `bisecco.eu`
- `app/blog/[slug]/page.tsx` lignes 122, 126
- `app/blog/page.tsx` lignes 22, 31
- `app/contact/page.tsx` ligne 18
- `app/qui-sommes-nous/page.tsx` lignes 75-87
- `app/profil/[id]/page.tsx` ligne 109
- `app/emploi/[id]/page.tsx` ligne 43

### 2. Coming-soon gate bloque les crawlers AI
**Impact :** GPTBot, ClaudeBot, PerplexityBot, Googlebot reçoivent un 302 vers /coming-soon → zéro indexation possible.

**Solution :** soit désactiver `COMING_SOON_ENABLED=false` en prod, soit bypasser pour les crawlers connus dans `middleware.ts` (détection User-Agent).

### 3. SIREN incohérent
Mentions légales : "en cours d'immatriculation" / qui-sommes-nous : "RCS Cannes 750 463 317" → contradiction visible qui impacte le score Trust.

---

## 🔥 HIGH PRIORITY (semaine 1, ~4-6h)

### Contenu
- **Pages métiers thin content** : toutes les `/metiers/[slug]` ont le même texte. Ajouter 200-300 mots uniques par métier prioritaire (10-15 métiers max).
- **/tarifs retourne 404** : afficher contenu "Bisecco est gratuit pour tous" + roadmap premium, ou retirer du sitemap.
- **Auteurs blog crédibles** : remplacer les avatars `pravatar.cc` par de vraies photos + bios LinkedIn.
- **Section partenaires "Bientôt"** : masquer les 3 slots vides sur la home.

### Schema
- **FAQPage homepage** : actuellement dans un client component → invisible aux crawlers. Déplacer le JSON-LD dans le Server Component parent.
- **Organization.logo** : passer de string à ImageObject avec width/height.
- **WebSite.SearchAction.target** : wrapper en EntryPoint object (spec actuelle).
- **JobPosting datePosted** : ne pas utiliser `new Date()` au render → date stable depuis les données.

### Local
- **LocalBusiness sous-types** : utiliser `Plumber`, `Electrician`, `Carpenter` etc. au lieu de `LocalBusiness` générique (facteur #1 classement local pack).
- **Téléphone public** : ajouter un numéro dans le footer + schema Organization.
- **Adresse complète dans Organization schema** (manquante dans layout.tsx).

### GEO
- **llms.txt** : ajouter licence RSL 1.0 + définition rapide 50 mots + corriger URLs.
- **Règles robots.txt par crawler AI** : GPTBot, PerplexityBot, ClaudeBot, Google-Extended explicitement allowed.

---

## 🟡 MEDIUM (mois 1, ~10-15h)

### Nouveau contenu à créer
- **Page `/villes/[ville]`** : hub par ville listant tous les métiers (44 pages potentielles, fort impact longue traîne).
- **Page `/comparateur`** : tableau Bisecco vs Pages Jaunes vs Habitatpresto → très citable par LLMs pour "alternative à Pages Jaunes".
- **Schemas Service** sur `/metiers/[slug]` (impact AI Overviews fort).
- **Schemas Person** sur `/profil/[id]` (citation gérants par AI).
- **Schemas HowTo** sur pages métier x ville.

### Sitemap
- Ajouter pages manquantes : `/tarifs`, `/presse`, `/carrieres`, `/devis`, `/fil`.
- Remplacer `lastmod: new Date()` par dates stables (Google ignore les sitemaps avec lastmod factice).
- Soumettre `https://bisecco.eu/sitemap.xml` dans Google Search Console.

### E-E-A-T
- Stats homepage rendues server-side (pas seulement en JS).
- Cross-linking entre villes voisines sur les pages locales.
- Enrichir CITY_DATA pour les 32 villes manquantes (au moins les 15 plus importantes).

---

## 🟢 LOW (mois 2-3, autorité long terme)

- **Canal YouTube Bisecco** + 2 vidéos courtes ("Comment fonctionne la vérification SIREN", "Trouver un plombier vérifié") → correlation 0.737 avec citations ChatGPT.
- **Présence Reddit** active sur r/france, r/travaux, r/artisanat.
- **Création du GBP** (Google Business Profile) pour AGISCO HOLDING SAS à Cannes — une fois SIREN officiel.
- **Système de sollicitation d'avis** post-devis (email J+7 automatique).
- **Backlinks presse / institutionnels** : CMA France, CAPEB, ADEME, presse locale Cannes.

---

## 📊 Visibilité par plateforme AI (état actuel)

| Plateforme | Score | Raison principale |
|---|---|---|
| Google AI Overviews | 18/100 | Site inaccessible + schema domaine cassé |
| ChatGPT Search | 12/100 | Aucune mention externe, site bloqué |
| Perplexity | 15/100 | llms.txt présent mais URLs incorrectes |
| Bing Copilot | 20/100 | Schema bien structuré mais domaine incohérent |

---

## 🎯 Plan d'attaque recommandé

### Aujourd'hui (1h)
✅ Fix domaine bisecco.fr → bisecco.eu (10 fichiers)
✅ Désactiver coming-soon ou bypasser crawlers
✅ Corriger incohérence SIREN
✅ Soumettre sitemap dans GSC

### Cette semaine (4-6h)
✅ Pages métiers : 10 contenus uniques 200-300 mots
✅ Corriger /tarifs (page ou retrait sitemap)
✅ Schemas : Organization complet, SearchAction EntryPoint, FAQPage server-rendered
✅ Téléphone public + adresse complète Organization
✅ LocalBusiness sous-types par métier

### Ce mois (15h)
✅ Créer `/villes/[ville]` + `/comparateur`
✅ Schemas Service + Person + HowTo
✅ Refonte sitemap (lastmod stables, pages manquantes)
✅ Enrichir CITY_DATA 15 villes

### Trimestre 1 (autorité long terme)
✅ YouTube + Reddit
✅ GBP Bisecco
✅ Sollicitation avis automatique
✅ Backlinks institutionnels
