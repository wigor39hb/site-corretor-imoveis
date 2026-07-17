import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0D1B2A",
          800: "#122236",
          700: "#1B3A5C",
          500: "#2D5986",
        },
        gold: {
          500: "#C9A96E",
          400: "#D9BE8A",
          300: "#E8D5A3",
          200: "#F2E8CC",
        },
        neutral: {
          900: "#0A0A0A",
          600: "#4A4A4A",
          400: "#888888",
          200: "#E8E8E8",
          100: "#F2F2F2",
          50: "#F8F6F1",
        },
        success: "#3DAA6F",
        warning: "#D4900A",
        error: "#E05252",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      width: {
        sidebar: "260px",
      },
    },
  },
  plugins: [],
};
export default config;
