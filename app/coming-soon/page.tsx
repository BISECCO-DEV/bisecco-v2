import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles, ShieldCheck, KeyRound, Mail } from "lucide-react";
import { ComingSoonClient } from "./ComingSoonClient";

export const metadata: Metadata = {
  title: "Bisecco · Le 1er réseau social de professionnels français vérifiés SIREN",
  description:
    "Bisecco · Annuaire de professionnels français vérifiés SIREN. Trouvez un professionnel qualifié près de chez vous (plombier, électricien, maçon, menuisier, développeur web…). 100% gratuit, 0% commission. Nouvelle version bientôt disponible.",
  keywords: ["professionnels", "professionnels vérifiés", "SIREN", "plombier", "électricien", "annuaire professionnels", "devis gratuit"],
  alternates: { canonical: "https://bisecco.fr" },
  openGraph: {
    title: "Bisecco · Réseau de professionnels français vérifiés",
    description: "Annuaire 100% gratuit · 0% commission · SIREN vérifié.",
    type: "website",
    locale: "fr_FR",
    url: "https://bisecco.fr",
    siteName: "Bisecco",
  },
};

export const dynamic = "force-dynamic";

export default function ComingSoonPage() {
  return (
    <div
      className="relative min-h-screen w-full text-white overflow-hidden"
      style={{ backgroundColor: "#040A1C" }}
    >
      {/* Mesh gradient principal · simplifié (2 gradients au lieu de 5) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 18% 22%, rgba(240, 122, 47, 0.28) 0%, transparent 45%),
            radial-gradient(at 82% 78%, rgba(59, 130, 246, 0.22) 0%, transparent 50%)
          `,
        }}
      />

      {/* Orbes statiques desktop · animations retirées pour perf mobile */}
      <div className="absolute top-[12%] left-[18%] w-[420px] h-[420px] rounded-full bg-brand-500/35 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[18%] right-[14%] w-[380px] h-[380px] rounded-full bg-blue-500/30 blur-[130px] pointer-events-none" />

      {/* Pattern hexagonal subtil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='96' viewBox='0 0 84 96'><path d='M42 0L84 24v48L42 96 0 72V24z' fill='none' stroke='%23ffffff' stroke-width='1.2'/></svg>\")",
          backgroundSize: "84px 96px",
        }}
      />

      {/* Vignette douce autour */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(4, 10, 28, 0.7) 100%)",
        }}
      />

      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:py-16">
        {/* Logo header */}
        <div className="flex items-center gap-3 mb-10 sm:mb-14">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/15 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)]">
            <Image
              src="/logo.jpg"
              alt="Logo Bisecco · réseau de professionnels français vérifiés"
              width={48}
              height={48}
              priority
              fetchPriority="high"
            />
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl tracking-[0.16em] leading-tight">
              BISECCO
            </div>
            <div className="text-[0.62rem] text-brand-400 font-bold tracking-[0.18em] uppercase">
              Réseau de professionnels
            </div>
          </div>
        </div>

        {/* Carte centrale */}
        <div className="w-full max-w-xl">
          {/* Status badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-extrabold tracking-[0.16em] uppercase backdrop-blur-md">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-brand-400 animate-ping opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-brand-500" />
              </span>
              Préparation lancement
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-center text-[32px] sm:text-[44px] lg:text-[54px] leading-[1.1] font-extrabold tracking-[-0.025em]">
            <span className="text-brand-500">BISECCO</span> évolue.
          </h1>

          <p className="mt-6 text-center text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Notre plateforme est actuellement en maintenance afin de déployer une{" "}
            <strong className="text-white">Version 2 plus complète</strong>, avec de nouvelles
            fonctionnalités et services dédiés aux <strong className="text-white">particuliers</strong> et aux{" "}
            <strong className="text-white">professionnels</strong>.
          </p>

          {/* Composant client : code + email */}
          <ComingSoonClient />

          {/* Trust signals */}
          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { icon: ShieldCheck, label: "SIREN vérifié" },
              { icon: Sparkles, label: "100 % gratuit" },
              { icon: Mail, label: "0 % commission" },
            ].map((t) => (
              <div
                key={t.label}
                className="bg-white/[0.04] border border-white/[0.10] rounded-2xl p-3 text-center backdrop-blur-md"
              >
                <t.icon size={14} className="text-brand-400 mx-auto mb-1.5" />
                <div className="text-[0.66rem] font-extrabold text-white/85 leading-tight">
                  {t.label}
                </div>
              </div>
            ))}
          </div>

          {/* Footer info · contraste renforcé pour l'accessibilité */}
          <div className="mt-12 text-center text-[0.72rem] text-white/65 font-mono">
            <p className="inline-flex items-center gap-1.5">
              <KeyRound size={10} aria-hidden="true" />
              Accès restreint · Code requis pour entrée anticipée
            </p>
          </div>
        </div>

        {/* Footer fixe en bas · contraste renforcé */}
        <footer className="absolute bottom-4 left-0 right-0 text-center text-[0.72rem] text-white/60">
          © {new Date().getFullYear()} Bisecco · Tous droits réservés ·{" "}
          <a href="https://bisecco.fr" className="text-white/75 hover:text-white transition underline-offset-2 hover:underline">
            bisecco.fr
          </a>
        </footer>
      </main>
    </div>
  );
}
