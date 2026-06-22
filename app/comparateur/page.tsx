import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Star, MapPin, Clock, Award, CheckCircle2, X, MessageCircle, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Comparer des professionnels",
  description: "Comparez jusqu'à 3 professionnels côte à côte : note, services, tarifs, distance et avis.",
  alternates: { canonical: "/comparateur" },
};

const COMPARE = [
  { id: "1", name: "Jean Dupont",   company: "Dupont Maçonnerie", avatar: "https://i.pravatar.cc/150?img=12", metier: "Maçon",      city: "Meaux",   rating: 4.8, reviews: 23, response: "2h",   priceFrom: 400,  certified: ["Qualibat", "Assurance décennale"], yearsXp: 15, accept: ["Carte", "Espèces"] },
  { id: "2", name: "Marc Lefevre",  company: "Lefevre & Fils",    avatar: "https://i.pravatar.cc/150?img=33", metier: "Maçon",      city: "Chelles", rating: 4.9, reviews: 31, response: "1h",   priceFrom: 450,  certified: ["Qualibat RGE", "Assurance décennale", "Garantie biennale"], yearsXp: 22, accept: ["Carte", "Espèces", "Chèque"] },
  { id: "3", name: "Karim Benali",  company: "KB Renovation",     avatar: "https://i.pravatar.cc/150?img=68", metier: "Maçon",      city: "Melun",   rating: 4.7, reviews: 18, response: "3h",   priceFrom: 380,  certified: ["Qualibat"], yearsXp: 8, accept: ["Espèces"] },
];

const ROWS: { label: string; getValue: (a: typeof COMPARE[number]) => React.ReactNode; highlight?: "max" | "min" }[] = [
  { label: "Note", getValue: (a) => (
    <span className="inline-flex items-center gap-1 font-bold text-ink-700">
      <Star size={13} fill="#f07a2f" className="text-brand-500" /> {a.rating}
      <span className="font-normal text-ink-400">({a.reviews})</span>
    </span>
  ), highlight: "max" },
  { label: "Métier",      getValue: (a) => <span className="font-semibold text-brand-500">{a.metier}</span> },
  { label: "Ville",       getValue: (a) => <span className="inline-flex items-center gap-1 text-ink-700"><MapPin size={11} /> {a.city}</span> },
  { label: "Expérience",  getValue: (a) => <span className="font-semibold text-ink-700">{a.yearsXp} ans</span>, highlight: "max" },
  { label: "Réponse",     getValue: (a) => <span className="text-ink-700"><Clock size={11} className="inline mr-1" />{a.response}</span> },
  { label: "À partir de", getValue: (a) => <span className="font-bold text-ink-700">{a.priceFrom} €</span>, highlight: "min" },
  { label: "Certifications", getValue: (a) => (
    <div className="flex flex-wrap gap-1">
      {a.certified.map((c) => (
        <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold">
          <CheckCircle2 size={9} /> {c}
        </span>
      ))}
    </div>
  ) },
  { label: "Paiements acceptés", getValue: (a) => <span className="text-ink-700 text-sm">{a.accept.join(" · ")}</span> },
];

export default function ComparateurPage() {
  // Calcul best/worst pour highlight
  const best: Record<string, string> = {};
  ROWS.forEach((r) => {
    if (!r.highlight) return;
    const values = COMPARE.map((a, i) => ({ id: a.id, val: r.label === "Note" ? a.rating : r.label === "Expérience" ? a.yearsXp : a.priceFrom, i }));
    const winner = r.highlight === "max"
      ? values.reduce((a, b) => (a.val > b.val ? a : b))
      : values.reduce((a, b) => (a.val < b.val ? a : b));
    best[r.label] = winner.id;
  });

  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10">
        <Link href="/rechercher" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Retour à la recherche
        </Link>

        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold text-ink-700 tracking-tight">Comparer les professionnels</h1>
          <p className="text-ink-400 mt-1">Comparez jusqu&apos;à 3 professionnels côte à côte pour faire le meilleur choix.</p>
        </div>

        {/* Header artisans */}
        <div className="grid grid-cols-[160px_repeat(3,1fr)] gap-3 mb-3">
          <div className="text-xs font-bold text-ink-400 uppercase tracking-wider self-end pb-3 pl-2">
            Critères
          </div>
          {COMPARE.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-ink-100 p-4 relative group">
              <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-ink-50 hover:bg-red-50 text-ink-400 hover:text-red-500 flex items-center justify-center transition" aria-label="Retirer">
                <X size={13} />
              </button>
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.avatar} alt={`${a.name}, ${a.metier} à ${a.city}`} className="w-16 h-16 rounded-2xl mx-auto border-2 border-white shadow-card" />
                <div className="mt-2 font-bold text-ink-700 text-sm">{a.name}</div>
                <div className="text-xs text-ink-400">{a.company}</div>
                <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.65rem] font-bold">
                  <ShieldCheck size={9} /> Vérifié
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          {ROWS.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-[160px_repeat(3,1fr)] gap-3 px-4 py-4 ${i % 2 === 0 ? "bg-ink-50/40" : ""}`}>
              <div className="text-sm font-bold text-ink-500 self-center">{row.label}</div>
              {COMPARE.map((a) => {
                const isBest = row.highlight && best[row.label] === a.id;
                return (
                  <div
                    key={a.id}
                    className={`text-sm self-center px-3 py-2 rounded-lg ${
                      isBest ? "bg-brand-50 border border-brand-200 ring-1 ring-brand-200" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {row.getValue(a)}
                      {isBest && <Award size={12} className="text-brand-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* CTA actions */}
        <div className="grid grid-cols-[160px_repeat(3,1fr)] gap-3 mt-3">
          <div />
          {COMPARE.map((a) => (
            <div key={a.id} className="flex flex-col gap-2">
              <Link href={`/profil/${a.id}`} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition">
                Voir le profil
              </Link>
              <Link href={`/devis?artisan=${a.id}`} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-ink-200 text-ink-700 text-sm font-bold hover:border-brand-500 transition">
                <MessageCircle size={13} /> Devis
              </Link>
            </div>
          ))}
        </div>

        {/* Ajouter un artisan */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-dashed border-ink-200 hover:border-brand-500 hover:bg-brand-50/30 text-ink-500 hover:text-brand-500 text-sm font-bold transition">
            <Plus size={14} /> Ajouter un 4ᵉ professionnel à comparer
          </button>
        </div>
      </div>
    </div>
  );
}
