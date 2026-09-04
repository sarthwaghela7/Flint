/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF8',
        ink: '#0A0A0A',
        accent: '#FF5A1F',
      },
      fontFamily: {
        body: ['"Space Grotesk"', 'sans-serif'],
        logo: ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
}
