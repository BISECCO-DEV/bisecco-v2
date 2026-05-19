import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, MapPin, Heart, Coffee, Zap, ArrowRight, Users, Award, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Carrières — Rejoignez Bisecco",
  description: "Bisecco recrute. Découvrez nos offres d'emploi et notre culture. Télétravail flexible, équipe à taille humaine.",
};

const JOBS = [
  { title: "Développeur·euse Full-Stack (H/F)", type: "CDI",     location: "Meaux ou Full Remote", salary: "45-65K€",  team: "Tech" },
  { title: "Customer Success Manager",          type: "CDI",     location: "Meaux ou Hybride",     salary: "35-45K€",  team: "Customer" },
  { title: "Growth Marketer",                   type: "CDI",     location: "Full Remote",          salary: "40-55K€",  team: "Marketing" },
  { title: "UX/UI Designer",                    type: "Freelance", location: "Full Remote",        salary: "TJM 500€", team: "Product" },
];

export default function CarrieresPage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full bg-brand-500/15 blur-[140px]" />
        <div className="container-default text-center relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <Briefcase size={11} /> On recrute
          </span>
          <h1 className="text-3xl md:text-[2.8rem] font-bold mt-4 tracking-[-0.02em] leading-[1.05]">
            Construisez avec nous <br />
            <span className="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">
              le futur de l&apos;artisanat français.
            </span>
          </h1>
          <p className="mt-5 text-white/65 max-w-xl mx-auto leading-relaxed">
            Une équipe de passionné·es, basée à Meaux mais ouverte au full remote. Pas de bullshit, juste du produit qui aide les artisans.
          </p>
        </div>
      </section>

      <div className="container-default py-12">
        {/* Avantages */}
        <h2 className="text-xl font-bold text-ink-700 mb-5 tracking-tight">Pourquoi nous rejoindre ?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            { icon: Heart,      title: "Full remote possible",  desc: "Travaillez d'où vous voulez en France" },
            { icon: Coffee,     title: "Bureaux à Meaux",       desc: "Café, cuisine équipée, salle de pause" },
            { icon: Zap,        title: "Stack moderne",         desc: "Next.js, TS, Supabase, IA" },
            { icon: Sparkles,   title: "Stock options",         desc: "Partagez la croissance" },
          ].map((a) => (
            <div key={a.title} className="bg-white rounded-2xl p-5 border border-ink-100">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                <a.icon size={18} className="text-brand-500" />
              </div>
              <h3 className="font-bold text-ink-700 text-sm">{a.title}</h3>
              <p className="text-xs text-ink-500 mt-1 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Offres */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-ink-700 tracking-tight">Offres ouvertes</h2>
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            {JOBS.length} postes
          </span>
        </div>
        <div className="space-y-3 mb-14">
          {JOBS.map((j) => (
            <article key={j.title} className="bg-white rounded-2xl border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.65rem] font-bold uppercase tracking-wider">
                      {j.team}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-50 border border-ink-200 text-ink-700 text-[0.65rem] font-bold uppercase tracking-wider">
                      {j.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-ink-700 text-lg">{j.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-ink-500 flex-wrap">
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {j.location}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Award size={12} /> {j.salary}</span>
                  </div>
                </div>
                <Link href={`/carrieres/${j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="btn-primary text-sm">
                  Postuler <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Spontanée */}
        <section className="bg-gradient-to-br from-brand-50 to-amber-50/30 rounded-3xl p-8 md:p-10 border border-brand-200/60 text-center">
          <Users size={28} className="mx-auto text-brand-500 mb-3" />
          <h2 className="text-2xl font-bold text-ink-700 tracking-tight">Aucune offre ne vous correspond ?</h2>
          <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto">
            Envoyez-nous une candidature spontanée. On lit toutes les candidatures.
          </p>
          <a href="mailto:jobs@bisecco.fr" className="btn-primary mt-6 inline-flex">
            Candidature spontanée
          </a>
        </section>
      </div>
    </div>
  );
}
