import type { Metadata } from "next";
import Link from "next/link";
import { PosterForm } from "./PosterForm";
import { ArrowLeft, Briefcase, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Poster une offre d'emploi",
  description: "Publiez une offre d'emploi pour votre entreprise artisanale. Validation SIREN, candidats qualifiés, gratuit jusqu'à 30 jours.",
};

export default function PosterPage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10">
        <Link href="/emploi" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Toutes les offres
        </Link>

        <div className="mt-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <Briefcase size={11} /> Recruteur
          </span>
          <h1 className="text-3xl md:text-[2.1rem] font-bold mt-3 text-ink-700 tracking-[-0.02em] leading-tight">
            Postez votre <span className="text-brand-500">offre d&apos;emploi</span>
          </h1>
          <p className="text-ink-400 mt-2">
            Publication gratuite, candidats qualifiés. Votre entreprise est validée via votre SIREN.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-7 mb-8">
          {[
            { icon: ShieldCheck, text: "Entreprises vérifiées SIREN" },
            { icon: Briefcase,   text: "100% gratuit pendant 30j" },
            { icon: Zap,         text: "Candidatures sous 48h" },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-ink-100 text-sm font-semibold text-ink-700">
              <t.icon size={15} className="text-emerald-500 flex-shrink-0" />
              {t.text}
            </div>
          ))}
        </div>

        <PosterForm />
      </div>
    </div>
  );
}
