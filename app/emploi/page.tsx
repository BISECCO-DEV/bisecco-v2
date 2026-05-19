import type { Metadata } from "next";
import Link from "next/link";
import { EmploiClient } from "./EmploiClient";
import { Briefcase, TrendingUp, Award, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Emploi artisanat · Le 1er job board des métiers d'artisans",
  description: "Trouvez un emploi dans l'artisanat : boulanger, plombier, maçon, menuisier, électricien, boucher. Apprentissage, CDI, alternance, partout en France.",
};

export default function EmploiPage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-brand-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="container-default relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <Briefcase size={11} /> Emploi artisanat · Nouveau
          </span>
          <h1 className="text-3xl md:text-[2.8rem] font-bold mt-4 tracking-[-0.02em] leading-[1.05]">
            Le 1<sup className="text-xl">er</sup> job board<br />
            <span className="text-brand-500">
              dédié aux métiers d&apos;artisans.
            </span>
          </h1>
          <p className="mt-5 text-white/65 max-w-2xl leading-relaxed">
            Apprentissages, CDI, alternances : trouvez un emploi dans l&apos;artisanat près de chez vous. Pas de spam, pas de fausses annonces · les entreprises sont vérifiées via leur SIREN.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            {[
              { value: "1 247", label: "Offres actives" },
              { value: "288",   label: "Métiers couverts" },
              { value: "100%",  label: "Entreprises vérifiées" },
              { value: "<24h",  label: "Mise en relation" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-default py-10">
        {/* Two CTAs */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/mon-profil/cv"
            className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
                <Award size={20} className="text-brand-500" />
              </div>
              <div>
                <h3 className="font-bold text-ink-700">Je cherche un job</h3>
                <p className="text-xs text-ink-400">Créer/modifier mon CV en 2 minutes</p>
              </div>
            </div>
            <span className="text-brand-500 group-hover:translate-x-1 transition">→</span>
          </Link>

          <Link
            href="/emploi/poster"
            className="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-ink-800 to-ink-700 text-white border border-ink-700 hover:-translate-y-0.5 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                <Briefcase size={20} className="text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold">Je recrute</h3>
                <p className="text-xs text-white/55">Poster une offre d&apos;emploi</p>
              </div>
            </div>
            <span className="text-brand-400 group-hover:translate-x-1 transition">→</span>
          </Link>
        </div>

        <EmploiClient />

        {/* Pourquoi Bisecco emploi */}
        <section className="mt-14 grid md:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, title: "200 000+ postes",   text: "à pourvoir dans l'artisanat français (chiffres CMA France 2024)." },
            { icon: Award,      title: "SIREN vérifié",      text: "100% des recruteurs ont leur entreprise contrôlée. Aucune offre fantôme." },
            { icon: MapPin,     title: "Près de chez vous",   text: "Filtre par ville, code postal, rayon d'intervention. Métiers locaux d'abord." },
          ].map((c) => (
            <div key={c.title} className="bg-white rounded-2xl p-5 border border-ink-100">
              <c.icon size={20} className="text-brand-500 mb-3" />
              <h3 className="font-bold text-ink-700">{c.title}</h3>
              <p className="text-sm text-ink-500 mt-1 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
