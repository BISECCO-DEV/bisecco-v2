/**
 * Point d'entrée Node.js pour cPanel o2switch.
 *
 * cPanel "Setup Node.js App" exige un fichier .js comme entrypoint.
 * Next.js standalone n'expose pas de fichier .js direct, donc on wrap
 * `next start` via le HTTP server natif.
 *
 * Le port est injecté par cPanel via process.env.PORT.
 */
const next = require("next");
const http = require("http");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

// Force production (cPanel set NODE_ENV=production automatiquement)
process.env.NODE_ENV = "production";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res).catch((err) => {
      console.error("[server] handle error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    });
  }).listen(port, () => {
    console.log(`[bisecco-v2] ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error("[server] Next.js failed to prepare:", err);
  process.exit(1);
});
