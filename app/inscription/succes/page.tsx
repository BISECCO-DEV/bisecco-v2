import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2, Mail, ShieldCheck, Clock, Sparkles, Home, MessageCircle,
} from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";

export const metadata: Metadata = {
  title: "Inscription validée · Bisecco",
  description: "Votre inscription Bisecco a bien été enregistrée. Activez votre compte depuis votre boîte mail.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ role?: string; email?: string }>;

export default async function InscriptionSuccesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { role, email } = await searchParams;
  const isArtisan = role === "artisan";
  const maskedEmail = email
    ? email.replace(/^(.{2}).*(@.*)$/, "$1***$2")
    : "votre boîte mail";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-sand-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Hero card succès */}
        <div className="bg-white rounded-3xl border border-sand-200 shadow-[0_20px_50px_-20px_rgba(13,30,74,0.18)] p-8 sm:p-12 text-center">
          {/* Icône succès */}
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 grid place-items-center">
              <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2} />
            </div>
            <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-brand-500 grid place-items-center shadow-[0_4px_12px_rgba(240,122,47,0.45)]">
              <Sparkles size={14} className="text-white" strokeWidth={2.4} />
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.66rem] font-bold tracking-[0.16em] uppercase mb-4">
            ✓ Inscription enregistrée
          </div>

          <h1 className="font-display font-semibold text-[32px] sm:text-[42px] tracking-[-0.025em] leading-[1.1] text-ink-900">
            Bienvenue sur <span className="text-brand-500">Bisecco</span> !
          </h1>

          <p className="mt-5 text-ink-500 text-[1rem] leading-relaxed max-w-lg mx-auto">
            Votre {isArtisan ? "compte artisan" : "compte particulier"} a bien été créé.
            {isArtisan
              ? " Notre équipe vérifie votre SIREN et valide votre profil sous peu."
              : " Pour finaliser votre inscription, vous devez activer votre adresse email."}
          </p>

          {/* Étapes */}
          <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
            {isArtisan ? (
              <>
                {/* Étape 1 artisan : email auto-validé */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 grid place-items-center text-white flex-shrink-0 font-display font-semibold">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900 text-[0.94rem] inline-flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Email auto-validé pour les pros
                    </div>
                    <p className="text-[0.84rem] text-ink-600 mt-1 leading-relaxed">
                      Pas besoin de cliquer sur un lien : votre adresse <strong className="text-ink-900">{maskedEmail}</strong> est déjà confirmée.
                    </p>
                  </div>
                </div>

                {/* Étape 2 artisan : validation admin */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-50/60 border border-brand-200/60">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 grid place-items-center text-white flex-shrink-0 font-display font-semibold">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900 text-[0.94rem] inline-flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-brand-600" />
                      Notre équipe valide votre profil
                    </div>
                    <p className="text-[0.84rem] text-ink-600 mt-1 leading-relaxed">
                      Nous vérifions votre numéro SIREN et vos métiers déclarés.
                      Vous recevrez un email dès que votre profil sera <strong className="text-ink-900">approuvé et visible</strong>.
                    </p>
                  </div>
                </div>

                {/* Étape 3 artisan : connexion */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
                  <div className="w-10 h-10 rounded-xl bg-ink-700 grid place-items-center text-white flex-shrink-0 font-display font-semibold">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900 text-[0.94rem] inline-flex items-center gap-1.5">
                      <Sparkles size={14} className="text-ink-700" />
                      Vous accédez à toute la plateforme
                    </div>
                    <p className="text-[0.84rem] text-ink-600 mt-1 leading-relaxed">
                      Une fois validé : profil public, messagerie, fil d&apos;actualité, devis entrants — tout est débloqué.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Étape 1 particulier : vérif email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand-50/60 border border-brand-200/60">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 grid place-items-center text-white flex-shrink-0 font-display font-semibold">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900 text-[0.94rem] inline-flex items-center gap-1.5">
                      <Mail size={14} className="text-brand-500" />
                      Vérifiez votre boîte mail
                    </div>
                    <p className="text-[0.84rem] text-ink-600 mt-1 leading-relaxed">
                      Un email vous a été envoyé à <strong className="text-ink-900">{maskedEmail}</strong>.
                      Cliquez sur le lien d&apos;activation à l&apos;intérieur.
                    </p>
                    <p className="text-[0.74rem] text-ink-400 mt-1.5">
                      Pensez à vérifier vos spams si l&apos;email tarde à arriver.
                    </p>
                  </div>
                </div>

                {/* Étape 2 particulier : connexion */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-sand-100/70 border border-sand-200">
                  <div className="w-10 h-10 rounded-xl bg-ink-700 grid place-items-center text-white flex-shrink-0 font-display font-semibold">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900 text-[0.94rem] inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-ink-700" />
                      Connectez-vous et explorez
                    </div>
                    <p className="text-[0.84rem] text-ink-600 mt-1 leading-relaxed">
                      Dès votre email confirmé, vous pourrez vous connecter et trouver des artisans
                      vérifiés près de chez vous.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CtaButton href="/" variant="primary" size="md" icon={Home}>
              Retour à l&apos;accueil
            </CtaButton>
            <CtaButton href="/contact" variant="white" size="md" icon={MessageCircle}>
              Besoin d&apos;aide ?
            </CtaButton>
          </div>

          {/* Sous-pied */}
          <p className="mt-7 pt-6 border-t border-sand-200 text-[0.78rem] text-ink-400">
            {isArtisan
              ? "Une question sur le délai de validation ? "
              : "Vous n'avez pas reçu d'email ? "}
            <Link href="/contact" className="font-semibold text-brand-500 hover:underline">
              Contactez le support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
