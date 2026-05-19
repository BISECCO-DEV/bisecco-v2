#!/usr/bin/env node
/**
 * Reset le mot de passe d'un user (admin par défaut) dans la SQLite V1,
 * et regénère le SQL d'UPDATE pour Supabase.
 *
 * Usage :
 *   node supabase/scripts/reset_admin_password.mjs
 */

import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { writeFileSync } from "node:fs";
import { stdin, stdout } from "node:process";

const rl = readline.createInterface({ input: stdin, output: stdout });

const defaultEmail = "bisecco.support@gmail.com";
const inputEmail = (await rl.question(`Email du compte à réinitialiser [${defaultEmail}] : `)).trim();
const email = inputEmail || defaultEmail;

const password = await rl.question("Nouveau mot de passe (8 caractères min) : ");
if (password.length < 8) {
  console.log("❌ Mot de passe trop court (8 caractères minimum).");
  rl.close();
  process.exit(1);
}

const confirm = await rl.question("Confirme le mot de passe : ");
if (confirm !== password) {
  console.log("❌ Les mots de passe ne correspondent pas.");
  rl.close();
  process.exit(1);
}

rl.close();

// 1) Générer le hash en $2y$ (compatible Laravel)
const hash2a = bcrypt.hashSync(password, 12);
const hash = "$2y$" + hash2a.slice(4);

console.log("\n✓ Hash généré :", hash);

// 2) Mettre à jour le SQLite V1
const sqlitePath = "C:/Users/Laurent/Desktop/bisecco-PROJET/bisecco-PROJET/database/database.sqlite";
const db = new Database(sqlitePath);
const result = db
  .prepare("UPDATE users SET password = ?, remember_token = NULL, updated_at = datetime('now') WHERE lower(email) = lower(?)")
  .run(hash, email);
db.close();

if (result.changes === 0) {
  console.log(`❌ Email "${email}" non trouvé dans SQLite. Aucune modification.`);
  process.exit(1);
}

console.log(`✓ SQLite V1 mis à jour (${result.changes} ligne).`);

// 3) Regénérer aussi le SQL pour Supabase (juste cet user)
function esc(s) { return s.replace(/'/g, "''"); }
const sqlLine = `UPDATE public.users SET password = '${esc(hash)}' WHERE lower(email) = '${esc(email.toLowerCase())}';`;

const supabaseSqlPath = "db/014_reset_admin_password.sql";
const content = `-- =====================================================================
-- 014 — Reset du mot de passe admin (mdp connu, partagé V1+V2)
-- =====================================================================
-- Généré automatiquement par : node supabase/scripts/reset_admin_password.mjs
-- Email : ${email}
-- =====================================================================

${sqlLine}
`;

writeFileSync(supabaseSqlPath, content);
console.log(`✓ SQL Supabase écrit dans ${supabaseSqlPath}`);

console.log("\n=== Récapitulatif ===");
console.log(`Email     : ${email}`);
console.log(`Nouveau mdp : ${password}`);
console.log(`\nÉtapes suivantes :`);
console.log(`  1. Connecte-toi sur V1 local avec ${email} + ce nouveau mdp → doit marcher ✅`);
console.log(`  2. Applique db/014_reset_admin_password.sql dans Supabase Dashboard → SQL Editor`);
console.log(`  3. Connecte-toi sur V2 (localhost:3000/connexion) → l'auto-migration créera ton compte Auth → ✅`);
