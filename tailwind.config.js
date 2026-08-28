/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
    extend: {
      colors: {
        // Paleta Terminal Moderno (Obsidian, Esmeralda Neón & Titanio)
        primary: {
          DEFAULT: '#0B0E14',
          container: '#151B26',
          fixed: '#1E293B',
          'fixed-dim': '#334155',
          'on-container': '#94A3B8',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          dark: '#047857',
          container: '#064E3B',
          glow: 'rgba(16, 185, 129, 0.4)',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          light: '#ECFEFF',
          dark: '#0E7490',
        },
        // Alias de compatibilidad: 'gold' ahora mapea a Esmeralda Neón
        gold: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          dark: '#047857',
          container: '#064E3B',
        },
        secondary: {
          DEFAULT: '#10B981',
          container: '#064E3B',
          'on-container': '#34D399',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          dim: '#E2E8F0',
          bright: '#FFFFFF',
          container: {
            lowest: '#FFFFFF',
            low: '#F1F5F9',
            DEFAULT: '#E2E8F0',
            high: '#CBD5E1',
            highest: '#E2E8F0',
          },
          variant: '#E2E8F0',
          tint: '#10B981',
        },
        'on-surface': {
          DEFAULT: '#0F172A',
          variant: '#475569',
        },
        'bullish-green': '#10B981',
        'bearish-red': '#F43F5E',
        'champagne-light': '#ECFDF5',
        outline: {
          DEFAULT: '#64748B',
          variant: '#CBD5E1',
        },
      },
      borderRadius: {
        DEFAULT: '0.75rem', // 12px
        sm: '0.5rem',       // 8px
        md: '0.75rem',      // 12px
        lg: '1rem',         // 16px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        full: '9999px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'h1': ['clamp(1.4rem, 1.1rem + 1.2vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'h2': ['clamp(1.2rem, 1rem + 0.8vw, 1.65rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['clamp(1.05rem, 0.95rem + 0.4vw, 1.35rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
        'subtitle': ['clamp(0.85rem, 0.8rem + 0.2vw, 0.95rem)', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '-0.008em' }],
        'caption': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '600' }],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0, 0, 0, 0.04)',
        tactile: '0 8px 24px -4px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'tactile-hover': '0 16px 32px -6px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'gold-glow': '0 0 20px rgba(16, 185, 129, 0.35)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.35)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.35)',
      },
      maxWidth: {
        '8xl': '1920px',
        '9xl': '2560px',
      },
    },
  },
  plugins: [],
};
