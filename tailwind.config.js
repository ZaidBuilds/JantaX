/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          700: '#1a4d8f',
          900: '#0f2d59',
          DEFAULT: '#0f2d59',
          dark: '#0a1f3d',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          glow: 'rgba(249,115,22,0.08)',
          DEFAULT: '#f97316',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          900: '#0f172a',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
        premium: '0 10px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.08)',
        float: '0 20px 40px -12px rgba(15,45,89,0.15)',
      },
      borderRadius: {
        control: '8px',
        surface: '10px',
        pill: '9999px',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
