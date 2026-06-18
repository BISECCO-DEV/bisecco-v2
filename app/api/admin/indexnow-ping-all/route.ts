import { NextResponse } from "next/server";
import { requireDbAdmin } from "@/lib/auth/current-user";
import { pingIndexNow, getAllPrioritaryUrls } from "@/lib/seo/indexnow";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Ping IndexNow avec toutes les URLs SEO prioritaires de Bisecco.
 *
 * Utile après un déploiement majeur (nouvelles pages, nouveau métier, etc.)
 * pour accélérer l'indexation Bing/Yandex en quelques minutes.
 *
 * Sécurité : admin uniquement (pour éviter abus du quota IndexNow).
 *
 * POST /api/admin/indexnow-ping-all
 */
export async function POST() {
  try {
    await requireDbAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const urls = await getAllPrioritaryUrls();

  // IndexNow accepte jusqu'à 10 000 URLs par ping
  const chunkSize = 10000;
  let pinged = 0;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    await pingIndexNow(chunk);
    pinged += chunk.length;
  }

  return NextResponse.json({
    ok: true,
    total_urls_pinged: pinged,
    targets: ["Bing", "Yandex (via Bing peering)", "Seznam"],
    note: "Indexation prévue dans 5 minutes à quelques heures.",
  });
}
