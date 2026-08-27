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
        primary: {
          DEFAULT: '#000d21',
          container: '#002347',
          fixed: '#d4e3ff',
          'fixed-dim': '#adc8f5',
          'on-container': '#718bb5',
        },
        gold: {
          DEFAULT: '#C5A059',
          light: '#F1E9DB',
          dark: '#775a19',
          container: '#fed488',
        },
        secondary: {
          DEFAULT: '#775a19',
          container: '#fed488',
          'on-container': '#785a1a',
        },
        surface: {
          DEFAULT: '#f8f9fa',
          dim: '#d9dadb',
          bright: '#f8f9fa',
          container: {
            lowest: '#ffffff',
            low: '#f3f4f5',
            DEFAULT: '#edeeef',
            high: '#e7e8e9',
            highest: '#e1e3e4',
          },
          variant: '#e1e3e4',
          tint: '#455f87',
        },
        'on-surface': {
          DEFAULT: '#191c1d',
          variant: '#43474e',
        },
        'bullish-green': '#115E59',
        'bearish-red': '#991B1B',
        'champagne-light': '#F1E9DB',
        outline: {
          DEFAULT: '#74777f',
          variant: '#c4c6cf',
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
        soft: '0 2px 10px rgba(0, 35, 71, 0.04)',
        tactile: '0 8px 24px -4px rgba(0, 35, 71, 0.06), 0 2px 6px -1px rgba(0, 35, 71, 0.03)',
        'tactile-hover': '0 16px 32px -6px rgba(0, 35, 71, 0.12), 0 4px 12px -2px rgba(0, 35, 71, 0.06)',
        'gold-glow': '0 0 20px rgba(197, 160, 89, 0.3)',
      },
      maxWidth: {
        '8xl': '1920px',
        '9xl': '2560px',
      },
    },
  },
  plugins: [],
};
