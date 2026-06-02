import { NextResponse } from "next/server";

/**
 * /api/link-preview?url=https://example.com
 *
 * Fetch server-side la page cible et extrait ses metadata Open Graph
 * (og:title, og:description, og:image, og:site_name) + favicon.
 *
 * Utilisé par InAppLinkViewer pour afficher une carte d'aperçu style
 * Twitter/LinkedIn quand un user clique un lien externe dans le fil Actu.
 *
 * Sécurité : seules les URLs http(s) publiques sont fetchées, avec un
 * timeout de 5 sec et une taille max de réponse de 1 Mo (lit les 1ers
 * 50 Ko qui suffisent largement pour les balises meta du <head>).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 5000;
const MAX_BYTES = 50_000;

type Preview = {
  url: string;
  finalUrl: string;
  host: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon: string;
};

function pickMeta(html: string, names: string[]): string | undefined {
  for (const n of names) {
    // <meta property="og:title" content="..."> ou name="..."
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${n}["'][^>]+content=["']([^"']+)["']`,
      "i",
    );
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]).trim();
    // Forme inverse : content avant property
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${n}["']`,
      "i",
    );
    const m2 = html.match(re2);
    if (m2?.[1]) return decodeEntities(m2[1]).trim();
  }
  return undefined;
}

function pickTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1]).trim() : undefined;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function resolveUrl(maybeRel: string, base: string): string {
  try {
    return new URL(maybeRel, base).href;
  } catch {
    return maybeRel;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Only http(s) allowed" }, { status: 400 });
  }

  const host = parsed.hostname.replace(/^www\./, "");
  const favicon = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(target, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BiseccoPreviewBot/1.0; +https://bisecco.fr)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok || !res.body) {
      const preview: Preview = { url: target, finalUrl: res.url || target, host, favicon };
      return NextResponse.json(preview, { headers: { "Cache-Control": "public, max-age=3600" } });
    }

    // Lecture limitée à 50 Ko (les balises meta sont dans le head, premières lignes)
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8", { fatal: false });
    let html = "";
    let read = 0;
    while (read < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      read += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (html.toLowerCase().includes("</head>")) break;
    }
    try {
      reader.cancel();
    } catch {
      /* ignore */
    }

    const title =
      pickMeta(html, ["og:title", "twitter:title"]) ?? pickTitle(html);
    const description = pickMeta(html, [
      "og:description",
      "twitter:description",
      "description",
    ]);
    const rawImage = pickMeta(html, ["og:image", "og:image:url", "twitter:image"]);
    const image = rawImage ? resolveUrl(rawImage, res.url || target) : undefined;
    const siteName = pickMeta(html, ["og:site_name", "application-name"]);

    const preview: Preview = {
      url: target,
      finalUrl: res.url || target,
      host,
      title,
      description,
      image,
      siteName,
      favicon,
    };

    return NextResponse.json(preview, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    });
  } catch {
    const preview: Preview = { url: target, finalUrl: target, host, favicon };
    return NextResponse.json(preview, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
