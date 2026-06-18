"use server";

import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";
import { pushNotification } from "@/lib/notifications/actions";
import { sendMail } from "@/lib/mail/mailer";
import { newQuoteEmail } from "@/lib/mail/templates";

const APP_URL_BASE = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

export type PublicQuoteState = { error?: string; success?: string; quoteId?: number } | undefined;

const URGENCY_MAP: Record<string, string> = {
  asap: "immediate",
  week: "week",
  month: "month",
  flex: "flexible",
};

const BUDGET_MAP: Record<string, string> = {
  low: "under_500",
  mid: "500_2000",
  high: "2000_5000",
  xl: "over_10000",
  unknown: "unknown",
};

/**
 * Soumet une demande de devis publique (broadcast).
 * - artisan_id = null (visible à tous les artisans du métier)
 * - client_id = id bigint si user auth, sinon null (invité)
 */
export async function submitPublicQuoteAction(payload: {
  metier: string;
  title: string;
  description: string;
  urgency: string;
  budget: string;
  city: string;
  postalCode: string;
  fullName: string;
  email: string;
  phone: string;
  /** Optionnel : client_number ('BS-2026-001') ou id numérique d'un pro précis. */
  targetArtisan?: string | null;
}): Promise<PublicQuoteState> {
  const title = payload.title.trim();
  const description = payload.description.trim();
  const email = payload.email.trim().toLowerCase();
  const metierName = payload.metier.trim();
  const urgencyDb = URGENCY_MAP[payload.urgency] ?? "flexible";
  const budgetDb = BUDGET_MAP[payload.budget] ?? "unknown";

  if (!metierName) return { error: "Métier requis." };
  if (!title || title.length < 8) return { error: "Titre trop court (8 caractères min)." };
  if (!description || description.length < 20) return { error: "Description trop courte (20 caractères min)." };
  if (!payload.city.trim()) return { error: "Ville requise." };
  if (!/^\d{5}$/.test(payload.postalCode.trim())) return { error: "Code postal invalide." };
  if (!payload.fullName.trim()) return { error: "Nom complet requis." };
  if (!/.+@.+\..+/.test(email)) return { error: "Email invalide." };

  const dbUser = await getCurrentDbUser();

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "").trim() || null;
  const ua = (h.get("user-agent") || "").slice(0, 500) || null;

  const admin = createSupabaseAdminClient();

  // Anti-spam
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  if (dbUser) {
    const { count } = await admin
      .from("quote_requests")
      .select("*", { count: "exact", head: true })
      .eq("client_id", dbUser.id)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) return { error: "Limite atteinte (5 demandes/24h)." };
  } else if (ip) {
    const { count } = await admin
      .from("quote_requests")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) return { error: "Limite atteinte (3 demandes/24h depuis cette IP)." };
  }

  // Résoudre metier_id
  const { data: metier } = await admin
    .from("metiers")
    .select("id")
    .ilike("name", metierName)
    .maybeSingle();
  const metierId = metier?.id ?? null;

  // ─── Résoudre l'artisan ciblé (si on vient depuis un profil pro) ────
  let targetArtisanId: number | null = null;
  let targetArtisanEmail: string | null = null;
  let targetArtisanName: string | null = null;
  let targetArtisanClientNumber: string | null = null;

  if (payload.targetArtisan) {
    const ref = payload.targetArtisan.trim();
    const numericId = Number(ref);
    const isNumeric = Number.isFinite(numericId) && numericId > 0;

    const baseQuery = admin
      .from("users")
      .select("id, name, email, client_number, validation_status, artisan_profiles(company_name)")
      .eq("role", "artisan")
      .is("deleted_at", null);

    const { data: artisan } = isNumeric
      ? await baseQuery.eq("id", numericId).maybeSingle()
      : await baseQuery.eq("client_number", ref).maybeSingle();

    if (artisan && artisan.validation_status === "approved") {
      targetArtisanId = artisan.id;
      targetArtisanEmail = artisan.email;
      targetArtisanClientNumber = artisan.client_number;
      type ProfileRow = { company_name?: string | null };
      const profile = Array.isArray(artisan.artisan_profiles)
        ? (artisan.artisan_profiles[0] as ProfileRow | undefined)
        : (artisan.artisan_profiles as ProfileRow | null);
      targetArtisanName = profile?.company_name?.trim() || artisan.name || "Pro";
    }
  }

  const { data: created, error: insErr } = await admin
    .from("quote_requests")
    .insert({
      client_id: dbUser?.id ?? null,
      // Si la demande est CIBLÉE (depuis un profil pro), on lie directement.
      // Sinon NULL = broadcast à tous les pros du métier.
      artisan_id: targetArtisanId,
      metier_id: metierId,
      title,
      description,
      city: payload.city.trim(),
      postal_code: payload.postalCode.trim(),
      urgency: urgencyDb,
      budget_range: budgetDb,
      contact_email: email,
      contact_phone: payload.phone.trim() || null,
      submitter_name: payload.fullName.trim(),
      submitter_phone: payload.phone.trim() || null,
      status: "new",
      ip_address: ip,
      user_agent: ua,
    })
    .select("id")
    .single();

  if (insErr || !created) {
    return { error: insErr?.message ?? "Erreur lors de l'envoi." };
  }

  // ─── Notification ───────────────────────────────────────────────────
  if (targetArtisanId) {
    // 1) DEMANDE CIBLÉE → notif push/in-app + email à CET artisan
    await pushNotification(
      targetArtisanId,
      "quote_received",
      "📋 Nouvelle demande de devis",
      `${payload.fullName.trim()} : ${title}`,
      `/mon-profil/devis/${created.id}/reponse`,
      "📋",
    );

    if (targetArtisanEmail && targetArtisanName) {
      const tpl = newQuoteEmail({
        artisanName: targetArtisanName,
        particulierName: payload.fullName.trim(),
        metierName: metierName || "votre métier",
        city: payload.city.trim() || null,
        description: `${title}\n\n${description}`,
        quoteUrl: `${APP_URL_BASE}/mon-profil/devis/${created.id}/reponse`,
      });
      await sendMail({
        to: targetArtisanEmail,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      }).catch(() => null);
    }
    void targetArtisanClientNumber; // réservé pour usage futur (deep link app)
  } else if (metierId) {
    // 2) BROADCAST → notif in-app + EMAIL à tous les artisans approuvés du métier
    const { data: peers } = await admin
      .from("artisan_profiles")
      .select("user_id, company_name, users!inner(validation_status, email, name)")
      .eq("metier_id", metierId);

    type PeerRow = {
      user_id: number;
      company_name: string | null;
      users:
        | { validation_status: string; email: string | null; name: string | null }
        | { validation_status: string; email: string | null; name: string | null }[];
    };

    const eligiblePros = ((peers ?? []) as PeerRow[])
      .map((p) => {
        const u = Array.isArray(p.users) ? p.users[0] : p.users;
        if (!u || u.validation_status !== "approved") return null;
        return {
          userId: p.user_id,
          email: u.email,
          displayName: p.company_name?.trim() || u.name || "Pro",
        };
      })
      .filter((p): p is { userId: number; email: string | null; displayName: string } => p !== null);

    const approvedUserIds = eligiblePros.map((p) => p.userId);

    // 2.1) Push + in-app à tous
    if (approvedUserIds.length > 0) {
      await Promise.all(
        approvedUserIds.map((uid) =>
          pushNotification(
            uid,
            "quote_received",
            "Nouvelle demande de devis dans ton métier",
            `${payload.city.trim()} : ${title}`,
            `/mon-profil/devis/${created.id}/reponse`,
            "📋",
          ),
        ),
      );
    }

    // 2.2) Email à chacun (best-effort, en parallèle)
    //      Limité à 30 destinataires pour éviter le flood SMTP.
    const recipients = eligiblePros.filter((p) => p.email).slice(0, 30);
    if (recipients.length > 0) {
      await Promise.all(
        recipients.map((p) => {
          const tpl = newQuoteEmail({
            artisanName: p.displayName,
            particulierName: payload.fullName.trim(),
            metierName: metierName || "votre métier",
            city: payload.city.trim() || null,
            description: `${title}\n\n${description}`,
            quoteUrl: `${APP_URL_BASE}/mon-profil/devis/${created.id}/reponse`,
          });
          return sendMail({
            to: p.email!,
            subject: tpl.subject,
            html: tpl.html,
            text: tpl.text,
          }).catch(() => null);
        }),
      );
    }
  }

  return { success: "Demande envoyée", quoteId: created.id };
}
