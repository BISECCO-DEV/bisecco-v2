"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentDbUser } from "@/lib/auth/current-user";

export type ReportState = { error?: string; success?: string } | undefined;

const REASONS = ["spam", "fake_profile", "inappropriate", "siren_invalid", "abuse", "other"] as const;

export const REASON_LABELS: Record<typeof REASONS[number], string> = {
  spam: "Spam / pub / arnaque",
  fake_profile: "Faux profil (nom, photo, identité)",
  inappropriate: "Contenu inapproprié",
  siren_invalid: "SIREN invalide ou inexistant",
  abuse: "Harcèlement / abus",
  other: "Autre raison",
};

/** Signaler un profil · supporte auth + anon */
export async function submitReportAction(
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const reportedRaw = formData.get("reported_user_id")?.toString();
  const reportedUserId = parseInt(reportedRaw ?? "", 10);
  const reasonRaw = formData.get("reason")?.toString();
  const detail = formData.get("detail")?.toString().trim() || null;
  const reporterEmail = formData.get("reporter_email")?.toString().trim().toLowerCase() || null;

  if (!reportedUserId) return { error: "Profil cible invalide." };
  if (!REASONS.includes(reasonRaw as typeof REASONS[number])) return { error: "Raison invalide." };

  const me = await getCurrentDbUser();
  if (!me && !reporterEmail) return { error: "Email requis pour les signalements anonymes." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "").trim() || null;
  const ua = (h.get("user-agent") || "").slice(0, 500) || null;

  const admin = createSupabaseAdminClient();

  // Anti-spam : 3 signalements/IP/24h
  if (ip) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("profile_reports")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) return { error: "Limite atteinte (3 signalements/24h)." };
  }

  // Anti-doublon par reporter
  const dupQuery = admin
    .from("profile_reports")
    .select("*", { head: true, count: "exact" })
    .eq("reported_user_id", reportedUserId);
  if (me) dupQuery.eq("reporter_id", me.id);
  else if (reporterEmail) dupQuery.eq("reporter_email", reporterEmail);
  const { count: dup } = await dupQuery;
  if ((dup ?? 0) > 0) {
    return { success: "Vous avez déjà signalé ce profil. Merci." };
  }

  await admin.from("profile_reports").insert({
    reporter_id: me?.id ?? null,
    reporter_email: reporterEmail,
    reported_user_id: reportedUserId,
    reason: reasonRaw,
    detail,
    status: "new",
    ip_address: ip,
    user_agent: ua,
  });

  revalidatePath(`/profil/${reportedUserId}`);
  return { success: "Merci. Notre équipe examinera ce profil sous 24h." };
}

/** Admin: change le status d'un report */
export async function handleReportAction(
  reportId: number,
  status: "reviewed" | "resolved" | "dismissed",
  note?: string,
) {
  const me = await getCurrentDbUser();
  if (!me || (me.role !== "admin" && me.role !== "super_admin")) return { ok: false };

  const admin = createSupabaseAdminClient();
  await admin.from("profile_reports")
    .update({
      status,
      admin_note: note ?? null,
      handled_by: me.id,
      handled_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  revalidatePath("/admin/signalements");
  return { ok: true };
}
