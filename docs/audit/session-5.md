# Session 5 — Performance & Production Readiness

## Fixed this session
- [C-1] `next.config.ts` — added Content-Security-Policy header (default-src, script-src, style-src, img-src, font-src, connect-src, frame-ancestors)
- [C-2] `src/app/sitemap.ts` — localhost fallback replaced with canonical domain `https://studiofile.fr`
- [C-3] `src/app/api/newsletter/route.ts` — subscriber email logged unconditionally to production; wrapped in `NODE_ENV === 'development'` guard
- [I-2] `package.json` — `shadcn` CLI moved from `dependencies` to `devDependencies`
- [I-4] `public/manifest.json` — `background_color` corrected `#FAF7F2` → `#FAF5F0` (canvas token); `theme_color` corrected `#1A1917` → `#141414` (black token)
- [I-6] `src/app/sitemap.ts` — `/products/totem` (virtual product, no Shopify handle) was missing from sitemap; added with `priority: 0.9`
- [I-7] `src/app/sitemap.ts` — `/faq`, `/search`, and all four policy pages (`/policies/privacy-policy`, `/policies/refund-policy`, `/policies/terms-of-service`, `/policies/shipping-policy`) added
- [I-8] `src/app/robots.ts`, `src/lib/utils/seo.ts` — fallback domain corrected from `studiofile.com` to `studiofile.fr` in both files
- [I-12] `next.config.ts` — dead `rewrites()` function returning three empty arrays deleted
- [M-2] `next.config.ts` — `Strict-Transport-Security` header added (`max-age=63072000; includeSubDomains; preload`)
- [M-3] `src/app/api/newsletter/route.ts` — email validation strengthened from `includes("@")` to full regex (matches contact route pattern)
- [M-6] `src/app/sitemap.ts` — all `lastModified` values were `new Date()` (build timestamp); static routes now use a fixed date; dynamic routes (products, collections) omit `lastModified` since `updatedAt` is not in the current query shape
- [M-10] `next.config.ts` — `Cross-Origin-Opener-Policy: same-origin` header added
- [M-11] `public/manifest.json` — `"lang": "en"` field added

## Deferred — fix in final pass

### CRITICAL
_(none remaining)_

### IMPORTANT
- [I-1] `.env.local.example` — `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` missing from example file; add with comment
- [I-3] `src/app/layout.tsx` — four Google fonts (`JetBrains_Mono`, `Instrument_Sans`, `Instrument_Serif`, `Inter_Tight`) loaded on every page; audit which are actually used in production components and remove unused
- [I-5] `src/app/api/contact/route.ts`, `newsletter/route.ts` — no rate limiting; handle via Vercel WAF or `@upstash/ratelimit`
- [I-9] `tsconfig.json` — `moduleResolution: "node"` outdated; should be `"bundler"` for Next.js 15+
- [I-10] `src/app/(main)/account/` — zero `loading.tsx` files; account pages fetch data async with no loading state
- [I-11] `src/app/layout.tsx:33` — `html lang="en"` needs verification against actual site content language

### MINOR
- [M-1] `tsconfig.json` — `target: "ES2017"` outdated; update to `ES2022`
- [M-4] `public/manifest.json` — `icon-192-maskable.png` and `screenshot-540x720.png` referenced but not present in `/public/`
- [M-5] `postcss.config.js` — uses CommonJS `module.exports`; rename to `.mjs` for ESM consistency
- [M-7] `middleware.ts` — post-launch steps (remove soft-launch `/` redirect, uncomment real `config` export) should be added to `docs/STATUS.md` pre-launch checklist
- [M-8] `src/app/layout.tsx:52–55` — JSON-LD `sameAs` includes Pinterest (not listed as studio platform); verify all social handles are correct
- [M-9] `.env.local.example` — `NEXT_PUBLIC_SITE_URL` value is `http://localhost:3000` with no comment explaining what the production value should be
