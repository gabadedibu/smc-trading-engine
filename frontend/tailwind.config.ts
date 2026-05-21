import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        card: '#111118',
        border: '#1e1e2e',
        accent: '#6366f1',
        buy: '#22c55e',
        sell: '#ef4444',
        wait: '#f59e0b',
        primary: '#e2e8f0',
        muted: '#64748b'
      }
    }
  },
  plugins: []
} satisfies Config;
