import type { Metadata } from "next";
import Image from "next/image";
import { Wrench, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Bisecco · Maintenance · Le 1er réseau de professionnels français vérifiés SIREN" },
  description:
    "Bisecco · Annuaire de professionnels français vérifiés SIREN. Plombier, électricien, maçon, menuisier, développeur web. 100% gratuit, 0% commission. Plateforme en mise à jour, retour très prochain.",
  keywords: ["professionnels", "professionnels vérifiés", "SIREN", "annuaire professionnels", "devis gratuit"],
  alternates: { canonical: "https://bisecco.fr" },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#05122e] relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full bg-brand-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative w-full max-w-md text-center text-white">
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-11 h-11 rounded-xl overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="Logo Bisecco · réseau de professionnels français vérifiés"
              width={44}
              height={44}
              priority
              fetchPriority="high"
            />
          </div>
          <span className="font-bold text-lg tracking-[0.12em]">BISECCO</span>
        </div>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mb-6 relative">
          <Wrench size={32} className="text-brand-400 animate-pulse-slow" />
          <span className="absolute inset-0 rounded-3xl border border-brand-500/30 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[0.65rem] font-bold tracking-[0.14em] uppercase mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          Maintenance en cours
        </span>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Nous revenons <span className="text-brand-500">très bientôt</span>
        </h1>
        <p className="text-white/65 mt-4 leading-relaxed">
          Notre équipe finalise les dernières mises à jour pour vous offrir une expérience encore meilleure. Merci de votre patience.
        </p>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full w-[72%] relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-[0.7rem] text-white/55 font-semibold">
            <span>Progression</span>
            <span>72%</span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/65">
          <ShieldCheck size={12} className="text-emerald-400" />
          Toutes vos données sont en sécurité
        </div>

        <p className="mt-8 text-xs text-white/70">
          Pour toute urgence, écrivez-nous à <a href="mailto:contact@bisecco.fr" className="text-brand-300 font-bold hover:text-brand-200 underline-offset-2 hover:underline">contact@bisecco.fr</a>
        </p>
      </div>
    </div>
  );
}
