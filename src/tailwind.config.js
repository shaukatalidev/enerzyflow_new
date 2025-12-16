/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#00F0FF",
        dark: "#050505",
        surface: "#0F0F0F",
        glass: "rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [],
};
