import { CheckCircle2 } from "lucide-react";

type Task = { count: number; label: string; done?: boolean };

type Props = {
  adminName: string;
  /** Date du jour à afficher dans l'eyebrow (déjà formatée, ex: "Vendredi 22 mai 2026") */
  todayLabel: string;
  /** Phrases résumé. Les éléments <strong>...</strong> sont autorisés en JSX. */
  summary: React.ReactNode;
  tasks: Task[];
};

/**
 * Bloc d'accueil sombre · eyebrow date + titre serif "Bonjour Admin." + tâches du jour.
 */
export function HeroWelcome({ adminName, todayLabel, summary, tasks }: Props) {
  return (
    <div className="relative bg-gradient-to-br from-ink-800 to-ink-900 text-white rounded-2xl p-7 sm:p-8 overflow-hidden min-h-[200px] flex flex-col justify-between">
      {/* Décors lumineux */}
      <div
        className="absolute -top-16 -right-16 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(240,122,47,0.20), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-8 right-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.18), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/55 mb-3">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-500" />
          </span>
          {todayLabel} · Plateforme opérationnelle
        </div>
        <h1 className="font-display font-medium text-[1.85rem] sm:text-[2rem] tracking-[-0.025em] leading-[1.1] mb-2">
          Bonjour <span className="italic font-normal text-brand-400">{adminName}.</span>
        </h1>
        <p className="text-[0.92rem] text-white/70 max-w-xl leading-relaxed">{summary}</p>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap gap-2.5">
        {tasks.map((task, i) => (
          <div
            key={`${task.label}-${i}`}
            className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/[0.10] backdrop-blur-sm text-[0.78rem] text-white/85 hover:bg-brand-500/15 hover:border-brand-500/30 transition cursor-pointer"
          >
            <span className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[0.66rem] font-bold text-white ${task.done ? "bg-emerald-500" : "bg-brand-500"}`}>
              {task.count}
            </span>
            <span>{task.label}</span>
            {task.done && <CheckCircle2 size={13} strokeWidth={2.4} className="text-emerald-400" />}
          </div>
        ))}
      </div>
    </div>
  );
}
