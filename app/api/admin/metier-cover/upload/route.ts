import { NextResponse } from "next/server";
import { requireDbAdmin } from "@/lib/auth/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "metier-covers";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Upload manuel d'une cover métier par l'admin.
 *
 * POST /api/admin/metier-cover/upload (multipart/form-data)
 *   - file : l'image (jpeg/png/webp, max 5 MB)
 *   - slug : slug du métier
 *
 * Sauvegarde directement dans le bucket metier-covers + met à jour metiers.cover_url.
 * Cache buster ?v=timestamp pour forcer le refresh client.
 */
export async function POST(request: Request) {
  try {
    await requireDbAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const slug = String(formData.get("slug") ?? "").trim();

  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug manquant" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Fichier manquant" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { ok: false, error: `Fichier trop gros (max ${MAX_SIZE / 1024 / 1024} MB)` },
      { status: 400 },
    );
  }
  if (!ALLOWED_MIMES.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Format non supporté (jpeg, png, webp uniquement). Reçu : ${file.type}` },
      { status: 400 },
    );
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

  const buffer = Buffer.from(await file.arrayBuffer());

  // Tout les uploads finissent en .jpg pour cohérence (le content-type force le bon affichage)
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const fileName = `${metier.slug}.${ext}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
    contentType: file.type,
    upsert: true,
    cacheControl: "31536000",
  });
  if (upErr) {
    return NextResponse.json({ ok: false, error: `Storage : ${upErr.message}` }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  const url = `${pub.publicUrl}?v=${Date.now()}`;

  const { error: updErr } = await supabase
    .from("metiers")
    .update({
      cover_url: url,
      cover_alt: `Photo illustrative d'un ${metier.name.toLowerCase()} (upload custom)`,
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
    size_kb: Math.round(buffer.byteLength / 1024),
  });
}
