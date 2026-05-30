---
description: Audit complet du code — bugs, anti-patterns, sécurité, perf, SEO
---

Faire un audit complet du projet Bisecco. Vérifier :

## 🐛 Bugs

- Formulaires avec `setTimeout` puis success sans logique (= mockups fake)
- `alert()` natif dans les composants client
- `process.env.NEXT_PUBLIC_*` utilisé pour des URLs côté serveur (devrait être `APP_URL`)
- `localhost:3000` hardcodé dans le code
- `console.log` qui leak des données sensibles
- `await admin.auth.admin.listUsers({ perPage: 1000 })` (limite à 1000)

## 🔒 Sécurité

- Server actions sans `requireDbAdmin()` au début (pour actions admin)
- Validation côté serveur manquante (longueur, format)
- Rate limiting absent sur actions critiques (reset password, signup)
- Tables sans RLS activé
- Secrets dans le code

## ⚡ Performance

- Bundles First Load JS anormalement gros (>200 KB pour une page simple)
- `<img>` natif au lieu de `next/image`
- Composants client lourds chargés sans lazy
- Re-fetch en boucle au lieu d'unstable_cache

## 🎨 Anti-patterns design

- Side-stripe borders (border-left/right > 1px coloré)
- Gradient text
- Hero-metric template SaaS cliché
- `Math.random()` / `Date.now()` pendant render
- `setState` direct dans `useEffect` sans guard

## 📈 SEO

- Sitemap statique (devrait être dynamique)
- Pages programmatiques métier×ville pauvres en contenu
- Absence de Schema.org JSON-LD sur les pages clés
- Méta absentes (title, description, OG)

## 📋 Action

1. Scanner les fichiers concernés avec Grep
2. Lister les vrais problèmes (pas du bullshit générique)
3. Classer par criticité : 🔴 critique / 🟠 important / 🟡 mineur
4. Pour chaque problème : indiquer le fichier + ligne + fix recommandé
5. Donner un TOP 5 actions prioritaires
