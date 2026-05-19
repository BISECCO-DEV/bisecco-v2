#!/usr/bin/env node
/**
 * Extrait les emails + hashes bcrypt Laravel depuis le dump MySQL d'origine,
 * et génère un fichier SQL d'UPDATEs à appliquer dans Supabase pour restaurer
 * la colonne `password` qui a été perdue lors de l'import.
 *
 * Usage :
 *   node supabase/scripts/restore_passwords.mjs
 *
 * Output : db/012_restore_legacy_passwords.sql
 */

import { readFileSync, writeFileSync } from "node:fs";

const DUMP_PATH = "supabase/dumps/bisecco_db.sql";
const OUT_PATH = "db/012_restore_legacy_passwords.sql";

const sql = readFileSync(DUMP_PATH, "utf-8");

// Trouver le bloc INSERT INTO `users` (ne pas confondre avec password_reset_tokens etc.)
const insertMatch = sql.match(/INSERT INTO `users`[\s\S]*?VALUES\s*([\s\S]*?);/);
if (!insertMatch) {
  console.error("Impossible de trouver INSERT INTO `users` dans le dump.");
  process.exit(1);
}

const valuesBlock = insertMatch[1];

// Parser chaque tuple. Les tuples sont entre parenthèses, séparés par "),\n("
// On simplifie en split sur "),\n(" puis on rajoute les paren.
const tuples = valuesBlock
  .trim()
  .replace(/^\(/, "")
  .replace(/\)$/, "")
  .split(/\),\s*\(/);

console.log(`${tuples.length} tuples détectés.`);

// Parser CSV-style en respectant les quotes simples MySQL et NULL
function parseTuple(raw) {
  const out = [];
  let i = 0;
  while (i < raw.length) {
    while (raw[i] === " " || raw[i] === ",") i++;
    if (i >= raw.length) break;

    if (raw[i] === "'") {
      // String literal, avec échappement \' et ''
      let val = "";
      i++; // skip opening quote
      while (i < raw.length) {
        const c = raw[i];
        if (c === "\\" && i + 1 < raw.length) {
          // Échappement MySQL : \' \" \\ \n etc.
          const next = raw[i + 1];
          if (next === "'") { val += "'"; i += 2; continue; }
          if (next === '"') { val += '"'; i += 2; continue; }
          if (next === "\\") { val += "\\"; i += 2; continue; }
          if (next === "n") { val += "\n"; i += 2; continue; }
          if (next === "r") { val += "\r"; i += 2; continue; }
          if (next === "t") { val += "\t"; i += 2; continue; }
          if (next === "0") { val += "\0"; i += 2; continue; }
          val += next;
          i += 2;
          continue;
        }
        if (c === "'") {
          // Double quote = single quote literal en MySQL
          if (raw[i + 1] === "'") {
            val += "'";
            i += 2;
            continue;
          }
          i++; // closing quote
          break;
        }
        val += c;
        i++;
      }
      out.push(val);
    } else if (raw.slice(i, i + 4).toUpperCase() === "NULL") {
      out.push(null);
      i += 4;
    } else {
      // Number ou autre token sans quote
      let val = "";
      while (i < raw.length && raw[i] !== "," && raw[i] !== ")") {
        val += raw[i];
        i++;
      }
      val = val.trim();
      out.push(val === "" ? null : Number.isFinite(Number(val)) ? Number(val) : val);
    }
  }
  return out;
}

// Schéma de la table users dans le dump (cf. INSERT INTO `users` (`id`, ...))
const COLS = [
  "id", "client_number", "name", "email", "email_verified_at", "password",
  "oauth_provider", "oauth_id", "role", "phone", "city", "description", "siren",
  "validation_status", "validated_at", "validated_by", "rejection_reason",
  "profile_photo", "cover_photo", "remember_token", "created_at", "updated_at",
  "stripe_id", "pm_type", "pm_last_four", "trial_ends_at",
  "siren_status", "siren_last_checked_at", "siren_closed_at", "deleted_at",
];

function escapeSqlString(s) {
  return s.replace(/'/g, "''");
}

const updates = [];
let withPasswords = 0;
let withoutPasswords = 0;

for (const tupleRaw of tuples) {
  const fields = parseTuple(tupleRaw);
  const row = {};
  COLS.forEach((col, idx) => {
    row[col] = fields[idx];
  });

  if (!row.email) continue;

  if (row.password && typeof row.password === "string" && row.password.length > 20) {
    withPasswords++;
    updates.push(
      `UPDATE public.users SET password = '${escapeSqlString(row.password)}' WHERE lower(email) = '${escapeSqlString(row.email.toLowerCase())}' AND password IS NULL;`,
    );
  } else {
    withoutPasswords++;
  }
}

console.log(`✓ ${withPasswords} users avec password à restaurer.`);
console.log(`  ${withoutPasswords} users sans password dans le dump (OAuth, etc.).`);

const header = `-- =====================================================================
-- 012 — Restaure les hashes bcrypt Laravel des utilisateurs V1
-- =====================================================================
-- Ce fichier est généré automatiquement par :
--   node supabase/scripts/restore_passwords.mjs
--
-- Il restaure la colonne public.users.password (perdue lors de l'import)
-- à partir du dump MySQL d'origine, pour permettre l'auto-migration au login.
--
-- À appliquer dans Supabase Dashboard → SQL Editor.
-- Idempotent : ne met à jour que les lignes où password IS NULL.
-- =====================================================================

`;

writeFileSync(OUT_PATH, header + updates.join("\n") + "\n");
console.log(`✓ Écrit dans ${OUT_PATH}`);
