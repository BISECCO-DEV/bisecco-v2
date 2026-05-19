#!/usr/bin/env python3
"""
Convertit le dump MySQL (mysqldump) de Bisecco en SQL Postgres compatible Supabase.

Usage:
    python mysql_to_postgres.py supabase/dumps/bisecco_db.sql > supabase/dumps/bisecco_postgres.sql

Transformations :
- Backticks `col` → "col" ou rien
- Chaînes MySQL '\'' → Postgres "''"
- Dates '0000-00-00 00:00:00' → NULL
- Booléens 0/1 → false/true sur colonnes BOOLEAN
- Filtre les tables non migrées (cache, jobs, sessions, stripe, etc.)
- Réordonne les INSERT pour respecter les foreign keys
- Reset des séquences BIGSERIAL après import (SELECT setval...)
"""

from __future__ import annotations

import io
import re
import sys
from pathlib import Path

# Force UTF-8 stdout (Windows console default cp1252 break sur les flèches)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# ─── Configuration ────────────────────────────────────────────────────────

# Schéma Postgres : pour chaque table on définit les colonnes qu'on garde
# (dans l'ordre d'apparition dans le CREATE TABLE Postgres).
# Les colonnes du dump MySQL non listées ici seront ignorées.
POSTGRES_SCHEMA: dict[str, list[str]] = {
    "metiers": [
        "id", "name", "slug", "category", "description", "icon",
        "created_at", "updated_at",
    ],
    "users": [
        "id", "client_number", "name", "email", "email_verified_at", "password",
        "oauth_provider", "oauth_id", "role", "phone", "city", "description",
        "profile_photo", "cover_photo",
        "siren", "siren_status", "siren_last_checked_at", "siren_closed_at",
        "validation_status", "validated_at", "validated_by", "rejection_reason",
        "remember_token", "created_at", "updated_at", "deleted_at",
    ],
    "artisan_profiles": [
        "id", "user_id", "metier_id", "company_name", "description",
        "availability", "business_hours", "service_radius",
        "latitude", "longitude", "siret", "siret_verified", "rcs_verified",
        "is_active", "created_at", "updated_at",
    ],
    "artisan_profile_metier": [
        "id", "artisan_profile_id", "metier_id",
    ],
    "services": [
        "id", "artisan_profile_id", "name", "price",
        "created_at", "updated_at",
    ],
    "gallery_images": [
        "id", "artisan_profile_id", "user_id", "image_path", "caption",
        "sort_order", "created_at", "updated_at",
    ],
    "reviews": [
        "id", "is_flagged", "artisan_profile_id", "user_id", "rating", "comment",
        "created_at", "updated_at",
    ],
    "follows": [
        "id", "follower_id", "following_id", "created_at", "updated_at",
    ],
    "artisan_posts": [
        "id", "user_id", "content", "image", "is_news",
        "created_at", "updated_at",
    ],
    "artisan_post_likes": [
        "id", "post_id", "user_id", "created_at", "updated_at",
    ],
    "artisan_post_comments": [
        "id", "post_id", "user_id", "content", "created_at", "updated_at",
    ],
    "artisan_connections": [
        "id", "follower_id", "following_id", "created_at", "updated_at",
    ],
    "chat_conversations": [
        "id", "visitor_id", "visitor_name", "visitor_email", "page_url",
        "status", "human_mode", "last_activity_at", "created_at", "updated_at",
    ],
    "chat_messages": [
        "id", "conversation_id", "body", "sender", "sender_name", "read_at",
        "created_at", "updated_at",
    ],
    "profile_views": [
        "id", "profile_user_id", "viewed_at",
    ],
    "maintenance_subscribers": [
        "id", "email", "token", "ip_address", "notified_at", "created_at",
    ],
}

# Ordre d'insertion (respecte les foreign keys : parents d'abord)
INSERT_ORDER = [
    "metiers",
    "users",
    "artisan_profiles",
    "artisan_profile_metier",
    "services",
    "gallery_images",
    "reviews",
    "follows",
    "artisan_posts",
    "artisan_post_likes",
    "artisan_post_comments",
    "artisan_connections",
    "chat_conversations",
    "chat_messages",
    "profile_views",
    "maintenance_subscribers",
]

# Colonnes BOOLEAN (où 0/1 doit devenir false/true)
BOOLEAN_COLUMNS = {
    "artisan_profiles": {"siret_verified", "rcs_verified", "is_active"},
    "reviews": {"is_flagged"},
    "artisan_posts": {"is_news"},
    "chat_conversations": {"human_mode"},
}


# ─── Parsing du dump ──────────────────────────────────────────────────────

def split_sql_values(values_str: str) -> list[list[str]]:
    """
    Sépare la liste de VALUES en lignes individuelles.
    Gère les chaînes avec virgules, parenthèses, échappements.
    """
    rows: list[list[str]] = []
    current: list[str] = []
    buffer = ""
    depth = 0
    in_string = False
    escape = False

    i = 0
    while i < len(values_str):
        c = values_str[i]
        if escape:
            buffer += c
            escape = False
        elif c == "\\":
            buffer += c
            escape = True
        elif c == "'" and not in_string:
            in_string = True
            buffer += c
        elif c == "'" and in_string:
            # Check for escaped ''
            if i + 1 < len(values_str) and values_str[i + 1] == "'":
                buffer += "''"
                i += 1
            else:
                in_string = False
                buffer += c
        elif in_string:
            buffer += c
        elif c == "(" and depth == 0:
            depth = 1
            buffer = ""
        elif c == "(":
            depth += 1
            buffer += c
        elif c == ")" and depth == 1:
            depth = 0
            current.append(buffer.strip())
            rows.append(current)
            current = []
            buffer = ""
        elif c == ")":
            depth -= 1
            buffer += c
        elif c == "," and depth == 1:
            current.append(buffer.strip())
            buffer = ""
        else:
            if depth > 0:
                buffer += c
        i += 1

    return rows


def parse_insert_statements(sql: str) -> dict[str, dict]:
    """
    Parse les INSERT INTO du dump, retourne {table: {columns: [...], rows: [[...], ...]}}
    """
    inserts: dict[str, dict] = {}

    # Regex pour extraire chaque INSERT
    pattern = re.compile(
        r"INSERT INTO `(?P<table>[^`]+)` \((?P<cols>[^)]+)\) VALUES\s*(?P<values>.*?);(?=\s*$|\s*INSERT|\s*\Z)",
        re.MULTILINE | re.DOTALL,
    )

    for match in pattern.finditer(sql):
        table = match.group("table")
        cols_raw = match.group("cols")
        values_raw = match.group("values")

        columns = [c.strip().strip("`") for c in cols_raw.split(",")]
        rows = split_sql_values(values_raw)

        inserts[table] = {"columns": columns, "rows": rows}

    return inserts


def transform_value(value: str, column: str, table: str) -> str:
    """Convertit une valeur MySQL → Postgres."""
    value = value.strip()

    # NULL
    if value.upper() == "NULL":
        return "NULL"

    # Dates invalides MySQL → NULL
    if value in ("'0000-00-00 00:00:00'", "'0000-00-00'"):
        return "NULL"

    # Booléens
    if column in BOOLEAN_COLUMNS.get(table, set()):
        if value == "0":
            return "false"
        if value == "1":
            return "true"

    # Chaînes : MySQL utilise \' pour échapper, Postgres utilise ''
    if value.startswith("'") and value.endswith("'"):
        inner = value[1:-1]
        # \' -> ''
        inner = inner.replace("\\'", "''")
        # \\ -> \
        inner = inner.replace("\\\\", "\\")
        # \n, \r, \t (Postgres supporte E'string' pour escape mais simplifions)
        inner = inner.replace("\\n", chr(10)).replace("\\r", chr(13)).replace("\\t", chr(9))
        # Réenchapper les single quotes
        return f"'{inner}'"

    return value


def emit_postgres_insert(table: str, parsed: dict) -> str:
    """Génère le SQL Postgres INSERT pour une table."""
    schema_cols = POSTGRES_SCHEMA[table]
    dump_cols = parsed["columns"]

    # Index des colonnes du dump qu'on garde, dans l'ordre du schema Postgres
    indices: list[int | None] = []
    for sc in schema_cols:
        if sc in dump_cols:
            indices.append(dump_cols.index(sc))
        else:
            indices.append(None)

    lines: list[str] = []
    lines.append(f"-- Données : {table} ({len(parsed['rows'])} lignes)")
    lines.append(f"INSERT INTO public.{table} ({', '.join(schema_cols)}) VALUES")

    value_lines: list[str] = []
    for row in parsed["rows"]:
        out_values: list[str] = []
        for idx, col in zip(indices, schema_cols):
            if idx is None:
                # Colonne absente du dump → DEFAULT
                out_values.append("DEFAULT")
            else:
                raw = row[idx] if idx < len(row) else "NULL"
                out_values.append(transform_value(raw, col, table))
        value_lines.append(f"  ({', '.join(out_values)})")

    lines.append(",\n".join(value_lines) + ";")
    return "\n".join(lines)


def emit_sequence_reset(table: str) -> str:
    """Reset le compteur BIGSERIAL après import."""
    return (
        f"SELECT setval(pg_get_serial_sequence('public.{table}', 'id'), "
        f"COALESCE((SELECT MAX(id) FROM public.{table}), 1));"
    )


# ─── Main ─────────────────────────────────────────────────────────────────

def main(input_path: str) -> None:
    sql = Path(input_path).read_text(encoding="utf-8", errors="replace")
    inserts = parse_insert_statements(sql)

    out: list[str] = []
    out.append("-- ============================================================")
    out.append("-- Bisecco — Migration des données MySQL → Postgres Supabase")
    out.append("-- Généré automatiquement depuis le dump mysqldump")
    out.append("-- ============================================================")
    out.append("-- À exécuter dans Supabase SQL Editor APRÈS schema.sql")
    out.append("-- ============================================================")
    out.append("")
    out.append("BEGIN;")
    out.append("")

    found = 0
    missing: list[str] = []

    for table in INSERT_ORDER:
        if table in inserts:
            out.append(emit_postgres_insert(table, inserts[table]))
            out.append("")
            found += 1
        else:
            missing.append(table)

    out.append("-- ─── Reset des séquences BIGSERIAL ────────────────────────")
    for table in INSERT_ORDER:
        if "id" in POSTGRES_SCHEMA[table]:
            out.append(emit_sequence_reset(table))

    out.append("")
    out.append("COMMIT;")
    out.append("")
    out.append(f"-- Tables importées : {found}/{len(INSERT_ORDER)}")
    if missing:
        out.append(f"-- Tables vides dans le dump (pas d'INSERT) : {', '.join(missing)}")

    print("\n".join(out))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python mysql_to_postgres.py <dump.sql>", file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1])
