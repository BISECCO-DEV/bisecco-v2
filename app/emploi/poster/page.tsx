import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, ShieldCheck, Zap, Lock, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Poster une offre d'emploi · Abonnement Pro",
  description: "Publiez vos offres d'emploi pour votre entreprise artisanale. Fonctionnalité réservée aux abonnés Pro, bientôt disponible sur Bisecco.",
};

export default function PosterPage() {
  return (
    <div className="bg-ink-50 min-h-screen pb-16">
      <div className="container-default py-10 max-w-3xl">
        <Link href="/emploi" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold transition">
          <ArrowLeft size={14} /> Toutes les offres
        </Link>

        <div className="mt-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <Briefcase size={11} /> Recruteur · Abonnement Pro
          </span>
          <h1 className="text-3xl md:text-[2.1rem] font-bold mt-3 text-ink-700 tracking-[-0.02em] leading-tight">
            Postez vos <span className="text-brand-500">offres d&apos;emploi</span>
          </h1>
          <p className="text-ink-400 mt-2">
            Le dépôt d&apos;offres d&apos;emploi sera réservé aux entreprises abonnées au plan <strong>Pro</strong>. Bisecco reste 100% gratuit pour les particuliers et pour la mise en avant de votre profil artisan.
          </p>
        </div>

        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 text-white border border-ink-700 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 mb-4">
              <Lock size={20} className="text-brand-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Bientôt disponible</h2>
            <p className="text-white/70 mt-2 text-sm leading-relaxed max-w-xl">
              Nous finalisons l&apos;offre d&apos;abonnement Pro pour recruteurs : publication illimitée, validation SIREN, mise en avant des annonces et tri par compétences. En attendant, créez votre compte pour être prévenu dès le lancement.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: ShieldCheck, text: "Entreprises vérifiées SIREN" },
                { icon: Briefcase,   text: "Offres illimitées (plan Pro)" },
                { icon: Zap,         text: "Candidatures qualifiées" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-white/85">
                  <t.icon size={14} className="text-brand-400 flex-shrink-0" />
                  {t.text}
                </div>
              ))}
            </div>

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
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
