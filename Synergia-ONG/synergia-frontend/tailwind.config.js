/** @type {import('tailwindcss').Config} */
export default {
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}", // <--- CORREÇÃO: USE ** PARA TODOS OS SUBDIRETÓRIOS
],
  theme: {
    extend: {
      colors: {
        "synergia-green": "#008779",
        "synergia-dark": "#006c5f",
      },
    },
  },
  plugins: [],
};