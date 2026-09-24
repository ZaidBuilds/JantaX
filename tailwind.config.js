/** @type {import('tailwindcss').Config} */
// Colours map onto the CSS variables in src/tokens.css so utility classes
// follow the same palette (and dark mode) as the rest of the app.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: {
    // src/index.css owns the base reset; Tailwind's preflight used to load
    // after it and strip styling from native inputs and selects.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: { DEFAULT: 'var(--surface)', 2: 'var(--surface-2)', 3: 'var(--surface-3)' },
        ink: { DEFAULT: 'var(--ink)', 2: 'var(--ink-2)', 3: 'var(--ink-3)', 4: 'var(--ink-4)' },
        line: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        brand: { DEFAULT: 'var(--brand)', ink: 'var(--brand-ink)', soft: 'var(--brand-soft)', line: 'var(--brand-line)' },
        good: { DEFAULT: 'var(--good)', soft: 'var(--good-soft)', line: 'var(--good-line)' },
        warn: { DEFAULT: 'var(--warn)', soft: 'var(--warn-soft)', line: 'var(--warn-line)' },
        bad: { DEFAULT: 'var(--bad)', soft: 'var(--bad-soft)', line: 'var(--bad-line)' },
        info: { DEFAULT: 'var(--info)', soft: 'var(--info-soft)', line: 'var(--info-line)' },
        primary: {
          50: 'var(--brand-soft)',
          100: 'var(--brand-line)',
          500: 'var(--brand-ink)',
          700: 'var(--brand)',
          900: 'var(--brand)',
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-hover)',
        },
        accent: {
          400: 'var(--accent)',
          500: 'var(--accent)',
          600: 'var(--accent-ink)',
          glow: 'var(--accent-soft)',
          DEFAULT: 'var(--accent)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-display)'],
        display: ['var(--font-display)'],
        body: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glass: 'var(--shadow-sm)',
        premium: 'var(--shadow-md)',
        float: 'var(--shadow-lg)',
      },
      borderRadius: {
        control: 'var(--r-md)',
        surface: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
    },
  },
  plugins: [],
};
