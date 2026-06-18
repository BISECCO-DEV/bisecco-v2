import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/push/subscribe
 * Body : { endpoint, keys: { p256dh, auth } }
 *
 * Enregistre une nouvelle subscription push pour le user connecté.
 * Idempotent : si l'endpoint existe déjà, on met à jour user_id (changement de compte).
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.id == null) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  let body: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const endpoint = body.endpoint;
  const p256dh = body.keys?.p256dh;
  const auth = body.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Subscription invalide" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const userAgent = req.headers.get("user-agent")?.slice(0, 200) ?? null;

  // Upsert manuel (la contrainte UNIQUE est sur endpoint)
  const { error } = await admin
    .from("push_subscriptions")
    .upsert(
      { user_id: user.id, endpoint, p256dh, auth, user_agent: userAgent },
      { onConflict: "endpoint" },
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/push/subscribe?endpoint=...
 * Supprime une subscription quand l'user désactive depuis son browser.
 */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.id == null) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const endpoint = req.nextUrl.searchParams.get("endpoint");
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint manquant" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  await admin
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  return NextResponse.json({ ok: true });
}
