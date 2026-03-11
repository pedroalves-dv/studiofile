# STATUS.md — Studiofile

Current position: **Phase 11 in progress — 11.3 Header effects + 11.4 Shop layout remaining.**

Update this file at the end of every session.

---

## Phase Progress

| Phase | Description | Status | Audit |
| ------- | ----------- | --------- | --------- |
| 1.1 | Scaffolding, env, next.config, tailwind | ✅ Done | ✅ Done |
| 1.2 | Shopify types, client, queries, mutations, server functions | ✅ Done | ✅ Done |
| 2.1 | Design tokens, fonts, globals.css, layout.tsx | ✅ Done | ✅ Done |
| 2.2 | Header, Footer, Breadcrumb, PageWrapper | ✅ Done | ✅ Done |
| 2.3 | UI primitives, Toast, LoadingBar, CookieConsent | ✅ Done | ✅ Done |
| 3.1 | Loading skeletons, error boundaries, not-found | ✅ Done | ✅ Done |
| 3.2 | Favicon, manifest, OG images | ✅ Done | ✅ Done |
| 4.1 | Home page | ✅ Done | ✅ Done |
| 4.2 | Collections index | ✅ Done | ✅ Done |
| 4.3 | Shop / Collection pages, filtering, sorting, pagination | ✅ Done | ✅ Done |
| 4.4 | Product Detail Page (full) | ✅ Done | ✅ Done |
| 4.5 | About, Contact, Policies, Sitemap | ✅ Done | ✅ Done |
| 5.1 | Search, predictive search, SearchBar, Header integration | ✅ Done | ✅ Done |
| 6.1 | Cart context & state | ✅ Done | ⬜ |
| 6.2 | Cart drawer UI | ✅ Done | ⬜ |
| 7.1 | Auth flow, middleware, account pages | ✅ Done | ⬜ |
| 8.1 | Wishlist | ✅ Done | ⬜ |
| 8.2 | Recently viewed, related products | ✅ Done | ⬜ |
| 9.1 | Analytics, SEO, structured data | ✅ Done | ⬜ |
| 10.1 | Animation layer — GSAP removed, replaced by CSS/Motion in Phase 11 | ✅ Done | ✅ Done |
| 10.2 | Page transitions, accessibility audit | ✅ Done | ✅ Done |
| 11.1 | Marquee component (CSS, no JS animation) | ✅ Done | ✅ Done |
| 11.2 | Home page editorial overhaul (mobile-first, BrandStory, asymmetric grid, process accordion) | ✅ Done | ⬜ |
| 11.x | Cart & Wishlist drawer styling overhaul (ad hoc — outside phase structure) | ✅ Done | ⬜ |
| 11.3 | Header accent hover effects | 🔄 In Progress | ⬜ |
| 11.4 | Shop & collection editorial layout, ProductCard redesign | ⬜ | ⬜ |

---

## Next Session — Phase 11 (continued)

**Done:** 11.1 (Marquee), 11.2 (home page overhaul), 11.x (cart/wishlist drawer styling).

**Remaining:**

1. **11.3 — Header accent hover effects**: Verify whether the blurred accent slash behind the logo and nav link accent-on-hover effects from the phase spec are implemented. Complete or finish if partial.
2. **11.4 — Shop & collection editorial layout**: Full-width grid, ProductCard redesign (outline on hover, no scale), collapsible filter panel, large collection heading at 8vw.

After 11.4: move to pre-launch checklist.

Note: Phase 11.5 (PDP redesign) is intentionally deferred — the PDP will be rebuilt
as a custom product configurator in a dedicated phase.

---

## Deferred Items

These were intentionally skipped or partially implemented and must be completed before launch.

| Item | Deferred from | Notes |
| ---- | ------------- | ----- |
| `src/lib/utils/seo.ts` full implementation | Phase 1 | ✅ Done in Phase 9 |
| `RelatedProducts` full implementation | Phase 4.4 | ✅ Done in Phase 8 |
| `WishlistContext` full implementation | Phase 2.1 | ✅ Done in Phase 8 |
| `CartContext` full implementation | Phase 2.1 | ✅ Done in Phase 6 |
| Address management UI | Phase 7 | Auth core done; no addresses page in this scaffold |
| Contact form email service (Resend/Postmark) | Phase 4.5 | API route logs only — wire before launch |
| About / founder page real photography | Phase 4.5 | Placeholder divs — replace when assets ready |
| Instagram / Pinterest real handles | Phase 9 | Placeholder URLs in Organization JSON-LD |
| PDP redesign | Phase 11 | Deferred — will be rebuilt as custom product configurator |
| Cart & Wishlist drawer styling | Phase 11.x | Done ad hoc outside phase structure — audit against phase 11 spec before launch |

---

## Known Issues & Gotchas

Issues discovered during development that affect future phases:

- **`removeDiscountCode`** calls `CART_DISCOUNT_CODES_UPDATE` with an empty array — there is no separate remove mutation in Shopify's API.
- **Shopify discount codes** do not throw on invalid codes — they return `discountCodes[].applicable: false`. Check this flag, not a caught error.
- **`redirect()` in Server Actions** throws a special internal error — never wrap it in try/catch. See `customerLogout` in Phase 7.
- **`useSearchParams()` in LoadingBar** requires a Suspense boundary in `layout.tsx` — should already be in place from Phase 2.3.
- **`viewTransitionName`** as inline style requires `as React.CSSProperties` cast — TypeScript does not recognise this property natively.
- **`quantityAvailable`** can be `null` in Shopify when inventory tracking is disabled — treat as unlimited stock, not zero.
- **`ImageZoom`** uses `createPortal` directly into `document.body`, not the `Dialog` component — Dialog has `max-w-md` constraints unsuitable for a fullscreen lightbox.
- **`VariantSelector.tsx`** syncs `?variant=` to URL on selection. Initial variant from URL is read by `ProductInfoPanel` — ensure `useSearchParams` is available (wrap in Suspense if SSR issues arise).
- **`PageWrapper`** is a `<div>` — `layout.tsx` wraps children in `<main id="main-content">`, so PageWrapper must not use `<main>` (duplicate landmark). PDP page likewise uses `<div>`, not `<main>`.
- **`muted` color** is `#6B6560` in `tailwind.config.ts` — do not change to `#8A8580`, which fails WCAG AA contrast.
- **`RevealOnScroll`** is currently a plain `<div>` passthrough — GSAP was removed. Rebuild with CSS scroll-driven animation when needed (Phase 11.4 or later).
- **`ProductGrid`** is `'use client'` — was required for GSAP which has since been removed. Can be converted back to a server component if no client features are needed.
- **`src/components/shop/`** contains only `FilterPanel.tsx` (canonical) and `SortSelect.tsx` (dead, can be deleted). `search/FilterPanel` re-exports from `shop/FilterPanel` — do not delete `shop/FilterPanel` without updating that re-export.

---

## Pre-Launch Checklist

- [ ] Replace placeholder founder name and bio (About page)
- [ ] Replace placeholder photography (About page)
- [ ] Update Instagram and Pinterest URLs in Footer and Organization JSON-LD
- [ ] Wire contact form to email service (Resend recommended)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Verify all `generateMetadata` canonical URLs match production domain
- [ ] Test Shopify checkout handoff with real store credentials
- [ ] Run Lighthouse audit — accessibility score ≥ 90
- [ ] Run `npm run build` clean with zero warnings
- [ ] Verify sitemap at `/sitemap.xml` includes all products and collections
- [ ] Verify `/robots.txt` disallows `/account/` and `/api/`
