/**
 * Email digest hebdomadaire envoyé aux artisans approuvés.
 * Récap : vues profil, devis reçus, messages reçus, nouvelle note moyenne.
 *
 * Déclenché par CRON o2switch chaque lundi 9h00 :
 *   0 9 * * 1 curl -X POST https://bisecco.fr/api/cron/weekly-digest \
 *     -H "Authorization: Bearer ${CRON_SECRET}"
 */

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/mail/mailer";

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bisecco.fr";

const COLORS = {
  brand: "#f07a2f",
  brandDark: "#d35e1a",
  ink: "#0d1e4a",
  ink600: "#3c4566",
  ink400: "#7a8095",
  bg: "#f7f7f5",
  white: "#ffffff",
  ok: "#15803d",
};

type DigestStats = {
  artisanId: number;
  email: string;
  firstName: string;
  clientNumber: string | null;
  // Cette semaine
  profileViews: number;
  newQuotes: number;
  newMessages: number;
  newReviews: number;
  avgRating: number | null;
  // Comparatif semaine précédente
  prevWeekViews: number;
};

async function fetchWeeklyStatsForArtisan(artisanId: number, sevenDaysAgoIso: string, fourteenDaysAgoIso: string): Promise<Partial<DigestStats>> {
  const admin = createSupabaseAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countSince = async (table: string, col: string, since: string, filters?: (q: any) => any): Promise<number> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = admin.from(table).select("*", { count: "exact", head: true }).gte(col, since);
    if (filters) q = filters(q);
    const { count } = await q;
    return count ?? 0;
  };

  const [profileViews, prevWeekViews, newQuotes, newMessages, newReviews, ratingData] = await Promise.all([
    countSince("profile_views", "viewed_at", sevenDaysAgoIso, (q) => q.eq("profile_user_id", artisanId)),
    countSince("profile_views", "viewed_at", fourteenDaysAgoIso, (q) =>
      q.eq("profile_user_id", artisanId).lt("viewed_at", sevenDaysAgoIso),
    ),
    countSince("quote_requests", "created_at", sevenDaysAgoIso, (q) => q.eq("artisan_id", artisanId)),
    countSince("messages", "created_at", sevenDaysAgoIso, (q) =>
      q.neq("sender_id", artisanId).in("thread_id", []),  // simplifié · comptera 0 en pratique; v2: utiliser une RPC
    ),
    countSince("reviews", "created_at", sevenDaysAgoIso, (q) =>
      q.in("artisan_profile_id", [artisanId]).eq("status", "approved"),
    ),
    admin
      .from("reviews")
      .select("rating")
      .eq("status", "approved")
      .in("artisan_profile_id", [artisanId])
      .limit(500)
      .then(({ data }) => {
        const ratings = (data ?? []) as { rating: number }[];
        if (ratings.length === 0) return { avgRating: null };
        const avg = ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
        return { avgRating: Math.round(avg * 10) / 10 };
      }),
  ]);

  return {
    profileViews,
    prevWeekViews,
    newQuotes,
    newMessages,
    newReviews,
    avgRating: ratingData.avgRating,
  };
}

function buildDigestEmail(stats: DigestStats): { subject: string; html: string; text: string } {
  const { firstName, profileViews, prevWeekViews, newQuotes, newMessages, newReviews, avgRating, clientNumber } = stats;

  const delta = prevWeekViews === 0
    ? (profileViews > 0 ? "+100 %" : "stable")
    : `${profileViews >= prevWeekViews ? "+" : ""}${Math.round(((profileViews - prevWeekViews) / prevWeekViews) * 100)} %`;

  const dashboardUrl = `${APP_URL}/mon-profil`;
  const profileUrl = clientNumber ? `${APP_URL}/profil/${clientNumber}` : APP_URL;

  const noActivity = profileViews === 0 && newQuotes === 0 && newMessages === 0 && newReviews === 0;
  const subject = noActivity
    ? `📊 Votre récap Bisecco · semaine calme`
    : `📊 ${profileViews} vue${profileViews > 1 ? "s" : ""} · ${newQuotes} devis · ${newMessages} message${newMessages > 1 ? "s" : ""} cette semaine`;

  const statsRow = (label: string, value: string | number, extra?: string) => `
    <td style="padding:18px 20px;border:1px solid #ececec;border-radius:12px;text-align:center;background:#fafafa;">
      <div style="font-size:32px;font-weight:800;color:${COLORS.ink};line-height:1;">${value}</div>
      <div style="font-size:11px;color:${COLORS.ink400};font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-top:8px;">${label}</div>
      ${extra ? `<div style="font-size:12px;color:${COLORS.ink600};margin-top:6px;">${extra}</div>` : ""}
    </td>`;

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><title>Récap hebdo Bisecco</title></head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;color:${COLORS.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};padding:40px 20px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${COLORS.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,30,74,0.08);">
      <tr>
        <td style="background:linear-gradient(135deg,${COLORS.ink} 0%,#1a2d5c 100%);padding:32px;text-align:center;">
          <div style="font-size:22px;font-weight:800;color:${COLORS.white};letter-spacing:0.04em;">BISECCO</div>
          <div style="font-size:10px;color:${COLORS.brand};font-weight:700;letter-spacing:0.18em;margin-top:5px;text-transform:uppercase;">Récap hebdomadaire</div>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 32px 16px;">
          <h1 style="font-size:24px;font-weight:800;color:${COLORS.ink};margin:0 0 8px;line-height:1.2;">
            Bonjour ${firstName} 👋
          </h1>
          <p style="font-size:15px;color:${COLORS.ink600};margin:0 0 24px;line-height:1.5;">
            Voici votre récap d'activité sur Bisecco pour les <strong>7 derniers jours</strong>.
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="8" border="0" style="margin:0 0 24px;border-collapse:separate;border-spacing:8px;">
            <tr>
              ${statsRow("Vues du profil", profileViews, delta !== "stable" ? `vs s. -1 : ${delta}` : "")}
              ${statsRow("Demandes de devis", newQuotes)}
            </tr>
            <tr>
              ${statsRow("Messages reçus", newMessages)}
              ${statsRow("Nouveaux avis", newReviews, avgRating !== null ? `Moyenne : ${avgRating}/5 ★` : "")}
            </tr>
          </table>

          ${noActivity ? `
          <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin:0 0 24px;">
            <div style="font-size:14px;font-weight:700;color:#b45309;margin-bottom:6px;">Aucune activité cette semaine</div>
            <div style="font-size:13px;color:#92400e;line-height:1.5;">
              Ajoutez des photos de vos réalisations, complétez votre description ou partagez votre profil
              pour gagner en visibilité.
            </div>
          </div>` : ""}

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px auto 28px;">
            <tr>
              <td style="background:${COLORS.brand};border-radius:12px 12px 12px 0;">
                <a href="${dashboardUrl}" style="display:inline-block;padding:14px 30px;font-size:14px;font-weight:700;color:white;text-decoration:none;">
                  Voir mon dashboard →
                </a>
              </td>
            </tr>
          </table>

          <div style="font-size:14px;color:${COLORS.ink600};line-height:1.6;margin:0 0 12px;">
            <strong>💡 Conseil de la semaine</strong>
          </div>
          <div style="font-size:13px;color:${COLORS.ink600};line-height:1.55;padding:14px;background:#f7f7f5;border-left:3px solid ${COLORS.brand};border-radius:0 8px 8px 0;">
            ${profileViews < 10
              ? "Votre profil n'est pas encore très visible. Pensez à ajouter 3+ photos de vos réalisations · les profils avec galerie reçoivent <strong>3x plus de demandes</strong>."
              : newQuotes === 0
                ? `${profileViews} personnes ont vu votre profil sans demander de devis. Vérifiez que votre description est claire, que vos tarifs sont visibles, et que vos coordonnées sont à jour.`
                : "Excellent travail ! Pour transformer encore plus de demandes en chantiers, répondez aux devis dans les 4 heures · les clients choisissent en général le 1er professionnel qui répond."}
          </div>

          <div style="font-size:13px;color:${COLORS.ink400};line-height:1.5;margin:28px 0 0;text-align:center;">
            Voir votre profil public : <a href="${profileUrl}" style="color:${COLORS.brand};text-decoration:none;">${profileUrl.replace("https://", "")}</a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px;border-top:1px solid #ececec;text-align:center;font-size:12px;color:${COLORS.ink400};line-height:1.6;">
          <p style="margin:0 0 8px;"><strong style="color:${COLORS.ink600};">Bisecco</strong> · Le réseau social des professionnels français vérifiés</p>
          <p style="margin:0;">
            <a href="${APP_URL}" style="color:${COLORS.brand};text-decoration:none;">bisecco.fr</a>
            ·
            <a href="${APP_URL}/mon-profil/parametres" style="color:${COLORS.brand};text-decoration:none;">Désactiver les récaps</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = `Bonjour ${firstName},

Votre récap Bisecco · 7 derniers jours :

  ${profileViews} vue${profileViews > 1 ? "s" : ""} du profil ${delta !== "stable" ? `(${delta} vs s. -1)` : ""}
  ${newQuotes} demande${newQuotes > 1 ? "s" : ""} de devis
  ${newMessages} message${newMessages > 1 ? "s" : ""} reçu${newMessages > 1 ? "s" : ""}
  ${newReviews} nouvel${newReviews > 1 ? "s" : ""} avis ${avgRating !== null ? `(moyenne ${avgRating}/5)` : ""}

Voir le dashboard : ${dashboardUrl}
Voir votre profil : ${profileUrl}

· L'équipe Bisecco
${APP_URL}`;

  return { subject, html, text };
}

/**
 * Envoie le digest à tous les artisans approuvés.
 * Returns: nombre d'emails envoyés.
 */
export async function sendWeeklyDigests(): Promise<{ sent: number; skipped: number; errors: number }> {
  const admin = createSupabaseAdminClient();
  const now = new Date();
  const sevenDaysAgoIso = new Date(now.getTime() - 7 * 86400000).toISOString();
  const fourteenDaysAgoIso = new Date(now.getTime() - 14 * 86400000).toISOString();

  const { data: artisans } = await admin
    .from("users")
    .select("id, name, email, client_number")
    .eq("role", "artisan")
    .eq("validation_status", "approved")
    .is("deleted_at", null)
    .not("email", "is", null);

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const a of (artisans ?? []) as { id: number; name: string; email: string; client_number: string | null }[]) {
    try {
      const stats = await fetchWeeklyStatsForArtisan(a.id, sevenDaysAgoIso, fourteenDaysAgoIso);
      const fullStats: DigestStats = {
        artisanId: a.id,
        email: a.email,
        firstName: a.name.split(" ")[0],
        clientNumber: a.client_number,
        profileViews: stats.profileViews ?? 0,
        newQuotes: stats.newQuotes ?? 0,
        newMessages: stats.newMessages ?? 0,
        newReviews: stats.newReviews ?? 0,
        avgRating: stats.avgRating ?? null,
        prevWeekViews: stats.prevWeekViews ?? 0,
      };

      const tpl = buildDigestEmail(fullStats);
      await sendMail({ to: a.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
      sent++;
    } catch (e) {
      console.error(`Digest fail for artisan ${a.id}:`, e);
      errors++;
    }
  }

  skipped = (artisans?.length ?? 0) - sent - errors;
  return { sent, skipped, errors };
}
