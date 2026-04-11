import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "1xs": "0.65rem",
        "10xl": "10rem",
        "11xl": "12rem",
        "12xl": "14rem",
        "13xl": "16rem",
        "14xl": "18rem",
        "15xl": "20rem",
      },
      colors: {
        black: "rgb(var(--color-black) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        tamed: "rgb(var(--color-tamed) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        stroke: "rgb(var(--color-stroke) / <alpha-value>)",
        light: "rgb(var(--color-light) / <alpha-value>)",
        lighter: "rgb(var(--color-lighter) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        mono2: ["var(--font-mono2)", "monospace"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        stack: ["var(--font-stack)", "sans-serif"],
        stacktext: ["var(--font-stacktext)", "sans-serif"],
        hubot: ["var(--font-hubot)", "sans-serif"],
        tasa: ["var(--font-tasa)", "sans-serif"],
        mona: ["var(--font-mona)", "sans-serif"],
        zal: ["var(--font-zal)", "sans-serif"],
        funnel: ["var(--font-funnel)", "sans-serif"],
        khregular: ["var(--font-khregular)", "sans-serif"],
        khbold: ["var(--font-khbold)", "sans-serif"],
      },
      letterSpacing: {
        display: "0.08em",
        tight: "-0.02em",
      },
      keyframes: {
        slideDown: {
          from: { gridTemplateRows: "0fr" },
          to: { gridTemplateRows: "1fr" },
        },
        slideUp: {
          from: { gridTemplateRows: "1fr" },
          to: { gridTemplateRows: "0fr" },
        },
        badgeIn: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        revealLTR: {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "inset(0 0% 0 0)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.15s ease-out",
        slideUp: "slideUp 0.15s ease-out",
        badgeIn: "badgeIn 0.3s ease-out forwards",
        revealLTR: "revealLTR 0.15s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
