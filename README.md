# Studiofile — 3D Design & E-Commerce

Premium e-commerce + showcase for a Paris-based 3D printing studio.

## 🚀 Quick Start

### 1. Installation

```bash
# if Required NVM path prefix for this environment: PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm install
npm install
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and add your Shopify Storefront credentials:

```Bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Development

```Bash
# PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run dev
npm run dev
```

Note: Root / currently redirects to /coming-soon via middleware.

### 🛠 Tech Stack

- Framework Next.js 15 (App Router)
- Commerce: Shopify Storefront API (Headless GraphQL)
- Motion: motion/react (Performance-optimized animations)
- Styles: Tailwind CSS (Custom "Stroke/Canvas" design system)
- Smooth Scroll: Lenis

### 📂 Project Documentation

(AI Context)To keep the main context window clean, technical details are modularized:

- `CLAUDE.md` : Core workflow rules, NVM paths, and subagent strategies.
- `docs/architecture.md` : Data flow, Shopify patterns, and TOTEM configurator logic.
- `docs/STATUS.md` : Current roadmap, pre-launch checklist, and technical debt.
- `docs/IDEAS.md` : Creative sandbox for future features (SVG text, scroll effects).
- `.claude/rules/` : Specialized instruction sets for Styles, Shopify, and TOTEM.

### 🏗 Key Commands

`npm run dev` : Start development server
`npm run type-check` : Run TypeScript validation (Strict: false)
`npm run build` : Production build (0 warnings required)
`npm run lint` : Code quality check
