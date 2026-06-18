import { NextResponse } from "next/server";
import { requireDbAdmin } from "@/lib/auth/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BUCKET = "blog-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Upload d'une image pour un article de blog (admin uniquement).
 *
 * POST /api/admin/blog/upload-image
 * Body : multipart/form-data avec un champ "file"
 *
 * Réponse :
 *   - { ok: true, url: "https://...supabase.co/storage/v1/object/public/blog-images/xxx.jpg" }
 *
 * L'URL retournée est insérée dans le bloc image de l'article.
 */
export async function POST(request: Request) {
  try {
    await requireDbAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

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
      {
        ok: false,
        error: `Format non supporté. Utilise JPG, PNG, WebP ou AVIF (reçu : ${file.type})`,
      },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();

  // Nom de fichier unique pour éviter les collisions
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/avif" ? "avif" : "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  const fileName = `${timestamp}-${random}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
    cacheControl: "31536000", // 1 an
  });
  if (upErr) {
    return NextResponse.json(
      {
        ok: false,
        error:
          upErr.message.includes("not found") || upErr.message.includes("Bucket")
            ? `Le bucket "${BUCKET}" n'existe pas dans Supabase Storage. Crée-le d'abord (public, 5 MB max).`
            : `Storage : ${upErr.message}`,
      },
      { status: 500 },
    );
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return NextResponse.json({
    ok: true,
    url: pub.publicUrl,
    size_kb: Math.round(buffer.byteLength / 1024),
    filename: fileName,
  });
}
