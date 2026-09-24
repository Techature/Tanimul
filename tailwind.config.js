/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
      },
      colors: {
        background: '#E8E8E8',
        pastel: {
          yellow: '#FFF3B0',
          green: '#B8E6B8',
          purple: '#D4B8E8',
        },
      },
      animation: {
        bouncegentle: 'bouncegentle 0.6s ease-in-out',
        pulseRecord: 'pulseRecord 1.2s ease-in-out infinite',
      },
      keyframes: {
        bouncegentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseRecord: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.5)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 12px rgba(239, 68, 68, 0)' },
        },
      },
    },
  },
  plugins: [],
}
