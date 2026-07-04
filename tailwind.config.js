/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1a6b3c',
        'forest-dark': '#14532d',
        leaf: '#4ade80',
      },
    },
  },
  plugins: [],
}
