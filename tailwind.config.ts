import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060c",
          900: "#080a14",
          850: "#0b0e1c",
          800: "#0f1424",
          700: "#161c31",
          600: "#1e2740",
        },
        brand: {
          violet: "#7c5cff",
          indigo: "#5b6cff",
          cyan: "#22d3ee",
          blue: "#3b82f6",
        },
        // CT VH — tema claro com roxo da logo
        arena: {
          blue: "#7c3aed",
          "blue-dark": "#6d28d9",
          orange: "#ea580c",
          green: "#16a34a",
          yellow: "#ca8a04",
          red: "#dc2626",
          bg: "#efe7fc",
          card: "#ffffff",
          ink: "#241b3d",
          muted: "#6f6890",
          border: "#ddd0f2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grad-brand": "linear-gradient(120deg, #7c5cff 0%, #22d3ee 100%)",
        "grad-brand-soft":
          "linear-gradient(120deg, rgba(124,92,255,.15), rgba(34,211,238,.12))",
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,.2), 0 20px 60px -20px rgba(124,92,255,.45)",
        "glow-cyan": "0 20px 70px -18px rgba(34,211,238,.5)",
        card: "0 10px 40px -18px rgba(0,0,0,.6)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(.9)", opacity: "0.7" },
          "70%,100%": { transform: "scale(1.6)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.4s infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
