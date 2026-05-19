import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, ThumbsUp, MessageCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Mes avis",
  robots: { index: false, follow: false },
};

const MY_REVIEWS = [
  { id: 1, author: "Marie L.",  avatar: "https://i.pravatar.cc/100?img=47", rating: 5, text: "Excellent travail sur la rénovation de notre cuisine. Très professionnel, ponctuel et propre.", project: "Rénovation cuisine", date: "Il y a 2 semaines", responded: false },
  { id: 2, author: "Pierre M.", avatar: "https://i.pravatar.cc/100?img=33", rating: 5, text: "Devis clair, prix correct, intervention rapide. Je recommande vivement.", project: "Ouverture mur porteur", date: "Il y a 1 mois", responded: true },
  { id: 3, author: "Sophie K.", avatar: "https://i.pravatar.cc/100?img=48", rating: 4, text: "Bon travail dans l'ensemble. Quelques retards mais le résultat est là.", project: "Pose carrelage salle de bain", date: "Il y a 2 mois", responded: true },
  { id: 4, author: "Thomas R.", avatar: "https://i.pravatar.cc/100?img=12", rating: 5, text: "Excellent artisan, à l'écoute, qui propose des solutions intelligentes.", project: "Extension maison", date: "Il y a 3 mois", responded: false },
];

const RATING_DIST = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 17 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

export default function MesAvisPage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10">
        <Link href="/mon-profil" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Mon espace
        </Link>
        <h1 className="text-3xl font-bold text-ink-700 mt-4 tracking-tight">Mes avis clients</h1>
        <p className="text-ink-400 mt-1">{MY_REVIEWS.length} avis reçus · note moyenne 4.8/5</p>

        {/* Distribution + résumé */}
        <div className="bg-gradient-to-br from-brand-50/60 to-white rounded-3xl p-6 border border-brand-100 mt-8">
          <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-ink-700">4.8</div>
              <div className="flex justify-center gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < 5 ? "#f07a2f" : "#e5e7eb"} className={i < 5 ? "text-brand-500" : "text-ink-200"} />
                ))}
              </div>
              <div className="text-xs text-ink-400 mt-2">{MY_REVIEWS.length} avis vérifiés</div>
            </div>
            <div className="space-y-2">
              {RATING_DIST.map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-xs">
                  <span className="text-ink-500 font-semibold w-8">{r.stars}★</span>
                  <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-ink-400 w-10 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-4 mt-8">
          {MY_REVIEWS.map((r) => (
            <article key={r.id} className="bg-white rounded-2xl p-5 border border-ink-100">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.avatar} alt="" className="w-11 h-11 rounded-full border border-ink-100 flex-shrink-0" loading="lazy" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <strong className="text-ink-700">{r.author}</strong>
                      <ShieldCheck size={11} className="text-emerald-500" />
                      <span className="text-xs text-ink-400 ml-1">· {r.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} size={13} fill="#f07a2f" className="text-brand-500" />)}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-1 mb-2 px-2 py-0.5 rounded-full bg-ink-50 text-[0.65rem] font-bold text-ink-500 uppercase tracking-wider">
                    {r.project}
                  </span>
                  <p className="text-sm text-ink-600 leading-relaxed">{r.text}</p>
                  <div className="flex items-center gap-4 mt-3">
                    {r.responded ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        ✓ Vous avez répondu
                      </span>
                    ) : (
                      <button className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:underline">
                        <MessageCircle size={11} /> Répondre
                      </button>
                    )}
                    <button className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-brand-500 transition">
                      <ThumbsUp size={11} /> Remercier
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
