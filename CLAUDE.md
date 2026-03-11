# CLAUDE.md — Studiofile

Project-level instructions for Claude Code. Read this at the start of every session.

---

## Project

Premium e-commerce + showcase website for a 3D printing and design studio.
Modular, functional home decor and furniture. Premium brand aesthetic.

| Layer | Choice |
| ------- | -------- |
| Frontend | Next.js 15 App Router, TypeScript |
| Styling | Tailwind CSS v3 |
| Backend | Shopify Storefront API (GraphQL) |
| Animations | CSS transitions · `motion` v12 · View Transitions API |
| Hosting | Vercel |

---

## Session Workflow

### Start of every session

1. Read this file.
2. Read `docs/STATUS.md` — check what is done and what is next.
3. Read existing files before editing them — never guess at their shape.

### During a session

- Scope your work to the files listed in the phase prompt. Do not touch unrelated files.
- Use `TodoWrite` to track multi-step tasks within a session.
- Fix TypeScript errors before moving on — run `npm run type-check` if unsure.
- Prefer `Edit` over `Write` for existing files to minimise diff noise.

### End of session

- Run type checking: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors required.
- Commit: `feat: phase X.Y — [description]`
- Update `docs/STATUS.md` — tick completed items, note anything blocked or deferred.

## Important

Do not use `npx` or bare `npm` directly — nvm is not available in the shell. Always prepend `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"` to any Node/npm commands.

### After `/compact` or context reset

Re-read this file first, then `docs/STATUS.md`.

---

## Repository Layout

```text
src/
  app/               ← Next.js App Router pages (server components by default)
  components/
    ui/              ← Accordion, ArrowButton, Badge, Button, Dialog, HoverWord,
                        Input, MagneticButton, MagnifyingGlassIcon, ScrambleButton,
                        ShoppingBagIcon, SimpleIcon, Skeleton, SparklesIcon,
                        TextEffectWrapper, Tooltip
    layout/          ← Header, Footer, Breadcrumb, PageWrapper
    product/         ← ProductCard, ProductGrid, ProductImage, ImageGallery,
                        ImageGalleryWithZoom, ImageZoom, ImageZoomGallery,
                        ProductInfoPanel, VariantSelector, StockIndicator,
                        RelatedProducts, RecentlyViewed, ProductViewTracker,
                        ProductViewEvent
    cart/            ← CartDrawer, CartItem, CartSummary, DiscountInput,
                        CartNote, FreeShippingBar, EmptyCart
    search/          ← SearchBar, PredictiveSearch, SearchResults, FilterPanel, SortSelect
    account/         ← AccountDashboard, OrderCard, OrderList
    wishlist/        ← WishlistButton, WishlistDrawer
    contact/         ← ContactForm
    common/          ← Toast, CookieConsent, LoadingBar, SkeletonCard,
                        RevealOnScroll, Marquee, HorizontalScrollRow
    home/            ← BrandStory, FeaturedProducts, HeroContent, NewsletterForm
  lib/
    shopify/         ← client.ts, queries.ts, mutations.ts, types.ts,
                        products.ts, collections.ts, cart.ts, auth.ts,
                        search.ts, policies.ts
    utils/           ← format.ts, cn.ts, seo.ts, params.ts
    constants.ts     ← FREE_SHIPPING_THRESHOLD, CURRENCY_CODE
  hooks/             ← useCart, useWishlist, useScrollLock, useLocalStorage,
                        useDebounce, useMediaQuery, useRecentlyViewed,
                        useIsomorphicLayoutEffect, useClickOutside,
                        useScramble, useScroll
  context/           ← CartContext.tsx, WishlistContext.tsx, ToastContext.tsx
docs/
  STATUS.md          ← current progress — update after every session
  phases/            ← one file per phase with detailed build instructions
  BUILD-ORDER.md     ← rationale for the build sequence
```

---

## Server vs Client Rules

- Pages are **server components** by default — never add `'use client'` to a page.
- Client logic lives in leaf components imported into server pages.
- Client components cannot import server lib functions — use Server Actions or API routes.
- Cart actions (`src/lib/shopify/cart.ts`) are Server Actions — call from client via `useCart`.
- Auth actions (`src/lib/shopify/auth.ts`) are Server Actions — call from forms/useTransition.
- Predictive search: client calls `/api/search/predictive` route, not the lib directly.
- Wishlist/recently viewed product fetching: client calls `/api/products/batch` route.

---

## Shopify API Patterns

- `src/lib/shopify/client.ts` — typed `storefront(query, variables?, options?)` fetch wrapper
- `src/lib/shopify/queries.ts` — all GraphQL query strings
- `src/lib/shopify/mutations.ts` — all GraphQL mutation strings
- Individual lib files export typed server functions — never import from `queries.ts` directly in components
- Policies: always fetched via `getShopPolicies()` — **never hardcode legal text**
- Cart expiry: `getCart()` returning null = stale cartId — clear localStorage and start fresh
- Discount codes: Shopify does NOT throw on invalid codes — check `discountCodes[].applicable`

---

### Layout utilities

- `container-wide` — `max-w-screen-xl mx-auto px-6 md:px-12`
- `container-narrow` — `max-w-2xl mx-auto px-6`
- `section-padding` — generous responsive vertical padding
- `grain` — applied to `<body>`, SVG noise pseudo-element, `pointer-events: none`

### Aesthetic constraints

#### Typography

- Display/heading: `Noka` (`font-display`) — all `h1–h6`, large editorial text
- Body: `JetBrains Mono` (`font-body`) — body copy
- Mono labels: `JetBrains Mono` (`font-mono`) — prices, tags, UI labels, button text
- Narrative: `Instrument Serif` (`font-serif`) — long-form editorial paragraphs, pull quotes
- Logo only: `Apple Garamond` (`font-logoserif`) — never use elsewhere

#### Colors

| Token | Hex | Usage |
| ----- | --- | ----- |
| `ink` | `#31302e` | Primary text, dark backgrounds |
| `canvas` | `#faf7f2` | Page background |
| `accent` | `#ffdaa7` | Highlights, selection, badges |
| `muted` | `#6B6560` | Secondary text |
| `light` | `#b4b0ac` | Tertiary/placeholder text (`text-light`) |
| `stroke` | `#E5E0D8` | Borders, dividers |
| `success` | `#4A7C59` | Success states |
| `error` | `#B84040` | Error states |

All colors are defined as CSS custom properties in `globals.css` and consumed via Tailwind tokens.

#### Corners

- All elements: sharp by default — `borderRadius: DEFAULT: 0px`. Do not add rounding without explicit justification.
- `sm: 2px` is the only non-zero radius defined — use only when a very subtle rounding is intentional.
- Images: always sharp — no exceptions.
- Exceptions must be deliberate and noted (e.g. mobile search uses `rounded-2xl` for a UX reason).

#### Spacing & layout

- Be explicit and precise — do not fall back to Tailwind defaults without intention
- Layouts should feel considered and dense, not airy or generic
- Grids can be clean and structured, but compositions should feel designed, not templated
- Layering is encouraged — elements can sit behind or over others to create depth
- Avoid the standard stacked-sections pattern; think in terms of composition, not blocks

#### Design direction

- Reference point: Pentagram, high-end design studio websites, Readymag showcases
- Image and motion (gifs, video) are first-class compositional elements, not decoration
- UX quirks are welcome — unexpected interactions, scroll behaviors, cursor effects
- Brutalist in sensibility: raw, confident, not polished-SaaS or generic e-commerce

#### Performance (Critical)

- CSS transitions and animations are always preferred over JS-driven equivalents
- Use the `motion` package only when CSS cannot achieve the desired result
- Never install animation libraries without explicit instruction — the bundle is already lean
- Use skeletons for any async content that takes time to load
- No heavy visual effects — blur filters, large box-shadows, and backdrop-filter should be used sparingly and tested for paint performance

---

## TypeScript Standards

- All props, function args, and return types must be explicitly typed.
- Import Shopify types from `@/lib/shopify/types`.
- Never use `any` — use `unknown` and narrow, or `React.DependencyList` for hook deps.
- Use `@/` path aliases throughout.
- `viewTransitionName` in inline styles requires `as React.CSSProperties` cast.

---

## Known Decisions & Resolved Ambiguities

### PDP (Phase 4.4)

- `ProductInfoPanel.tsx` is the client orchestrator for the right panel — owns `selectedVariant` state.
- `ImageGallery.tsx` handles main image + thumbnail strip.
- `ImageZoom.tsx` is a portal-based fullscreen lightbox — renders into `document.body` via `createPortal`, does **not** use the `Dialog` component (Dialog has `max-w-md` constraints unsuitable for a fullscreen lightbox).
- `VariantSelector` syncs selected variant to URL `?variant={variantId}` via `router.replace()`.
- Spec tags in `key:value` format are auto-parsed into the specs table. Tags without `:` are ignored.
- **The PDP will be fully rebuilt as a custom product configurator in a future phase.** Do not make structural changes to PDP files outside that dedicated phase.

### Cart (Phase 6)

- `cartId` persisted in localStorage (`sf-cart-id`), passed into every Server Action.
- `addItem` signature: `addItem(variantId: string, quantity: number)`.
  First add calls `createCart()`, subsequent adds call `addToCart()`.
- `isItemInCart` / `getItemQuantity` match against `line.merchandise.id` (variant ID), not `line.id`.
- `CartDrawer` uses the `Dialog` primitive from Phase 2.3 for focus trap.
- Cart icon ref (`cartIconRef`) lives in CartContext — attached to Header's cart button for focus restoration on drawer close.
- Free shipping threshold defined in `src/lib/constants.ts` — not hardcoded in components.

### Auth (Phase 7)

- `redirect()` from `next/navigation` must never be inside a try/catch — it throws a special internal error. In `customerLogout`, the revoke call is wrapped in try/catch but `redirect('/')` is called outside it.
- Logout uses `<form action={customerLogout}>` — not `onClick` calling a Server Action.
- `/account/forgot-password` is a **public** route — excluded from middleware protection.
- `?next=` param is read server-side in the login page and passed to `LoginForm` for post-login redirect.
- `ShopifyOrder` type includes `statusUrl: string` — added in Phase 7.

### Search (Phase 5)

- Predictive search: client fetches `/api/search/predictive?q=` — not the lib directly.
- `src/lib/utils/params.ts` exports `SORT_MAP` and `parseFilters` — shared between shop, collection, and search pages. Do not duplicate inline.
- Sort uses Shopify's `sortKey` + `reverse` pattern — not `PRICE_ASC`/`PRICE_DESC` strings.
- `FilterPanel` and `SortSelect` from `components/search/` are reused on the search page.
- `components/search/FilterPanel` re-exports from `components/shop/FilterPanel` — the shop version is canonical. Do not delete `shop/FilterPanel`.

### Wishlist & Engagement (Phase 8)

- Wishlist and recently viewed product data fetched via `/api/products/batch?handles=` — client components cannot call server lib functions directly.
- `WishlistButton` uses `e.preventDefault()` + `e.stopPropagation()` — it sits inside `<Link>` cards.
- `HorizontalScrollRow` is a shared component used by `RecentlyViewed` and `RelatedProducts`.
- `ProductViewTracker` (records recently viewed) and `ProductViewEvent` (Vercel Analytics) both render `null` — place anywhere in the PDP page JSX.

### Contact (Phase 4.5)

- Honeypot field name is `website` — hidden, `tabIndex={-1}`, `aria-hidden="true"`.
- Email service not wired — add Resend or Postmark before launch.

### Policies (Phase 4.5)

- Valid handles: `'privacy-policy' | 'refund-policy' | 'terms-of-service' | 'shipping-policy'`.
- `getShopPolicies()` fetches all four at once — page matches on handle.

### Animation (Phase 10–11)

- GSAP has been **removed** — `src/lib/gsap.ts` does not exist. Do not reference or reinstall it.
- `motion` (Framer Motion v12 rebranded) is the JS animation library — use only when CSS cannot achieve the result.
- `RevealOnScroll` is currently a passthrough `<div>` with no animation logic.
- `ProductGrid` is `'use client'` from GSAP era — can be converted to a server component if no client features are added.
- Marquee uses a CSS `@keyframes` animation — no JS. Keyframe defined in `globals.css`.

---

## Environment Variables

See `.env.local.example` for the full list.
