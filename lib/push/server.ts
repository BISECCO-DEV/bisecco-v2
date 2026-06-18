import "server-only";
import webpush from "web-push";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ─── Configuration VAPID ─────────────────────────────────────────────
// Génère tes clés une fois avec : npx web-push generate-vapid-keys
// Puis ajoute dans tes env vars (cPanel) :
//   VAPID_PUBLIC_KEY        = "BHj..."
//   VAPID_PRIVATE_KEY       = "kj9..."
//   NEXT_PUBLIC_VAPID_KEY   = même valeur que VAPID_PUBLIC_KEY
//   VAPID_SUBJECT           = "mailto:contact@bisecco.fr"

let isConfigured = false;

function ensureConfigured() {
  if (isConfigured) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:contact@bisecco.fr";
  if (!pub || !priv) {
    console.warn("[push] VAPID keys missing — push notifications disabled.");
    return false;
  }
  webpush.setVapidDetails(subject, pub, priv);
  isConfigured = true;
  return true;
}

export type PushPayload = {
  title: string;
  body?: string;
  url?: string;
  icon?: string;
};

/**
 * Envoie une notification push à TOUS les devices enregistrés pour ce user.
 * Nettoie automatiquement les subscriptions invalides (HTTP 404 / 410).
 */
export async function sendPushToUser(userId: number, payload: PushPayload): Promise<{ sent: number; failed: number }> {
  if (!ensureConfigured()) return { sent: 0, failed: 0 };

  const admin = createSupabaseAdminClient();
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (!subs || subs.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;
  const toDelete: number[] = [];
  const json = JSON.stringify(payload);

  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        json,
      );
      sent++;
    } catch (err: unknown) {
      failed++;
      const status = (err as { statusCode?: number }).statusCode;
      // 404 / 410 = subscription expirée → cleanup
      if (status === 404 || status === 410) {
        toDelete.push(s.id);
      }
    }
  }

  if (toDelete.length > 0) {
    await admin.from("push_subscriptions").delete().in("id", toDelete);
  }
  if (sent > 0) {
    await admin
      .from("push_subscriptions")
      .update({ last_used_at: new Date().toISOString() })
      .eq("user_id", userId);
  }

  return { sent, failed };
}
