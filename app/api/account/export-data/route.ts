import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Export RGPD complet de toutes les données du user connecté.
 * Article 20 RGPD · droit à la portabilité.
 *
 * Renvoie un JSON téléchargé avec toutes les data perso connues.
 * Si une table n'existe pas (migration future), elle est ignorée silencieusement.
 *
 * Authentification : user connecté uniquement (lit SES données).
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return NextResponse.json({ ok: false, error: "NON_AUTHENTIFIE" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const uid = user.id;

  // Helper : retourne data[] ou [] si la table n'existe pas / erreur
  async function safeSelect<T = unknown>(
    table: string,
    select: string,
    eqColumn: string | null,
    eqValue: number | string | null,
  ): Promise<T[]> {
    try {
      let q = supabase.from(table).select(select);
      if (eqColumn && eqValue !== null) {
        q = q.eq(eqColumn, eqValue);
      }
      const r = await q;
      if (r.error) return [];
      return (r.data ?? []) as T[];
    } catch {
      return [];
    }
  }

  let profile: unknown = null;
  try {
    const r = await supabase.from("users").select("*").eq("id", uid).maybeSingle();
    profile = r.data ?? null;
  } catch {
    profile = null;
  }

  const [
    artisanProfile,
    gallery,
    reviewsGiven,
    messagesSent,
    posts,
    likes,
    comments,
    quotes,
    cvSubs,
    reports,
  ] = await Promise.all([
    safeSelect("artisan_profiles", "*", "user_id", uid),
    safeSelect("gallery_images", "*", "user_id", uid),
    safeSelect("reviews", "*", "user_id", uid),
    safeSelect("messages", "*", "sender_id", uid),
    safeSelect("feed_posts", "*", "user_id", uid),
    safeSelect("feed_likes", "*", "user_id", uid),
    safeSelect("feed_comments", "*", "user_id", uid),
    safeSelect("quotes", "*", "requester_id", uid),
    safeSelect("cv_submissions", "*", "user_id", uid),
    safeSelect("reports", "*", "reporter_id", uid),
  ]);

  const exportPayload = {
    _meta: {
      version: 1,
      exported_at: new Date().toISOString(),
      user_id: uid,
      email: user.email,
      legal_basis: "RGPD Article 20 - Droit à la portabilité",
      contact_dpo: "contact@bisecco.fr",
    },
    profile,
    artisan: {
      profiles: artisanProfile,
      gallery,
    },
    reviews: {
      given: reviewsGiven,
    },
    messages: messagesSent,
    feed: {
      posts,
      likes,
      comments,
    },
    quotes,
    cv_submissions: cvSubs,
    reports,
  };

  const fileName = `bisecco-export-${user.client_number ?? uid}-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
