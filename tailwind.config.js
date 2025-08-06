
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1a202c',
        'brand-secondary': '#2d3748',
        'brand-accent': '#4299e1',
        'brand-light': '#edf2f7',
      },
    },
  },
  plugins: [],
}
