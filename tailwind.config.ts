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
        // Palette Bisecco — OKLCH avec <alpha-value> placeholder pour
        // que les opacity modifiers Tailwind v3 (bg-brand-500/20, etc.) marchent.
        // - brand : orange Bisecco (h≈40°), chroma réduite aux extrêmes
        // - ink   : neutres teintés brand = jamais blanc/noir pur
        // ─────────────────────────────────────────────────────────────
        brand: {
          50:  'oklch(97% 0.018 60 / <alpha-value>)',
          100: 'oklch(94% 0.034 58 / <alpha-value>)',
          200: 'oklch(87% 0.068 55 / <alpha-value>)',
          300: 'oklch(80% 0.105 52 / <alpha-value>)',
          400: 'oklch(72% 0.150 47 / <alpha-value>)',
          500: 'oklch(65% 0.180 45 / <alpha-value>)',  // couleur principale (≈ #f07a2f)
          600: 'oklch(58% 0.180 42 / <alpha-value>)',
          700: 'oklch(50% 0.165 40 / <alpha-value>)',
          800: 'oklch(42% 0.140 38 / <alpha-value>)',
          900: 'oklch(35% 0.115 36 / <alpha-value>)',
          950: 'oklch(22% 0.075 34 / <alpha-value>)',
        },
        ink: {
          50:  'oklch(97% 0.008 250 / <alpha-value>)',
          100: 'oklch(92% 0.012 248 / <alpha-value>)',
          200: 'oklch(83% 0.020 246 / <alpha-value>)',
          300: 'oklch(70% 0.030 244 / <alpha-value>)',
          400: 'oklch(50% 0.040 242 / <alpha-value>)',
          500: 'oklch(40% 0.045 240 / <alpha-value>)',
          600: 'oklch(28% 0.055 238 / <alpha-value>)',
          700: 'oklch(22% 0.060 236 / <alpha-value>)',
          800: 'oklch(20% 0.062 234 / <alpha-value>)',
          900: 'oklch(13% 0.050 232 / <alpha-value>)',
        },
        // ─────────────────────────────────────────────────────────────
        // Tokens dashboard Admin v2 (inspiration ihos.fr · ton chaleureux)
        // ─────────────────────────────────────────────────────────────
        sand: {
          50:  '#f6f4ef',  // bg admin
          100: '#efece4',  // bg-soft (table head, hover)
          200: '#e6e2d6',  // line
          300: '#d8d2c2',  // line-strong
        },
        // Couleurs sémantiques (statuts, KPIs, badges)
        ok:     { DEFAULT: '#15803d', soft: '#dcfce7' },
        warn:   { DEFAULT: '#b45309', soft: '#fef3c7' },
        info:   { DEFAULT: '#1d4ed8', soft: '#dbeafe' },
        violet: { DEFAULT: '#6d28d9', soft: '#ede9fe' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
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
        'toast-progress': 'toastProgress 5s linear forwards',
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
        toastProgress: {
          '0%':   { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
