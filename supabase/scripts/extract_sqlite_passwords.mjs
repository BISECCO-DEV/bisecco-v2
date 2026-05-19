#!/usr/bin/env node
/**
 * Extrait les emails + hashes bcrypt depuis la base SQLite de la V1 LOCALE,
 * et génère un fichier SQL d'UPDATEs à appliquer dans Supabase.
 *
 * Usage :
 *   node supabase/scripts/extract_sqlite_passwords.mjs
 *
 * Output : db/013_refresh_legacy_passwords_local.sql
 */

import Database from "better-sqlite3";
import { writeFileSync } from "node:fs";

const SQLITE_PATH = "C:/Users/Laurent/Desktop/bisecco-PROJET/bisecco-PROJET/database/database.sqlite";
const OUT_PATH = "db/013_refresh_legacy_passwords_local.sql";

const db = new Database(SQLITE_PATH, { readonly: true });

// Liste les colonnes pour comprendre la structure
const cols = db.prepare("PRAGMA table_info(users)").all();
console.log("Colonnes de la table users :");
console.log(cols.map((c) => c.name).join(", "));
console.log();

// Récupère les users avec password non-null
const rows = db
  .prepare("SELECT id, email, password FROM users WHERE password IS NOT NULL AND (deleted_at IS NULL OR deleted_at = '') ORDER BY id")
  .all();

console.log(`${rows.length} users avec password trouvés dans SQLite.`);

function escapeSqlString(s) {
  return String(s).replace(/'/g, "''");
}

const updates = rows.map(
  (r) =>
    `UPDATE public.users SET password = '${escapeSqlString(r.password)}' WHERE lower(email) = '${escapeSqlString(r.email.toLowerCase())}';`,
);

const header = `-- =====================================================================
-- 013 — Restaure les hashes bcrypt depuis la V1 LOCALE (SQLite)
-- =====================================================================
-- Ce fichier est généré automatiquement par :
--   node supabase/scripts/extract_sqlite_passwords.mjs
--
-- Source : C:/Users/Laurent/Desktop/bisecco-PROJET/bisecco-PROJET/database/database.sqlite
--
-- Écrase les hashes actuels en base Supabase par ceux de la V1 locale,
-- pour que tes utilisateurs puissent se connecter avec leur vrai mot de passe.
--
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- =====================================================================

`;

writeFileSync(OUT_PATH, header + updates.join("\n") + "\n");
console.log(`✓ Écrit dans ${OUT_PATH}`);

// Vérification rapide
const sample = rows.find((r) => r.email.toLowerCase() === "bisecco.support@gmail.com");
if (sample) {
  console.log("\nHash de bisecco.support@gmail.com :", sample.password.slice(0, 20) + "...");
}

db.close();
