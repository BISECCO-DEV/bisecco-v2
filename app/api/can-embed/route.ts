import { NextResponse } from "next/server";

/**
 * /api/can-embed?url=https://example.com
 *
 * Vérifie côté serveur si une URL peut être chargée dans une iframe Bisecco
 * en analysant ses headers HTTP :
 *
 *  - X-Frame-Options: DENY        → bloqué
 *  - X-Frame-Options: SAMEORIGIN  → bloqué (origine ≠ bisecco.eu)
 *  - X-Frame-Options: ALLOW-FROM  → bloqué sauf si bisecco.eu listé
 *  - Content-Security-Policy: frame-ancestors 'none' / 'self' → bloqué
 *
 * Utilisé par InAppLinkViewer avant d'instancier l'iframe : si le site
 * refuse l'embed, on évite l'iframe vide et on affiche directement la carte
 * OG avec bouton "Ouvrir dans le navigateur".
 *
 * Cache 1h pour éviter de re-checker la même URL en boucle.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 4000;

type Result = { canEmbed: boolean; reason?: string };

// Liste de hosts connus pour bloquer systématiquement (raccourci, économise un HEAD)
const KNOWN_BLOCKED_HOSTS = new Set<string>([
  "laposte.fr",
  "facebook.com",
  "www.facebook.com",
  "instagram.com",
  "www.instagram.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "www.linkedin.com",
  "youtube.com",
  "www.youtube.com",
  "google.com",
  "www.google.com",
  "amazon.fr",
  "www.amazon.fr",
  "amazon.com",
  "www.amazon.com",
  "leboncoin.fr",
  "www.leboncoin.fr",
  "pap.fr",
  "www.pap.fr",
  "seloger.com",
  "www.seloger.com",
  "github.com",
  "www.github.com",
]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) return NextResponse.json({ canEmbed: false, reason: "missing-url" });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ canEmbed: false, reason: "invalid-url" });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ canEmbed: false, reason: "bad-protocol" });
  }

  const host = parsed.hostname.toLowerCase();
  if (KNOWN_BLOCKED_HOSTS.has(host) || KNOWN_BLOCKED_HOSTS.has(host.replace(/^www\./, ""))) {
    return NextResponse.json(
      { canEmbed: false, reason: "known-blocked" } as Result,
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    // HEAD pour économiser la bande passante. Certains serveurs répondent 405,
    // dans ce cas on retombe sur un GET.
    let res = await fetch(target, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BiseccoEmbedChecker/1.0; +https://bisecco.eu)",
      },
    });

    if (res.status === 405 || res.status === 501) {
      res = await fetch(target, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BiseccoEmbedChecker/1.0; +https://bisecco.eu)",
        },
      });
      // On consomme le body pour ne pas leaker (mais on ne lit que peu)
      try {
        await res.body?.cancel();
      } catch {
        /* ignore */
      }
    }

    const xfo = res.headers.get("x-frame-options")?.toLowerCase().trim() ?? "";
    const csp = res.headers.get("content-security-policy")?.toLowerCase() ?? "";

    if (xfo.includes("deny") || xfo.includes("sameorigin")) {
      return jsonResult({ canEmbed: false, reason: `x-frame-options:${xfo}` });
    }
    if (xfo.startsWith("allow-from")) {
      const allowed = xfo.replace(/^allow-from\s*/, "").trim();
      if (!allowed.includes("bisecco.eu") && !allowed.includes("bisecco.fr")) {
        return jsonResult({ canEmbed: false, reason: `x-frame-options:${xfo}` });
      }
    }

    if (csp.includes("frame-ancestors")) {
      const ancestorsMatch = csp.match(/frame-ancestors\s+([^;]+)/);
      const directive = ancestorsMatch?.[1] ?? "";
      if (
        directive.includes("'none'") ||
        (directive.includes("'self'") &&
          !directive.includes("bisecco.eu") &&
          !directive.includes("bisecco.fr"))
      ) {
        return jsonResult({ canEmbed: false, reason: "csp:frame-ancestors" });
      }
      // 'self' contient bisecco → OK. Sinon vérifie *
      if (
        !directive.includes("*") &&
        !directive.includes("bisecco.eu") &&
        !directive.includes("bisecco.fr") &&
        !directive.includes("'self'")
      ) {
        return jsonResult({ canEmbed: false, reason: "csp:no-bisecco" });
      }
    }

    return jsonResult({ canEmbed: true });
  } catch {
    // Erreur réseau / timeout → on suppose bloqué pour éviter d'attendre 3.5s dans l'iframe
    return jsonResult({ canEmbed: false, reason: "fetch-error" });
  } finally {
    clearTimeout(timeout);
  }
}

function jsonResult(r: Result) {
  return NextResponse.json(r, {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
