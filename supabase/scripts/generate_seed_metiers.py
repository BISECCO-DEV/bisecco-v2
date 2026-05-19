#!/usr/bin/env python3
"""
Génère un fichier SQL qui :
1. Met à jour la CHECK constraint de public.metiers pour accepter les nouvelles catégories V2
2. Insère (ou met à jour si déjà présent) tous les métiers de lib/metiers.ts

Source : c:/Users/Laurent/Desktop/bisecco-v2/lib/metiers.ts
Sortie  : c:/Users/Laurent/Desktop/bisecco-v2/supabase/seed_metiers.sql
"""

from __future__ import annotations

import io
import re
import sys
import unicodedata
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

METIERS_TS = Path(r"c:/Users/Laurent/Desktop/bisecco-v2/lib/metiers.ts")
OUTPUT_SQL = Path(r"c:/Users/Laurent/Desktop/bisecco-v2/supabase/seed_metiers.sql")


def slugify(text: str) -> str:
    """Convertit un nom de métier en slug kebab-case ASCII."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text


def parse_metiers(content: str) -> list[dict]:
    """Parse lib/metiers.ts et extrait les métiers."""
    pattern = re.compile(
        r'\{\s*name:\s*"([^"]+)"\s*,\s*category:\s*"([^"]+)"\s*,\s*icon:\s*"([^"]+)"\s*\}'
    )
    metiers = []
    seen_slugs = set()
    for match in pattern.finditer(content):
        name, category, icon = match.groups()
        slug = slugify(name)
        # Gère les collisions de slugs (ex: "Boucher" et "Boucher-charcutier")
        original_slug = slug
        counter = 2
        while slug in seen_slugs:
            slug = f"{original_slug}-{counter}"
            counter += 1
        seen_slugs.add(slug)
        metiers.append({"name": name, "slug": slug, "category": category, "icon": icon})
    return metiers


def escape_sql(s: str) -> str:
    """Échappe pour single-quoted SQL string."""
    return s.replace("'", "''")


def main() -> None:
    content = METIERS_TS.read_text(encoding="utf-8")
    metiers = parse_metiers(content)
    categories = sorted({m["category"] for m in metiers})

    out: list[str] = []
    out.append("-- ============================================================")
    out.append("-- Bisecco — Seed des 290 métiers (source: lib/metiers.ts du V2)")
    out.append("-- ============================================================")
    out.append("-- À exécuter dans Supabase SQL Editor.")
    out.append("-- Idempotent : peut être ré-exécuté sans danger (ON CONFLICT)")
    out.append("-- ============================================================")
    out.append("")
    out.append("BEGIN;")
    out.append("")
    out.append("-- 1. Mise à jour de la CHECK constraint pour accepter les nouvelles catégories V2")
    out.append("ALTER TABLE public.metiers DROP CONSTRAINT IF EXISTS metiers_category_check;")
    out.append("ALTER TABLE public.metiers ADD CONSTRAINT metiers_category_check")
    quoted_cats = ", ".join("'" + escape_sql(c) + "'" for c in categories)
    out.append(f"  CHECK (category IN ({quoted_cats}));")
    out.append("")
    out.append(f"-- 2. Upsert de {len(metiers)} métiers")
    out.append("INSERT INTO public.metiers (name, slug, category, icon) VALUES")

    rows = []
    for m in metiers:
        rows.append(
            f"  ('{escape_sql(m['name'])}', '{m['slug']}', '{escape_sql(m['category'])}', '{escape_sql(m['icon'])}')"
        )
    out.append(",\n".join(rows))
    out.append("ON CONFLICT (slug) DO UPDATE SET")
    out.append("  name     = EXCLUDED.name,")
    out.append("  category = EXCLUDED.category,")
    out.append("  icon     = EXCLUDED.icon,")
    out.append("  updated_at = NOW();")
    out.append("")
    out.append("-- 3. Reset de la séquence (au cas où)")
    out.append(
        "SELECT setval(pg_get_serial_sequence('public.metiers', 'id'), "
        "COALESCE((SELECT MAX(id) FROM public.metiers), 1));"
    )
    out.append("")
    out.append("COMMIT;")
    out.append("")
    out.append(f"-- Total : {len(metiers)} métiers répartis dans {len(categories)} catégories :")
    for cat in categories:
        count = sum(1 for m in metiers if m["category"] == cat)
        out.append(f"--   • {cat} : {count}")

    OUTPUT_SQL.write_text("\n".join(out), encoding="utf-8")
    print(f"✓ {OUTPUT_SQL}")
    print(f"  {len(metiers)} métiers, {len(categories)} catégories")


if __name__ == "__main__":
    main()
