import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type ProBadge = {
  key: string;
  label: string;
  emoji: string;
  description: string;
  color: "gold" | "purple" | "emerald" | "blue" | "orange";
};

/**
 * Calcule les badges mérités par un pro à partir de l'état de la DB.
 * Calculé à la volée (pas de table dédiée) — change automatiquement quand les
 * conditions évoluent.
 */
export async function computeProBadges(userId: number): Promise<ProBadge[]> {
  const admin = createSupabaseAdminClient();
  const badges: ProBadge[] = [];

  const [userRes, portfolioCountRes, referralCountRes, reviewsRes] = await Promise.all([
    admin.from("users").select("created_at, siren, validation_status").eq("id", userId).maybeSingle(),
    admin.from("portfolio_before_after").select("id", { count: "exact", head: true }).eq("user_id", userId),
    admin.from("users").select("id", { count: "exact", head: true }).eq("referred_by_user_id", userId).is("deleted_at", null),
    admin.from("artisan_profiles").select("id, reviews(rating, status)").eq("user_id", userId).maybeSingle(),
  ]);

  const user = userRes.data;
  const portfolioCount = portfolioCountRes.count ?? 0;
  const referralCount = referralCountRes.count ?? 0;

  // ─── Badge "SIREN vérifié" (toujours visible si validé) ────────────
  // Pas inclus ici car déjà géré ailleurs (chip dans le header).

  // ─── Badge "Vétéran" (inscrit > 6 mois) ────────────────────────────
  if (user?.created_at) {
    const months = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (months >= 6) {
      badges.push({
        key: "veteran",
        label: "Vétéran",
        emoji: "🎖️",
        description: `Sur Bisecco depuis ${Math.floor(months)} mois`,
        color: "purple",
      });
    }
  }

  // ─── Badge "Portfolio Pro" (≥ 3 paires avant/après) ────────────────
  if (portfolioCount >= 3) {
    badges.push({
      key: "portfolio_pro",
      label: "Portfolio complet",
      emoji: "✨",
      description: `${portfolioCount} réalisations avant/après publiées`,
      color: "orange",
    });
  }

  // ─── Badge "Parrain" (≥ 3 personnes parrainées) ────────────────────
  if (referralCount >= 3) {
    badges.push({
      key: "parrain",
      label: referralCount >= 10 ? "Super Parrain" : "Parrain",
      emoji: referralCount >= 10 ? "🌟" : "🤝",
      description: `${referralCount} membre${referralCount > 1 ? "s" : ""} parrainé${referralCount > 1 ? "s" : ""}`,
      color: "blue",
    });
  }

  // ─── Badge "Bien noté" (note ≥ 4.5 sur ≥ 5 avis) ───────────────────
  const reviewsRaw = (reviewsRes.data?.reviews ?? []) as { rating: number; status: string }[];
  const approved = reviewsRaw.filter((r) => r.status === "approved");
  if (approved.length >= 5) {
    const avg = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
    if (avg >= 4.5) {
      badges.push({
        key: "well_rated",
        label: "Très apprécié",
        emoji: "⭐",
        description: `Note moyenne ${avg.toFixed(1)}/5 sur ${approved.length} avis`,
        color: "gold",
      });
    }
  }

  return badges;
}
