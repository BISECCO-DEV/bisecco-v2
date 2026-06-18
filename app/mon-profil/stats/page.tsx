import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, TrendingUp, TrendingDown, Eye, MessageCircle, FileText,
  Heart, UserPlus, Trophy, Sparkles, Camera, Star,
} from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { redirect } from "next/navigation";
import {
  fetchProDailyViews,
  fetchProConversionFunnel,
  fetchProRanking,
  fetchProSocialCounts,
} from "@/lib/db/pro-stats";
import { ViewsLineChart } from "./ViewsLineChart";

export const metadata: Metadata = {
  title: "Mes statistiques",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MyStatsPage() {
  const user = await requireUser();
  if (user.role !== "artisan") {
    redirect("/mon-profil");
  }
  if (!user.id) redirect("/mon-profil");

  const [daily, funnel, ranking, social] = await Promise.all([
    fetchProDailyViews(user.id, 30),
    fetchProConversionFunnel(user.id, 30),
    fetchProRanking(user.id),
    fetchProSocialCounts(user.id),
  ]);

  const viewsDelta = daily.totalPrev > 0
    ? Math.round(((daily.total - daily.totalPrev) / daily.totalPrev) * 100)
    : (daily.total > 0 ? 100 : 0);

  const rankPercentile = ranking.rank && ranking.total > 1
    ? Math.round(((ranking.total - ranking.rank + 1) / ranking.total) * 100)
    : null;

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-10 max-w-6xl">
        <Link
          href="/mon-profil"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition"
        >
          <ArrowLeft size={14} /> Retour à mon espace
        </Link>

        <div className="mt-4 mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink-700 tracking-tight">
              Mes statistiques
            </h1>
            <p className="text-ink-400 mt-1.5 text-sm">
              Performance de ton profil sur les 30 derniers jours.
            </p>
          </div>
          {ranking.rank && rankPercentile !== null && rankPercentile >= 50 && (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
              <Trophy size={18} className="text-amber-500" />
              <div className="text-sm">
                <strong className="text-ink-700">Top {100 - rankPercentile + 1}%</strong>
                <span className="text-ink-500"> dans ton segment</span>
              </div>
            </div>
          )}
        </div>

        {/* ═══════ HERO : vues 30j + delta ═══════ */}
        <section className="bg-white rounded-3xl border border-ink-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Vues du profil · 30 derniers jours
              </div>
              <div className="flex items-baseline gap-4 mt-1.5">
                <span className="text-[64px] md:text-[88px] font-bold tracking-[-0.04em] text-ink-700 leading-none tabular-nums">
                  {daily.total.toLocaleString("fr-FR")}
                </span>
                <DeltaBadge value={viewsDelta} prevTotal={daily.totalPrev} />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-ink-100 pt-6">
            <ViewsLineChart points={daily.points} />
          </div>
        </section>

        {/* ═══════ 4 cards : engagement social ═══════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <SocialCard
            icon={UserPlus}
            label="Abonnés"
            value={social.followers}
            color="bg-blue-50 text-blue-600"
            href="#"
          />
          <SocialCard
            icon={Heart}
            label="Favoris"
            value={social.favoritedBy}
            color="bg-rose-50 text-rose-600"
            sub="ajouté en favori par"
          />
          <SocialCard
            icon={Sparkles}
            label="Avant / Après"
            value={social.portfolioPairs}
            color="bg-amber-50 text-amber-600"
            sub={`${social.portfolioPairs}/6 publié${social.portfolioPairs > 1 ? "s" : ""}`}
            href="/mon-profil/edit"
          />
          <SocialCard
            icon={Camera}
            label="Photos galerie"
            value={social.galleryPhotos}
            color="bg-emerald-50 text-emerald-600"
            sub={`${social.galleryPhotos}/3 publié${social.galleryPhotos > 1 ? "es" : "e"}`}
            href="/mon-profil/edit"
          />
        </div>

        {/* ═══════ Funnel conversion ═══════ */}
        <section className="bg-white rounded-3xl border border-ink-100 p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-ink-700">
              Tunnel de conversion <span className="text-ink-400 font-normal text-sm">· 30 jours</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <FunnelStep
              icon={Eye}
              label="Vues du profil"
              value={funnel.views}
              color="bg-ink-50 text-ink-700"
              isFirst
            />
            <FunnelStep
              icon={MessageCircle}
              label="Contacts entamés"
              value={funnel.contacts}
              color="bg-brand-50 text-brand-700"
              conversionRate={funnel.viewToContact}
              conversionLabel={`${funnel.viewToContact}% des visiteurs`}
            />
            <FunnelStep
              icon={FileText}
              label="Devis demandés"
              value={funnel.quotes}
              color="bg-emerald-50 text-emerald-700"
              conversionRate={funnel.contactToQuote}
              conversionLabel={`${funnel.contactToQuote}% des contacts`}
            />
          </div>

          <ConversionTips funnel={funnel} portfolioCount={social.portfolioPairs} />
        </section>

        {/* ═══════ Classement ═══════ */}
        {ranking.metierName && ranking.city && (
          <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden mb-6">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={18} className="text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/65">
                  Ton classement
                </span>
              </div>

              {ranking.rank ? (
                <>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-[56px] md:text-[72px] font-bold tracking-[-0.04em] leading-none tabular-nums">
                      #{ranking.rank}
                    </span>
                    <span className="text-2xl text-white/65">/ {ranking.total}</span>
                  </div>
                  <p className="text-white/80 mt-3">
                    {ranking.metierName} à <strong>{ranking.city}</strong> · sur {ranking.total} pros actifs
                  </p>
                  {rankPercentile !== null && (
                    <div className="mt-5 pt-5 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/65">Tu fais mieux que</span>
                        <span className="font-bold">{rankPercentile}% des pros</span>
                      </div>
                      <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                          style={{ width: `${rankPercentile}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white/80">
                    {ranking.metierName} à {ranking.city}
                  </div>
                  <p className="text-white/65 mt-2 text-sm">
                    Pas encore de classement. Reçois quelques vues pour entrer dans le top.
                  </p>
                </>
              )}
            </div>
          </section>
        )}

        {/* ═══════ Astuce / CTA ═══════ */}
        <section className="bg-gradient-to-br from-brand-50/60 to-amber-50/60 border border-brand-100 rounded-2xl p-5 md:p-6">
          <div className="flex items-start gap-3">
            <Star size={20} className="text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-ink-700">Comment progresser dans le classement ?</h3>
              <ul className="text-sm text-ink-600 mt-2 space-y-1.5 leading-relaxed">
                <li>• <strong>Avant/Après</strong> : chaque réalisation publiée augmente la durée de visite (donc le ranking SEO)</li>
                <li>• <strong>Réponds vite</strong> : les pros qui répondent en &lt; 2h apparaissent plus haut</li>
                <li>• <strong>Demande des avis</strong> à tes clients récents — ta note compte directement</li>
                <li>• <strong>Profil complet</strong> à 100% : tarifs, zone, disponibilité, description longue</li>
              </ul>
              <Link
                href="/mon-profil/edit"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-brand-600 hover:text-brand-700"
              >
                Compléter mon profil →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// =====================================================================
// Sous-composants
// =====================================================================

function DeltaBadge({ value, prevTotal }: { value: number; prevTotal: number }) {
  if (prevTotal === 0 && value === 0) {
    return <span className="text-sm text-ink-400">Pas de données précédentes</span>;
  }
  const isUp = value >= 0;
  return (
    <div className={`pb-3 inline-flex items-center gap-1.5 text-sm font-bold ${isUp ? "text-emerald-600" : "text-red-600"}`}>
      {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {isUp ? "+" : ""}{value}% vs période précédente
    </div>
  );
}

function SocialCard({
  icon: Icon, label, value, color, sub, href,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
  color: string;
  sub?: string;
  href?: string;
}) {
  const content = (
    <div className="bg-white rounded-2xl border border-ink-100 p-5 h-full hover:border-brand-200 hover:shadow-sm transition">
      <div className={`w-10 h-10 rounded-xl ${color} grid place-items-center mb-3`}>
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div className="text-3xl font-bold text-ink-700 tabular-nums leading-tight">
        {value.toLocaleString("fr-FR")}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mt-1">
        {label}
      </div>
      {sub && <div className="text-xs text-ink-400 mt-0.5">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function FunnelStep({
  icon: Icon, label, value, color, conversionRate, conversionLabel, isFirst,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  color: string;
  conversionRate?: number;
  conversionLabel?: string;
  isFirst?: boolean;
}) {
  return (
    <div className="rounded-2xl border-2 border-ink-100 p-5">
      <div className={`w-10 h-10 rounded-xl ${color} grid place-items-center mb-3`}>
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div className="text-3xl font-bold text-ink-700 tabular-nums">
        {value.toLocaleString("fr-FR")}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mt-1">
        {label}
      </div>
      {!isFirst && conversionLabel && (
        <div className="mt-3 pt-3 border-t border-ink-100">
          <div className="text-xs text-ink-500">
            <strong className={conversionRate && conversionRate >= 5 ? "text-emerald-600" : "text-ink-700"}>
              {conversionLabel}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

function ConversionTips({
  funnel, portfolioCount,
}: {
  funnel: { viewToContact: number; contactToQuote: number; views: number };
  portfolioCount: number;
}) {
  // Pas d'astuces si trop peu de données
  if (funnel.views < 20) return null;

  const tips: string[] = [];
  if (funnel.viewToContact < 3) {
    tips.push(
      portfolioCount < 2
        ? "Ton taux vues → contacts est bas. Publie 2-3 réalisations avant/après pour rassurer."
        : "Ton taux vues → contacts est bas. Vérifie ta photo de couverture et ta description.",
    );
  }
  if (funnel.viewToContact >= 5) {
    tips.push("Excellent taux vues → contacts (≥ 5%). Continue comme ça.");
  }
  if (funnel.contactToQuote < 30 && funnel.viewToContact > 0) {
    tips.push("Beaucoup de contacts mais peu de devis. Vérifie ton temps de réponse.");
  }

  if (tips.length === 0) return null;

  return (
    <div className="mt-5 pt-5 border-t border-ink-100">
      <ul className="space-y-1.5">
        {tips.map((t, i) => (
          <li key={i} className="text-xs text-ink-500 leading-relaxed flex gap-2">
            <span className="text-brand-500">→</span> {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
