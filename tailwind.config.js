/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#0a0a0a',
        elevated: '#111111',
        border: '#1f1f1f',
        cyan: {
          DEFAULT: '#00ffff',
          glow: 'rgba(0,255,255,0.3)',
          dim: 'rgba(0,255,255,0.1)',
        },
        magenta: {
          DEFAULT: '#ff006e',
          glow: 'rgba(255,0,110,0.3)',
        },
        green: {
          term: '#00ff88',
        },
        yellow: {
          term: '#ffdd00',
        },
        orange: {
          term: '#ff8800',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Consolas', 'monospace'],
      },
      boxShadow: {
        cyan: '0 0 15px rgba(0,255,255,0.3)',
        magenta: '0 0 15px rgba(255,0,110,0.3)',
        green: '0 0 15px rgba(0,255,136,0.3)',
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        scanline: 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};
