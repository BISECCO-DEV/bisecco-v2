import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Clock, AlertOctagon } from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Mes avis",
  robots: { index: false, follow: false },
};

type ReviewRow = {
  id: number;
  rating: number;
  comment: string | null;
  status: "pending" | "approved" | "rejected" | string;
  is_flagged: boolean;
  created_at: string;
  users: {
    name: string | null;
    profile_photo: string | null;
  } | null;
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86400000);
  if (days < 1) return "Aujourd'hui";
  if (days < 2) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
  return `Il y a ${Math.floor(days / 365)} an${days >= 730 ? "s" : ""}`;
}

export default async function MesAvisPage() {
  const user = await requireUser();
  if (!user.id) return null;

  const admin = createSupabaseAdminClient();

  // Récupère l'artisan_profile_id si le user est artisan
  const { data: profile } = await admin
    .from("artisan_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Récupère tous les avis associés à ce profil (toutes statuts pour transparence)
  const rows: ReviewRow[] = profile
    ? (
        await admin
          .from("reviews")
          .select(
            `id, rating, comment, status, is_flagged, created_at,
             users:user_id ( name, profile_photo )`,
          )
          .eq("artisan_profile_id", profile.id)
          .order("created_at", { ascending: false })
      ).data as unknown as ReviewRow[] ?? []
    : [];

  const approvedReviews = rows.filter((r) => r.status === "approved" && !r.is_flagged);
  const pendingReviews = rows.filter((r) => r.status === "pending");
  const rejectedOrFlagged = rows.filter((r) => r.status === "rejected" || r.is_flagged);

  const avg = approvedReviews.length
    ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
    : 0;

  // Distribution 5/4/3/2/1 sur approuvés
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = approvedReviews.filter((r) => Math.round(r.rating) === stars).length;
    const pct = approvedReviews.length ? Math.round((count / approvedReviews.length) * 100) : 0;
    return { stars, count, pct };
  });

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon espace
        </Link>
        <h1 className="text-3xl font-bold text-ink-700 mt-4 tracking-tight">Mes avis clients</h1>
        <p className="text-ink-400 mt-1">
          {approvedReviews.length === 0
            ? "Aucun avis pour l'instant"
            : `${approvedReviews.length} avis approuvé${approvedReviews.length > 1 ? "s" : ""} · note moyenne ${avg.toFixed(1)}/5`}
          {pendingReviews.length > 0 && ` · ${pendingReviews.length} en attente de modération`}
        </p>

        {!profile && (
          <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-4 py-3 text-sm">
            Cette section est destinée aux professionnels. Votre compte n&apos;a pas (encore) de profil professionnel rattaché.
          </div>
        )}

        {profile && approvedReviews.length === 0 && pendingReviews.length === 0 && (
          <div className="mt-8 bg-white rounded-3xl border border-ink-100 p-10 text-center">
            <Star size={32} className="text-ink-200 mx-auto mb-3" />
            <h2 className="font-bold text-ink-700">Aucun avis pour l&apos;instant</h2>
            <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto leading-relaxed">
              Les avis laissés par vos clients après une mission apparaîtront ici, une fois validés par l&apos;équipe Bisecco.
            </p>
          </div>
        )}

        {/* Distribution + résumé · uniquement s'il y a des avis approuvés */}
        {approvedReviews.length > 0 && (
          <div className="bg-gradient-to-br from-brand-50/60 to-white rounded-3xl p-6 border border-brand-100 mt-8">
            <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-ink-700 tabular-nums">{avg.toFixed(1)}</div>
                <div className="flex justify-center gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(avg) ? "#f07a2f" : "#e5e7eb"}
                      className={i < Math.round(avg) ? "text-brand-500" : "text-ink-200"}
                    />
                  ))}
                </div>
                <div className="text-xs text-ink-400 mt-2">
                  {approvedReviews.length} avis vérifié{approvedReviews.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="space-y-2">
                {distribution.map((r) => (
                  <div key={r.stars} className="flex items-center gap-3 text-xs">
                    <span className="text-ink-500 font-semibold w-8">{r.stars}★</span>
                    <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-ink-400 w-12 text-right tabular-nums">{r.pct}% ({r.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Avis en attente (visibles uniquement par le pro, pas publics) */}
        {pendingReviews.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-amber-500" />
              <h2 className="font-bold text-ink-700">
                En attente de modération ({pendingReviews.length})
              </h2>
            </div>
            <p className="text-xs text-ink-500 mb-3">
              Ces avis ont été déposés par des clients. L&apos;équipe Bisecco les valide avant qu&apos;ils n&apos;apparaissent publiquement.
            </p>
            <div className="space-y-3">
              {pendingReviews.map((r) => (
                <ReviewCard key={r.id} review={r} statusBadge="pending" />
              ))}
            </div>
          </section>
        )}

        {/* Avis approuvés */}
        {approvedReviews.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-ink-700 mb-3">Avis publiés</h2>
            <div className="space-y-3">
              {approvedReviews.map((r) => (
                <ReviewCard key={r.id} review={r} statusBadge="approved" />
              ))}
            </div>
          </section>
        )}

        {/* Avis rejetés / signalés (uniquement compte pro pour info) */}
        {rejectedOrFlagged.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon size={16} className="text-red-500" />
              <h2 className="font-bold text-ink-700">
                Avis non publiés ({rejectedOrFlagged.length})
              </h2>
            </div>
            <p className="text-xs text-ink-500 mb-3">
              Avis rejetés ou signalés par notre équipe. Ils ne sont pas visibles publiquement.
            </p>
            <div className="space-y-3">
              {rejectedOrFlagged.map((r) => (
                <ReviewCard key={r.id} review={r} statusBadge="rejected" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  statusBadge,
}: {
  review: ReviewRow;
  statusBadge: "approved" | "pending" | "rejected";
}) {
  const authorName = review.users?.name ?? "Anonyme";
  const initials = authorName.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");

  const badge =
    statusBadge === "approved" ? null
    : statusBadge === "pending"
      ? { label: "En attente", cls: "bg-amber-50 text-amber-700 border-amber-200" }
      : { label: review.is_flagged ? "Signalé" : "Rejeté", cls: "bg-red-50 text-red-700 border-red-200" };

  return (
    <article className={`bg-white rounded-2xl p-5 border ${
      statusBadge === "pending" ? "border-amber-200" :
      statusBadge === "rejected" ? "border-red-200" :
      "border-ink-100"
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-ink-100 border border-ink-200 flex items-center justify-center font-bold text-ink-600 flex-shrink-0">
          {review.users?.profile_photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.users.profile_photo} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-sm">{initials || "?"}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="text-ink-700 text-sm">{authorName}</strong>
              <ShieldCheck size={11} className="text-emerald-500" />
              <span className="text-xs text-ink-400">· {timeAgo(review.created_at)}</span>
              {badge && (
                <span className={`px-2 py-0.5 rounded-full text-[0.62rem] font-bold uppercase tracking-wider border ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <div className="flex gap-0.5 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < review.rating ? "#f07a2f" : "#e5e7eb"}
                  className={i < review.rating ? "text-brand-500" : "text-ink-200"}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-ink-600 leading-relaxed mt-2 whitespace-pre-wrap break-words">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
