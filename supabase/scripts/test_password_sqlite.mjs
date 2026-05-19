#!/usr/bin/env node
/**
 * Test rapide : vérifie un mot de passe contre le hash SQLite V1 locale.
 *
 * Usage :
 *   node supabase/scripts/test_password_sqlite.mjs <email> <password>
 */

import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error("Usage: node supabase/scripts/test_password_sqlite.mjs <email> <password>");
  process.exit(1);
}

const db = new Database(
  "C:/Users/Laurent/Desktop/bisecco-PROJET/bisecco-PROJET/database/database.sqlite",
  { readonly: true },
);

const row = db
  .prepare("SELECT email, password FROM users WHERE lower(email) = lower(?) LIMIT 1")
  .get(email);

db.close();

if (!row) {
  console.log(`❌ Email "${email}" non trouvé dans SQLite.`);
  process.exit(1);
}

console.log("Email DB    :", row.email);
console.log("Hash trouvé :", row.password);
console.log("Préfixe     :", row.password.slice(0, 7));
console.log();

const tries = [
  { label: "tel quel ($2y$)", h: row.password },
  { label: "normalisé en $2a$", h: row.password.replace(/^\$2y\$/, "$2a$") },
];

for (const t of tries) {
  const ok = bcrypt.compareSync(password, t.h);
  console.log(`  ${ok ? "✅" : "❌"} ${t.label}`);
}
