"use server";

import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";

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

  const { data: created, error: insErr } = await admin
    .from("quote_requests")
    .insert({
      client_id: dbUser?.id ?? null,
      artisan_id: null,
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

  // Notifie tous les artisans approuvés du métier
  if (metierId) {
    const { data: targetArtisans } = await admin
      .from("artisan_profiles")
      .select("user_id")
      .eq("metier_id", metierId);

    if (targetArtisans && targetArtisans.length > 0) {
      const notifs = targetArtisans.map((a) => ({
        user_id: a.user_id,
        type: "quote_received",
        title: "Nouvelle demande de devis",
        message: `Demande dans votre métier : ${title}`,
        action_url: "/mon-profil/devis",
        icon: "📋",
      }));
      await admin.from("app_notifications").insert(notifs);
    }
  }

  return { success: "Demande envoyée", quoteId: created.id };
}
