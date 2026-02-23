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
          50: "#f4f0f7",
          100: "#e5ddf0",
          200: "#cbbce3",
          300: "#a892cf",
          400: "#8166b8",
          500: "#63469e",
          600: "#4e3480",
          700: "#3f2a68",
          800: "#352356",
          900: "#2c1e47",
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
