import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Refined real estate palette — editorial / luxury feel
        ink: { DEFAULT: "#0E1A14", soft: "#2A3A32" },
        paper: "#FAF7F0",
        cream: { DEFAULT: "#F5F1E8", dark: "#E8E2D3" },
        moss: { DEFAULT: "#3A5743", dark: "#2A4232", light: "#5C7A65" },
        terra: { DEFAULT: "#C8623C", dark: "#A04E2E", light: "#E89A7E" },
        gold: "#C9A659",
        // Semantic tokens
        border: { DEFAULT: "#E8E2D3", soft: "#F0EBE0" },
        // Status colors
        blue: "#3B6E8F",
        green: "#3F7A4E",
        yellow: "#B88A2E",
        red: "#B5462D",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,26,20,.05)",
        card: "0 4px 16px rgba(14,26,20,.08)",
        lift: "0 16px 48px rgba(14,26,20,.14)",
      },
      animation: {
        "fade-in": "fadeIn .25s ease-out",
        "slide-up": "slideUp .3s cubic-bezier(.4,0,.2,1)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
