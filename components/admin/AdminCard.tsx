import type { ReactNode } from "react";

type Props = {
  title?: string;
  count?: number | string;
  link?: { href: string; label: string };
  children: ReactNode;
  className?: string;
  headless?: boolean;
};

/**
 * Wrapper panel blanc avec en-tête optionnel (titre + count + link).
 * Base structurelle de toutes les cards du dashboard admin.
 */
export function AdminCard({ title, count, link, children, className = "", headless = false }: Props) {
  return (
    <div className={`bg-white border border-sand-200 rounded-2xl overflow-hidden ${className}`}>
      {!headless && title && (
        <header className="flex items-center justify-between px-5 py-4 border-b border-sand-200">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-semibold text-[1.05rem] tracking-tight text-ink-900">{title}</h3>
            {count !== undefined && (
              <span className="bg-sand-100 px-2 py-0.5 rounded-full text-[0.72rem] font-semibold text-ink-600 font-mono">
                {count}
              </span>
            )}
          </div>
          {link && (
            <a
              href={link.href}
              className="text-[0.78rem] text-ink-600 font-semibold hover:text-brand-500 transition-colors inline-flex items-center gap-1"
            >
              {link.label} →
            </a>
          )}
        </header>
      )}
      {children}
    </div>
  );
}
