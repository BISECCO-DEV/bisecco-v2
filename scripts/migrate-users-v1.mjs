#!/usr/bin/env node
/**
 * Migration des comptes V1 (MySQL Laravel) vers V2 (Supabase Auth + public.users).
 *
 * USAGE:
 *   1. Exporter la table 'users' V1 depuis phpMyAdmin (CSV, avec entêtes)
 *   2. Sauvegarder dans `scripts/users-v1.csv`
 *   3. Lancer: node scripts/migrate-users-v1.mjs
 *   4. Copier-coller le SQL généré dans Supabase SQL Editor → Run
 *
 * Garantit:
 *   - Hash bcrypt Laravel ($2y$...) → utilisé tel quel dans Supabase auth.users
 *   - Les users se connectent avec leur mdp actuel (zéro friction)
 *   - Email_confirmed_at = NOW() pour bypass email verification
 *   - Mirror dans public.users avec name, role, validation_status, siren, etc.
 *
 * Pré-requis colonnes CSV V1 (case-sensitive):
 *   - email (obligatoire)
 *   - password (hash bcrypt, $2y$ ou $2a$ ou $2b$)
 *   - name
 *   - role (artisan|particulier|admin)
 *   - validation_status (pending|approved|rejected)
 *   - siren (optionnel)
 *   - phone (optionnel)
 *   - city (optionnel)
 *   - client_number (optionnel)
 *   - referral_code (optionnel)
 *   - created_at (optionnel)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dirname, "users-v1.csv");
const SQL_OUT = join(__dirname, "users-v1-migration.sql");

if (!existsSync(CSV_PATH)) {
  console.error(`❌ Fichier introuvable : ${CSV_PATH}`);
  console.error(`   Exporte la table users V1 depuis phpMyAdmin et place le CSV ici.`);
  process.exit(1);
}

const raw = readFileSync(CSV_PATH, "utf8").replace(/^﻿/, "");
const lines = raw.split(/\r?\n/).filter(Boolean);
if (lines.length < 2) {
  console.error("❌ CSV vide ou pas d'entêtes.");
  process.exit(1);
}

// Parse CSV (basique mais gère les guillemets)
function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
const rows = lines.slice(1).map((line) => {
  const cells = parseCsvLine(line);
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = (cells[i] ?? "").trim().replace(/^"|"$/g, "");
  });
  return obj;
});

console.log(`📥 ${rows.length} comptes trouvés dans le CSV V1`);

// Validation
const required = ["email", "password"];
const missing = required.filter((r) => !headers.includes(r));
if (missing.length > 0) {
  console.error(`❌ Colonnes manquantes : ${missing.join(", ")}`);
  console.error(`   Colonnes trouvées : ${headers.join(", ")}`);
  process.exit(1);
}

// SQL escape
const esc = (v) => {
  if (v == null || v === "" || v === "NULL") return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
};

const lines_sql = [];
lines_sql.push(`-- ============================================================`);
lines_sql.push(`-- Migration users V1 (Laravel/MySQL) → V2 (Supabase Auth + public.users)`);
lines_sql.push(`-- Généré le ${new Date().toISOString()}`);
lines_sql.push(`-- ${rows.length} comptes à migrer`);
lines_sql.push(`-- ============================================================`);
lines_sql.push(``);
lines_sql.push(`-- Crée une transaction (rollback automatique si erreur)`);
lines_sql.push(`BEGIN;`);
lines_sql.push(``);

let imported = 0;
let skipped = 0;

for (const u of rows) {
  if (!u.email || !u.password) {
    skipped++;
    continue;
  }

  // Normalise hash bcrypt Laravel ($2y$) en $2a$ (Supabase peut comprendre les deux)
  let hash = u.password;
  if (hash.startsWith("$2y$")) {
    hash = "$2a$" + hash.slice(4);
  }
  if (!hash.startsWith("$2a$") && !hash.startsWith("$2b$")) {
    console.warn(`⚠️  Hash invalide pour ${u.email}, skip`);
    skipped++;
    continue;
  }

  const email = u.email.toLowerCase().trim();
  const name = u.name || email.split("@")[0];
  const role = ["artisan", "particulier", "admin", "super_admin"].includes(u.role) ? u.role : "particulier";
  const validationStatus = ["pending", "approved", "rejected"].includes(u.validation_status)
    ? u.validation_status
    : (role === "particulier" ? "approved" : "pending");
  const createdAt = u.created_at && u.created_at !== "NULL" && u.created_at !== "0000-00-00 00:00:00"
    ? u.created_at
    : new Date().toISOString();

  lines_sql.push(`-- ─── ${email} (${role}) ───`);

  // 1. INSERT dans auth.users — WHERE NOT EXISTS car auth.users n'a pas
  //    de contrainte unique standard sur email (pattern multi-instance Supabase)
  lines_sql.push(`INSERT INTO auth.users (`);
  lines_sql.push(`  instance_id, id, aud, role, email, encrypted_password,`);
  lines_sql.push(`  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,`);
  lines_sql.push(`  is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token`);
  lines_sql.push(`)`);
  lines_sql.push(`SELECT`);
  lines_sql.push(`  '00000000-0000-0000-0000-000000000000'::uuid, gen_random_uuid(), 'authenticated', 'authenticated',`);
  lines_sql.push(`  ${esc(email)}, ${esc(hash)},`);
  lines_sql.push(`  NOW(), '{"provider":"email","providers":["email"]}'::jsonb,`);
  lines_sql.push(`  ${esc(JSON.stringify({ name, migrated_from: "v1" }))}::jsonb,`);
  lines_sql.push(`  ${esc(createdAt)}, NOW(),`);
  lines_sql.push(`  FALSE, '', '', '', ''`);
  lines_sql.push(`WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = ${esc(email)});`);

  // 2. INSERT dans public.users (mirror profile)
  //    NOTE: client_number et referral_code = NULL pour éviter UNIQUE conflicts
  //    avec des comptes test déjà créés sur V2. V2 régénérera à la connexion.
  lines_sql.push(`INSERT INTO public.users (`);
  lines_sql.push(`  email, name, role, validation_status, password,`);
  lines_sql.push(`  phone, city, siren, email_verified_at, created_at, updated_at`);
  lines_sql.push(`)`);
  lines_sql.push(`VALUES (`);
  lines_sql.push(`  ${esc(email)}, ${esc(name)}, ${esc(role)}, ${esc(validationStatus)}, ${esc(hash)},`);
  lines_sql.push(`  ${esc(u.phone)}, ${esc(u.city)}, ${esc(u.siren)},`);
  lines_sql.push(`  NOW(), ${esc(createdAt)}, NOW()`);
  lines_sql.push(`)`);
  lines_sql.push(`ON CONFLICT (email) DO NOTHING;`);
  lines_sql.push(``);

  imported++;
}

lines_sql.push(`COMMIT;`);
lines_sql.push(``);
lines_sql.push(`-- Vérification rapide :`);
lines_sql.push(`-- SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'migrated_from' = 'v1';`);
lines_sql.push(`-- SELECT email, role, validation_status FROM public.users ORDER BY id DESC LIMIT 30;`);

const sql = lines_sql.join("\n");
writeFileSync(SQL_OUT, sql, "utf8");

console.log(`\n✓ ${imported} comptes prêts à migrer (${skipped} ignorés)`);
console.log(`\n📄 SQL généré : ${SQL_OUT}`);
console.log(`\n📋 Prochaine étape :`);
console.log(`   1. Ouvre le fichier ${SQL_OUT}`);
console.log(`   2. Copie tout le contenu`);
console.log(`   3. Colle dans Supabase Dashboard → SQL Editor → New query → Run`);
console.log(`   4. Les users V1 peuvent maintenant se connecter avec leur mdp actuel sur V2 🎉`);
