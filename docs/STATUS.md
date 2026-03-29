# STATUS.md — Studiofile

Current position: **Session Final complete — all deferred audit items resolved. Phase 11.4 (shop layout) remaining. TOTEM Phase 4 (real SVG shapes) pending. Site ready for pre-launch checklist review.**

Update this file at the end of every session.

---

## Site Architecture

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js 16 App Router, TypeScript (`strict: false`) |
| Styling    | Tailwind CSS v3                                     |
| Backend    | Shopify Storefront API (GraphQL)                    |
| Animations | CSS transitions · `motion` v12                      |
| Hosting    | Vercel                                              |

**Soft launch mode:** `middleware.ts` redirects `/` → `/coming-soon`. The main site is live but gated. Remove the redirect when ready to launch.

---

## Phase Progress

### Foundation & Infrastructure (Done)

| Phase   | Description                                                                         | Status  |
| ------- | ----------------------------------------------------------------------------------- | ------- |
| 1–3     | Scaffolding, Shopify client, design tokens, layout shell, loading/error states      | ✅ Done |
| 4.1–4.3 | Home page, Collections index, Shop/Collection pages with filter + sort + pagination | ✅ Done |
| 4.4     | Product Detail Page (standard)                                                      | ✅ Done |
| 4.5     | About, Contact, Policies, Sitemap                                                   | ✅ Done |
| 5       | Search + predictive search                                                          | ✅ Done |
| 6       | Cart context, cart drawer, discount codes, free shipping bar                        | ✅ Done |
| 7       | Customer auth: login, register, forgot password, account dashboard, orders          | ✅ Done |
| 7.x     | Account settings page — profile update + password change, 4-tab nav synced          | ✅ Done |
| 7.y     | Account addresses page — list, add, edit, delete, set-as-default                    | ✅ Done |
| 8       | Wishlist, Recently Viewed, Related Products                                         | ✅ Done |
| 9       | Analytics (Vercel), SEO, structured data, sitemap, robots                           | ✅ Done |
| 10      | GSAP removed — replaced by CSS/motion in Phase 11. View transitions added.          | ✅ Done |

### Phase 11 — UX Design Pass

| Phase | Description                                                                                                           | Status         |
| ----- | --------------------------------------------------------------------------------------------------------------------- | -------------- |
| 11.1  | Marquee component (CSS, no JS)                                                                                        | ✅ Done        |
| 11.2  | Home page editorial overhaul (hero, brand story, collections, featured)                                               | ✅ Done        |
| 11.x  | Cart + Wishlist drawer styling overhaul (ad hoc)                                                                      | ✅ Done        |
| 11.3  | Header accent hover effects (logo slash + nav color shift)                                                            | ✅ Done        |
| 11.x  | Mobile menu UX polish — interactions, drawer animations, dialog refinements                                           | ✅ Done        |
| 11.x  | Font stack consolidation + UI overhaul — removed experimental fonts, tightened type system                            | ✅ Done        |
| 11.x  | Hero sticky columns — staggered image placeholders (bg-light/bg-lighter), sticky TOTEM title on scroll                | ✅ Done        |
| 11.x  | Account pages audit + layout refactor — prep for full site styling pass                                               | 🔄 In Progress |
| 11.4  | Shop + collection editorial layout, ProductCard redesign (outline on hover)                                           | ⬜ Pending     |
| 11.x  | Coming-soon page editorial rework — canvas aesthetic, parallax image section, logo-only header, LandingSignup re-skin | ✅ Done        |

**Phase 11 notes:**

- Hero sticky columns are complete with placeholder color blocks. Real product/lifestyle images will be swapped in during a future phase.
- 11.5 (PDP redesign) is intentionally skipped — the PDP will be replaced by the TOTEM configurator.

---

## TOTEM Configurator — Active Build Track

The TOTEM lamp is a modular ceiling light: stackable 3D-printed shapes, each sold as a separate Shopify product. The configurator at `/products/totem` lets customers build their lamp, then adds the whole configuration as a grouped cart bundle.

| Phase   | Description                                                                                          | Status  |
| ------- | ---------------------------------------------------------------------------------------------------- | ------- |
| TOTEM 1 | `totem-config.ts`, cart line attributes, `addBundle()` in `useCart`, `TotemCartGroup` in cart drawer | ✅ Done |
| TOTEM 2 | `TotemConfigurator` UI at `/products/totem` — stack, color picker, shape catalog, live total         | ✅ Done |
| TOTEM 3 | Preset gallery tab, visual preview pane, `TotemCartGroup` polish                                     | ✅ Done |

### TOTEM Architecture Decisions

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

---

## Known Issues & Gotchas

- **`cart.lines` is a flat array** — `ShopifyCart.lines: ShopifyCartLine[]` — not `.lines.edges`. The GraphQL queries return edges/nodes but the storefront client normalises to flat arrays. All component code uses flat array access; do not use `.edges`.
- **`removeDiscountCode`** calls `CART_DISCOUNT_CODES_UPDATE` with empty array — no separate remove mutation in Shopify's API.
- **Shopify discount codes** do not throw on invalid — check `discountCodes[].applicable: false`.
- **`redirect()` in Server Actions** throws a special error — never wrap in try/catch.
- **`quantityAvailable`** can be `null` when inventory tracking is disabled — treat as unlimited.
- **`viewTransitionName`** as inline style requires `as React.CSSProperties` cast.
- **`ImageZoom`** uses `createPortal` into `document.body`, not the `Dialog` component.
- **`RevealOnScroll`** is a plain passthrough `<div>` — GSAP was removed. Rebuild with CSS if needed.
- **`ProductGrid`** is `'use client'` — legacy from GSAP era, can be converted to server component.
- **`src/components/search/FilterPanel`** re-exports from `src/components/shop/FilterPanel` — do not delete the shop version.
- **`muted` color** is `#6B6560` — do not change to `#8A8580` (fails WCAG AA).
- **`strict: false`** in `tsconfig.json` — TypeScript will not catch all type errors; run `type-check` explicitly.
- **Font normalization complete** — `font-body`, `font-mono`, and `font-serif` classes removed from all components. Geist Sans is inherited from the `body` default. Only `font-display` (Noka) is used explicitly in components.
- **Experimental font tokens in `tailwind.config.ts`** — `font-tasa`, `font-hubot`, `font-mona`, `font-zal`, `font-funnel`, `font-khregular`, `font-khbold`, `font-stack`, `font-stacktext`, `font-mono2` exist for type testing only. Only `font-display` should be used in production components. Do not remove the experimental tokens until the font decision is finalised.
