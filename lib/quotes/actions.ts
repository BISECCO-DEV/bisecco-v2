"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { pushNotification } from "@/lib/notifications/actions";
import { sendMail } from "@/lib/mail/mailer";
import { newQuoteEmail } from "@/lib/mail/templates";
import { URGENCY, BUDGET, type Urgency, type BudgetRange } from "./constants";

const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.eu";

export type QuoteState = { error?: string; success?: string; quoteId?: number } | undefined;

/** Soumet une demande de devis ciblée sur un artisan (depuis sa page profil). */
export async function submitQuoteAction(
  _prev: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  const me = await getCurrentDbUser();
  if (!me) return { error: "Connexion requise pour envoyer une demande." };
  if (me.role === "artisan") return { error: "Les artisans ne peuvent pas envoyer de devis." };

  const artisanIdRaw = formData.get("artisan_id")?.toString();
  const artisanId = parseInt(artisanIdRaw ?? "", 10);
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const city = formData.get("city")?.toString().trim() || null;
  const postalCode = formData.get("postal_code")?.toString().trim() || null;
  const urgency = formData.get("urgency")?.toString() as Urgency;
  const budgetRange = formData.get("budget_range")?.toString() as BudgetRange;
  const contactPhone = formData.get("contact_phone")?.toString().trim() || null;
  const contactEmail = formData.get("contact_email")?.toString().trim();

  if (!artisanId) return { error: "Artisan invalide." };
  if (!title || title.length < 8) return { error: "Titre trop court." };
  if (!description || description.length < 30) return { error: "Description trop courte (30 caractères min)." };
  if (!URGENCY.includes(urgency)) return { error: "Urgence invalide." };
  if (!BUDGET.includes(budgetRange)) return { error: "Budget invalide." };
  if (!contactEmail || !/.+@.+\..+/.test(contactEmail)) return { error: "Email invalide." };

  const admin = createSupabaseAdminClient();

  const { data: artisan } = await admin
    .from("users")
    .select("id, role, validation_status, artisan_profiles(metier_id)")
    .eq("id", artisanId)
    .single();

  if (!artisan || artisan.role !== "artisan" || artisan.validation_status !== "approved") {
    return { error: "Artisan introuvable ou non validé." };
  }
  if (artisan.id === me.id) return { error: "Vous ne pouvez pas vous envoyer une demande." };

  // Anti-spam 5/24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recent } = await admin
    .from("quote_requests")
    .select("*", { count: "exact", head: true })
    .eq("client_id", me.id)
    .gte("created_at", since);
  if ((recent ?? 0) >= 5) return { error: "Limite atteinte (5 demandes/24h)." };

  // Anti-doublon 1h
  const lastHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: dup } = await admin
    .from("quote_requests")
    .select("*", { count: "exact", head: true })
    .eq("client_id", me.id)
    .eq("artisan_id", artisanId)
    .gte("created_at", lastHour);
  if ((dup ?? 0) >= 1) return { error: "Vous avez déjà contacté cet artisan dans la dernière heure." };

  const metierId = Array.isArray(artisan.artisan_profiles)
    ? (artisan.artisan_profiles[0] as { metier_id?: number } | undefined)?.metier_id
    : (artisan.artisan_profiles as { metier_id?: number } | null)?.metier_id ?? null;

  const { data: created, error: insErr } = await admin
    .from("quote_requests")
    .insert({
      client_id: me.id,
      artisan_id: artisanId,
      metier_id: metierId,
      title,
      description,
      city,
      postal_code: postalCode,
      urgency,
      budget_range: budgetRange,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      submitter_name: me.name,
      submitter_phone: contactPhone,
      status: "new",
    })
    .select("id")
    .single();

  if (insErr || !created) return { error: insErr?.message ?? "Erreur lors de l'envoi." };

  await pushNotification(
    artisanId,
    "quote_received",
    "Nouvelle demande de devis",
    `Vous avez reçu une demande : ${title}`,
    "/mon-profil/devis",
    "📋",
  );

  // Email à l'artisan ciblé
  const { data: artisanInfo } = await admin
    .from("users")
    .select("email, name")
    .eq("id", artisanId)
    .maybeSingle();
  let metierName = "";
  if (metierId) {
    const { data: metier } = await admin.from("metiers").select("name").eq("id", metierId).maybeSingle();
    metierName = metier?.name ?? "";
  }
  if (artisanInfo?.email && artisanInfo.name) {
    const tpl = newQuoteEmail({
      artisanName: artisanInfo.name,
      particulierName: me.name ?? "Un client",
      metierName: metierName || title,
      city,
      description,
      quoteUrl: `${APP_URL_BASE}/mon-profil/devis/${created.id}`,
    });
    await sendMail({ to: artisanInfo.email, subject: tpl.subject, html: tpl.html, text: tpl.text, replyTo: contactEmail });
  }

  revalidatePath("/mon-profil/devis");
  redirect(`/devis/confirme?id=${created.id}`);
}

/** Artisan marque le devis comme répondu */
export async function markRespondedAction(quoteId: number): Promise<{ ok: boolean; error?: string }> {
  const me = await getCurrentDbUser();
  if (!me) return { ok: false, error: "Auth requise" };

  const admin = createSupabaseAdminClient();
  const { data: quote } = await admin
    .from("quote_requests")
    .select("id, artisan_id, client_id, status, title")
    .eq("id", quoteId)
    .single();

  if (!quote || quote.artisan_id !== me.id) return { ok: false, error: "Forbidden" };
  if (quote.status === "closed") return { ok: false, error: "Demande fermée" };

  await admin.from("quote_requests")
    .update({ status: "responded", responded_at: new Date().toISOString() })
    .eq("id", quoteId);

  if (quote.client_id) {
    await pushNotification(
      quote.client_id,
      "quote_responded",
      "Votre demande a été traitée",
      `L'artisan a répondu à : ${quote.title}`,
      "/mon-profil/devis",
      "💬",
    );
  }

  revalidatePath("/mon-profil/devis");
  return { ok: true };
}

/** Fermer une demande (artisan ou client) */
export async function closeQuoteAction(quoteId: number): Promise<{ ok: boolean }> {
  const me = await getCurrentDbUser();
  if (!me) return { ok: false };

  const admin = createSupabaseAdminClient();
  const { data: quote } = await admin
    .from("quote_requests")
    .select("artisan_id, client_id")
    .eq("id", quoteId)
    .single();

  if (!quote || (quote.artisan_id !== me.id && quote.client_id !== me.id)) {
    return { ok: false };
  }

  await admin.from("quote_requests")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("id", quoteId);

  revalidatePath("/mon-profil/devis");
  return { ok: true };
}
