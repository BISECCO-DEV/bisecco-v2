"use client";

import { useMemo, useState } from "react";

type Point = { label: string; total: number };

export function RevenueLineChart({ points }: { points: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...points.map((p) => p.total), 1);

  const w = 600, h = 220;
  const padX = 24, padTop = 24, padBottom = 32;
  const innerW = w - padX * 2;
  const innerH = h - padTop - padBottom;
  const stepX = innerW / Math.max(points.length - 1, 1);

  const coords = useMemo(
    () => points.map((p, i) => ({
      x: padX + i * stepX,
      y: padTop + innerH - (p.total / max) * innerH,
      ...p,
    })),
    [points, stepX, innerH, max],
  );

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const fillPath = `${linePath} L ${coords[coords.length - 1]?.x ?? 0} ${padTop + innerH} L ${coords[0]?.x ?? 0} ${padTop + innerH} Z`;

  const showHovered = hover !== null ? coords[hover] : null;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        {showHovered && (
          <div className="text-sm">
            <strong className="text-ink-700 text-base">
              {showHovered.total.toLocaleString("fr-FR")} €
            </strong>
            <span className="text-ink-400 ml-2">{showHovered.label}</span>
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
        {/* Grille horizontale */}
        {[0, 0.5, 1].map((p) => {
          const y = padTop + innerH - p * innerH;
          return (
            <line
              key={p}
              x1={padX} y1={y} x2={w - padX} y2={y}
              stroke="#e5e7eb"
              strokeDasharray="3 5"
              strokeWidth={1}
            />
          );
        })}

        {/* Aire dégradée */}
        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill="url(#revGradient)" />

        {/* Ligne */}
        <path
          d={linePath}
          fill="none"
          stroke="#6366f1"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points + zones d'interaction */}
        {coords.map((c, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
            <rect
              x={c.x - stepX / 2}
              y={padTop}
              width={stepX}
              height={innerH}
              fill="transparent"
            />
            <circle
              cx={c.x}
              cy={c.y}
              r={hover === i ? 6 : 4}
              fill="white"
              stroke="#6366f1"
              strokeWidth={2.2}
              style={{ transition: "r 0.15s" }}
            />
            {hover === i && (
              <line
                x1={c.x} y1={c.y + 6} x2={c.x} y2={padTop + innerH}
                stroke="#6366f1"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.4}
              />
            )}
          </g>
        ))}

        {/* Labels X */}
        {coords.map((c, i) => (
          <text
            key={`lbl-${i}`}
            x={c.x}
            y={h - 8}
            textAnchor="middle"
            fontSize={11}
            fill="#8a93a0"
            fontWeight={500}
          >
            {c.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
