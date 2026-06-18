/**
 * Génère une image de couverture pour chaque métier.
 *
 * Stratégie en cascade :
 *   1. Pixabay (vraies photos pro · GRATUIT 5000 req/h)
 *   2. Pollinations.ai (AI Flux · GRATUIT illimité avec referrer)
 *
 * Setup préalable :
 *   1. Lancer la migration 025_add_metier_covers.sql dans Supabase Dashboard
 *   2. Créer le bucket public "metier-covers" dans Supabase Storage
 *   3. Créer un compte gratuit sur pixabay.com → API key
 *   4. Ajouter PIXABAY_API_KEY="ta_clé" dans .env.local
 *
 * Usage :
 *   node scripts/generate-metier-covers.mjs              → seulement les manquants
 *   node scripts/generate-metier-covers.mjs --force      → régénère TOUS
 *   node scripts/generate-metier-covers.mjs --slug=plombier → un seul métier
 *
 * Coût : 0€.
 * Temps : ~1-2 sec par image (Pixabay) ou ~5 sec (Pollinations fallback).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.warn("⚠️  .env.local introuvable — utilise les env vars système.");
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY dans .env.local");
  process.exit(1);
}

const BUCKET = "metier-covers";

// ─── Args CLI ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const SLUG_FILTER = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

// ─── Traduction métiers FR → mots-clés EN pour stock photos ───────────
const METIER_KEYWORDS = {
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
  "Barbier": "barber shop",
  "Restaurant": "restaurant dining",
  "Pub": "pub bar irish",
  "Bar": "cocktail bar drinks",
  "Marchand de biens": "real estate house keys",
  "Promoteur immobilier": "construction building development",
  "Cuisinier": "chef cooking",
  "Comptable": "accountant office",
  "Carreleur": "tiler tiles",
  "Plâtrier": "plasterer wall",
  "Soudeur": "welder metal",
  "Forgeron": "blacksmith forge",
  "Bijoutier": "jeweler workshop",
  "Cordonnier": "shoemaker leather",
  "Tailleur": "tailor sewing",
  "Couturier": "seamstress fabric",
  "Fleuriste": "florist flowers",
  "Photographe": "photographer camera",
  "Jardinier": "gardener garden",
  "Mécanicien": "mechanic garage",
  "Carrossier": "auto body shop",
  "Vitrier": "glazier glass",
  "Serrurier": "locksmith lock",
  "Chauffagiste": "heating engineer",
  "Frigoriste": "refrigeration technician",
  "Étancheur": "waterproofing roof",
  "Ravaleur": "facade renovation",
  "Apiculteur": "beekeeper bees",
  "Vigneron": "winemaker vineyard",
  "Fromager": "cheesemaker dairy",
  "Brasseur": "brewer beer",
  "Chocolatier": "chocolatier chocolate",
  "Glacier": "ice cream maker",
  "Charcutier": "charcutier sausage",
  "Poissonnier": "fishmonger fish",
  "Crémier": "dairy shop",
  "Caviste": "wine cellar",
  "Traiteur": "caterer food",
  "Pizzaiolo": "pizza chef",
  "Sommelier": "wine sommelier",
  "Tatoueur": "tattoo artist",
  "Esthéticienne": "beauty salon",
  "Manucure": "manicure nails",
  "Coiffeuse": "hair salon woman",
  "Masseuse": "massage therapy",
  "Naturopathe": "natural medicine",
  "Sophrologue": "relaxation therapy",
  "Osthéopate": "osteopath therapy",
  "Kinésithérapeute": "physiotherapy",
  "Podologue": "podiatrist foot",
  "Dentiste": "dentist office",
  "Vétérinaire": "veterinarian animal",
  "Toiletteur": "pet grooming",
  "Architecte": "architect blueprint",
  "Décorateur": "interior design",
  "Designer": "graphic design",
  "Développeur informatique": "developer coding",
  "Webdesigner": "web design",
  "Photographe mariage": "wedding photographer",
  "Vidéaste": "videographer camera",
  "DJ": "dj music",
  "Musicien": "musician guitar",
  "Accordeur de piano": "piano tuning",
  "Luthier": "luthier violin",
  "Tapissier": "upholsterer fabric",
  "Ébéniste": "cabinetmaker wood",
  "Sculpteur": "sculptor stone",
  "Vitrailliste": "stained glass artist",
  "Céramiste": "ceramic pottery",
  "Potier": "potter clay",
  "Verrier": "glass blower",
  "Doreur": "gold leaf craftsman",
  "Encadreur": "framing workshop",
  "Relieur": "bookbinder leather",
  "Calligraphe": "calligraphy ink",
  "Imprimeur": "printer printing",
  "Tatoueur": "tattoo studio",
  "Toiturier": "roofer tiles",
  "Couvreur-zingueur": "zinc roofing",
  "Charpentier": "carpenter beam",
  "Parqueteur": "parquet wood floor",
  "Marbrier": "marble stone",
  "Tailleur de pierre": "stone carver",
  "Façadier": "facade plaster",
  "Sols souples": "flooring installation",
  "Cuisiniste": "kitchen design",
  "Domoticien": "home automation",
  "Electroménagiste": "appliance repair",
};

function stripAccents(s) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function keywordsForMetier(name) {
  if (METIER_KEYWORDS[name]) return METIER_KEYWORDS[name];
  return `${stripAccents(name)} craftsman work`;
}

/**
 * Génère une liste de mots-clés à essayer en cascade pour Pixabay.
 * Du plus spécifique au plus générique.
 */
function keywordsCascade(name) {
  const cascade = [];
  // 1. Mapping manuel précis
  if (METIER_KEYWORDS[name]) cascade.push(METIER_KEYWORDS[name]);
  // 2. Nom complet sans accents
  cascade.push(stripAccents(name));
  // 3. Premier mot (ex: "Couvreur-zingueur" → "Couvreur")
  const firstWord = stripAccents(name.split(/[\s-]/)[0]);
  if (firstWord && firstWord.length > 3) cascade.push(`${firstWord} work`);
  // 4. Fallbacks génériques très larges
  cascade.push("craftsman workshop", "artisan work hands");
  return [...new Set(cascade)]; // dédup
}

// ─── Pixabay (primary) ─────────────────────────────────────────────────
let pixabayDiagnosed = false;

async function searchPixabay(keywords) {
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(keywords)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5&min_width=1280`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) {
    if (!pixabayDiagnosed) {
      const body = await res.text().catch(() => "");
      console.log(`\n   🔍 [DEBUG Pixabay] HTTP ${res.status} : ${body.slice(0, 200)}`);
      pixabayDiagnosed = true;
    }
    return { error: `http_${res.status}` };
  }
  const data = await res.json();
  if (!data.hits || data.hits.length === 0) return { error: "no_results" };
  return { hits: data.hits };
}

async function fetchFromPixabay(metierName) {
  if (!PIXABAY_API_KEY) return { error: "no_key" };

  try {
    // Cascade : 4 essais avec des mots-clés du + précis au + générique
    const cascade = keywordsCascade(metierName);
    let hits = null;
    let lastError = null;

    for (const keywords of cascade) {
      const r = await searchPixabay(keywords);
      if (r.hits) {
        hits = r.hits;
        break;
      }
      lastError = r.error;
    }

    if (!hits) return { error: `pixabay_${lastError ?? "no_results"}` };

    const imageUrl = hits[0].largeImageURL ?? hits[0].webformatURL;
    const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
    if (!imgRes.ok) return { error: `pixabay_img_${imgRes.status}` };
    return { buffer: Buffer.from(await imgRes.arrayBuffer()), source: "pixabay" };
  } catch (err) {
    return { error: `pixabay_exception_${err.message ?? "unknown"}` };
  }
}

// ─── Pollinations.ai (fallback AI) ─────────────────────────────────────
let pollinationsDiagnosed = false;
async function fetchFromPollinations(metierName, seed) {
  const prompt =
    `Professional photography of a ${metierName.toLowerCase()} at work, modern workshop, ` +
    `soft natural light, cinematic, focus on tools and craftsmanship, no faces visible, photorealistic`;

  // URL simplifiée · pas de model spécifié (utilise le default gratuit)
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${seed}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "image/*" },
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (!pollinationsDiagnosed) {
        console.log(`\n   🔍 [DEBUG Pollinations] HTTP ${res.status} : ${body.slice(0, 200)}`);
        pollinationsDiagnosed = true;
      }
      return { error: `pollinations_http_${res.status}` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 5000) return { error: "pollinations_too_small" };
    return { buffer: buf, source: "pollinations" };
  } catch (err) {
    return { error: `pollinations_exception_${err.message ?? "unknown"}` };
  }
}

// ─── Main ──────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  let query = supabase.from("metiers").select("id, name, slug, cover_url");
  if (SLUG_FILTER) query = query.eq("slug", SLUG_FILTER);
  const { data: metiers, error } = await query.order("name");

  if (error) {
    console.error("❌ Erreur DB :", error.message);
    process.exit(1);
  }
  if (!metiers || metiers.length === 0) {
    console.log("⚠️  Aucun métier trouvé.");
    return;
  }

  const toGenerate = metiers.filter((m) => FORCE || !m.cover_url);
  console.log(`\n🎨 Génération de ${toGenerate.length}/${metiers.length} cover(s) métier`);
  console.log(`   1. Pixabay (vraies photos, ${PIXABAY_API_KEY ? "✅ clé OK" : "❌ pas de clé"})`);
  console.log(`   2. Pollinations.ai (AI fallback)\n`);

  let successPixabay = 0;
  let successPollinations = 0;
  let failed = 0;
  const startTime = Date.now();

  for (const m of toGenerate) {
    const idx = successPixabay + successPollinations + failed + 1;
    const label = `[${idx}/${toGenerate.length}] ${m.name}`;
    process.stdout.write(`${label.padEnd(50)} → `);

    let result = null;
    const errors = [];

    // 1. Pixabay
    if (PIXABAY_API_KEY) {
      const r = await fetchFromPixabay(m.name);
      if (r.buffer) result = r;
      else errors.push(r.error);
    }

    // 2. Fallback Pollinations
    if (!result) {
      const seed = m.id * 1000 + m.slug.charCodeAt(0);
      const r = await fetchFromPollinations(m.name, seed);
      if (r.buffer) result = r;
      else errors.push(r.error);
    }

    if (!result) {
      console.log(`❌ ${errors.join(" | ")}`);
      failed++;
      continue;
    }

    try {
      const fileName = `${m.slug}.jpg`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, result.buffer, {
          contentType: "image/jpeg",
          upsert: true,
          cacheControl: "31536000",
        });
      if (upErr) throw upErr;

      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      const publicUrl = publicData.publicUrl;

      const { error: dbErr } = await supabase
        .from("metiers")
        .update({
          cover_url: publicUrl,
          cover_alt: `Photo illustrative d'un ${m.name.toLowerCase()} au travail`,
        })
        .eq("id", m.id);
      if (dbErr) throw dbErr;

      const tag = result.source === "pixabay" ? "📸 Pixabay" : "🤖 AI";
      console.log(`✅ ${tag} · ${Math.round(result.buffer.length / 1024)} KB`);
      if (result.source === "pixabay") successPixabay++;
      else successPollinations++;
    } catch (err) {
      console.log(`❌ Upload : ${err.message}`);
      failed++;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 Terminé en ${elapsed}s`);
  console.log(`   📸 Pixabay : ${successPixabay}`);
  console.log(`   🤖 Pollinations AI : ${successPollinations}`);
  if (failed > 0) console.log(`   ❌ ${failed} échec(s)`);
}

main().catch((err) => {
  console.error("\n💥 Erreur fatale :", err);
  process.exit(1);
});
