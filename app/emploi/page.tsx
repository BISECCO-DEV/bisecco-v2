import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase, Bell, ShieldCheck, Sparkles, ArrowRight,
  Search, MessageCircle, Lock, Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Emploi artisanat · Bientôt disponible",
  description:
    "Le job board Bisecco arrive bientôt. Réservé aux entreprises abonnées Pro pour publier leurs offres, gratuit pour les candidats dès l'ouverture. En attendant, échangez en direct avec les artisans vérifiés SIREN.",
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
            <Sparkles size={11} /> Bientôt disponible
          </span>
          <h1 className="text-3xl md:text-[2.8rem] font-bold mt-4 tracking-[-0.02em] leading-[1.05]">
            Le job board des artisans<br />
            <span className="text-brand-500">arrive bientôt sur Bisecco.</span>
          </h1>
          <p className="mt-5 text-white/65 max-w-2xl leading-relaxed">
            Nous finalisons une plateforme dédiée aux offres d&apos;emploi de l&apos;artisanat français : apprentissage, alternance, CDI, freelance. La publication d&apos;offres sera réservée aux entreprises <strong className="text-white">abonnées au plan Pro</strong>. Le dépôt et la consultation seront gratuits pour les candidats dès l&apos;ouverture.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-[0_8px_24px_-8px_rgba(240,122,47,0.6)]"
            >
              <Bell size={15} /> Être prévenu du lancement
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-semibold text-sm transition"
            >
              <Mail size={15} /> Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <div className="container-default py-10 max-w-4xl">
        {/* En attendant : alternatives concrètes */}
        <div className="bg-white rounded-3xl border border-ink-100 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-brand-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-700 tracking-tight">En attendant l&apos;ouverture du job board</h2>
              <p className="text-sm text-ink-500 mt-1">
                Vous pouvez déjà entrer en relation directe avec les artisans Bisecco · pour un stage, un apprentissage, ou simplement leur proposer vos services.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <Link
              href="/rechercher"
              className="group p-5 rounded-2xl border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition bg-ink-50/60"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-ink-100 flex items-center justify-center">
                  <Search size={18} className="text-brand-500" />
                </div>
                <h3 className="font-extrabold text-ink-700 text-sm">Trouver un artisan</h3>
              </div>
              <p className="text-xs text-ink-500 leading-relaxed">
                Parcourez les profils par métier et ville. Tous vérifiés SIREN.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-bold text-brand-600">
                Parcourir l&apos;annuaire <ArrowRight size={11} />
              </span>
            </Link>

            <Link
              href="/messagerie"
              className="group p-5 rounded-2xl border border-ink-100 hover:border-brand-300 hover:-translate-y-0.5 transition bg-ink-50/60"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-ink-100 flex items-center justify-center">
                  <MessageCircle size={18} className="text-brand-500" />
                </div>
                <h3 className="font-extrabold text-ink-700 text-sm">Contacter en direct</h3>
              </div>
              <p className="text-xs text-ink-500 leading-relaxed">
                Envoyez un message à l&apos;artisan de votre choix depuis sa fiche : stage, apprentissage, candidature spontanée.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-bold text-brand-600">
                Ouvrir la messagerie <ArrowRight size={11} />
              </span>
            </Link>
          </div>
        </div>

        {/* Ce qui arrive avec le plan Pro */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white border border-ink-700 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 mb-4">
              <Lock size={20} className="text-brand-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Réservé aux abonnés Pro</h2>
            <p className="text-white/70 mt-2 text-sm leading-relaxed max-w-xl">
              La publication d&apos;offres d&apos;emploi et la consultation des candidatures reçues feront partie du plan <strong className="text-white">Bisecco Pro</strong>. Le reste de Bisecco (annuaire, devis, messagerie, signalement) reste 100% gratuit.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: Briefcase,   text: "Offres d'emploi illimitées" },
                { icon: ShieldCheck, text: "Validation SIREN automatique" },
                { icon: Sparkles,    text: "Mise en avant des annonces" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-white/85">
                  <t.icon size={14} className="text-brand-400 flex-shrink-0" />
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
