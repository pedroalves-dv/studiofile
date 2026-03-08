# STATUS.md — Studiofile

Current position: **Phase 6 complete. Phase 7 is next.**

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
| 7.1 | Auth flow, middleware, account pages | ⬜ Next | ⬜ |
| 8.1 | Wishlist | ⬜ | ⬜ |
| 8.2 | Recently viewed, related products | ⬜ | ⬜ |
| 9.1 | Analytics, SEO, structured data | ⬜ | ⬜ |
| 10.1 | GSAP animations | ⬜ | ⬜ |
| 10.2 | Page transitions, accessibility audit | ⬜ | ⬜ |

---

## Next Session — Phase 7.1

**File to read:** `docs/phases/phase-7-auth.md`

**What gets built:**

- Auth flow: login, register, logout, forgot password
- Middleware for protected `/account/` routes
- Account pages: orders, addresses, profile
- `CustomerContext` or server-side session handling via Shopify Customer API

---

## Deferred Items

These were intentionally skipped or partially implemented and must be completed before launch.

| Item | Deferred from | Notes |
| ---- | ------------- | ----- |
| `src/lib/utils/seo.ts` full implementation | Phase 1 | Stub only — built in Phase 9 |
| `RelatedProducts` full implementation | Phase 4.4 | Returns null — built in Phase 8 |
| `WishlistContext` full implementation | Phase 2.1 | Stub only — built in Phase 8 |
| `CartContext` full implementation | Phase 2.1 | Stub only — built in Phase 6 |
| Contact form email service (Resend/Postmark) | Phase 4.5 | API route logs only — wire before launch |
| About / founder page real photography | Phase 4.5 | Placeholder divs — replace when assets ready |
| Instagram / Pinterest real handles | Phase 9 | Placeholder URLs in Organization JSON-LD |
| `src/components/shop/` directory | Phase 4 audit | Stray directory (SortSelect, FilterPanel, ProductGrid). Shop/collection pages now import from canonical paths (`search/`, `product/`). `src/components/shop/` can be deleted when safe. |
| `RelatedProducts.tsx` | Phase 4 audit | Fully implemented (spec says stub until Phase 8). Left as-is since it's working code. |

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
- **`src/components/ui/SkeletonCard.tsx`** is a stray duplicate — canonical location is `src/components/common/SkeletonCard.tsx`. Shop and collection pages now import from `common/`. The `ui/` copy can be deleted when safe.
- **`src/components/shop/`** is a stray directory containing SortSelect, FilterPanel, ProductGrid. Shop/collection pages now import from canonical paths. `src/components/shop/` can be deleted when safe (search/FilterPanel still re-exports from it — fix that when deleting).
- **`VariantSelector.tsx`** now syncs `?variant=` to URL on selection. Initial variant from URL is read by `ProductInfoPanel` — ensure `useSearchParams` is available (wrap in Suspense if SSR issues arise).

---

## Pre-Launch Checklist

Not started. Revisit after Phase 10.

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
  