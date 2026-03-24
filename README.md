# Studiofile — E-Commerce Platform

Premium e-commerce + showcase website for a 3D printing and design studio. Modular, functional home decor and furniture.

## Quick Start

### Installation

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and add your Shopify credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The root `/` currently redirects to `/coming-soon` (soft-launch gate). Remove the redirect in `middleware.ts` to access the full site at `/`.

### Build for Production

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run build
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm start
```

---

## Stack

| Layer | Choice |
| ----- | ------ |
| Frontend | Next.js 15 App Router, React 18, TypeScript (`strict: false`) |
| Styling | Tailwind CSS v3 (custom tokens, zero border-radius) |
| Animations | `motion` v12 (Framer Motion) · CSS transitions · View Transitions API |
| State | React Context (Cart, Wishlist, Toast) |
| Backend | Shopify Storefront API (GraphQL) |
| Utilities | clsx, tailwind-merge |
| Hosting | Vercel (Analytics + Speed Insights) |

---

## Project Structure

### `/src/app` — Next.js Routes (App Router)

#### Main site (`(main)` layout)

- **`/`** — Home page (hero + product spotlight + brand story)
- **`/shop`** — All products with filter + sort + pagination
- **`/collections`** — Collections index
- **`/collections/[handle]`** — Single collection with filter + sort
- **`/products/[handle]`** — Product detail page (standard)
- **`/products/totem`** — TOTEM modular lamp configurator (replaces standard PDP)
- **`/search?q=...`** — Search results with filter + sort
- **`/about`** — Studio story, process, values
- **`/contact`** — Contact form
- **`/faq`** — Frequently asked questions
- **`/policies/[handle]`** — Policy pages (privacy-policy, refund-policy, terms-of-service, shipping-policy)

#### Account (protected — middleware redirects to `/account/login`)

- **`/account`** — Account dashboard
- **`/account/login`** — Login (public)
- **`/account/register`** — Registration (public)
- **`/account/forgot-password`** — Password reset (public)
- **`/account/orders`** — Order history
- **`/account/settings`** — Profile update + password change
- **`/account/addresses`** — Address management (list, add, edit, delete, set default)

#### Landing (`(landing)` layout)

- **`/coming-soon`** — Editorial soft-launch gate (newsletter signup + parallax images)

#### API Routes

- **`/api/contact`** — Contact form (logs only — wire email service before launch)
- **`/api/newsletter`** — Newsletter signup (logs only — wire Shopify/Klaviyo before launch)
- **`/api/search/predictive`** — Typeahead search suggestions
- **`/api/search/products`** — Full-text product search with filters
- **`/api/products/batch`** — Multi-product fetch by handle (used by wishlist + recently viewed)

---

### `/src/components` — Reusable Components

#### `/ui` — Base Primitives

- `Button.tsx` — Configurable button with variants
- `ArrowButton.tsx` — Polymorphic button/link with animated arrow indicator and optional glow
- `Badge.tsx` — Inline badge/tag
- `Input.tsx` — Form text input
- `Skeleton.tsx` — Loading skeleton shimmer
- `Dialog.tsx` — Modal dialog with focus trap
- `Accordion.tsx` — Collapsible sections
- `Tooltip.tsx` — Hover tooltip
- `CustomSelect.tsx` — Styled dropdown (used in contact form)
- `HoverWord.tsx` — Word-level hover text effect
- `ScrambleButton.tsx` — Button with text scramble animation on hover
- `LogoHover.tsx` — Logo with masked SVG reveal animation (CSS-only, no JS)

**Animated icons with imperative handles** — attach via `useRef<XHandle>`, call `.startAnimation()` / `.stopAnimation()`:

- `HeartIcon.tsx` / `HeartIconHandle` — scale pulse
- `ShoppingBagIcon.tsx` / `ShoppingBagIconHandle` — wiggle + lift
- `SparklesIcon.tsx` / `SparklesIconHandle` — staggered opacity flicker
- `MagnifyingGlassIcon.tsx` / `MagnifyingGlassIconHandle` — shimmy

Basic icon components (no animation handle): `MenuIcon.tsx`, `UserIcon.tsx`, `UserCircleIcon.tsx`, `UserRoundCheckIcon.tsx`, `SimpleIcon.tsx`

#### `/layout` — Page Structure

- `Header.tsx` — Top navigation (logo, nav links, cart, account, mobile menu)
- `Footer.tsx` — Footer with newsletter form, links, socials
- `FooterBackground.tsx` — Decorative footer background
- `NewsletterForm.tsx` — Newsletter signup form
- `PageWrapper.tsx` — Content wrapper `<div>` (layout.tsx owns the single `<main>`)
- `Breadcrumb.tsx` — Breadcrumb navigation

#### `/product` — Product Components

- `ProductCard.tsx` — Product grid card (image, title, price)
- `ProductGrid.tsx` — Grid layout (`'use client'` — legacy, can be converted)
- `ProductImage.tsx` — Next.js Image wrapper
- `ImageGallery.tsx` — Main image + thumbnail strip
- `ImageGalleryWithZoom.tsx` — ImageGallery + fullscreen lightbox (PDP Section 1)
- `ImageZoom.tsx` — Fullscreen lightbox via `createPortal` into body (not Dialog)
- `ImageZoomGallery.tsx` — Horizontal image strip with per-image lightbox (PDP Section 3)
- `ProductInfoPanel.tsx` — PDP right panel, owns `selectedVariant` state
- `VariantSelector.tsx` — Variant picker, syncs selection to URL `?variant=`
- `StockIndicator.tsx` — Inventory availability indicator
- `RelatedProducts.tsx` — Shopify product recommendations
- `RecentlyViewed.tsx` — Recently viewed products (localStorage)
- `ProductViewTracker.tsx` — Records recently viewed, renders null
- `ProductViewEvent.tsx` — Vercel Analytics event, renders null
- `TotemConfigurator.tsx` — TOTEM modular lamp builder (shape stack, color picker, presets, live total)

#### `/cart` — Shopping Cart

- `CartDrawer.tsx` — Side cart panel (Dialog-based focus trap)
- `CartItem.tsx` — Individual line item
- `CartSummary.tsx` — Subtotal, discount, shipping, total
- `CartNote.tsx` — Order note textarea
- `DiscountInput.tsx` — Discount code input
- `FreeShippingBar.tsx` — Progress bar toward free shipping threshold
- `EmptyCart.tsx` — Empty state
- `TotemCartGroup.tsx` — Grouped TOTEM build (collapsible, shows pieces + total)

#### `/home` — Home Page & Landing

- `Hero.tsx` — Hero background/structure
- `HeroContent.tsx` — Animated TOTEM letter fall-in (motion v12), client component
- `LandingHero.tsx` — Hero for `/coming-soon`
- `LandingMinimalHeader.tsx` — Logo-only header for `/coming-soon`
- `LandingParallaxImages.tsx` — Parallax editorial image section (CSS-only)
- `LandingStackSection.tsx` — Stacked image layout section
- `LandingSignup.tsx` — Newsletter signup for `/coming-soon`
- `BrandStory.tsx` — Studio narrative section
- `ProductSpotlight.tsx` — Featured product showcase
- `FeaturedProducts.tsx` — Grid of featured products
- `Collections.tsx` — Collections preview
- `Process.tsx` — Process/values section

#### `/search` — Search UI

- `SearchBar.tsx` — Search input
- `PredictiveSearch.tsx` — Typeahead dropdown (calls `/api/search/predictive`)
- `SearchResults.tsx` — Results page content
- `FilterPanel.tsx` — Re-exports from `shop/FilterPanel` — do not delete shop version
- `SortSelect.tsx` — Sort dropdown

#### `/shop` — Shop/Collection

- `FilterPanel.tsx` — Canonical filter UI (reused by search, collection, and shop pages)

#### `/wishlist` — Wishlist

- `WishlistButton.tsx` — Heart toggle on product cards (uses `e.stopPropagation()` — sits inside Links)
- `WishlistDrawer.tsx` — Wishlist sidebar

#### `/account` — Account Pages

- `OrderCard.tsx` — Order history card (status, date, total, status URL)

#### `/contact` — Contact

- `ContactForm.tsx` — Contact form with honeypot field (`website`, hidden, `tabIndex={-1}`)

#### `/common` — Shared Utilities

- `Marquee.tsx` — CSS `@keyframes` scrolling marquee (no JS)
- `HorizontalScrollRow.tsx` — Horizontal snap-scroll row (used by RecentlyViewed + RelatedProducts)
- `RevealOnScroll.tsx` — Passthrough `<div>` (animation deferred — GSAP removed, CSS rebuild pending)
- `SkeletonCard.tsx` — Product card loading skeleton
- `Toast.tsx` — Toast notification
- `ScrollToTop.tsx` — Floating back-to-top button
- `CookieConsent.tsx` — Cookie consent banner
- `SmoothScroll.tsx` — Smooth scroll wrapper
- `LoadingBar.tsx` — Page-level loading indicator

---

### `/src/lib` — Shopify Integration & Utilities

#### `/shopify`

- **`client.ts`** — Typed GraphQL fetch wrapper: `storefront(query, variables?, options?)`
- **`queries.ts`** — All GraphQL query strings
- **`mutations.ts`** — All GraphQL mutation strings
- **`types.ts`** — TypeScript types (`ShopifyProduct`, `ShopifyCart`, `ShopifyOrder`, etc.)
- **`products.ts`** — `getProduct`, `getProducts`, `getProductRecommendations`, `getAllProductHandles`
- **`collections.ts`** — `getCollection`, `getCollections`, `getCollectionProducts`
- **`cart.ts`** — Server Actions: `createCart`, `addToCart`, `updateCartLine`, `removeFromCart`, `applyDiscountCode`, `removeDiscountCode`, `updateCartNote`, `getCart`
- **`auth.ts`** — Server Actions: `customerLogin`, `customerRegister`, `customerLogout`, `getCustomerToken`, `getCustomer`, `updateCustomer`, etc.
- **`search.ts`** — `predictiveSearch`, `searchProducts`
- **`policies.ts`** — `getShopPolicies`, `getPolicyByHandle`

#### `/utils`

- **`cn.ts`** — `classNamesMerge()` (clsx + tailwind-merge)
- **`cx.ts`** — `cx()` className builder
- **`format.ts`** — `formatPrice`, `formatDate`
- **`params.ts`** — `SORT_MAP`, `parseFilters()` — shared by shop, collection, and search pages
- **`seo.ts`** — `buildProductMetadata`, `SITE_URL`

#### Root lib files

- **`constants.ts`** — `FREE_SHIPPING_THRESHOLD` and site-wide constants
- **`totem-config.ts`** — TOTEM shapes, colors, fixations, cables, presets, `calcTotemPrice()`

---

### `/src/hooks` — Custom React Hooks

- **`useCart.ts`** — Cart management: `openCart`, `closeCart`, `addItem`, `updateItem`, `removeItem`, `applyDiscount`, `removeDiscount`, `updateNote`, `addBundle` (TOTEM groups), `isItemInCart`, `getItemQuantity`
- **`useWishlist.ts`** — Wishlist state
- **`useRecentlyViewed.ts`** — Recently viewed products (localStorage)
- **`useScroll.ts`** — Scroll position + direction tracking
- **`useScrollLock.ts`** — Disable body scroll (drawers, modals)
- **`useMediaQuery.ts`** — Responsive breakpoint detection
- **`useDebounce.ts`** — Debounce value (search input)
- **`useLocalStorage.ts`** — Persistent client-side storage
- **`useClickOutside.ts`** — Click-outside detection (dropdowns)
- **`useScramble.ts`** — Text scramble animation
- **`useIsomorphicLayoutEffect.ts`** — SSR-safe `useLayoutEffect`

---

### `/src/context` — React Context Providers

- **`CartContext.tsx`** — Global cart state (open/close, lines, loading)
- **`WishlistContext.tsx`** — Wishlist state
- **`ToastContext.tsx`** — Toast notifications

---

### Root Configuration

- **`next.config.ts`** — Image optimization (Shopify CDN), view transitions, security headers
- **`tailwind.config.ts`** — Custom tokens (colors, fonts, spacing, animation)
- **`middleware.ts`** — Auth protection for `/account/*`, soft-launch redirect `/` → `/coming-soon`
- **`.env.local.example`** — Environment variables template

---

## Key Features

- Full Shopify Storefront API integration (products, collections, cart, auth, search, policies)
- Customer auth: login, register, forgot password, account dashboard, orders, addresses, profile
- TOTEM modular lamp configurator with grouped cart bundles
- Wishlist + recently viewed (localStorage, client-only)
- Predictive search with typeahead dropdown
- Editorial home page with animated hero (motion v12)
- Soft-launch gate (`/coming-soon`) with parallax images and newsletter signup
- View transitions between pages
- SEO: structured data (JSON-LD), sitemap, robots, OG image generation
- Custom animated icon components with imperative animation handles
- TypeScript throughout (strict: false — run `type-check` explicitly)

---

## Development Workflow

```bash
# Start development server
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run dev

# Type check
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check

# Build for production
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run build

# Start production server
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm start

# Lint
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run lint
```

> **nvm note:** nvm is not available in the shell environment. Always prefix Node/npm commands with `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"`.

---

## Deployment

Deploy to Vercel:

```bash
vercel
```

Vercel automatically builds, optimizes, and deploys. Analytics and Speed Insights are pre-configured.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Tailwind CSS](https://tailwindcss.com)
- [motion (Framer Motion)](https://motion.dev)
- [Vercel Deployment](https://vercel.com/docs)

---

## License

Private project — Studiofile.
