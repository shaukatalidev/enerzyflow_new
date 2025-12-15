/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        brand: "#00f0ff",
        dark: "#050505",
        surface: "#111111",
        // Optional: define opacity shades
        "brand-5": "rgba(0,240,255,0.05)",
        "brand-30": "rgba(0,240,255,0.3)",
        "brand-50": "rgba(0,240,255,0.5)",
      },
      // Custom text shadows
      textShadow: {
        glow: "0 0 10px rgba(0,240,255,0.4)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/postcss"), 
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".text-shadow-glow": {
          textShadow: theme("textShadow.glow"),
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};

export default config;
