import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight, Rocket } from "lucide-react";
import type { OnboardingStatus } from "@/lib/db/onboarding";

type Props = {
  status: OnboardingStatus;
  /** Compact = juste la barre de progression sans liste détaillée. */
  compact?: boolean;
};

/**
 * Card d'onboarding avec barre de progression circulaire + checklist.
 * Affichée en haut de /mon-profil tant que toutes les étapes ne sont pas faites.
 */
export function OnboardingChecklist({ status, compact = false }: Props) {
  if (status.percent === 100) {
    // Tout est fait → mode trophée discret (option : ne rien afficher)
    return (
      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 grid place-items-center flex-shrink-0 shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4)]">
          <CheckCircle2 size={22} className="text-white" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-[1rem] text-ink-900 leading-tight">
            Votre profil est complet !
          </h3>
          <p className="text-[0.82rem] text-ink-500 mt-0.5">
            Toutes les étapes recommandées ont été franchies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-6 relative overflow-hidden">
      {/* Halo brand discret */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-500/[0.06] blur-2xl pointer-events-none" aria-hidden />

      <div className="relative flex items-start gap-5">
        {/* Cercle de progression */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(13,30,74,0.08)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#f07a2f"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(status.percent / 100) * 201} 201`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center font-display font-semibold text-[1rem] text-ink-900">
            {status.percent}%
          </div>
        </div>

        {/* Titre + résumé */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Rocket size={14} className="text-brand-500" />
            <span className="text-[0.62rem] font-bold tracking-[0.16em] uppercase text-brand-500">
              Onboarding
            </span>
          </div>
          <h3 className="font-display font-semibold text-[1.15rem] tracking-tight text-ink-900 mt-1">
            Complétez votre profil
          </h3>
          <p className="text-[0.86rem] text-ink-500 mt-1 leading-relaxed">
            <strong className="text-ink-900">{status.completed} / {status.total}</strong> étapes accomplies.
            {status.hasCritical && (
              <span className="text-amber-700">
                {" "}Certaines étapes sont indispensables pour être visible.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Liste détaillée */}
      {!compact && (
        <ul className="mt-5 pt-5 border-t border-sand-200 space-y-1">
          {status.steps.map((step) => (
            <li key={step.key}>
              <Link
                href={step.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition ${
                  step.done ? "opacity-60 hover:opacity-100 hover:bg-sand-50" : "hover:bg-sand-50"
                }`}
              >
                <span className="flex-shrink-0">
                  {step.done ? (
                    <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={2} />
                  ) : (
                    <Circle size={18} className={step.priority === 1 ? "text-amber-500" : "text-ink-300"} strokeWidth={2} />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block font-medium text-[0.86rem] leading-tight ${step.done ? "text-ink-500 line-through" : "text-ink-900"}`}>
                    {step.title}
                  </span>
                  {!step.done && (
                    <span className="block text-[0.74rem] text-ink-400 mt-0.5">{step.description}</span>
                  )}
                </span>
                {!step.done && (
                  <>
                    {step.priority === 1 && (
                      <span className="px-1.5 py-0.5 rounded text-[0.58rem] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        Important
                      </span>
                    )}
                    <ChevronRight size={14} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
