# STATUS.md — Studiofile

## TOTEM Architecture Decisions

Page structure TBD: /products/totem currently serves both showcase and configurator. A split into /products/totem (showcase) + /products/totem/configure (configurator) is under consideration — do not restructure these routes without discussion.

**Shopify product structure:** One product per shape (arch, dome, cylinder, cone, wave, sphere, torus, prism), one variant per color (chalk, stone, black, clay, sage, navy, cream, terracotta). Fixation kit and cable are two additional products. No fixed bundles — unlimited configuration.

**Cart mechanism:** Each module = one cart line. All lines in a build share a hidden `_build_id` attribute. The cart drawer groups lines by `_build_id` and renders them as a single `TotemCartGroup` card (collapsed/expandable).

**Presets:** Defined as TypeScript constants in `totem-config.ts` pointing at shape/color IDs. Clicking a preset populates configurator state — no separate Shopify products.

**UX model:** Composition, not shopping. Shapes are added to a stack (not toggled). Each piece has its own position and color. Reorder via ▲▼ arrows. Color picker appears contextually on selection.

### TOTEM Pending Before Phase 2 Goes Live

- [ ] Create TOTEM products in Shopify admin (per-module, per-color variants)
- [ ] Set `NEXT_PUBLIC_TOTEM_VARIANT_ID` env var (Phase 1 uses this placeholder)
- [ ] Replace placeholder variant IDs in `addBundle()` with real Shopify variant IDs

---

## Pre-Launch Checklist

- [ ] Remove `/` → `/coming-soon` redirect in `middleware.ts` and restore config matcher
- [ ] Wire contact form to email service (Resend recommended) — `src/app/api/contact/route.ts` only logs
- [ ] Wire newsletter to Shopify/Klaviyo — `src/app/api/newsletter/route.ts` only logs
- [ ] Create TOTEM products in Shopify admin
- [ ] Replace placeholder founder name, bio, photography on About page
- [ ] Update Instagram + TikTok URLs in Footer and `src/app/layout.tsx` Organization JSON-LD
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Run `npm run build` clean with zero warnings
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Verify sitemap at `/sitemap.xml` includes all products + collections
- [ ] Test Shopify checkout handoff with real store credentials
- [ ] Verify `/robots.txt` disallows `/account/` and `/api/`

## Known Inactive / Scaffolded Code

| Item | Status |
| --- | --- |
| Home page (`/`) | Redirected to `/coming-soon` — home content in `(main)/page.tsx` not seen by users |
| FAQ content | Page is live; all content is lorem ipsum placeholder |
| Contact email | `/api/contact` logs and returns success — no email service wired |
| Newsletter | `/api/newsletter` logs — not wired to Shopify/Klaviyo |
| TOTEM Shopify products | Configurator UI complete; variant IDs are placeholders |
| Footer social links | `href="#"` placeholders (except coming-soon which has real Instagram/TikTok URLs) |
| Wishlist header icon | Commented out in Header (drawer + WishlistButton work; entry point deferred) |
| Search overlay in Header | Commented out in Header |
| `ProductGrid` `'use client'` | GSAP legacy; safe to convert to server component |
