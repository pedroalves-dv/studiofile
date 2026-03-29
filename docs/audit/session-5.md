# Session 5 — Performance & Production Readiness

## Fixed this session

- [C-1] `next.config.ts` — added Content-Security-Policy header (default-src, script-src, style-src, img-src, font-src, connect-src, frame-ancestors)
- [C-2] `src/app/sitemap.ts` — localhost fallback replaced with canonical domain `https://studiofile.fr`
- [C-3] `src/app/api/newsletter/route.ts` — subscriber email logged unconditionally to production; wrapped in `NODE_ENV === 'development'` guard
- [I-2] `package.json` — `shadcn` CLI moved from `dependencies` to `devDependencies`
- [I-4] `public/manifest.json` — `background_color` corrected `#FAF7F2` → `#FAF5F0` (canvas token); `theme_color` corrected `#1A1917` → `#141414` (black token)
- [I-6] `src/app/sitemap.ts` — `/products/totem` (virtual product, no Shopify handle) was missing from sitemap; added with `priority: 0.9`
- [I-7] `src/app/sitemap.ts` — `/faq`, `/search`, and all four policy pages added
- [I-8] `src/app/robots.ts`, `src/lib/utils/seo.ts` — fallback domain corrected from `studiofile.com` to `studiofile.fr` in both files
- [I-12] `next.config.ts` — dead `rewrites()` function returning three empty arrays deleted
- [M-2] `next.config.ts` — `Strict-Transport-Security` header added (`max-age=63072000; includeSubDomains; preload`)
- [M-3] `src/app/api/newsletter/route.ts` — email validation strengthened from `includes("@")` to full regex
- [M-6] `src/app/sitemap.ts` — static routes now use a fixed date; dynamic routes omit `lastModified`
- [M-10] `next.config.ts` — `Cross-Origin-Opener-Policy: same-origin` header added
- [M-11] `public/manifest.json` — `"lang": "en"` field added

## Fixed in final pass

- [I-1] `.env.local.example` — added `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` with server-only comment.
- [I-3] `src/app/layout.tsx` — audited all four Google fonts; `JetBrains_Mono`, `Instrument_Sans`, `Instrument_Serif` had no production usages; removed imports, const declarations, and className variables. `Inter_Tight` kept (`font-inter` class used in login page and LandingParallaxImages).
- [I-9] `tsconfig.json` — `moduleResolution` updated from `"node"` to `"bundler"`.
- [I-10] `src/app/(main)/account/` — created `loading.tsx` for all four protected routes: dashboard, orders, settings, addresses.
- [M-1] `tsconfig.json` — `target` updated from `"ES2017"` to `"ES2022"`.
- [M-5] `postcss.config.js` — renamed to `postcss.config.mjs`; converted body to ESM `export default`.
- [M-7] `docs/STATUS.md` — pre-launch checklist already included middleware redirect removal; confirmed present, no change needed.
- [M-9] `.env.local.example` — `NEXT_PUBLIC_SITE_URL` comment updated to note production value `https://studiofile.fr`.

## Requires human decision

- [I-5] `src/app/api/contact/route.ts`, `newsletter/route.ts` — no rate limiting. Requires platform decision: Vercel WAF vs `@upstash/ratelimit`.
- [I-11] `src/app/layout.tsx` — `html lang="en"` verification. Content is English-first; current value appears correct. Confirm before launch.
- [M-4] `public/manifest.json` — `icon-192-maskable.png` and `screenshot-540x720.png` referenced but not present in `/public/`. Asset creation required.
- [M-8] `src/app/layout.tsx` — JSON-LD `sameAs` includes Pinterest; verify all social handles are correct before launch.
