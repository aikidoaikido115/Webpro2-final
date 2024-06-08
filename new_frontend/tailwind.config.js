/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        appear: {
          '0%': {
            opacity: '0',
            clipPath: 'inset(100% 100% 0 0)',
          },
          '100%': {
            opacity: '1',
            clipPath: 'inset(0 0 0 0)',
          },
        },
      },
      animation: {
        appear: 'appear 1s linear',
      },
    },
  },
  plugins: [],
}