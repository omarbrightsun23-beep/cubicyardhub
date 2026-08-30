/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#003865',
          green: '#1BB954',
          yellow: '#FBAF3C',
          cream: '#EFE6C8',
          charcoal: '#2C3138',
          gray: '#828892',
          sand: '#FAF8F2',
        }
      }
    },
  },
  plugins: [],
}
