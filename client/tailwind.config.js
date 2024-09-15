/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'rgba(120, 57, 238,0.5)',
        secondary:'rgba(120, 57, 238,1)'
      }
    },
  },
  plugins: [],
}
