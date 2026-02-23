import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: "#fdf5f0",
          100: "#fae7db",
          200: "#f5cdb6",
          300: "#eeab88",
          400: "#e58057",
          500: "#dc6030",
          600: "#ce4c23",
          700: "#ab3c1e",
          800: "#88321f",
          900: "#6e2c1d",
        },
        sand: {
          50: "#faf9f6",
          100: "#f2efe6",
          200: "#e5dece",
          300: "#d4c8b0",
          400: "#bfae8e",
          500: "#a8926c",
          600: "#937b57",
          700: "#7a6347",
          800: "#64523c",
          900: "#534534",
        },
        jungle: {
          50: "#f2f9f2",
          100: "#e0f2e0",
          200: "#c1e5c4",
          300: "#92d097",
          400: "#5db365",
          500: "#389640",
          600: "#2a7a31",
          700: "#246029",
          800: "#214d25",
          900: "#1d4020",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
