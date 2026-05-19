# Migrations SQL — Bisecco V2

Toutes les migrations vivent ici, numérotées chronologiquement.
À appliquer dans l'ordre dans le SQL Editor Supabase (ou via `supabase db push`).

| # | Fichier | Description |
|---|---------|-------------|
| 001 | `001_initial_schema.sql` | Schéma initial (profiles, metiers, etc.) |
| 002 | `002_rls_policies.sql` | RLS policies + helper `is_admin()` |
| 003 | `003_full_schema.sql` | Schéma étendu (import depuis MySQL legacy) |
| 004 | `004_rls_public_read.sql` | Élargissement lecture publique |
| 005 | `005_cv_schema.sql` | Tables CV / banque de CV |
| 006 | `006_cv_submissions.sql` | Soumissions de candidatures |
| 007 | `007_migrate_metiers_v2.sql` | Refonte des métiers |
| 008 | `008_seed_metiers.sql` | Seed catalogue des métiers |
| 009 | `009_cleanup_old_metiers.sql` | Nettoyage post-migration |
| 010 | `010_sprint_features_v2.sql` | Features sprint V2 (avis, devis, etc.) |

## Convention

- **Toujours numéroter** : `NNN_description.sql` (3 chiffres, snake_case).
- **Jamais éditer une migration déjà appliquée** — créer une nouvelle migration à la place.
- **Idempotent quand possible** : `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`, etc.
- **RLS** : ne jamais désactiver une policy en prod sans migration tracée.

## Dossier `supabase/`

- `supabase/dumps/` — exports/snapshots de la base (référence, pas exécutables).
- `supabase/scripts/` — scripts Python utilitaires (ex. `mysql_to_postgres.py`).
- Les fichiers `.sql` plats à la racine de `supabase/` sont **legacy** — utiliser `db/` à la place.

## Générer les types TypeScript

```bash
npm run supabase:types
```

Nécessite Supabase CLI installé et projet lié (`supabase link --project-ref <id>`).
