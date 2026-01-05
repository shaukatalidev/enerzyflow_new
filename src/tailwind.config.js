/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2.5rem",
      },
    },

    extend: {
      colors: {
        brand: "#00F0FF",
        dark: "#050505",
        surface: "#0F0F0F",
        glass: "rgba(255, 255, 255, 0.05)",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },

      backgroundImage: {
        "cyber-grid":
          "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
        "radial-dark":
          "radial-gradient(circle at center, rgba(0,240,255,0.08), transparent 70%)",
      },

      boxShadow: {
        glow: "0 0 40px rgba(0,240,255,0.25)",
        soft: "0 10px 30px rgba(0,0,0,0.6)",
      },

      backdropBlur: {
        glass: "16px",
      },

      zIndex: {
        "-10": "-10",
        60: "60",
        70: "70",
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSlow: "pulse 6s ease-in-out infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },

  plugins: [],
};
