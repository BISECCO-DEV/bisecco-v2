#!/usr/bin/env node
/**
 * Test interactif : prompt pour email + password (pas de problème d'échappement shell).
 *
 * Usage :
 *   node supabase/scripts/test_password_interactive.mjs
 */

import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = readline.createInterface({ input: stdin, output: stdout });

const email = (await rl.question("Email V1 : ")).trim();
const password = await rl.question("Mot de passe V1 (visible à l'écran) : ");

rl.close();

const db = new Database(
  "C:/Users/Laurent/Desktop/bisecco-PROJET/bisecco-PROJET/database/database.sqlite",
  { readonly: true },
);

const row = db
  .prepare("SELECT id, email, password FROM users WHERE lower(email) = lower(?) LIMIT 1")
  .get(email);

db.close();

if (!row) {
  console.log(`\n❌ Email "${email}" non trouvé dans SQLite.`);
  process.exit(1);
}

console.log("\n--- Diagnostic ---");
console.log("Email DB        :", row.email);
console.log("Mdp tapé        :", JSON.stringify(password), `(${password.length} caractères)`);
console.log("Hash trouvé     :", row.password);

const ok = bcrypt.compareSync(password, row.password);
const okNorm = bcrypt.compareSync(password, row.password.replace(/^\$2y\$/, "$2a$"));

console.log("\nbcrypt compare ($2y$):", ok ? "✅ MATCH" : "❌");
console.log("bcrypt compare ($2a$):", okNorm ? "✅ MATCH" : "❌");

if (!ok && !okNorm) {
  console.log("\n⚠️  Le mot de passe tapé ne correspond pas au hash en SQLite.");
  console.log("   Soit le mdp est différent, soit le hash n'est pas celui que V1 utilise.");
}
