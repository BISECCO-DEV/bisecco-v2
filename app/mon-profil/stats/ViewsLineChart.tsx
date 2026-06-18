"use client";

import { useState } from "react";

type Point = { date: string; label: string; count: number };

type Props = {
  points: Point[];
};

/**
 * Graphique en barres 30 jours : minimaliste, SVG, sans dépendance externe.
 * Hover sur une barre → tooltip avec la date et le nombre de vues.
 */
export function ViewsLineChart({ points }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const width = 800;
  const height = 180;
  const padding = { top: 18, right: 8, bottom: 28, left: 8 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...points.map((p) => p.count), 1);
  const barWidth = innerW / points.length;
  const barGap = Math.max(2, barWidth * 0.18);
  const actualBarWidth = barWidth - barGap;

  const total = points.reduce((acc, p) => acc + p.count, 0);
  const avg = points.length > 0 ? Math.round(total / points.length) : 0;
  const avgY = padding.top + innerH - (avg / max) * innerH;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">
          <span className="text-ink-500">Moyenne : </span>
          <strong className="text-ink-700">{avg}</strong>
          <span className="text-ink-400"> vues/jour</span>
        </div>
        {hovered !== null && (
          <div className="text-xs font-bold text-brand-600">
            {points[hovered]?.label} : {points[hovered]?.count} vue{(points[hovered]?.count ?? 0) > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
        role="img"
        aria-label="Graphique des vues par jour"
      >
        {/* Ligne moyenne en pointillés */}
        {avg > 0 && (
          <line
            x1={padding.left}
            y1={avgY}
            x2={width - padding.right}
            y2={avgY}
            stroke="#d8dee6"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}

        {/* Barres */}
        {points.map((p, i) => {
          const h = (p.count / max) * innerH;
          const x = padding.left + i * barWidth + barGap / 2;
          const y = padding.top + innerH - h;
          const isHovered = hovered === i;
          return (
            <g
              key={p.date}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Zone cliquable invisible (plein hauteur) */}
              <rect
                x={padding.left + i * barWidth}
                y={padding.top}
                width={barWidth}
                height={innerH}
                fill="transparent"
              />
              {/* Barre réelle */}
              <rect
                x={x}
                y={p.count === 0 ? padding.top + innerH - 2 : y}
                width={actualBarWidth}
                height={p.count === 0 ? 2 : h}
                rx={3}
                ry={3}
                fill={isHovered ? "#dc6422" : p.count === 0 ? "#e5e7eb" : "#f07a2f"}
                style={{ transition: "fill 0.15s ease" }}
              />
            </g>
          );
        })}

        {/* Labels X : 1 sur 5 pour pas surcharger */}
        {points.map((p, i) => {
          if (i % 5 !== 0 && i !== points.length - 1) return null;
          const x = padding.left + i * barWidth + barWidth / 2;
          return (
            <text
              key={`lbl-${p.date}`}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fontSize={10}
              fill="#8a93a0"
              fontWeight={500}
            >
              {p.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
