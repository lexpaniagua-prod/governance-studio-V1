/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0b0f',
          surface: '#12141a',
          card: '#1a1d26',
          elevated: '#1f2333',
          glass: 'rgba(255,255,255,0.04)',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          active: 'rgba(255,255,255,0.20)',
        },
        state: {
          purple: '#7c5cfc',
          'purple-dim': 'rgba(124,92,252,0.15)',
          blue: '#3b82f6',
          'blue-dim': 'rgba(59,130,246,0.15)',
          green: '#22c55e',
          'green-dim': 'rgba(34,197,94,0.15)',
          amber: '#f59e0b',
          'amber-dim': 'rgba(245,158,11,0.15)',
          red: '#ef4444',
          'red-dim': 'rgba(239,68,68,0.15)',
          teal: '#14b8a6',
          'teal-dim': 'rgba(20,184,166,0.15)',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#475569',
          accent: '#7c5cfc',
        }
      },
      backdropBlur: { xs: '4px', sm: '8px', md: '16px' },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    }
  },
  plugins: []
}
