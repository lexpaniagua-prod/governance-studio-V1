/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base:     'var(--bg-base)',
          surface:  'var(--bg-surface)',
          card:     'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          subtle:  'var(--border-subtle)',
          default: 'var(--border-default)',
          active:  'var(--border-active)',
        },
        state: {
          purple:      '#7c5cfc',
          'purple-dim':'var(--state-purple-dim)',
          blue:        '#3b82f6',
          'blue-dim':  'var(--state-blue-dim)',
          green:       '#22c55e',
          'green-dim': 'var(--state-green-dim)',
          amber:       '#f59e0b',
          'amber-dim': 'var(--state-amber-dim)',
          red:         '#ef4444',
          'red-dim':   'var(--state-red-dim)',
          teal:        '#14b8a6',
          'teal-dim':  'var(--state-teal-dim)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
          accent:    '#7c5cfc',
        },
      },
      backdropBlur: { xs: '4px', sm: '8px', md: '16px' },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
