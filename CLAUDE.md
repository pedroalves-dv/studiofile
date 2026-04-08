# CLAUDE.md — Studiofile

## User

User is a beginner front-end enthustiast, vibe-coding this project alone. Explanations and plans need to be given in a readable manner for non-technical readers.

## Project

Premium e-commerce + showcase website for a Paris 3D printing and design studio.
Modular home decor, lighting, and furniture. Art-directed, editorial aesthetic — never generic SaaS.

**Current status:** Soft-launch. All traffic redirected to `/coming-soon` via middleware. Core site is fully built; launch gate is the middleware redirect.

## Tech Stack

- Frontend: Next.js 16.2.1 App Router, TypeScript 5.6.0 (`strict: false`)
- Styling: Tailwind CSS 3.4.0  
- Backend: Shopify Storefront API 2026 - Headless (Integrated App) - (GraphQL, no SDK — custom fetch wrapper)
- Animations: CSS transitions · `motion` 12.37.0 · View Transitions API
- Scroll: Lenis 1.3.18 via `SmoothScroll` component
- Analytics: Vercel Analytics 1.3.0 + Speed Insights 1.0.0
- Hosting: Vercel

**Key dependencies (exact versions):**

- React 19.2.4 · Lucide React 0.408.0 · RadixUI (accordion 1.2.12, slot 1.2.4)
- Sonner 2.0.7 (toasts) · tailwind-merge 3.5.0 · clsx 2.1.1
- country-state-city 3.2.1 · libphonenumber-js 1.12.40
- `motion` 12.37.0 — import from `motion/react` or `motion`, **NOT** `framer-motion`
- **GSAP: removed** — `src/lib/gsap.ts` does not exist

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
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
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary.

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

- Run type checking: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors required
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
- `redirect()` in Server Actions throws a special Next.js error — **never wrap in try/catch**.

## Shopify API Patterns

- `src/lib/shopify/client.ts` — typed `storefront(query, variables?, options?)` fetch wrapper
- `src/lib/shopify/queries.ts` — all GraphQL query strings
- `src/lib/shopify/mutations.ts` — all GraphQL mutation strings
- Individual lib files export typed server functions — never import from `queries.ts` directly in components
- All storefront queries must include `{ next: { revalidate: 3600 } }` unless real-time data is needed
- Cart/auth mutations use `cache: 'no-store'` — always fresh
- Policies: always fetched via `getShopPolicies()` — **never hardcode legal text**
- Cart expiry: `getCart()` returning null = stale cartId — clear localStorage and start fresh
- Discount codes: Shopify does NOT throw on invalid codes — check `discountCodes[].applicable`

## Aesthetic Constraints

### Typography

- Display: `Noka` (`font-display`) — **the ONLY explicit font class used in production components**. Product titles, section headings, type animations.
- Body: `Geist Sans` — default font, set on `body` in `globals.css`; inherited by all elements. Do **not** add `font-body` to components — it is redundant.
- `font-mono`, `font-serif`, `font-body`, `font-logoserif` — **removed from all production components**. Tokens remain in config but must not be added to components.
- Experimental tokens (`font-tasa`, `font-hubot`, `font-mona`, `font-zal`, `font-funnel`, `font-khregular`, `font-khbold`, etc.) exist in `tailwind.config.ts` for design exploration only — **do not use in production components**.

### Colors

Use `border-stroke` not `border-border`. The token is named `stroke`.

### Borders & Rounding

**ALWAYS use `rounded-md` on buttons and inputs**

### Design Direction

- Reference point: Pentagram, high-end design studio websites, Readymag showcases
- Image and motion are first-class compositional elements
- UX quirks welcome — unexpected interactions, scroll behaviors, cursor effects
- Brutalist in sensibility: raw, confident — not polished-SaaS

### Performance (Critical)

- CSS transitions and animations always preferred over JS-driven equivalents
- Use `motion` package only when CSS cannot achieve the desired result
- Never install animation libraries without explicit instruction
- Use skeletons for any async content that takes time to load
- No heavy visual effects — blur filters, large box-shadows, `backdrop-filter` — use sparingly, test for paint performance

### Layout Utilities

| Class              | What it does                                     |
| ------------------ | ------------------------------------------------ |
| `section-height`   | min-height = 100dvh minus header                 |
| `section-centered` | full viewport height (minus header), flex-center |

## TypeScript Standards

- All props, function args, and return types must be explicitly typed.
- Import Shopify types from `@/lib/shopify/types`.
- Never use `any` — use `unknown` and narrow. (Note: `strict: false` means TS won't auto-catch this — run `type-check` explicitly.)
- Use `@/` path aliases throughout.
- `viewTransitionName` in inline styles requires `as React.CSSProperties` cast.
- `cn()` utility: import from `@/lib/utils/cn` — NOT `@/lib/utils`.

## Active Pages & Routes

### Middleware state

- **Soft-launch active**: `/` → `/coming-soon` (landing group). Remove this redirect to go live.
- **Protected routes**: any `/account/*` not in the public list requires `sf-customer-token` cookie → redirects to `/account/login?next={pathname}`.
- **Public auth routes**: `/account/login`, `/account/register`, `/account/forgot-password`.

### Page list

| Route | Description |
| --- | --- |
| `/coming-soon` | Landing page — editorial hero, email signup, social links |
| `/products/totem` | TOTEM modular lamp configurator (replaces standard PDP for this product) |
| `/products/[handle]` | Standard product detail page |
| `/shop` | All products with filter, sort, pagination |
| `/collections` | Collection grid |
| `/collections/[handle]` | Dynamic collection with products |
| `/search` | Full search with filters and sort |
| `/about` | Studio story, process, values |
| `/contact` | Contact form (not yet wired to email service) |
| `/faq` | FAQ accordion (content is lorem ipsum placeholder) |
| `/policies/[handle]` | Privacy, refund, terms, shipping policies (from Shopify) |
| `/account/login` | Login form |
| `/account/register` | Registration form |
| `/account/forgot-password` | Password reset form (public route) |
| `/account` | Account dashboard — recent orders (auth required) |
| `/account/orders` | Orders list (auth required) |
| `/account/settings` | Profile settings form (auth required) |
| `/account/addresses` | Address manager (auth required) |

### API routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/products/batch` | GET | Batch fetch products by handle (wishlist, recently viewed) |
| `/api/search/predictive` | GET | Predictive search dropdown |
| `/api/search/products` | GET | Full product search with filters |
| `/api/totem-catalog` | GET | TOTEM shape/fixation/cable catalog |
| `/api/totem-variants` | GET | Shopify variant ID map for TOTEM (1h ISR) |
| `/api/contact` | POST | Contact form (logs only — needs Resend/Postmark) |
| `/api/newsletter` | POST | Newsletter signup (logs only — needs Klaviyo/Shopify) |

## Cart Architecture

- `cartId` persisted in localStorage (`sf-cart-id`), passed into every Server Action.
- `addItem` signature: `addItem(variantId: string, quantity: number)`.
  First add calls `createCart()`, subsequent adds call `addToCart()`.
- `isItemInCart` / `getItemQuantity` match against `line.merchandise.id` (variant ID), not `line.id`.
- `cart.lines` is a **flat array** (Shopify edges normalised by the client). Use `cart.lines.map()`, not `.edges`.
- `CartDrawer` uses the `Dialog` primitive for focus trap.
- Cart icon ref (`cartIconRef`) lives in CartContext — attached to Header's cart button for focus restoration.
- Free shipping threshold: `src/lib/constants.ts` (`FREE_SHIPPING_THRESHOLD = 150`, `CURRENCY_CODE = 'EUR'`).
- **Race condition fix**: `pendingCartRef` dedups concurrent first-add `createCart()` calls — shares one promise.

## TOTEM Configurator Architecture

**Product concept**: Modular ceiling lamp. Users stack 3D-printed shapes, choose colors, fixation, and cable. Each module = one Shopify cart line. One Shopify product per module shape × one variant per color.

### Data sources

| Source | Role |
| --- | --- |
| `src/lib/totem-config.ts` | Static truth: shapes, colors, fixations, cables, presets, pricing, helper maps |
| `src/lib/shopify/totem-variants.ts` | Server-side variant ID mapping (ISR 1h, by Shopify product tag) |
| `/api/totem-catalog` | Serves catalog to configurator client |
| `/api/totem-variants` | Serves variant map to `addTotemToCart()` |

### Data flow

1. `TotemConfigurator` fetches catalog from `/api/totem-catalog` on mount
2. User builds config (`pieces[]`, `fixationId`, `fixationColorId`, `cableId`)
3. `useCart().addTotemToCart(config)` fetches variant map from `/api/totem-variants`, validates stock, calls `createCart()` / `addToCart()` with multiple lines
4. Each line carries hidden attributes (see below)
5. `CartDrawer` groups lines by `_build_id` → renders `TotemCartGroup` per build

### Cart line attributes

- **All lines**: `_build_id` (shared UUID), `_build_label`
- **Shape lines**: `_shape_id`, `_color_id`, `_flipped`
- **Fixation line**: `_fixation_id`, `_fixation_color_id`
- **Cable line**: `_cable_id`
- **Optional**: `_pieces_config` (stringified JSON snapshot for Edit flow fallback)

### TotemCartGroup Edit flow

1. Read attributes from each line to reconstruct `TotemPiece[]`
2. Generate new `uid` for each piece via `generateUid()`
3. Write to localStorage: `sf-totem-pieces`, `sf-totem-fixation`, `sf-totem-fixation-color`, `sf-totem-cable`
4. Call `removeBundleItems()` to delete old bundle lines
5. Close cart drawer, navigate to `/products/totem`
6. Configurator reads localStorage on mount and pre-populates the form

### Virtual product entry

`src/lib/virtual-products.ts` provides the Totem product tile shown in shop/collection grids. It has no Shopify record and links directly to `/products/totem` with a static price label (`"From €72"`). Inject into product listing responses so TOTEM appears in shop grids.

### Presets

TypeScript constants in `src/lib/totem-config.ts` — not separate Shopify products. Presets are disabled (greyed + tooltip) if any constituent color is OOS.

## Auth Architecture

- `customerLogout` does **NOT** call `redirect()` — navigation handled client-side in `Header.tsx` via `useTransition` + `router.push('/')` after SA resolves, so toast fires first.
- Logout uses `<button type="button">` with `useTransition` in `Header.tsx` — not `<form action={customerLogout}>`.
- `/account/forgot-password` is a **public** route — excluded from middleware protection.
- `?next=` param is read server-side in the login page and passed to `LoginForm` for post-login redirect.
- Token stored in `sf-customer-token` cookie (HttpOnly, Secure in prod, SameSite=Lax, 30 days).
- `ShopifyOrder` type includes `statusUrl: string`.

## Header Architecture

- Logo swap on hover: `LogoHover.tsx` — two SVG masks, pure CSS opacity transition, no JS.
- Nav link hover: `ArrowButton` with `showArrow={false}` + custom `[clip-path:inset(0_100%_0_0)]` reveal span with `animate-revealLTR`.
- Scroll state: `isScrolling` sets `bg-canvas/60 backdrop-blur-xl`; resets after 1s of inactivity.
- **Wishlist icon is commented out** — components still exist; header entry point deferred. Do not delete wishlist components.
- **Search overlay is commented out** — the full-screen search pattern is in the file but disabled.
- **Logged-in**: `<User>` icon button → account dropdown (`isAccountOpen`). Links: My Account, Orders, Settings, Addresses, Sign out.
- **Logged-out**: `<User>` icon `<Link href="/account/login">`.
- `Header` accepts `isLoggedIn?: boolean` (default `false`) — passed from `layout.tsx` via `await getCustomerToken()`.

## ArrowButton (`src/components/ui/ArrowButton.tsx`)

- Polymorphic: renders `<Link>` when `href` provided, `<button>` otherwise.
- `showArrow?: boolean` — default `true`: arrow slides in + label shifts on hover. `false`: disable both (for nav links with custom hover effect).
- `glowColor?: string` — optional radial glow on hover.
- `label: ReactNode` — accepts string or JSX.
- Extra props fall through via `...rest`.

## Search

- `src/lib/utils/params.ts` exports `SORT_MAP` and `parseFilters` — shared between shop, collection, and search pages. Do not duplicate inline.
- Sort uses Shopify's `sortKey` + `reverse` pattern — not `PRICE_ASC`/`PRICE_DESC` strings.
- `components/search/FilterPanel` re-exports from `components/shop/FilterPanel` — the shop version is canonical. **Do not delete `shop/FilterPanel`.**

## Contact

- Honeypot field name: `website` — hidden, `tabIndex={-1}`, `aria-hidden="true"`.
- Email service not wired — add Resend or Postmark before launch.

## Policies

- Valid handles: `'privacy-policy' | 'refund-policy' | 'terms-of-service' | 'shipping-policy'`.
- `getShopPolicies()` fetches all four at once — page matches on handle.

## Environment Variables

See `.env.local.example` for the full list.

| Variable | Public? | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | ✓ | Shopify store domain (e.g. `store.myshopify.com`) |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | ✓ | Public Storefront API token |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | — | Private token for authenticated server-only queries |
| `NEXT_PUBLIC_SITE_URL` | ✓ | Canonical URL (e.g. `https://studiofile.fr`) |
| `NEXT_PUBLIC_GA_ID` | ✓ | Google Analytics ID (optional) |

## Rules for Claude Code

- **Type-check**: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` after every phase — zero errors required
- **Never use `any`** — use `unknown` and narrow (`strict: false` means TS won't auto-catch this)
- **`cn()` import**: from `@/lib/utils/cn` — NOT `@/lib/utils`
- **Shopify queries**: always include `{ next: { revalidate: 3600 } }` unless real-time data is needed
- **Cart mutations**: only via `useCart()` hook — never import cart Server Actions directly from components
- **`redirect()` in SAs**: throws a special error — never wrap in try/catch
- **`viewTransitionName`** in inline styles: requires `as React.CSSProperties` cast
- **`customerLogout`** does NOT call `redirect()` — navigation handled client-side
- **Rounded corners**: always `rounded-md` on buttons and inputs; never plain `rounded` (DEFAULT = 0px)
- **Fonts**: only `font-display` for explicit font; do NOT add `font-body`, `font-mono`, `font-serif`, or any experimental token to production components
- **Borders**: use `border-stroke` not `border-border`
- **`ImageZoom`**: uses `createPortal` into `document.body` — NOT the `Dialog` component
- **GSAP**: removed — `src/lib/gsap.ts` does not exist
- **`motion`**: import from `motion/react`, not `framer-motion`
- **Totem is the only virtual product** — do not create new virtual products without discussion
- **PDP**: do not make structural changes to PDP files outside the dedicated configurator rebuild phase
