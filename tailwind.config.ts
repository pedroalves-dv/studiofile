import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "10xl": "10rem",
        "11xl": "12rem",
      },
      colors: {
        black: "var(--color-black)",
        ink: "var(--color-ink)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        accent: "var(--color-accent)",
        muted: "var(--color-muted)",
        stroke: "var(--color-stroke)",
        light: "var(--color-light)",
        success: "var(--color-success)",
        error: "var(--color-error)",
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "serif"],
        logoserif: ["var(--font-logoserif)", "serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "2px",
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
      },
      animation: {
        slideDown: "slideDown 0.15s ease-out",
        slideUp: "slideUp 0.15s ease-out",
      },
      
    },
  },
  plugins: [],
};

export default config;
