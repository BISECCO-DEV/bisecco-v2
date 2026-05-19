#!/usr/bin/env node
/**
 * Vérification sanity de bcryptjs :
 *  1) Génère un hash $2y$ pour un mot de passe connu
 *  2) Vérifie qu'on peut le re-comparer correctement
 *  3) Teste aussi la compatibilité $2y$ ↔ $2a$
 */
import bcrypt from "bcryptjs";

const pwd = "TestSecret123!";

console.log("=== Sanity bcryptjs ===\n");
console.log("Mot de passe testé :", pwd);

// 1) Génération $2a$ standard
const hash2a = bcrypt.hashSync(pwd, 12);
console.log("\nGénéré ($2a$) :", hash2a);
console.log("compare($2a$)  :", bcrypt.compareSync(pwd, hash2a) ? "✅" : "❌");

// 2) Test avec préfixe $2y$ artificiel (comme Laravel)
const hash2y = "$2y$" + hash2a.slice(4);
console.log("\nMême hash avec préfixe $2y$ :", hash2y);
console.log("compare($2y$)  :", bcrypt.compareSync(pwd, hash2y) ? "✅" : "❌");

// 3) Test avec mauvais mdp
console.log("\nMauvais mdp 'wrong' :");
console.log("compare($2a$)  :", bcrypt.compareSync("wrong", hash2a) ? "❌ (faux positif!)" : "✅ (rejette bien)");

// 4) Test sur le vrai hash de bisecco.support
const realHash = "$2y$12$8fIGdK9A13keHCvj74TZs.K10Lny8NkYkClXxFLHchumyGBKMDjLy";
console.log("\nHash de bisecco.support@gmail.com :", realHash);
console.log("→ teste quelques candidats triviaux :");
for (const candidate of ["admin", "password", "bisecco", "Bisecco", "Bisecco123"]) {
  console.log(`  "${candidate}" →`, bcrypt.compareSync(candidate, realHash) ? "✅ MATCH" : "❌");
}

console.log("\n=== Fin ===");
