import type { Metadata } from "next";
import { DevisForm } from "./DevisForm";
import { ShieldCheck, Clock, Zap } from "lucide-react";
import { getMetierOptions } from "@/lib/db/metier-options";

export const metadata: Metadata = {
  title: "Demander un devis gratuit",
  description: "Décrivez votre projet en 2 minutes, ajoutez des photos et recevez plusieurs devis d'artisans vérifiés. 100% gratuit, sans engagement.",
};

export default async function DevisPage() {
  const metierOptions = await getMetierOptions();
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="container-default py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold tracking-wider uppercase">
            ⚡ Devis gratuit en 2 minutes
          </span>
          <h1 className="text-3xl md:text-[2.4rem] font-bold mt-5 text-ink-700 tracking-tight">
            Décrivez votre projet,{" "}
            <span className="text-brand-500">les artisans répondent</span>
          </h1>
          <p className="mt-3 text-ink-400 leading-relaxed">
            Remplissez ce formulaire en moins de 2 minutes. Plusieurs artisans vérifiés vous proposeront un devis adapté. Sans engagement.
          </p>
        </div>

        {/* Trust signals */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8 max-w-3xl mx-auto">
          {[
            { icon: ShieldCheck, text: "Artisans SIREN vérifiés", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
            { icon: Clock,       text: "Réponse sous 24h",         color: "text-blue-500",    bg: "bg-blue-50",    border: "border-blue-200" },
            { icon: Zap,         text: "100% gratuit, sans engagement", color: "text-brand-500", bg: "bg-brand-50", border: "border-brand-200" },
          ].map((t) => (
            <div key={t.text} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${t.bg} border ${t.border} text-sm font-semibold text-ink-700`}>
              <t.icon size={16} className={`${t.color} flex-shrink-0`} />
              {t.text}
            </div>
          ))}
        </div>

        {/* Form */}
        <DevisForm metierOptions={metierOptions} />
      </div>
    </div>
  );
}
