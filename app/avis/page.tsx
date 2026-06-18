import type { Metadata } from "next";
import Link from "next/link";
import { AvisClient } from "./AvisClient";
import { ShieldCheck, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Tous les avis vérifiés",
  description: "Découvrez les 247 avis clients vérifiés sur Bisecco. Seuls les clients ayant échangé avec un professionnel via la plateforme peuvent en laisser.",
};

export default function AvisPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Hero header */}
      <section className="relative bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-brand-500/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="container-default py-16 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white font-semibold transition"
          >
            ← Retour à l&apos;accueil
          </Link>

          <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mt-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
                <ShieldCheck size={11} /> Avis 100% vérifiés
              </span>
              <h1 className="text-3xl md:text-[2.6rem] font-bold mt-4 tracking-[-0.02em] leading-[1.1]">
                Tous les avis<br />
                <span className="text-white/55 font-medium">de notre communauté.</span>
              </h1>
              <p className="mt-4 text-white/65 max-w-xl leading-relaxed">
                Seuls les clients ayant réellement échangé avec un professionnel via Bisecco peuvent laisser un avis. Aucune note achetée, aucune fraude possible.
              </p>
            </div>
            <div className="flex items-center gap-6 md:border-l md:border-white/15 md:pl-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">4.8</span>
                  <span className="text-white/55 text-sm">/5</span>
                </div>
                <div className="flex gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#f07a2f" className="text-brand-500" />
                  ))}
                </div>
              </div>
              <div className="text-sm text-white/55 leading-tight">
                <strong className="block text-white text-xl">247</strong>
                avis publiés
              </div>
            </div>
          </div>
        </div>
      </section>

      <AvisClient />
    </div>
  );
}
