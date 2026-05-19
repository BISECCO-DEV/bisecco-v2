#!/usr/bin/env node
/**
 * Test rapide : un mot de passe match-il le hash en base d'un email donné ?
 *
 * Usage :
 *   node supabase/scripts/test_password.mjs <email> <password>
 *
 * Exemple :
 *   node supabase/scripts/test_password.mjs bisecco.support@gmail.com MonMotDePasseV1
 */

import { readFileSync } from "node:fs";
import bcrypt from "bcryptjs";

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error("Usage: node supabase/scripts/test_password.mjs <email> <password>");
  process.exit(1);
}

const csv = readFileSync("supabase/dumps/v1_passwords_fresh.csv", "utf-8");

// Trouve la ligne du user
const re = new RegExp(`'(\\$2[ayb]\\$[^']+)'\\s+WHERE\\s+lower\\(email\\)\\s+=\\s+'${email.toLowerCase().replace(/[.+]/g, "\\$&")}'`);
const match = csv.match(re);

if (!match) {
  console.log(`❌ Email "${email}" non trouvé dans le CSV.`);
  process.exit(1);
}

const hash = match[1];
console.log("Hash trouvé :", hash);
console.log("Préfixe     :", hash.slice(0, 7));
console.log();

const tries = [
  { label: "tel quel ($2y$)", h: hash },
  { label: "normalisé en $2a$", h: hash.startsWith("$2y$") ? "$2a$" + hash.slice(4) : hash },
  { label: "normalisé en $2b$", h: hash.startsWith("$2y$") ? "$2b$" + hash.slice(4) : hash },
];

for (const t of tries) {
  try {
    const ok = bcrypt.compareSync(password, t.h);
    console.log(`  ${ok ? "✅" : "❌"} ${t.label}: ${ok}`);
  } catch (e) {
    console.log(`  ⚠️  ${t.label}: erreur — ${e.message}`);
  }
}
