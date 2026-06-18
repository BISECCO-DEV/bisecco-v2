import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Briefcase, Users, ShieldCheck, ArrowRight, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Partenaires B2B",
  description: "Bisecco s'associe aux assureurs, syndics, agences immobilières et entreprises. Découvrez nos offres B2B.",
};

const PARTNERS = [
  { icon: ShieldCheck, title: "Assureurs",         desc: "Redirigez vos sinistrés vers nos professionnels vérifiés. Médiation incluse.",         cta: "En savoir plus" },
  { icon: Building2,   title: "Syndics de copro",  desc: "Tarifs négociés pour vos copropriétés. Devis comparés automatiquement.",         cta: "Demander une démo" },
  { icon: Briefcase,   title: "Agences immo",      desc: "Travaux pré-vente et post-acquisition. Professionnels validés, devis sous 24h.",     cta: "Devenir partenaire" },
  { icon: Users,       title: "Entreprises",       desc: "Avantages salariés : services professionnels à prix négociés (cuisine, déménagement, etc.).", cta: "Offre entreprises" },
];

export default function PartenairesProPage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <section className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-brand-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="container-default text-center relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <Award size={11} /> Partenariats B2B
          </span>
          <h1 className="text-3xl md:text-[2.6rem] font-bold mt-4 tracking-[-0.02em] leading-[1.05]">
            Devenez partenaire<br />
            <span className="text-brand-500">de Bisecco.</span>
          </h1>
          <p className="mt-4 text-white/65 max-w-xl mx-auto leading-relaxed">
            Assureurs, syndics, agences, entreprises : connectez vos clients à 250+ professionnels vérifiés, avec des tarifs négociés.
          </p>
        </div>
      </section>

      <div className="container-default py-12">
        {/* Grid partners */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {PARTNERS.map((p) => (
            <article key={p.title} className="bg-white rounded-3xl p-7 border border-ink-100 hover:border-brand-300 hover:-translate-y-1 transition group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-4">
                <p.icon size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-ink-700 tracking-tight">{p.title}</h3>
              <p className="text-ink-500 mt-2 leading-relaxed">{p.desc}</p>
              <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:gap-2 transition-all">
                {p.cta} <ArrowRight size={13} />
              </button>
            </article>
          ))}
        </div>

        {/* Stats */}
        <section className="bg-white rounded-3xl border border-ink-100 p-8 mb-14">
          <h2 className="text-xl font-bold text-ink-700 tracking-tight mb-1">Notre impact, en chiffres</h2>
          <p className="text-sm text-ink-400 mb-7">Données actualisées au 15 mai 2026.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "247",  label: "Professionnels actifs"      },
              { value: "12",   label: "Partenaires B2B"      },
              { value: "98%",  label: "Satisfaction client"  },
              { value: "<24h", label: "Délai d'intervention" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-ink-700 tracking-tight">{s.value}</div>
                <div className="text-xs text-ink-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <h2 className="text-xl font-bold text-ink-700 tracking-tight mb-5">Comment ça marche ?</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          {[
            { num: "01", title: "On échange",       text: "Premier appel pour comprendre votre besoin et identifier les synergies." },
            { num: "02", title: "On co-construit",  text: "Définition des tarifs, périmètre, intégration technique (API si besoin)." },
            { num: "03", title: "On déploie",       text: "Onboarding équipe, formation, communication et lancement officiel." },
          ].map((s) => (
            <div key={s.num} className="bg-white rounded-2xl p-6 border border-ink-100 relative">
              <span className="absolute top-4 right-4 text-3xl font-bold text-ink-100">{s.num}</span>
              <h3 className="font-bold text-ink-700">{s.title}</h3>
              <p className="text-sm text-ink-500 mt-2 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="bg-gradient-to-br from-ink-800 to-ink-700 rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Discutons de votre projet
            </h2>
            <p className="text-white/65 mt-2 max-w-md mx-auto">
              Premier appel gratuit de 30 min pour évaluer les synergies.
            </p>
            <Link href="/contact?sujet=partenariat" className="btn-primary mt-6 inline-flex">
              Prendre rendez-vous <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
