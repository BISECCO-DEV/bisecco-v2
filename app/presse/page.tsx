import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Download, Mail, ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Espace presse",
  description: "Kit média Bisecco : logos, photos, communiqués, contact RP. Tout pour vos articles.",
  alternates: { canonical: "/presse" },
};

const PRESS_ARTICLES = [
  { source: "Le Parisien",    date: "12 avril 2026",  title: "Bisecco, la pépite francilienne qui veut révolutionner la mise en relation avec les artisans" },
  { source: "Capital",        date: "5 avril 2026",   title: "Avec Bisecco, fini les arnaques : 100% des artisans sont vérifiés via le SIREN officiel" },
  { source: "L'Usine Nouvelle", date: "28 mars 2026", title: "Comment Bisecco compte digitaliser 250 métiers d'artisans français" },
  { source: "Les Échos",      date: "15 mars 2026",   title: "Plateformes d'artisans : Bisecco tire son épingle du jeu avec son modèle gratuit" },
];

export default function PressePage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px]" />
        <div className="container-default text-center relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/85 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <Newspaper size={11} /> Espace presse
          </span>
          <h1 className="text-3xl md:text-[2.6rem] font-bold mt-4 tracking-[-0.02em] leading-[1.1]">
            Bisecco dans <span className="text-brand-500">la presse</span>
          </h1>
          <p className="mt-4 text-white/65 max-w-xl mx-auto leading-relaxed">
            Kit média, logos, photos, communiqués. Tout pour parler de nous.
          </p>
        </div>
      </section>

      <div className="container-default py-12">
        {/* Kit média */}
        <section className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { title: "Logos & charte", desc: "Pack ZIP avec logos SVG, PNG, charte couleurs", icon: Download, count: "4 formats" },
            { title: "Photos HD",      desc: "Photos d'illustration en haute résolution",   icon: Download, count: "12 photos" },
            { title: "Communiqués",    desc: "Tous les communiqués de presse récents",      icon: Download, count: "5 PDF" },
          ].map((k) => (
            <button key={k.title} className="text-left bg-white rounded-2xl p-6 border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition group">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition">
                <k.icon size={20} className="text-brand-500" />
              </div>
              <h3 className="font-bold text-ink-700">{k.title}</h3>
              <p className="text-sm text-ink-500 mt-1">{k.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-500 group-hover:gap-2 transition-all">
                Télécharger ({k.count}) <ArrowRight size={11} />
              </div>
            </button>
          ))}
        </section>

        {/* Stats clés */}
        <section className="bg-white rounded-2xl border border-ink-100 p-8 mb-12">
          <h2 className="text-xl font-bold text-ink-700 mb-1 tracking-tight">Chiffres clés</h2>
          <p className="text-sm text-ink-400 mb-6">Au 15 mai 2026, dernière mise à jour le 1er du mois.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "247",   label: "Professionnels vérifiés" },
              { value: "1 893", label: "Devis traités" },
              { value: "4.8/5", label: "Note moyenne" },
              { value: "288",   label: "Métiers couverts" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-ink-700 tracking-tight">{s.value}</div>
                <div className="text-xs text-ink-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mentions presse */}
        <h2 className="text-xl font-bold text-ink-700 mb-5 tracking-tight">Bisecco dans les médias</h2>
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden mb-12">
          {PRESS_ARTICLES.map((a, i) => (
            <div key={i} className={`flex items-start gap-4 p-5 hover:bg-ink-50/60 transition cursor-pointer ${i > 0 ? "border-t border-ink-100" : ""}`}>
              <div className="px-3 py-1 rounded-full bg-ink-50 text-[0.7rem] font-bold tracking-wider uppercase text-ink-700 flex-shrink-0">
                {a.source}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-ink-700 leading-snug">{a.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-ink-400"><Calendar size={11} /> {a.date}</div>
              </div>
              <ArrowRight size={14} className="text-ink-300 flex-shrink-0 self-center" />
            </div>
          ))}
        </div>

        {/* Contact RP */}
        <section className="bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-8 md:p-10 border border-brand-200/60">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <Mail size={24} className="text-brand-500 mb-3" />
              <h2 className="text-2xl font-bold text-ink-700 tracking-tight">Contact presse</h2>
              <p className="text-sm text-ink-500 mt-2 max-w-md">
                Pour toute demande d&apos;interview, demande de prêt visuel, ou information complémentaire, contactez-nous directement.
              </p>
              <div className="mt-4 space-y-1 text-sm">
                <div className="font-bold text-ink-700">Laurent Nero</div>
                <div className="text-ink-500">Fondateur & CEO</div>
                <a href="mailto:presse@bisecco.fr" className="text-brand-500 font-bold hover:underline inline-block mt-1">presse@bisecco.fr</a>
              </div>
            </div>
            <Link href="/contact?sujet=presse" className="btn-primary">Demande d&apos;interview</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
