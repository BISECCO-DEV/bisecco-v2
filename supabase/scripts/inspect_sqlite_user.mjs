import Database from "better-sqlite3";

const db = new Database(
  "C:/Users/Laurent/Desktop/bisecco-PROJET/bisecco-PROJET/database/database.sqlite",
  { readonly: true },
);

console.log("=== Tous les users en SQLite ===\n");
const rows = db.prepare("SELECT id, email, role, created_at, updated_at, password FROM users ORDER BY id").all();
for (const r of rows) {
  console.log(`id=${r.id} | ${r.email} | role=${r.role} | updated=${r.updated_at}`);
  console.log(`  hash: ${r.password ? r.password.slice(0, 35) + "..." : "NULL"}`);
}

console.log("\n=== Détail bisecco.support@gmail.com ===");
const target = db.prepare("SELECT * FROM users WHERE lower(email) = 'bisecco.support@gmail.com'").get();
if (target) {
  console.log("id          :", target.id);
  console.log("created_at  :", target.created_at);
  console.log("updated_at  :", target.updated_at);
  console.log("password    :", target.password);
} else {
  console.log("Pas trouvé !");
}

db.close();
