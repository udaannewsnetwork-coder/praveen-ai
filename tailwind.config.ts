import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        background: "#06090C",
        surface: "#0B1015",
        "surface-2": "#111820",
        "surface-3": "#161F29",
        border: "#1E2933",
        foreground: "#EAF1F6",
        muted: "#8494A0",
        electric: {
          DEFAULT: "#2E8FFF",
          dim: "#1B5FB8",
          glow: "#5FB2FF",
        },
        emerald: {
          DEFAULT: "#18C99A",
          dim: "#0F8F6E",
          glow: "#4FE8C4",
        },
        amber: {
          DEFAULT: "#F5A623",
        },
        crimson: {
          DEFAULT: "#F5455C",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, #06090C), linear-gradient(to right, #1E2933 1px, transparent 1px), linear-gradient(to bottom, #1E2933 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        "rise-in": "rise-in 0.5s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
