"use server";

import { randomBytes } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/mail/mailer";
import { newsletterOptInEmail } from "@/lib/mail/templates";

const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.eu";

export type NewsletterState = { error?: string; success?: string } | undefined;

const AUDIENCES = ["particulier", "artisan", "both"] as const;

function freshToken(): string {
  return randomBytes(36).toString("base64url"); // ~48 chars
}

/** Inscription newsletter avec double opt-in RGPD (Sprint W V1) */
export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const name = formData.get("name")?.toString().trim() || null;
  const audienceRaw = formData.get("audience")?.toString();
  const source = formData.get("source")?.toString().slice(0, 50) || "home";
  const consent = formData.get("consent");

  if (!email || !/.+@.+\..+/.test(email)) return { error: "Email invalide." };
  if (!consent) return { error: "Vous devez accepter de recevoir nos emails." };

  const audience = (AUDIENCES.includes(audienceRaw as typeof AUDIENCES[number])
    ? audienceRaw
    : "both") as typeof AUDIENCES[number];

  const admin = createSupabaseAdminClient();
  const tokens = {
    confirmation_token: freshToken(),
    unsubscribe_token: freshToken(),
  };

  const { data: existing } = await admin
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existing?.status === "confirmed") {
    return { success: "Vous êtes déjà inscrit. Merci !" };
  }

  if (existing) {
    // Réinscription : régénère les tokens, repasse en pending
    await admin
      .from("newsletter_subscribers")
      .update({
        name,
        audience,
        status: "pending",
        source,
        ...tokens,
      })
      .eq("id", existing.id);
  } else {
    await admin.from("newsletter_subscribers").insert({
      email,
      name,
      audience,
      status: "pending",
      source,
      ...tokens,
    });
  }

  // Envoyer l'email de confirmation via nodemailer + o2switch
  const confirmUrl = `${APP_URL_BASE}/newsletter/confirmer/${tokens.confirmation_token}`;
  const tpl = newsletterOptInEmail({ confirmUrl });
  await sendMail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });

  return { success: "Vérifiez votre boîte mail pour confirmer." };
}

/** GET /newsletter/confirmer/{token} */
export async function confirmNewsletterAction(token: string): Promise<{ ok: boolean; email?: string }> {
  const admin = createSupabaseAdminClient();
  const { data: sub } = await admin
    .from("newsletter_subscribers")
    .select("id, email, status")
    .eq("confirmation_token", token)
    .single();

  if (!sub) return { ok: false };

  if (sub.status !== "confirmed") {
    await admin
      .from("newsletter_subscribers")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
      })
      .eq("id", sub.id);
  }

  return { ok: true, email: sub.email };
}

/** GET /newsletter/desinscrire/{token} */
export async function unsubscribeNewsletterAction(token: string): Promise<{ ok: boolean; email?: string }> {
  const admin = createSupabaseAdminClient();
  const { data: sub } = await admin
    .from("newsletter_subscribers")
    .select("id, email, status")
    .eq("unsubscribe_token", token)
    .single();

  if (!sub) return { ok: false };

  if (sub.status !== "unsubscribed") {
    await admin
      .from("newsletter_subscribers")
      .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
      .eq("id", sub.id);
  }

  return { ok: true, email: sub.email };
}
