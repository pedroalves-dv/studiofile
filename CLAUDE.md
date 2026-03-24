# CLAUDE.md — Studiofile

Project-level instructions for Claude Code. Read this at the start of every session.

---

## Project

Premium e-commerce + showcase website for a 3D printing and design studio.
Modular, functional home decor and furniture. Premium brand aesthetic.

| Layer      | Choice                                                |
| ---------- | ----------------------------------------------------- |
| Frontend   | Next.js 15 App Router, TypeScript                     |
| Styling    | Tailwind CSS v3                                       |
| Backend    | Shopify Storefront API (GraphQL)                      |
| Animations | CSS transitions · `motion` v12 · View Transitions API |
| Hosting    | Vercel                                                |

---

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps of architectural decisions)
- If somethig goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main content window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistakes
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance & Simplicity (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Managment

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step, adapt for casual/non dev users
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

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
    ui/
    layout/
    product/
    cart/
    search/
    account/
    wishlist/
    contact/
    common/
    home/
  lib/
    shopify/
    utils/
    constants.ts
  hooks/
  context/
docs/
  STATUS.md          ← current progress — update after every session
tasks/
  todo.md
  lessons.md
middleware.ts
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

- Display: `Noka` (`font-display`) — logo font, used sparingly for product type animations
- Body: `Geist Sans` (`font-body`) — Main font, all headings, body text
- Mono labels: `JetBrains Mono` (`font-mono`) — small details: prices, tags, UI labels
- Accent Typography: `Instrument Serif` (`font-serif`) — not yet used.

**Experimental tokens:** `tailwind.config.ts` also exposes `font-tasa`, `font-hubot`, `font-mona`, `font-zal`, `font-funnel`, `font-khregular`, `font-khbold`, `font-stack`, `font-stacktext`, and `font-mono2` (Fliege Mono). These exist for type testing only — do not use in production components until a decision is made.

#### Colors

| Token     | Hex       | Usage                                    |
| --------- | --------- | ---------------------------------------- |
| `ink`     | `#31302e` | Primary text, dark backgrounds           |
| `canvas`  | `#faf7f2` | Page background                          |
| `accent`  | `#ffdaa7` | Highlights, selection, badges            |
| `muted`   | `#6B6560` | Secondary text                           |
| `light`   | `#b4b0ac` | Tertiary/placeholder text (`text-light`) |
| `stroke`  | `#E5E0D8` | Borders, dividers                        |
| `success` | `#4A7C59` | Success states                           |
| `error`   | `#B84040` | Error states                             |

All colors are defined as CSS custom properties in `globals.css` and consumed via Tailwind tokens.

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
- **Wishlist icon is commented out in the Header** (both desktop and mobile) — the drawer and `WishlistButton` components still exist and work; the entry point from the header is deferred. Do not delete the wishlist components.

### Header (Phase 11.3)

- `Header` accepts `isLoggedIn?: boolean` (default `false`) — passed from `layout.tsx` via `await getCustomerToken()` so the server knows auth state before render.
- **Logged-in state:** renders a `<User>` icon `<button>` that toggles an account dropdown. Dropdown links: My Account, Orders, Settings, Addresses, then a Sign out `<form action={customerLogout}>`. Dropdown state is `isAccountOpen`, closed via `useClickOutside(accountRef, ...)`.
- **Logged-out state:** renders a `<User>` icon `<Link href="/account/login">`.
- Mobile menu also conditionally shows "Account" vs "Sign in" based on `isLoggedIn`.
- **Search overlay is commented out** — the full-screen search pattern (backdrop + `SearchBar`) is in the file but disabled. Do not delete it.
- **Wishlist icon is commented out** — see Wishlist section.
- Logo swap on hover: two SVG masks applied via `maskImage` CSS — `logo-black.svg` (default, no slash) fades out, `logo.svg` (with slash) fades in. Pure CSS opacity transition, no JS. Implemented in `src/components/ui/LogoHover.tsx`.
- Nav link hover effect: each link uses a `node` prop containing a `<span>` with `[clip-path:inset(0_100%_0_0)]` that reveals "/ XX" text left-to-right on hover via `animate-revealLTR` + `group-hover:w-auto`. The label translate is disabled (`showArrow={false}`) so `ArrowButton` doesn't interfere.
- Scroll state: `isScrolling` reduces header background to `bg-canvas/60` (+ `backdrop-blur-xl`) while the user is scrolling, resets after 1 second of inactivity.

### ArrowButton (`src/components/ui/ArrowButton.tsx`)

- Polymorphic: renders a `<Link>` when `href` is provided, a `<button>` otherwise.
- `showArrow?: boolean` controls the animated `→` indicator and label translate on hover.
  - Default (omitted or `true`): arrow slides in from left, label shifts right on group hover.
  - `showArrow={false}`: arrow and translate are both disabled — use for nav links that have their own custom hover effect.
- `glowColor?: string` — optional radial glow behind the button on hover (CSS filter blur).
- `label: ReactNode` — accepts string or arbitrary JSX (e.g. the nav node with reveal spans).
- Extra props (`aria-label`, etc.) fall through via `...rest`.

### Custom animated icons (`src/components/ui/`)

The following icons expose an imperative handle for animation control:

| Component             | Handle type                 | Methods                               |
| --------------------- | --------------------------- | ------------------------------------- |
| `HeartIcon`           | `HeartIconHandle`           | `startAnimation()`, `stopAnimation()` |
| `ShoppingBagIcon`     | `ShoppingBagIconHandle`     | `startAnimation()`, `stopAnimation()` |
| `SparklesIcon`        | `SparklesIconHandle`        | `startAnimation()`, `stopAnimation()` |
| `MagnifyingGlassIcon` | `MagnifyingGlassIconHandle` | `startAnimation()`, `stopAnimation()` |

Pattern: `const ref = useRef<XHandle>(null)` → attach to `<XIcon ref={ref} />` → call `ref.current?.startAnimation()` on `onMouseEnter` and `ref.current?.stopAnimation()` on `onMouseLeave`.

### Contact (Phase 4.5)

- Honeypot field name is `website` — hidden, `tabIndex={-1}`, `aria-hidden="true"`.
- Email service not wired — add Resend or Postmark before launch.

### Policies (Phase 4.5)

- Valid handles: `'privacy-policy' | 'refund-policy' | 'terms-of-service' | 'shipping-policy'`.
- `getShopPolicies()` fetches all four at once — page matches on handle.

### TOTEM Configurator (`/products/totem`)

- One Shopify product per module shape (arch, dome, cylinder, cone, wave, sphere, torus, prism), one variant per color. No fixed Shopify bundles.
- Cart mechanism: each module = one cart line. All lines in a build share a hidden `_build_id` line attribute. `CartDrawer` groups lines by `_build_id` and renders them as `TotemCartGroup` (collapsible).
- Presets are TypeScript constants in `src/lib/totem-config.ts` pointing at shape/color IDs — not separate Shopify products.
- `addBundle()` on `useCart` handles the grouped add. Requires real Shopify variant IDs before going live.
- The TOTEM configurator **replaces** the standard PDP for the totem product. Do not apply standard PDP patterns here.
- Placeholder env var: `NEXT_PUBLIC_TOTEM_VARIANT_ID` — replace with real IDs before launch.

### Animation (Phase 10–11)

**Library split:**

- `motion` (Framer Motion v12 rebranded) — component animations and spring physics only.
- GSAP + ScrollTrigger — scroll-driven sequences only (landing page image effect). Do not use for component animations.
- CSS `@keyframes` / transitions — always preferred when JS is not required.
- `LazyMotion` has been **fully removed** — do not re-add it.

**`motion` is used in exactly 6 files:**

| File                                        | Usage                                                                                    |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/components/ui/HeartIcon.tsx`           | `motion.svg` — scale pulse `[1,1.08,1]`, imperative handle                               |
| `src/components/ui/ShoppingBagIcon.tsx`     | `motion.svg` — wiggle+lift keyframes, imperative handle                                  |
| `src/components/ui/SparklesIcon.tsx`        | `motion.path` × 3 — staggered opacity+scale flicker, imperative handle                   |
| `src/components/ui/MagnifyingGlassIcon.tsx` | `motion.svg` — shimmy keyframes, imperative handle                                       |
| `src/components/home/HeroContent.tsx`       | `motion.span` × 5 — two-phase TOTEM letter animation (staggered fall-in + spring settle) |
| `src/components/home/LandingHero.tsx`       | `motion.span` × 5 — same two-phase letter animation, used on `/coming-soon`              |

`MagneticButton`, `ClipReveal`, `RevealText`, `HeroParallax`, `TextEffectWrapper` — no longer use `motion`.

- `RevealOnScroll` is currently a passthrough `<div>` with no animation logic.
- `ProductGrid` is `'use client'` (legacy from GSAP era) — can be converted to a server component if no client features are added.
- Marquee uses a CSS `@keyframes` animation — no JS. Keyframe defined in `globals.css`.

---

## Environment Variables

See `.env.local.example` for the full list.
