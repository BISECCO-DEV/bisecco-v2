import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─────────────────────────────────────────────────────────────
        // Palette Bisecco — OKLCH avec teinte unifiée (impeccable shared laws)
        // - brand : orange Bisecco (h≈40°), chroma réduite aux extrêmes
        // - ink   : neutres teintés brand (chroma 0.005-0.02) = jamais blanc/noir pur
        // ─────────────────────────────────────────────────────────────
        brand: {
          50:  'oklch(97% 0.018 60)',   // ≈ #fff7ed
          100: 'oklch(94% 0.034 58)',   // ≈ #ffedd5
          200: 'oklch(87% 0.068 55)',   // ≈ #fed7aa
          300: 'oklch(80% 0.105 52)',   // ≈ #fdba74
          400: 'oklch(72% 0.150 47)',   // ≈ #fb923c
          500: 'oklch(65% 0.180 45)',   // ≈ #f07a2f — couleur principale
          600: 'oklch(58% 0.180 42)',   // ≈ #e8621a
          700: 'oklch(50% 0.165 40)',   // ≈ #c2410c
          800: 'oklch(42% 0.140 38)',   // ≈ #9a3412
          900: 'oklch(35% 0.115 36)',   // ≈ #7c2d12
          950: 'oklch(22% 0.075 34)',   // ≈ #431407
        },
        ink: {
          // neutres teintés vers le brand (chroma 0.005-0.02), évite blanc/noir pur
          50:  'oklch(97% 0.008 250)',  // ≈ #f4f7fc
          100: 'oklch(92% 0.012 248)',  // ≈ #e4e9f3
          200: 'oklch(83% 0.020 246)',  // ≈ #c8d3e6
          300: 'oklch(70% 0.030 244)',  // ≈ #9aabbc
          400: 'oklch(50% 0.040 242)',  // ≈ #5a6a8a
          500: 'oklch(40% 0.045 240)',  // ≈ #3a4a6a
          600: 'oklch(28% 0.055 238)',  // ≈ #1a2f55
          700: 'oklch(22% 0.060 236)',  // ≈ #0f1e40
          800: 'oklch(20% 0.062 234)',  // ≈ #081f4d
          900: 'oklch(13% 0.050 232)',  // ≈ #05122e
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // hierarchy ≥ 1.25 ratio entre steps (impeccable shared law)
        'hero': ['clamp(2.25rem, 5.5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'brand': '0 8px 24px oklch(65% 0.180 45 / 0.35)',
        'brand-lg': '0 16px 40px oklch(65% 0.180 45 / 0.40)',
        'card': '0 4px 20px oklch(22% 0.060 236 / 0.10)',
      },
      // ─────────────────────────────────────────────────────────────
      // Motion — impeccable shared law : ease-out exponentiel uniquement
      // Bannis : bounce / elastic / overshoot (cubic-bezier avec valeur > 1)
      // Référence : ease-out-quint = cubic-bezier(0.16, 1, 0.3, 1)
      // ─────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        'out-quint':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-expo':   'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-circ':   'cubic-bezier(0, 0.55, 0.45, 1)',
      },
      animation: {
        // Animations conservées (purpose narratif clair)
        'fade-in':       'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up':       'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up':      'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'marquee':       'marquee 35s linear infinite',
        'dash':          'dashFlow 30s linear infinite',
        'reveal-up':     'revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scroll-dot':    'scrollDot 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        // SUPPRIMÉ (animations décoratives sans purpose) :
        //   pulse-slow, bounce-slow, float, float-slow, shimmer, tilt,
        //   gradient-flow, draw-line, glow-pulse, sheen
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        dashFlow: { '0%': { strokeDashoffset: '0' }, '100%': { strokeDashoffset: '-220' } },
        revealUp: {
          // Pas de blur filter (perf) ni de bounce — juste opacity + translateY
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollDot: {
          '0%':   { transform: 'translateY(0)', opacity: '1' },
          '60%':  { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
