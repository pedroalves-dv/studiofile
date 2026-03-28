# CLAUDE.md — Studiofile

Project-level instructions for Claude Code. Read this at the start of every session.

---

## Project

Premium e-commerce + showcase website for a 3D printing and design studio.
Modular, functional home decor and furniture. Premium brand aesthetic.

| Layer      | Choice                                                |
| ---------- | ----------------------------------------------------- |
| Frontend   | Next.js 16 App Router, TypeScript                     |
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

### Aesthetic constraints

#### Typography

- Display: `Noka` (`font-display`) — product font; used for product titles, section headings, and type animations. The only font class used in components.
- Body: `Geist Sans` — default font, set on `body` in `globals.css`; inherited by all elements. Do not add `font-body` to components — it is redundant.
- `font-mono`, `font-serif` — removed from all components. Tokens remain in config for potential future use but must not be added to components.

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

#### Design direction

- Reference point: Pentagram, high-end design studio websites, Readymag showcases
- Image and motion (gifs, video) are first-class compositional elements, not decoration
- UX quirks are welcome — unexpected interactions, scroll behaviors, cursor effects
- Brutalist in sensibility: raw, confident, not polished-SaaS or generic e-commerce
- ALWAYS USE ROUNDED-MD FOR BUTTONS AND INPUTS

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

- `customerLogout` does NOT call `redirect()` — navigation is handled client-side in `Header.tsx` via `useTransition` + `router.push('/')` after the SA resolves, allowing a toast to fire first.
- Logout uses a `<button type="button">` with `useTransition` in `Header.tsx` — not a `<form action={customerLogout}>`.
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

### Contact

- Honeypot field name is `website` — hidden, `tabIndex={-1}`, `aria-hidden="true"`.
- Email service not wired — add Resend or Postmark before launch.

### Policies

- Valid handles: `'privacy-policy' | 'refund-policy' | 'terms-of-service' | 'shipping-policy'`.
- `getShopPolicies()` fetches all four at once — page matches on handle.

### TOTEM Configurator (`/products/totem`)

- One Shopify product per module shape (arch, dome, cylinder, cone, wave, sphere, torus, prism), one variant per color. No fixed Shopify bundles.
- Cart mechanism: each module = one cart line. All lines in a build share a hidden `_build_id` line attribute. `CartDrawer` groups lines by `_build_id` and renders them as `TotemCartGroup` (collapsible).
- Presets are TypeScript constants in `src/lib/totem-config.ts` pointing at shape/color IDs — not separate Shopify products.
- `addBundle()` on `useCart` handles the grouped add. Requires real Shopify variant IDs before going live.
- The TOTEM configurator **replaces** the standard PDP for the totem product. Do not apply standard PDP patterns here.
- Placeholder env var: `NEXT_PUBLIC_TOTEM_VARIANT_ID` — replace with real IDs before launch.

## Environment Variables

See `.env.local.example` for the full list.
