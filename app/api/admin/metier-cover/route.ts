import { NextResponse } from "next/server";
import { requireDbAdmin } from "@/lib/auth/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "metier-covers";
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

// Mots-clés courants FR → EN pour Pixabay
const METIER_KEYWORDS: Record<string, string> = {
  "Plombier": "plumber tools",
  "Électricien": "electrician work",
  "Maçon": "mason bricks",
  "Peintre": "painter wall",
  "Menuisier": "carpenter wood",
  "Couvreur": "roofer roof",
  "Boulanger": "baker bread",
  "Pâtissier": "pastry chef",
  "Boucher": "butcher meat",
  "Coiffeur": "hairdresser salon",
  "Restaurant": "restaurant dining",
  "Pub": "pub bar irish",
  "Bar": "cocktail bar drinks",
  "Marchand de biens": "real estate house keys",
  "Promoteur immobilier": "construction building development",
  "Cuisinier": "chef cooking",
  "Comptable": "accountant office",
};

function stripAccents(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function keywordsCascade(name: string): string[] {
  const cascade: string[] = [];
  if (METIER_KEYWORDS[name]) cascade.push(METIER_KEYWORDS[name]);
  cascade.push(stripAccents(name));
  const firstWord = stripAccents(name.split(/[\s-]/)[0]);
  if (firstWord && firstWord.length > 3) cascade.push(`${firstWord} work`);
  cascade.push("craftsman workshop", "artisan work hands");
  return Array.from(new Set(cascade));
}

async function fetchFromPixabay(metierName: string): Promise<{ buffer: Buffer; source: "pixabay" } | null> {
  if (!PIXABAY_API_KEY) return null;
  const cascade = keywordsCascade(metierName);
  for (const keywords of cascade) {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(keywords)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&min_width=1280`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.hits || data.hits.length === 0) continue;
      // Pick aléatoire dans le top 20 pour varier à chaque régénération
      const pick = data.hits[Math.floor(Math.random() * Math.min(20, data.hits.length))];
      const imageUrl = pick.largeImageURL ?? pick.webformatURL;
      const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30_000) });
      if (!imgRes.ok) continue;
      return { buffer: Buffer.from(await imgRes.arrayBuffer()), source: "pixabay" };
    } catch {
      // try next cascade
    }
  }
  return null;
}

async function fetchFromPollinations(metierName: string, seed: number): Promise<{ buffer: Buffer; source: "pollinations" } | null> {
  const prompt =
    `Professional photography of a ${metierName.toLowerCase()} at work, modern workshop, ` +
    `cinematic, no faces visible, photorealistic`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${seed}`;
  try {
    const res = await fetch(url, { headers: { Accept: "image/*" }, signal: AbortSignal.timeout(60_000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 5000) return null;
    return { buffer: buf, source: "pollinations" };
  } catch {
    return null;
  }
}

/**
 * Régénère la cover d'un métier précis.
 *
 * POST /api/admin/metier-cover
 * Body: { slug: "plombier" }
 *
 * Stratégie : Pixabay (vraies photos pro) → Pollinations (AI fallback).
 * À chaque appel : nouvelle photo dans le top 20 Pixabay (random) ou nouveau seed AI.
 *
 * Sécurité : admin uniquement.
 */
export async function POST(request: Request) {
  try {
    await requireDbAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  let body: { slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body JSON invalide" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug manquant" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: metier, error: metierErr } = await supabase
    .from("metiers")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();
  if (metierErr || !metier) {
    return NextResponse.json({ ok: false, error: "Métier introuvable" }, { status: 404 });
  }

  // 1. Pixabay puis fallback Pollinations
  type FetchResult = { buffer: Buffer; source: "pixabay" | "pollinations" } | null;
  let result: FetchResult = await fetchFromPixabay(metier.name);
  if (!result) {
    const seed = Math.floor(Math.random() * 1_000_000) + metier.id;
    result = await fetchFromPollinations(metier.name, seed);
  }

  if (!result) {
    const reason = PIXABAY_API_KEY
      ? "Pixabay + Pollinations ont échoué (timeout ou pas de résultat)"
      : "PIXABAY_API_KEY manquante côté serveur et Pollinations a échoué";
    return NextResponse.json({ ok: false, error: reason }, { status: 502 });
  }

  // Upload
  const fileName = `${metier.slug}.jpg`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, result.buffer, {
      contentType: "image/jpeg",
      upsert: true,
      cacheControl: "31536000",
    });
  if (upErr) {
    return NextResponse.json({ ok: false, error: `Storage : ${upErr.message}` }, { status: 500 });
  }

  // URL publique + cache buster pour forcer le refresh client
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  const url = `${pub.publicUrl}?v=${Date.now()}`;

  const { error: updErr } = await supabase
    .from("metiers")
    .update({
      cover_url: url,
      cover_alt: `Photo illustrative d'un ${metier.name.toLowerCase()} au travail`,
    })
    .eq("id", metier.id);
  if (updErr) {
    return NextResponse.json({ ok: false, error: `DB : ${updErr.message}` }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    slug: metier.slug,
    name: metier.name,
    cover_url: url,
    source: result.source,
    size_kb: Math.round(result.buffer.byteLength / 1024),
  });
}
