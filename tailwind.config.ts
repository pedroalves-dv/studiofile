import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1A1917',
        canvas: '#FAF7F2',
        accent: '#C8A97E',
        muted: '#6B6560',
        border: '#E5E0D8',
        success: '#4A7C59',
        error: '#B84040',
        stone: {
          50: '#fafaf8',
          100: '#f5f5f0',
          200: '#e7e5e0',
          300: '#d6d3cb',
          400: '#a9a39a',
          500: '#78746e',
          600: '#5f5b54',
          700: '#4a4640',
          800: '#3e3a35',
          900: '#27242f',
          950: '#1a1917',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '2px',
      },
      letterSpacing: {
        display: '0.08em',
        tight: '-0.02em',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
