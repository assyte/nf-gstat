/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gstat-red': {
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
        },
        'gstat-dark': {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
        }
      }
    },
  },
  plugins: [],
}
