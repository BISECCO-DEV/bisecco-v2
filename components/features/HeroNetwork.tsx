import Image from "next/image";

type AvatarConfig = {
  src: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
  delay: number;
};

const AVATARS: AvatarConfig[] = [
  { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=240&h=240&fit=crop&crop=faces&q=80", top: "8%",  left: "30%", size: 120, delay: 0   },
  { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces&q=80", top: "18%", left: "5%",  size: 80,  delay: 0.1 },
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces&q=80", top: "20%", right: "8%", size: 130, delay: 0.15 },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=faces&q=80", top: "48%", left: "40%", size: 135, delay: 0.25 },
  { src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=faces&q=80", top: "62%", left: "8%",  size: 100, delay: 0.35 },
  { src: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&crop=faces&q=80", top: "58%", right: "5%", size: 110, delay: 0.4  },
];

const PINS: { top: string; left?: string; right?: string; delay: number }[] = [
  { top: "32%", left: "22%", delay: 0.5  },
  { top: "12%", right: "32%", delay: 0.55 },
  { top: "75%", left: "32%", delay: 0.6  },
  { top: "82%", right: "25%", delay: 0.65 },
  { top: "45%", left: "65%", delay: 0.7  },
];

export function HeroNetwork() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* ─── Grille "carte" en perspective ─── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <pattern
            id="map-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            patternTransform="skewX(-12) skewY(3)"
          >
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#5b8fd9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>

      {/* ─── "Routes" courbes lumineuses ─── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <filter id="streetGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g stroke="#3b82f6" strokeOpacity="0.45" fill="none" strokeLinecap="round" filter="url(#streetGlow)">
          <path d="M -50 220 Q 300 180, 600 250 T 1250 280" strokeWidth="2.5" />
          <path d="M -50 440 Q 350 520, 700 460 T 1250 480" strokeWidth="2" />
          <path d="M 200 -50 Q 280 200, 350 400 T 380 850" strokeWidth="1.5" />
          <path d="M 800 -50 Q 850 250, 920 450 T 950 850" strokeWidth="1.5" />
          <path d="M -50 100 Q 200 350, 600 380 T 1250 600" strokeWidth="1.2" strokeOpacity="0.3" />
        </g>
      </svg>

      {/* ─── Lignes pointillées reliant les avatars ─── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="5 6" fill="none" strokeLinecap="round">
          <path d="M 380 110 Q 250 200, 80 200" className="animate-dash" />
          <path d="M 380 110 Q 700 130, 1000 230" className="animate-dash" />
          <path d="M 380 110 Q 400 280, 540 460" className="animate-dash" />
          <path d="M 540 460 Q 350 540, 130 580" className="animate-dash" />
          <path d="M 540 460 Q 800 480, 1050 540" className="animate-dash" />
          <path d="M 1000 230 Q 1050 380, 1050 540" className="animate-dash" />
          <path d="M 80 200 Q 100 400, 130 580" className="animate-dash" strokeOpacity="0.18" />
        </g>
      </svg>

      {/* ─── Avatars ─── */}
      {AVATARS.map((a, i) => (
        <AvatarPin key={`av-${i}`} {...a} />
      ))}

      {/* ─── Pins vides (location) ─── */}
      {PINS.map((p, i) => (
        <Pin key={`pin-${i}`} {...p} />
      ))}

      {/* ─── Gradient de couverture sur la gauche pour faire ressortir le texte ─── */}
      <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#05122e] via-[#05122e]/85 to-transparent" />
    </div>
  );
}

/* ═════════ AVATAR + PIN TEARDROP ═════════ */
function AvatarPin({ src, top, left, right, size, delay }: AvatarConfig) {
  return (
    <div
      className="absolute animate-fade-up will-change-transform"
      style={{
        top,
        left,
        right,
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
    >
      <div className="relative">
        {/* Aura/halo */}
        <div
          className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl"
          style={{ transform: "scale(1.4)" }}
        />
        {/* Cercle avec photo */}
        <div
          className="relative rounded-full border-[3px] border-white shadow-[0_12px_40px_rgba(0,0,0,0.55)] overflow-hidden bg-ink-700"
          style={{ width: size, height: size }}
        >
          <Image
            src={src}
            alt=""
            width={size}
            height={size}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Pointe teardrop sous l'avatar */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
          style={{ bottom: -8 }}
        />
      </div>
    </div>
  );
}

/* ═════════ PIN SIMPLE (sans photo) ═════════ */
function Pin({ top, left, right, delay }: { top: string; left?: string; right?: string; delay: number }) {
  return (
    <div
      className="absolute animate-fade-up"
      style={{ top, left, right, animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-400/40 blur-md scale-150 animate-pulse-slow" />
        <svg width="34" height="44" viewBox="0 0 24 32" className="relative drop-shadow-[0_4px_10px_rgba(59,130,246,0.6)]">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.4 18.6 0 12 0z"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      </div>
    </div>
  );
}
