/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chess-bg': '#312e2b',
        'chess-surface': '#262421',
        'chess-hover': '#383531',
        'chess-green': '#81b64c',
        'chess-green-hover': '#95c660',
        'chess-text': '#ffffff',
        'chess-muted': '#c3c3c0',
        'chess-border': '#403d39',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
