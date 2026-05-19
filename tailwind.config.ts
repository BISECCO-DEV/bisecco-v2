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
        // Palette Bisecco — orange brand uniquement (+ neutres)
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f07a2f', // ← couleur principale
          600: '#e8621a',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        ink: {
          50:  '#f4f7fc',
          100: '#e4e9f3',
          200: '#c8d3e6',
          300: '#9aabbc',
          400: '#5a6a8a',
          500: '#3a4a6a',
          600: '#1a2f55',
          700: '#0f1e40',
          800: '#081f4d',
          900: '#05122e',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.25rem, 5.5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'brand': '0 8px 24px rgba(240,122,47,0.35)',
        'brand-lg': '0 16px 40px rgba(240,122,47,0.4)',
        'card': '0 4px 20px rgba(13, 30, 74, 0.10)',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out',
        'fade-up':       'fadeUp 0.6s cubic-bezier(.22,.68,0,1.2) both',
        'slide-up':      'slideUp 0.35s cubic-bezier(.22,.68,0,1.2) both',
        'marquee':       'marquee 35s linear infinite',
        'dash':          'dashFlow 30s linear infinite',
        'pulse-slow':    'pulseSlow 2.6s ease-in-out infinite',
        'bounce-slow':   'bounceSlow 2s ease-in-out infinite',
        'float':         'float 5s ease-in-out infinite',
        'float-slow':    'float 7s ease-in-out infinite',
        'shimmer':       'shimmer 3s linear infinite',
        'tilt':          'tilt 8s ease-in-out infinite',
        // Premium hero animations
        'gradient-flow': 'gradientFlow 6s ease-in-out infinite',
        'draw-line':     'drawLine 1.2s 0.9s cubic-bezier(.22,.68,0,1.2) both',
        'glow-pulse':    'glowPulse 3.5s ease-in-out infinite',
        'sheen':         'sheen 4.5s ease-in-out infinite',
        'reveal-up':     'revealUp 0.75s cubic-bezier(.22,.68,0,1.2) both',
        'scroll-dot':    'scrollDot 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        dashFlow: { '0%': { strokeDashoffset: '0' }, '100%': { strokeDashoffset: '-220' } },
        pulseSlow: { '0%,100%': { opacity: '0.4', transform: 'scale(1.5)' }, '50%': { opacity: '0.7', transform: 'scale(1.8)' } },
        bounceSlow: { '0%,100%': { transform: 'translate(-50%, 0)' }, '50%': { transform: 'translate(-50%, 6px)' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        tilt:     { '0%,100%': { transform: 'rotate(0deg)' }, '50%': { transform: 'rotate(1.5deg)' } },
        // Premium hero keyframes
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        drawLine: {
          '0%':   { strokeDashoffset: '300', opacity: '0' },
          '20%':  { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '0.55' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 10px 30px -5px rgba(240,122,47,0.5), inset 0 1px 0 rgba(255,255,255,0.18)' },
          '50%':      { boxShadow: '0 14px 40px -5px rgba(240,122,47,0.75), 0 0 0 4px rgba(240,122,47,0.10), inset 0 1px 0 rgba(255,255,255,0.25)' },
        },
        sheen: {
          '0%, 100%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '50%':      { transform: 'translateX(250%) skewX(-20deg)' },
        },
        revealUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)', filter: 'blur(6px)' },
          '60%':  { filter: 'blur(0)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
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
