import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: "blue" | "orange" | "green" | "warn" | "violet" | "ink";
  trend?: { direction: TrendDirection; value: string };
  sub?: string;
  /** Coordonnées Y de la sparkline (8 points entre 0 et 40). Si fourni, dessine la sparkline. */
  spark?: number[];
};

const ICON_BG = {
  blue:   "bg-info-soft text-info",
  orange: "bg-brand-50 text-brand-500",
  green:  "bg-ok-soft text-ok",
  warn:   "bg-warn-soft text-warn",
  violet: "bg-violet-soft text-violet",
  ink:    "bg-ink-900 text-white",
};

const TREND_STYLE = {
  up:      "bg-ok-soft text-ok",
  down:    "bg-red-50 text-red-700",
  neutral: "bg-sand-100 text-ink-600",
};

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const SPARK_COLOR = {
  blue:   "#1d4ed8",
  orange: "#f07a2f",
  green:  "#15803d",
  warn:   "#b45309",
  violet: "#6d28d9",
  ink:    "#0f1419",
};

export function KpiCard({
  label, value, icon: Icon, iconColor = "blue", trend, sub, spark,
}: Props) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  const sparkColor = SPARK_COLOR[iconColor];

  return (
    <div className="relative bg-white border border-sand-200 rounded-2xl p-5 overflow-hidden hover:border-sand-300 hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.68rem] font-semibold text-ink-600 uppercase tracking-[0.06em]">{label}</span>
        <div className={`w-7 h-7 rounded-lg grid place-items-center ${ICON_BG[iconColor]}`}>
          <Icon size={13} strokeWidth={2.2} />
        </div>
      </div>

      <div className="font-display font-medium text-[2.1rem] tracking-[-0.04em] leading-none mb-2 text-ink-900">
        {value}
      </div>

      <div className="flex items-center gap-2.5 text-[0.72rem] text-ink-500">
        {trend && TrendIcon && (
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-semibold ${TREND_STYLE[trend.direction]}`}>
            <TrendIcon size={10} strokeWidth={2.6} />
            {trend.value}
          </span>
        )}
        {sub && <span className="truncate">{sub}</span>}
      </div>

      {spark && spark.length >= 2 && (
        <svg
          className="absolute bottom-0 left-0 right-0 h-8 opacity-50 pointer-events-none"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={`spark-${label.replace(/\s/g, "-")}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={sparkColor} stopOpacity="0.18" />
              <stop offset="1" stopColor={sparkColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const step = 200 / (spark.length - 1);
            const points = spark.map((y, i) => `${i * step},${40 - y}`).join(" L");
            const pathLine = `M${points}`;
            const pathArea = `${pathLine} L200,40 L0,40 Z`;
            return (
              <>
                <path d={pathArea} fill={`url(#spark-${label.replace(/\s/g, "-")})`} />
                <path d={pathLine} stroke={sparkColor} strokeWidth="1.5" fill="none" />
              </>
            );
          })()}
        </svg>
      )}
    </div>
  );
}
