import { Compass, Home, MessageCircle, Search } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-sand-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_20px_50px_-20px_rgba(13,30,74,0.15)] p-10 sm:p-14 text-center max-w-lg w-full">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 grid place-items-center mx-auto mb-6">
          <Compass size={28} className="text-brand-500" strokeWidth={2} />
        </div>
        <div className="font-display font-semibold text-[64px] sm:text-[80px] leading-none text-ink-900 tracking-[-0.03em]">
          404
        </div>
        <h1 className="font-display font-semibold text-[1.5rem] tracking-tight text-ink-900 mt-4">
          Page introuvable
        </h1>
        <p className="text-ink-500 mt-3 text-[0.94rem] leading-relaxed max-w-sm mx-auto">
          La page que vous cherchez n&apos;existe pas, a été déplacée, ou le lien
          comporte une erreur.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <CtaButton href="/" variant="primary" size="md" icon={Home}>
            Accueil
          </CtaButton>
          <CtaButton href="/rechercher" variant="white" size="md" icon={Search}>
            Trouver un professionnel
          </CtaButton>
          <CtaButton href="/contact" variant="white" size="md" icon={MessageCircle}>
            Contact
          </CtaButton>
        </div>
      </div>
    </div>
  );
}
