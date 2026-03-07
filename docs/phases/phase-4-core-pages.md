# Phase 4 — Core Pages

> **Before starting Phase 4:** You must have Shopify credentials in `.env.local`:
> `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
> Without these, all data fetching will fail silently.

---

## Prompt 4.1 — Home Page

Build the Studiofile home page at `app/page.tsx`. Server Component.

### Data fetching

```ts
// No getFeaturedProducts() function exists — use getProducts()
const [products, collections] = await Promise.all([
  getProducts({ first: 4, sortKey: 'BEST_SELLING' }),
  getCollections(),
])
const featuredProducts = products.products.slice(0, 4)
const featuredCollections = collections.slice(0, 3)
```

### Sections

Build each section as a separate Server Component in `components/home/` for clarity.
Keep styles minimal — use design tokens and utility classes. You will refine visuals in the browser.

**1. Hero** — full viewport height, two-column layout (stacked on mobile)

- Left: editorial heading (Cormorant Garamond display font), subtext, two CTAs using `Button`
  component: "Shop All" → `/shop` (primary), "View Collections" → `/collections` (ghost)
- Right: featured product image using `next/image` with `priority` flag (above the fold)
- Placeholder text for heading: `"Objects made to last."` — this will be customised later

**2. Marquee** — full-width scrolling text strip

- Text: `"3D-PRINTED · MADE TO ORDER · DESIGNED IN PARIS · MODULAR OBJECTS · "` — repeated twice
  in the DOM so the loop is seamless
- CSS animation only — add `@keyframes marquee` to `globals.css`:
  
  ```css
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }  /* -50% because text is duplicated */
  }
  ```

- Apply: `animation: marquee 20s linear infinite`
- `text-label` class, thin `border-y border-stroke`, `overflow-hidden`
- Respect reduced motion: wrap in `@media (prefers-reduced-motion: no-preference)` or pause animation

**3. Featured Products** — "Selected Works"

- 4 products from `featuredProducts`
- Wrap in `<Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>}>`
- Use `ProductCard` component (built in Phase 4.3)
- Layout is an editorial asymmetric grid — apply a CSS grid where the first card spans 2 rows.
  Keep the grid class-based so you can adjust the layout visually later.
- "View All" link → `/shop`

**4. Brand Story** — "Shop by Collection"

- Static content — two paragraphs of studio copy (placeholder text is fine, will be updated)
- Split layout: left side accent element, right side text + "About the Studio" → `/about` link
- No data fetching required

**5. Collections Grid** — "Shop by Collection"

- 3 collections from `featuredCollections`
- Each card: full-bleed image, collection name overlaid, `Link` to `/collections/[handle]`
- If collection has no image: render a solid `bg-stone-100` placeholder
- Wrap in `<Suspense fallback={...skeleton...}>`

**6. Process** — "How It Works"

- Static content — 3 steps: "Designed in-studio", "Printed to order", "Shipped to you"
- Each step: step number in `text-label` style, heading, short description
- No data fetching

**7. Newsletter Callout** — "Ask us anything"

- Inverted section: `bg-ink text-canvas`
- Heading, email `Input` component, Subscribe `Button` — UI only, no action wired
- `aria-label="Email address"` on input

### Notes

- All `next/image` components need explicit `width`, `height` or `fill` + a sized parent
- Use `priority` on the hero image only — lazy load everything else

---

## Prompt 4.2 — Collections Index Page

Build `app/collections/page.tsx`. Server Component.

```ts
export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Collections' }  // template in layout adds " — Studiofile" automatically
}

const collections = await getCollections()
```

### Layout

- `PageWrapper` with `Breadcrumb` items: `[{ label: 'Home', href: '/' }, { label: 'Collections' }]`
- Heading: "Collections" in display font
- Collections grid: 2 columns desktop, 1 column mobile (`grid grid-cols-1 md:grid-cols-2 gap-6`)

### Collection card

Each card is a `<Link href={/collections/${collection.handle}}>` wrapping:

- Image container with `overflow-hidden` (required — without this, hover scale bleeds outside)
  - `next/image` with `fill` layout inside a sized parent (`aspect-[3/4]` or similar)
  - CSS transition: `transition-transform duration-500` + `group-hover:scale-[1.02]` on the image
  - Add `group` class to the Link for the hover to work
- Gradient scrim overlay at bottom: `absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/60`
- Collection name overlaid bottom-left: display font, `text-canvas`
- Product count: `text-label text-canvas/70`

Empty state (no collections): simple centered message, "Coming soon. Check back shortly."

---

## Prompt 4.3 — Shop / Collection Page with Filtering, Sorting & Pagination

Build:

- `app/shop/page.tsx` — all products
- `app/collections/[handle]/page.tsx` — products in a specific collection

Both are Server Components. All filter and sort state lives in URL search params.

### URL schema

```text
?sort=PRICE_ASC | PRICE_DESC | BEST_SELLING | CREATED_AT | TITLE
?filter=available | type:[value] | tag:[value]
?cursor=XXXX
```

> Note: multiple `?filter=` params are allowed in the URL simultaneously.

### Server-side param parsing

Parse `searchParams` server-side and convert to the correct types for `getProducts()`:

```ts
// Sort mapping — Shopify uses sortKey + reverse, not PRICE_ASC/DESC
const SORT_MAP: Record<string, { sortKey: string, reverse: boolean }> = {
  PRICE_ASC:    { sortKey: 'PRICE',       reverse: false },
  PRICE_DESC:   { sortKey: 'PRICE',       reverse: true  },
  BEST_SELLING: { sortKey: 'BEST_SELLING', reverse: false },
  CREATED_AT:   { sortKey: 'CREATED_AT',  reverse: true  },
  TITLE:        { sortKey: 'TITLE',       reverse: false  },
}

// Filter mapping — URL string format → ProductFilter[] objects for Shopify API
function parseFilters(filterParams: string | string[] | undefined): ProductFilter[] {
  const params = Array.isArray(filterParams) ? filterParams : filterParams ? [filterParams] : []
  return params.map(f => {
    if (f === 'available')       return { available: true }
    if (f.startsWith('type:'))   return { productType: f.slice(5) }
    if (f.startsWith('tag:'))    return { tag: f.slice(4) }
    return {}
  }).filter(f => Object.keys(f).length > 0)
}
```

### components/search/SortSelect.tsx (client)

Dropdown `<select>` for sort options. On change:

```ts
const params = new URLSearchParams(searchParams)
params.set('sort', value)
params.delete('cursor')  // reset pagination on sort change
router.replace(`?${params.toString()}`)
```

Options: Price: Low to High, Price: High to Low, Best Selling, Newest, A–Z

### components/search/FilterPanel.tsx (client)

Accepts available filter options as props (derived from current product set):

```ts
interface FilterPanelProps {
  availableTypes: string[]
  availableTags: string[]
  activeFilters: string[]  // current ?filter= values from URL
}
```

- Desktop: sidebar layout
- Mobile: "Filters" button opens a bottom sheet (fixed overlay, slides up)
- Filter groups: Availability (checkbox), Product Type (checkboxes), Tags (checkboxes)
- Each checkbox: on change, adds/removes `?filter=` param via `router.replace()`
- "Clear all" link: removes all `?filter=` params
- Active filter count badge on the "Filters" button

### components/product/ProductGrid.tsx

```ts
interface ProductGridProps {
  products: ShopifyProduct[]
  totalCount?: number
  showCount?: boolean
}
```

- Result count: `"Showing {products.length} products"` (or `"Showing X of Y"` if totalCount provided)
- Grid layout: CSS grid, responsive columns — keep class-based so layout is easy to adjust visually
- Editorial asymmetric grid is a nice-to-have, not a requirement — a clean uniform grid is fine here

### components/product/ProductCard.tsx

Build this here if not already built:

```ts
interface ProductCardProps {
  product: ShopifyProduct
  priority?: boolean  // for above-the-fold images
}
```

- `<Link href={/products/${product.handle}}>`
- Product image with `next/image` — use `viewTransitionName: product-image-${product.handle}` style
  (for Phase 10 shared element transition — safe to add now, no effect until Phase 10)
- Product title, price via `formatPrice()`
- Sale badge if `isOnSale()`
- `WishlistButton` — stub if WishlistContext doesn't exist yet (Phase 8)
- Keep styling clean and minimal — you will refine this visually

### Pagination

Use "Load more" button approach (simpler than infinite scroll, easier to debug):

- Server renders first 24 products
- "Load more" button links to same page with `?cursor={pageInfo.endCursor}`
- Next.js navigates to the new URL, server fetches next 24 and appends
- Show `"Showing X products"` count
- Hide "Load more" button when `pageInfo.hasNextPage === false`

> Note: this is a full-page navigation, not a client-side append. Products replace, not append,
> on each cursor change. A true infinite scroll client component can be added post-launch.

### Collection page extras

`app/collections/[handle]/page.tsx`:

- `notFound()` if collection not found
- Full-width banner: collection image (if exists) + collection title + description below
- `Breadcrumb`: `[{ label: 'Home', href: '/' }, { label: 'Collections', href: '/collections' }, { label: collection.title }]`
- `generateMetadata`: use `buildCollectionMetadata(collection)` from `lib/utils/seo.ts` (stub in Phase 1, built in Phase 9 — call it now so the wiring is in place)

---

## Prompt 4.4 — Product Detail Page (Full)

Build `app/products/[handle]/page.tsx`. Server Component shell with client sub-components.

### Server layer

```ts
const [product, recommendations] = await Promise.all([
  getProduct(params.handle),
  // recommendations requires productId — fetch product first if needed, or skip recommendations
  // if product is null. Use Promise.all carefully:
])
if (!product) notFound()

const recommendations = await getProductRecommendations(product.id)
```

`generateMetadata`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.handle)
  if (!product) return { title: 'Product Not Found' }
  return buildProductMetadata(product)  // stub now, real implementation in Phase 9
}
```

Product JSON-LD (include in page as `<script type="application/ld+json">`):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[product.title]",
  "description": "[product.description]",
  "image": "[product.featuredImage.url]",
  "brand": { "@type": "Brand", "name": "[product.vendor]" },
  "offers": {
    "@type": "Offer",
    "price": "[variant.price.amount]",
    "priceCurrency": "[variant.price.currencyCode]",
    "availability": "[availableForSale ? InStock : OutOfStock]"
  }
}
```

### components/product/ImageGallery.tsx (client)

Add this component to the scaffold — it was not in Phase 1 but is needed here.

```ts
interface ImageGalleryProps {
  images: ShopifyImage[]
  productTitle: string
}
```

- Main image: large, full-width of its column, `next/image` with `priority`
- Thumbnail strip below: horizontal scroll, clicking a thumbnail updates the main image
- State: `selectedIndex` managed locally
- Main image click: opens `ImageZoom` lightbox (built later in this phase)
- Keep styling minimal — structure over aesthetics

### components/product/VariantSelector.tsx (client)

```ts
interface VariantSelectorProps {
  variants: ShopifyProductVariant[]
  selectedVariantId: string | null
  onVariantChange: (variant: ShopifyProductVariant) => void
}
```

- Render variant options as pill buttons
- Unavailable variants: `opacity-40 line-through cursor-not-allowed`
- On selection: call `onVariantChange` + update URL with `?variant={variantId}` using
  `router.replace()` without scroll — this allows sharing a specific variant via URL

```ts
// Read initial variant from URL on mount:
const variantIdFromUrl = searchParams.get('variant')
const initialVariant = variants.find(v => v.id === variantIdFromUrl) ?? variants[0]
```

### components/product/StockIndicator.tsx

```ts
interface StockIndicatorProps {
  availableForSale: boolean
  quantityAvailable: number | null  // null = inventory tracking disabled = treat as in stock
}
```

- `null` or large number: "In stock" — green dot + text
- `quantityAvailable <= 5` and `> 0`: "Only {n} left" — amber
- `quantityAvailable === 0` or `!availableForSale`: "Out of stock" — muted

### PDP layout (Section 1)

Two-column grid on desktop, stacked on mobile:

**Left** — ImageGallery

**Right** — product info panel:

- `Breadcrumb`: Home › Collections › [collection] › [product title] (if product has a collection,
  otherwise Home › Shop › [product title])
- Product type tag: `text-label text-muted`
- Title: display font
- Price: `formatPrice()` in mono. If `isOnSale()`: render `compareAtPrice` with `line-through` +
  `Badge variant="sale"`. Show `getDiscountPercent()` in the badge.
- `StockIndicator`
- Short description: first 160 chars of `product.description`, "Read more" expands inline
- `VariantSelector`
- Quantity stepper:
  - `−` button: disabled at `quantity === 1`
  - `+` button: disabled at `quantity === (selectedVariant.quantityAvailable ?? 999)`
  - `quantityAvailable` can be `null` (tracking off) — treat as no upper limit
- Add to Cart button (full width, primary):
  - Disabled + "Out of Stock" text when `!selectedVariant.availableForSale`
  - On click: call `addItem(selectedVariant.id, quantity)` from `useCart()`
  - **Note:** `CartDrawer` opens automatically via `useCart().openCart()` but CartDrawer
    doesn't exist until Phase 6. The `useCart` hook's `addItem` already calls `openCart()` —
    this will just do nothing until Phase 6. No special handling needed.
  - Show loading state during cart mutation
- Custom order note: static text, styled as a subtle info box
- Trust badges row: static text/icons, no interaction

**Section 2** — Product description:

```tsx
<div
  className="prose prose-stone max-w-none"
  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
/>
```

Shopify sanitizes `descriptionHtml` server-side — no additional sanitization needed.
Add Tailwind typography plugin (`@tailwindcss/typography`) if not already installed.

**Section 3** — Image gallery strip:

- Horizontal scrollable row of all product images
- `overflow-x-auto`, `scroll-snap-type: x mandatory`
- Each image: `scroll-snap-align: start`, click opens `ImageZoom`

**Section 4** — Related Products:

- Rendered by `RelatedProducts` component (built in Phase 8 — stub here):
  
```tsx
// Stub until Phase 8:
export function RelatedProducts({ products }: { products: ShopifyProduct[] }) {
  return null
}
```

### components/product/ImageZoom.tsx (client)

Full-screen lightbox using the `Dialog` component from Phase 2.3.

```ts
interface ImageZoomProps {
  images: ShopifyImage[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement>
}
```

- `Dialog` wraps the lightbox content
- Full-resolution image centred, `next/image` with `fill` and `object-contain`
- Prev/next arrow buttons — update `currentIndex` state
- Keyboard: `←` / `→` navigate, `Escape` closes (Dialog handles Escape)
- Thumbnail strip at bottom showing all images, current highlighted
- Show a spinner/skeleton while the full-res image loads (`onLoadingComplete` → hide spinner)

---

## Prompt 4.5 — About, Contact & Policy Pages

### app/about/page.tsx

Server Component. Static content — placeholder copy is fine, will be updated.

```ts
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About',
    description: 'Learn about Studiofile — a Paris-based 3D printing and design studio.',
  }
}
```

Sections (structure over style — you will refine visually):

1. Hero area with heading "About"
2. Studio story: 2-column, long-form text left, image placeholder right
3. Process steps: reuse same structure as home page Process section
4. Values: 3 items — "Precision", "Sustainability", "Modularity" — with short descriptions
5. Founder: name, title, bio paragraph, image placeholder
6. CTA: "Shop the Collection" → `/shop` using primary `Button`

For image placeholders where no real asset exists: use `bg-stone-100` divs with appropriate
aspect ratios.

### app/contact/page.tsx + ContactForm

`page.tsx` is a Server Component. `ContactForm` is a `"use client"` component inside it.

**ContactForm fields:**

- Name (required)
- Email (required, email format)
- Subject: `<select>` with options: General Inquiry, Custom Order, Press, Other
- Message (required, `<textarea>`)
- Honeypot: a hidden text input that must remain empty
  
  ```tsx
  <input
    type="text"
    name="website"  // misleading name for bots
    tabIndex={-1}
    aria-hidden="true"
    autoComplete="off"
    style={{ position: 'absolute', left: '-9999px' }}
    value={honeypot}
    onChange={e => setHoneypot(e.target.value)}
  />
  ```

- Client-side validation before submit: required fields, email regex
- On submit: check honeypot (if filled, silently succeed without POSTing), then POST to `/api/contact`
- On success: `toast.success("Message sent. We'll be in touch soon.")` + reset form

**app/api/contact/route.ts:**

```ts
export async function POST(request: Request) {
  const body = await request.json()

  // Honeypot check
  if (body.website) return Response.json({ success: true })  // silently discard

  // Basic validation
  if (!body.name || !body.email || !body.message) {
    return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }

  // Development: log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('Contact form submission:', body)
  }

  // TODO: wire to email service (Resend recommended) before going live
  return Response.json({ success: true })
}
```

### app/policies/[handle]/page.tsx

```ts
const POLICY_HANDLES = ['privacy-policy', 'refund-policy', 'terms-of-service', 'shipping-policy']

export async function generateStaticParams() {
  return POLICY_HANDLES.map(handle => ({ handle }))
}
```

```ts
const policies = await getShopPolicies()
const policyMap: Record<string, ShopifyPolicy | null> = {
  'privacy-policy':  policies.privacyPolicy,
  'refund-policy':   policies.refundPolicy,
  'terms-of-service': policies.termsOfService,
  'shipping-policy': policies.shippingPolicy,
}
const policy = policyMap[params.handle]
if (!policy) notFound()
```

Render `policy.body` as HTML — Shopify provides sanitized HTML:

```tsx
<div
  className="prose prose-stone max-w-none"
  dangerouslySetInnerHTML={{ __html: policy.body }}
/>
```

`Breadcrumb`: `[{ label: 'Home', href: '/' }, { label: policy.title }]`

`generateMetadata`: `{ title: policy.title }`

### app/sitemap.ts

```ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const [handles, collections] = await Promise.all([
    getAllProductHandles(),
    getCollections(),
  ])

  return [
    { url: baseUrl,                  lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${baseUrl}/shop`,        lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...collections.map(c => ({
      url: `${baseUrl}/collections/${c.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...handles.map(p => ({
      url: `${baseUrl}/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]
}
```

Note: `export default` is required — named exports will silently not work.

---

**After Phase 4, verify:**

> - All pages render without errors with real Shopify data
> - `tsc --noEmit` — zero errors
> - Product page URL updates with `?variant=ID` on variant selection
> - Contact form honeypot silently discards bot submissions
> - Sitemap accessible at `/sitemap.xml`
> - Policy pages render at `/policies/privacy-policy` etc.
