import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2, Circle, ArrowRight, ArrowLeft, Sparkles,
  Camera, MapPin, FileText, Briefcase, Image as ImageIcon, ShieldCheck, Phone,
} from "lucide-react";
import { requireUser } from "@/lib/db/current-user";
import { fetchOnboardingStatus, type OnboardingStep } from "@/lib/db/onboarding";

export const metadata: Metadata = {
  title: { absolute: "Bienvenue sur Bisecco" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STEP_VISUALS: Record<string, { icon: typeof Camera; color: string }> = {
  validation:  { icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
  photo:       { icon: Camera,      color: "text-brand-600 bg-brand-50" },
  description: { icon: FileText,    color: "text-blue-600 bg-blue-50" },
  city:        { icon: MapPin,      color: "text-purple-600 bg-purple-50" },
  phone:       { icon: Phone,       color: "text-sky-600 bg-sky-50" },
  gallery:     { icon: ImageIcon,   color: "text-amber-600 bg-amber-50" },
  services:    { icon: Briefcase,   color: "text-rose-600 bg-rose-50" },
  post:        { icon: Sparkles,    color: "text-violet-600 bg-violet-50" },
  cover:       { icon: ImageIcon,   color: "text-teal-600 bg-teal-50" },
};

export default async function BienvenuePage() {
  const user = await requireUser();
  if (!user.id) redirect("/mon-profil");

  const status = await fetchOnboardingStatus(user.id, user.role);

  // Trouve la PROCHAINE étape à faire (priorité 1 d'abord, puis 2, puis 3)
  const sortedTodo = [...status.steps]
    .filter((s) => !s.done)
    .sort((a, b) => a.priority - b.priority);
  const nextStep = sortedTodo[0] ?? null;

  // Si tout est fait, redirige vers /mon-profil
  if (status.percent === 100) {
    redirect("/mon-profil");
  }

  return (
    <div className="bg-gradient-to-br from-brand-50/40 via-white to-amber-50/40 min-h-screen">
      <div className="container-default max-w-3xl py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 mb-4">
            <Sparkles size={13} className="text-brand-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Configuration de ton profil
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-[-0.025em] text-ink-900">
            Bienvenue, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-ink-500 mt-3 max-w-xl mx-auto">
            {user.role === "artisan"
              ? "Quelques étapes pour que ton profil soit irrésistible et que tu reçoives tes premiers contacts."
              : "Quelques infos pour que les pros puissent te recontacter rapidement."}
          </p>
        </div>

        {/* Progression visuelle */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-ink-100 shadow-[0_30px_60px_-30px_rgba(13,30,74,0.15)] mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-ink-700 tabular-nums">{status.percent}%</span>
              <span className="text-sm text-ink-500">complété</span>
            </div>
            <span className="text-xs font-bold text-ink-500">
              {status.completed} / {status.total} étapes
            </span>
          </div>
          <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${status.percent}%` }}
            />
          </div>
        </div>

        {/* Prochaine étape en HERO */}
        {nextStep && <NextStepHero step={nextStep} />}

        {/* Liste complète */}
        <div className="bg-white rounded-3xl border border-ink-100 p-6 mt-6">
          <h2 className="font-bold text-ink-700 text-lg mb-4">Toutes les étapes</h2>
          <ul className="space-y-2">
            {status.steps.map((step) => (
              <StepRow key={step.key} step={step} highlight={step.key === nextStep?.key} />
            ))}
          </ul>

          <div className="mt-6 pt-5 border-t border-ink-100 flex items-center justify-between flex-wrap gap-3">
            <Link
              href="/mon-profil"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold"
            >
              <ArrowLeft size={14} /> Aller à mon espace
            </Link>
            <Link
              href="/mon-profil/edit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition"
            >
              Continuer la configuration <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Astuce */}
        <p className="text-center text-xs text-ink-400 mt-6 leading-relaxed">
          💡 Tu peux passer ces étapes et y revenir à tout moment depuis ton espace.
        </p>
      </div>
    </div>
  );
}

// =====================================================================
// Composants
// =====================================================================

function NextStepHero({ step }: { step: OnboardingStep }) {
  const v = STEP_VISUALS[step.key] ?? { icon: Circle, color: "text-ink-600 bg-ink-50" };
  const Icon = v.icon;

  return (
    <div className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-500/25 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative">
        <div className="text-xs font-bold uppercase tracking-wider text-white/65 mb-2">
          Prochaine étape
        </div>
        <div className="flex items-start gap-4 md:gap-5">
          <div className={`w-12 h-12 rounded-2xl ${v.color} grid place-items-center flex-shrink-0`}>
            <Icon size={20} strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold leading-tight">{step.title}</h2>
            <p className="text-white/75 mt-1.5 leading-relaxed">{step.description}</p>
            <Link
              href={step.href}
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)]"
            >
              C&apos;est parti <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRow({ step, highlight }: { step: OnboardingStep; highlight?: boolean }) {
  const v = STEP_VISUALS[step.key] ?? { icon: Circle, color: "text-ink-600 bg-ink-50" };
  const Icon = v.icon;

  if (step.done) {
    return (
      <li>
        <div className="flex items-center gap-3 p-3 rounded-xl text-ink-400 line-through opacity-70">
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          <span className="flex-1 text-sm font-semibold">{step.title}</span>
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={step.href}
        className={`flex items-center gap-3 p-3 rounded-xl transition group ${
          highlight
            ? "bg-brand-50/60 border border-brand-200"
            : "hover:bg-ink-50/60 border border-transparent hover:border-ink-100"
        }`}
      >
        <div className={`w-9 h-9 rounded-lg ${v.color} grid place-items-center flex-shrink-0`}>
          <Icon size={15} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-ink-700">{step.title}</div>
          <div className="text-xs text-ink-500 mt-0.5 line-clamp-1">{step.description}</div>
        </div>
        <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 transition flex-shrink-0" />
      </Link>
    </li>
  );
}
