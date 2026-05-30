type Series = {
  label: string;
  /** Couleur hex de la courbe (ex: "#f07a2f") */
  color: string;
  /** Y values (0-100). Doivent avoir la même longueur que `labels`. */
  values: number[];
};

type Props = {
  /** Labels axe X (ex: ["L 16", "M 17", ...]). Définit le nombre de points. */
  labels: string[];
  series: Series[];
  /** Stats agrégées affichées sous le chart (total, comparaison, etc.) */
  stats?: { label: string; value: string; color?: string }[];
};

const WIDTH = 700;
const HEIGHT = 200;

function buildPath(values: number[]): string {
  if (values.length === 0) return "";
  const step = WIDTH / (values.length - 1 || 1);
  // Smooth curve via cubic Bezier
  let d = `M0,${HEIGHT - (values[0] / 100) * (HEIGHT - 20)}`;
  for (let i = 1; i < values.length; i++) {
    const x = i * step;
    const y = HEIGHT - (values[i] / 100) * (HEIGHT - 20);
    const px = (i - 1) * step;
    const py = HEIGHT - (values[i - 1] / 100) * (HEIGHT - 20);
    const cx1 = px + step / 2;
    const cx2 = x - step / 2;
    d += ` C${cx1},${py} ${cx2},${y} ${x},${y}`;
  }
  return d;
}

/**
 * Graphique SVG d'activité (multi-séries, courbes lissées).
 * Pas de dépendance externe · recharts/chart.js volontairement évités.
 */
export function ActivityChart({ labels, series, stats }: Props) {
  const xStep = WIDTH / (labels.length - 1 || 1);

  return (
    <div>
      {/* Légende */}
      <div className="flex flex-wrap gap-4 mb-3">
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-[0.78rem] text-ink-600">
            <span className="w-2 h-2 rounded-full" style={{ background: s.color }} aria-hidden />
            {s.label}
          </span>
        ))}
      </div>

      {/* Chart SVG */}
      <div className="relative h-[200px] mt-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-label="Graphique d'activité hebdomadaire"
        >
          {/* Gridlines horizontales */}
          <g stroke="#e6e2d6" strokeWidth="1" strokeDasharray="3 4">
            <line x1="0" y1={HEIGHT * 0.25} x2={WIDTH} y2={HEIGHT * 0.25} />
            <line x1="0" y1={HEIGHT * 0.5} x2={WIDTH} y2={HEIGHT * 0.5} />
            <line x1="0" y1={HEIGHT * 0.75} x2={WIDTH} y2={HEIGHT * 0.75} />
          </g>

          {/* Courbes (dernière série dessinée en premier pour le z-order visuel) */}
          {series.map((s) => (
            <path
              key={s.label}
              d={buildPath(s.values)}
              stroke={s.color}
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Labels axe X */}
          <g fontFamily="Inter, sans-serif" fontSize="11" fill="#8a93a0">
            {labels.map((label, i) => (
              <text key={label} x={i * xStep} y={HEIGHT - 2}>
                {label}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* Stats agrégées */}
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-7 mt-4 pt-4 border-t border-dashed border-sand-200">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div
                className="font-display font-medium text-[1.4rem] tracking-[-0.025em] leading-none"
                style={{ color: stat.color ?? "#0f1419" }}
              >
                {stat.value}
              </div>
              <div className="text-[0.66rem] text-ink-400 uppercase tracking-[0.08em] mt-1 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
