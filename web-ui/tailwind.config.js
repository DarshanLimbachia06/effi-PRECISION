/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eng-surface': '#050505',
        'eng-surface-light': '#0f0f12',
        'eng-border': '#1e1e24',
        'eng-pass': '#2dd4bf',
        'eng-fail': '#ff4b4b',
        'eng-info': '#8b5cf6',
        'eng-accent': '#f59e0b',
        'eng-text-muted': '#82828e',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
