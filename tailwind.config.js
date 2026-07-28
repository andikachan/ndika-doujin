/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e97991",
          light: "#f472b6",
          dark: "#ec4899",
          hover: "#d86a82",
        },
        surface: {
          light: "#f9fafb",
          dark: "#0e0e11",
        },
        card: {
          light: "#ffffff",
          dark: "#131314",
        },
        border: {
          light: "#e5e7eb",
          dark: "#1f1f23",
        },
        ink: {
          light: "#1a1a1a",
          dark: "#ffffff",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.45s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
      maxWidth: {
        reader: "900px",
      },
    },
  },
  plugins: [],
};
