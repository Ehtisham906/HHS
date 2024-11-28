/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: '#ff3c33',
        primary: '#00175A',
      },
      fontSize: {
        '1xl': '34px',
        '2xl': '32px',
        '3xl': '26px',
        '4xl': '22px',
        '5xl': '18px',
        '6xl': '16px',
      },
      animation: {
        "loop-scroll": 'loop-scroll 8s linear infinite'
      },
      keyframes: {
        "loop-scroll": {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    function ({ addUtilities }) {
      addUtilities({
        '.clip-ellipse': {
          clipPath: 'ellipse(100% 100% at 50% 100%)',
        },
      });
    },
    // ...
  ],
}