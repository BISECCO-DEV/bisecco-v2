import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type PipelineStatus = {
  label: string;
  color: "ok" | "warn" | "info" | "violet" | "ink";
};

export type PipelineRow = {
  id: number;
  /** Initial pour l'avatar (ex: "P" pour Pedro) */
  initial: string;
  /** Couleur du gradient avatar (a=orange, p=blue, v=violet, g=green) */
  avatarVariant?: "a" | "p" | "v" | "g";
  name: string;
  subtitle?: string;
  category: string;
  status: PipelineStatus;
  href: string;
};

type Props = {
  rows: PipelineRow[];
};

const AVATAR_GRADIENT = {
  a: "from-brand-500 to-orange-300",
  p: "from-info to-blue-400",
  v: "from-violet to-purple-300",
  g: "from-ok to-green-400",
};

const STATUS_DOT = {
  ok:     "bg-ok",
  warn:   "bg-warn",
  info:   "bg-info",
  violet: "bg-violet",
  ink:    "bg-ink-900",
};

/**
 * Tableau de suivi (artisans en validation, devis en cours, etc.).
 * Lignes cliquables vers `href`.
 */
export function PipelineTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-10 text-ink-400 text-sm">
        Aucune entrée pour l&apos;instant.
      </div>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-left px-5 py-2.5 text-[0.66rem] uppercase tracking-[0.08em] font-semibold text-ink-400 bg-sand-100 border-b border-sand-200">
            Professionnel
          </th>
          <th className="text-left px-5 py-2.5 text-[0.66rem] uppercase tracking-[0.08em] font-semibold text-ink-400 bg-sand-100 border-b border-sand-200">
            Métier
          </th>
          <th className="text-left px-5 py-2.5 text-[0.66rem] uppercase tracking-[0.08em] font-semibold text-ink-400 bg-sand-100 border-b border-sand-200">
            Statut
          </th>
          <th className="bg-sand-100 border-b border-sand-200" aria-hidden />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-sand-200 last:border-b-0 hover:bg-sand-100/60 transition-colors cursor-pointer group"
          >
            <td className="px-5 py-3.5">
              <Link href={row.href} className="flex items-center gap-2.5 min-w-0">
                <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${AVATAR_GRADIENT[row.avatarVariant ?? "a"]} grid place-items-center text-white font-display font-semibold text-[0.72rem] flex-shrink-0`}>
                  {row.initial}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-ink-900 text-[0.84rem] truncate">{row.name}</span>
                  {row.subtitle && (
                    <span className="block text-[0.72rem] text-ink-400 truncate">{row.subtitle}</span>
                  )}
                </span>
              </Link>
            </td>
            <td className="px-5 py-3.5 text-[0.82rem] text-ink-600">{row.category}</td>
            <td className="px-5 py-3.5">
              <span className="inline-flex items-center gap-2 text-[0.78rem] font-medium text-ink-700">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[row.status.color]}`} aria-hidden />
                {row.status.label}
              </span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <Link
                href={row.href}
                className="inline-grid place-items-center w-6 h-6 rounded-md border border-sand-200 bg-white text-ink-400 hover:border-ink-900 hover:text-ink-900 transition"
                aria-label={`Voir ${row.name}`}
              >
                <ChevronRight size={12} />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
