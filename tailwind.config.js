/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'M PLUS 1p', 'sans-serif'],
      },
      colors: {
        triz: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#c1d3fe',
          300: '#91b0fd',
          400: '#5c84fa',
          500: '#375df5',
          600: '#2544eb',
          700: '#1d34d8',
          800: '#1e2cb0',
          900: '#1e2b8c',
          950: '#161a51',
        },
      },
    },
  },
  plugins: [],
}
