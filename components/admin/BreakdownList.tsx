export type BreakdownRow = {
  label: string;
  count: number;
  percent: number;
  /** Couleur hex de la barre. */
  color: string;
};

type Props = {
  rows: BreakdownRow[];
  emptyLabel?: string;
};

/**
 * Liste de répartition (catégories, métiers, etc.) avec barres de progression.
 */
export function BreakdownList({ rows, emptyLabel = "Pas encore de données." }: Props) {
  if (rows.length === 0) {
    return <div className="text-center py-10 text-ink-400 text-sm">{emptyLabel}</div>;
  }

  return (
    <div className="px-5 py-4 flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[0.82rem]">
            <span className="font-medium text-ink-900">{row.label}</span>
            <span className="font-mono text-[0.72rem] text-ink-500">
              {row.count} · {row.percent}%
            </span>
          </div>
          <div className="h-[5px] bg-sand-100 rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm transition-[width] duration-700"
              style={{ width: `${Math.min(100, row.percent)}%`, background: row.color }}
              aria-hidden
            />
          </div>
        </div>
      ))}
    </div>
  );
}
