import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export function ComingSoon({
  title,
  description,
  icon,
  bullets,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  bullets: string[];
}) {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link
        href="/pro"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-500 font-semibold mb-6"
      >
        <ArrowLeft size={14} /> Tableau de bord
      </Link>

      <div className="bg-white rounded-3xl border border-ink-100 p-8 md:p-12 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 grid place-items-center mx-auto mb-5 shadow-[0_20px_40px_-12px_rgba(240,122,47,0.5)]">
          {icon}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[0.7rem] font-bold uppercase tracking-[0.14em] mb-4">
          <Sparkles size={11} /> Bientôt disponible
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-900 tracking-tight">
          {title}
        </h1>
        <p className="text-ink-500 mt-4 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        {bullets.length > 0 && (
          <ul className="mt-8 grid sm:grid-cols-2 gap-2.5 text-left max-w-xl mx-auto">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 px-4 py-3 rounded-xl bg-ink-50/60 border border-ink-100 text-sm text-ink-700">
                <span className="text-brand-500 mt-0.5">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-ink-400 mt-8">
          On travaille dessus. Reviens régulièrement pour suivre l&apos;avancement.
        </p>
      </div>
    </div>
  );
}
