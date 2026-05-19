import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles, ShieldCheck, Globe, KeyRound, Mail } from "lucide-react";
import { ComingSoonClient } from "./ComingSoonClient";

export const metadata: Metadata = {
  title: "Bisecco · Bientôt disponible sur bisecco.fr",
  description:
    "Bisecco · Le 1er réseau social d'artisans français vérifiés SIREN, développé pour les particuliers. Inscrivez-vous pour être prévenu du lancement.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ComingSoonPage() {
  return (
    <div
      className="relative min-h-screen w-full text-white overflow-hidden"
      style={{ backgroundColor: "#040A1C" }}
    >
      {/* Mesh gradient principal · fond animé multi-couleurs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 18% 22%, rgba(240, 122, 47, 0.28) 0%, transparent 45%),
            radial-gradient(at 82% 78%, rgba(59, 130, 246, 0.22) 0%, transparent 50%),
            radial-gradient(at 50% 100%, rgba(168, 85, 247, 0.18) 0%, transparent 55%),
            radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
            radial-gradient(at 0% 50%, rgba(34, 197, 94, 0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Orbes flottantes animées */}
      <div className="absolute top-[12%] left-[18%] w-[420px] h-[420px] rounded-full bg-brand-500/35 blur-[140px] pointer-events-none animate-float" />
      <div
        className="absolute bottom-[18%] right-[14%] w-[380px] h-[380px] rounded-full bg-blue-500/30 blur-[130px] pointer-events-none animate-float"
        style={{ animationDelay: "2s", animationDuration: "8s" }}
      />
      <div
        className="absolute top-[55%] left-[55%] w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none animate-float"
        style={{ animationDelay: "4s", animationDuration: "10s" }}
      />

      {/* Pattern hexagonal subtil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='96' viewBox='0 0 84 96'><path d='M42 0L84 24v48L42 96 0 72V24z' fill='none' stroke='%23ffffff' stroke-width='1.2'/></svg>\")",
          backgroundSize: "84px 96px",
        }}
      />

      {/* Étoiles scintillantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: "8%", left: "12%", delay: "0s" },
          { top: "15%", left: "85%", delay: "1.2s" },
          { top: "32%", left: "8%", delay: "2.4s" },
          { top: "48%", left: "92%", delay: "0.6s" },
          { top: "62%", left: "15%", delay: "3.1s" },
          { top: "78%", left: "78%", delay: "1.8s" },
          { top: "88%", left: "30%", delay: "2.7s" },
          { top: "22%", left: "62%", delay: "1.5s" },
          { top: "70%", left: "45%", delay: "0.9s" },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white animate-pulse-slow"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              boxShadow: "0 0 8px 2px rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>

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
            <Image src="/logo.jpg" alt="Bisecco" width={48} height={48} />
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl tracking-[0.16em] leading-tight">
              BISECCO
            </div>
            <div className="text-[0.62rem] text-brand-400 font-bold tracking-[0.18em] uppercase">
              Réseau d&apos;artisans
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
          <h1 className="text-center text-[34px] sm:text-[48px] lg:text-[60px] leading-[1.05] font-extrabold tracking-[-0.025em]">
            Service technique
            <br />
            <span className="text-brand-500">
              Bisecco
            </span>
          </h1>

          <p className="mt-6 text-center text-white/70 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            <strong className="text-white">Bisecco</strong> est accessible sur{" "}
            <a
              href="https://bisecco.fr"
              className="text-brand-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Globe size={14} /> bisecco.fr
            </a>
          </p>
          <p className="mt-2 text-center text-white/55 text-sm max-w-md mx-auto">
            Le 1<sup>er</sup> réseau social d&apos;artisans français vérifiés SIREN, développé pour
            les particuliers.
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

          {/* Footer info */}
          <div className="mt-12 text-center text-[0.66rem] text-white/30 font-mono">
            <p className="inline-flex items-center gap-1.5">
              <KeyRound size={10} />
              Accès restreint · Code requis pour entrée anticipée
            </p>
          </div>
        </div>

        {/* Footer fixe en bas */}
        <footer className="absolute bottom-4 left-0 right-0 text-center text-[0.66rem] text-white/30">
          © {new Date().getFullYear()} Bisecco · Tous droits réservés ·{" "}
          <a href="https://bisecco.fr" className="hover:text-white/60 transition">bisecco.fr</a>
        </footer>
      </main>
    </div>
  );
}
