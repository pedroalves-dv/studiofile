# Phase 11 — UX Design Concept

This phase is an art-direction pass. Everything is already functional.
The goal is to make the site feel like a Pentagram case study, not an e-commerce scaffold.

**Design references:** Pentagram.com, highfulminds.com, Readymag showcases, high-end design studio websites.

**Core principles for this phase:**

- Type is the layout. Headings at 8–15vw.
- Composition, not grid. Elements at unexpected positions. Layering is encouraged.
- Controlled density. Alternate between very dense (tight mono text) and very open (one massive element).
- Scroll as narrative. The page tells a story as you scroll — not sections stacking.
- Performance first. No heavy libraries. CSS transitions over JS animations wherever possible.

**Do not** add features outside this phase. **Do not** touch `lib/`, `hooks/` (except where noted),
or `shopify/` files. This phase is purely front-end visual work.

**Skipped intentionally:**
- Custom cursor — not needed
- Magnetic buttons — not needed
- RevealOnScroll animations — not needed now; revisit if content calls for it
- Header smart-hide — header stays visible at all times
- Footer redesign — already handled separately
- Process section — already in progress separately
- PDP redesign (11.5) — launching with a custom configurator; standard PDP redesign would be throwaway work

---

## Prompt 11.1 — Marquee Component

Create a reusable marquee component driven entirely by CSS. No JS animation. No scroll velocity.
This component is a utility — it may or may not be used on the home page immediately,
but should be ready for use anywhere.

### File to create

**`src/components/common/Marquee.tsx`** (`'use client'`)

```tsx
'use client'

interface MarqueeProps {
  text: string        // The text content to repeat
  speed?: number      // Animation duration in seconds (default: 30)
  className?: string  // Applied to the outer wrapper
  separator?: string  // Character between repetitions (default: ' · ')
}
```

Implementation:

- Render the text string twice side by side inside a `flex whitespace-nowrap w-max` track div
- Animate the track with a CSS `@keyframes marquee` that translates `0% → -50%`
- `animation: marquee {speed}s linear infinite`
- Outer wrapper: `overflow-hidden`
- Respect `prefers-reduced-motion`: if reduced motion is preferred, pause the animation
  via `motion-reduce:animation-pause` Tailwind variant or a CSS media query in globals

```tsx
export function Marquee({ text, speed = 30, className, separator = ' · ' }: MarqueeProps) {
  const content = `${text}${separator}`

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className="flex whitespace-nowrap w-max animate-marquee motion-reduce:pause"
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  )
}
```

Add to `src/app/globals.css`:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

Add to `tailwind.config.ts` under `theme.extend.animation`:

```ts
animation: {
  marquee: 'marquee 30s linear infinite',
}
```

Note: the `speed` prop overrides the duration via inline style — the config value is a fallback.

**11.1 complete when:**
- [ ] `Marquee` component exported from `src/components/common/Marquee.tsx`
- [ ] Smooth loop with no jump at the repeat point
- [ ] `speed` and `separator` props work correctly
- [ ] `prefers-reduced-motion` pauses the animation
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.1 — marquee component`

---

## Prompt 11.2 — Home Page Layout Overhaul

Read `src/app/page.tsx` and all files in `src/components/home/` before starting.
Work section by section. Do not skip type-checking between sections.
Skip the Process section — it is being handled separately.

---

### Hero — full-viewport composition

**Current:** Two-column split. Text left, image right.

**New concept:** Full-viewport composition. Product image fills the right 60% of the
screen absolutely positioned. Heading runs at 12vw — large enough to visually bleed
toward the image. No column divide visible.

Desktop layout:
```
┌────────────────────────────────────────────────┐  ← top of viewport
│  3D-PRINTED STUDIO / PARIS — EST. 2024         │  ← small meta, top-left
│                                                │
│                                                │
│  OBJECTS           ┌─────────────────────────┐ │
│  MADE TO           │                         │ │
│  LAST.─────────────│    product image        │ │
│                    │    absolute right-0     │ │
│  [Shop →]          │    top-0 h-full w-[60%] │ │
│  [Collections →]   │                         │ │
└────────────────────┴─────────────────────────┘  ← 100vh
```

Implementation in `src/components/home/HeroContent.tsx` (already a client component):

```tsx
<section className="relative min-h-screen overflow-hidden bg-canvas">

  {/* Full-height image — absolute right panel, desktop only */}
  <div className="absolute right-0 top-0 w-[60%] h-full hidden md:block">
    <Image
      src={product.featuredImage.url}
      alt={product.featuredImage.altText ?? product.title}
      fill
      className="object-cover"
      priority
    />
  </div>

  {/* Mobile image — stacked above text */}
  <div className="relative aspect-[4/3] w-full md:hidden">
    <Image
      src={product.featuredImage.url}
      alt={product.featuredImage.altText ?? product.title}
      fill
      className="object-cover"
      priority
    />
  </div>

  {/* Content layer */}
  <div className="relative z-10 container-wide min-h-screen flex flex-col justify-between py-8 md:py-12">

    {/* Top meta */}
    <p className="font-mono text-xs text-muted uppercase tracking-widest">
      3D-Printed Studio / Paris — Est. 2024
    </p>

    {/* Heading + CTAs — pinned to bottom of viewport */}
    <div className="mt-auto">
      <h1 className="font-mono font-bold leading-[0.9] tracking-tight
                     text-[clamp(4rem,12vw,11rem)] text-ink">
        OBJECTS<br />
        MADE TO<br />
        LAST.
      </h1>

      {/* CTAs — plain text links, not Button components */}
      <div className="flex gap-8 mt-10">
        <a
          href="/shop"
          className="font-mono text-sm uppercase tracking-wider
                     border-b border-ink pb-0.5 hover:text-muted transition-colors"
        >
          Shop →
        </a>
        <a
          href="/collections"
          className="font-mono text-sm uppercase tracking-wider
                     border-b border-ink pb-0.5 hover:text-muted transition-colors"
        >
          Collections →
        </a>
      </div>
    </div>

  </div>
</section>
```

---

### Featured Products — asymmetric editorial grid

**Current:** 3-column equal grid.

**New concept:** One dominant product on the left (5 columns), three secondary products
stacked on the right (2 columns). Zero gap — edges touch.

Section heading:

```tsx
<div className="flex justify-between items-baseline border-b border-stroke pb-4">
  <span className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] tracking-tight">SELECTED</span>
  <span className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] tracking-tight">WORKS</span>
</div>
```

Grid:

```tsx
<div className="grid grid-cols-[5fr_2fr] gap-0">

  {/* Dominant — left */}
  <Link href={`/products/${products[0].handle}`} className="group block border-r border-stroke">
    <div className="relative aspect-[3/4] overflow-hidden">
      <Image src={products[0].featuredImage.url} alt={...} fill className="object-cover" />
    </div>
    <div className="p-4 border-t border-stroke">
      <h3 className="font-mono font-bold text-xl">{products[0].title}</h3>
      <p className="font-mono text-sm text-muted mt-1">
        {formatPrice(products[0].priceRange.minVariantPrice.amount,
                     products[0].priceRange.minVariantPrice.currencyCode)}
      </p>
    </div>
  </Link>

  {/* Three secondary — right, stacked */}
  <div className="flex flex-col">
    {products.slice(1, 4).map((p, i) => (
      <Link key={p.id} href={`/products/${p.handle}`}
        className={cn('group block flex-1', i > 0 && 'border-t border-stroke')}>
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image src={p.featuredImage?.url ?? ''} alt={p.featuredImage?.altText ?? p.title}
            fill className="object-cover" />
        </div>
        <div className="px-3 py-2">
          <h3 className="font-mono text-xs uppercase tracking-wider truncate">{p.title}</h3>
          <p className="font-mono text-xs text-muted mt-0.5">
            {formatPrice(p.priceRange.minVariantPrice.amount,
                         p.priceRange.minVariantPrice.currencyCode)}
          </p>
        </div>
      </Link>
    ))}
  </div>

</div>

{/* Footer link */}
<div className="flex justify-end pt-4">
  <Link href="/shop"
    className="font-mono text-xs text-muted hover:text-ink transition-colors uppercase tracking-wider">
    → All Works
  </Link>
</div>
```

Build this as `src/components/home/FeaturedProducts.tsx` (server component).
Do NOT use the shared `ProductCard` component here — this layout requires bespoke control.
Fetch products server-side; reuse the existing Shopify product-fetching patterns.

---

### Brand Story — typographic anchor

**Current:** Two-column layout with decorative ampersand shape.

**New concept:** Full-width statement text, thin rule, short paragraph below.

```tsx
<section className="section-padding">

  {/* Full-bleed statement — escape container */}
  <div className="-mx-6 md:-mx-12 px-6 md:px-12">
    <p className="font-mono font-bold tracking-tight leading-[0.95]
                  text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
      DESIGNED IN PARIS.
    </p>
    <p className="font-mono font-bold tracking-tight leading-[0.95]
                  text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
      PRINTED TO ORDER.
    </p>
  </div>

  <hr className="border-stroke mt-12 mb-12" />

  <div className="max-w-xl">
    <p className="font-mono text-sm text-muted leading-relaxed">
      We design functional objects for the home — modular, adaptable, and built to last.
      Each piece is 3D-printed to order in our Paris studio.
    </p>
    <a
      href="/about"
      className="inline-block mt-6 font-mono text-sm border-b border-ink pb-0.5
                 hover:text-muted transition-colors"
    >
      About the Studio →
    </a>
  </div>

</section>
```

---

### Collections — edge-to-edge horizontal strip

**Current:** 3-column card grid with spacing and padding.

**New concept:** Full-bleed strip, zero gaps, images edge-to-edge.
Text label below each image. Horizontal scroll with snap on mobile.

```tsx
<section className="section-padding">
  <div className="-mx-6 md:-mx-12">

    {/* Desktop */}
    <div className="hidden md:grid grid-cols-3 gap-0">
      {collections.map((col) => (
        <Link key={col.id} href={`/collections/${col.handle}`}
          className="group block border-r border-stroke last:border-r-0">
          <div className="relative aspect-[2/3] overflow-hidden">
            {col.image ? (
              <Image src={col.image.url} alt={col.image.altText ?? col.title}
                fill className="object-cover
                group-hover:scale-[1.02] transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-stone-100" />
            )}
          </div>
          <div className="border-t border-stroke px-6 py-4">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider">
              {col.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>

    {/* Mobile: horizontal scroll */}
    <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory">
      {collections.map((col) => (
        <Link key={col.id} href={`/collections/${col.handle}`}
          className="shrink-0 min-w-[80vw] snap-center border-r border-stroke last:border-r-0">
          <div className="relative aspect-[2/3] overflow-hidden">
            {col.image ? (
              <Image src={col.image.url} alt={col.image.altText ?? col.title}
                fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-stone-100" />
            )}
          </div>
          <div className="border-t border-stroke px-4 py-3">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider">
              {col.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>

  </div>
</section>
```

---

**11.2 complete when:**
- [ ] Hero: full-viewport, image absolute right 60% desktop, heading at 12vw
- [ ] Hero: CTAs are plain text links with underline, not Button components
- [ ] Hero: mobile stacks image above text
- [ ] Featured: dominant left (5fr) + three stacked right (2fr), zero gap, price always visible
- [ ] Brand story: full-width statement text, thin rule, short paragraph + about link
- [ ] Collections: edge-to-edge strip, mobile horizontal scroll with snap
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.2 — home page editorial overhaul`

---

## Prompt 11.3 — Header Accent Effects

Read `src/components/layout/Header.tsx` before starting.
These are targeted refinements only — do not rebuild the header from scratch.
The header stays fixed and visible at all times. No smart-hide.

---

### Logo hover — blurred accent slash

The logo is an SVG (`/public/images/logo/logo.svg`). Currently it has a simple color
hover effect. Replace it with: a small colored blurred slash that appears behind the logo
on hover.

Implementation — wrap the logo in a relative container and add a pseudo-element
(or a real `<span>`) that appears on hover:

```tsx
<Link href="/" className="relative group flex items-center">

  {/* Blurred slash — appears behind logo on hover */}
  <span
    aria-hidden="true"
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               w-[110%] h-[140%]
               opacity-0 group-hover:opacity-100
               transition-opacity duration-300
               pointer-events-none"
    style={{
      background: 'var(--color-accent)',
      filter: 'blur(18px)',
      transform: 'translate(-50%, -50%) rotate(-8deg) scaleX(0.3)',
    }}
  />

  <Image
    src="/images/logo/logo.svg"
    alt="Studiofile"
    width={270}
    height={45}
    className="relative z-10"
    priority
  />

</Link>
```

Adjust `blur`, `scaleX`, and `rotate` values until the slash feels right — it should
be subtle, slightly longer than the logo, clearly a slash shape, not a glow blob.
Use the `accent` color token (`#C8A97E`).

---

### Nav link hover — accent color shift

**Current:** Standard underline or color change on hover.

**New:** On hover, the nav link text shifts to `accent` color. Clean, no number prefix.
Add a `transition-colors duration-200` for smoothness.

```tsx
<a
  href="/shop"
  className="font-mono text-sm uppercase tracking-wider text-ink
             hover:text-accent transition-colors duration-200"
>
  Shop
</a>
```

Apply consistently to all nav links. Also apply `hover:text-accent` to the
cart, wishlist, and search icon buttons in the header — use `currentColor` on the
icon SVGs so the color change propagates automatically.

---

**11.3 complete when:**
- [ ] Logo: blurred accent slash appears behind SVG on hover, hidden at rest
- [ ] Logo: slash is narrow/elongated (not a blob), slightly rotated, accent color
- [ ] Nav links: text shifts to accent color on hover
- [ ] Cart, wishlist, search icons: also shift to accent color on hover
- [ ] Header remains fixed and fully visible on all scroll positions (no change to existing behavior)
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.3 — header accent hover effects`

---

## Prompt 11.4 — Shop & Collection Layout + ProductCard Redesign

Read the following before starting:
- `src/app/shop/page.tsx`
- `src/app/collections/[handle]/page.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/product/ProductGrid.tsx`

---

### ProductCard — redesign

**Hover effect:** A 1px ink-colored outline traces the entire card on hover.
No scale transform. Price always visible.

```tsx
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block outline outline-1 outline-transparent
                 hover:outline-ink transition-[outline-color] duration-200"
    >

      {/* Image */}
      <div
        className="relative overflow-hidden aspect-[4/5]"
        style={{ viewTransitionName: `product-image-${product.handle}` } as React.CSSProperties}
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
            <span className="font-mono text-xs text-muted">No image</span>
          </div>
        )}

        {/* Sold out overlay */}
        {!product.availableForSale && (
          <div className="absolute inset-0 bg-canvas/60 flex items-end p-3">
            <span className="font-mono text-xs text-ink uppercase tracking-wider">Sold Out</span>
          </div>
        )}

        {/* Sale badge */}
        {onSale && product.availableForSale && (
          <div className="absolute top-3 left-3">
            <Badge variant="sale">−{discountPercent}%</Badge>
          </div>
        )}

        {/* Wishlist — visible on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton productHandle={product.handle} />
        </div>
      </div>

      {/* Info — always visible */}
      <div className="pt-3 pb-1 px-0">
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-ink leading-tight">
          {product.title}
        </h3>
        <p className="font-mono text-xs text-muted mt-1">
          {formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
          )}
          {onSale && compareAtPrice && (
            <span className="ml-2 line-through text-muted/50">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </p>
      </div>

    </Link>
  )
}
```

Preserve all existing sale/discount logic from the current `ProductCard`.

---

### Shop page — full-width layout

**Current:** `grid-cols-[200px_1fr]` sidebar + grid.

**New:** No sidebar. Full-width grid. Filters in a collapsible top bar.
Large editorial heading. Tight `gap-1` grid.

**Page structure (`src/app/shop/page.tsx`):**

```tsx
<PageWrapper>

  {/* Heading row */}
  <div className="border-b border-stroke pb-4 mb-0">
    <h1 className="font-mono font-bold text-[clamp(3rem,8vw,7rem)]
                   tracking-tight leading-none mb-4">
      SHOP
    </h1>
    {/* Client component: filter toggle + sort + result count */}
    <ShopControls totalCount={products.length} />
  </div>

  {/* Collapsible filter panel — client component */}
  <CollapsibleFilters>
    <FilterPanel {/* existing FilterPanel from search/ */} />
  </CollapsibleFilters>

  {/* Full-width product grid */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-1">
    <Suspense fallback={<ProductGridSkeleton />}>
      <ShopProducts searchParams={searchParams} />
    </Suspense>
  </div>

</PageWrapper>
```

**Create `src/components/shop/ShopControls.tsx`** (`'use client'`):

```tsx
interface ShopControlsProps {
  totalCount: number
}

export function ShopControls({ totalCount }: ShopControlsProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">

      {/* Left: count + filter toggle */}
      <div className="flex items-center gap-6">
        <span className="font-mono text-xs text-muted uppercase tracking-wider">
          — {totalCount} Objects
        </span>
        <button
          onClick={() => setFilterOpen(f => !f)}
          className="font-mono text-xs uppercase tracking-wider
                     hover:text-accent transition-colors duration-200"
        >
          {filterOpen ? 'Filter ↑' : 'Filter ↓'}
        </button>
      </div>

      {/* Right: sort */}
      <SortSelect {/* reuse from components/search/ */} />

    </div>
  )
}
```

**Create `src/components/shop/CollapsibleFilters.tsx`** (`'use client'`):

```tsx
export function CollapsibleFilters({ open, children }: {
  open: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        open ? 'max-h-96 opacity-100 border-b border-stroke' : 'max-h-0 opacity-0'
      )}
    >
      <div className="py-6">
        {children}
      </div>
    </div>
  )
}
```

Note: `ShopControls` and `CollapsibleFilters` need to share `filterOpen` state.
The simplest approach: merge them into one component, or lift state into a parent
client wrapper. Use whichever is cleaner — do not add a context for this.

Apply the same structural changes to `src/app/collections/[handle]/page.tsx`:
same heading treatment (collection title at 8vw), same collapsible filter, same tight grid.

---

**11.4 complete when:**
- [ ] ProductCard: 1px ink outline traces the full card on hover, no scale
- [ ] ProductCard: price always visible below title
- [ ] ProductCard: sold-out overlay rendered correctly
- [ ] ProductCard: wishlist button appears on hover
- [ ] Shop: no sidebar, full-width `gap-1` grid (4 cols desktop, 3 tablet, 2 mobile)
- [ ] Shop: `SHOP` heading at 8vw
- [ ] Shop: filter toggle button shows/hides FilterPanel with smooth height transition
- [ ] Shop: result count displayed in mono small caps
- [ ] Collections: same layout treatment as shop
- [ ] `npm run type-check` — zero errors
- [ ] Commit: `feat: phase 11.4 — shop layout and ProductCard redesign`

---

## Phase 11 Completion Criteria

All must pass before the phase is marked done:

- [ ] Marquee component ready and usable anywhere
- [ ] Home hero: full-viewport, heading at 12vw, image fills right 60% desktop
- [ ] Home featured: 5fr/2fr asymmetric grid, zero gap, price visible
- [ ] Home brand story: full-width statement text, rule, paragraph
- [ ] Home collections: edge-to-edge strip, mobile snap scroll
- [ ] Header logo: blurred accent slash on hover
- [ ] Header nav: accent color shift on hover (links + icons)
- [ ] ProductCard: full-card outline on hover, no scale, price always visible
- [ ] Shop: full-width editorial layout, collapsible filter, tight grid
- [ ] Collections: same layout as shop
- [ ] `npm run type-check` — zero errors
- [ ] `npm run build` — clean

Commit per sub-prompt: `feat: phase 11.X — [description]`
Update `docs/STATUS.md` after each sub-prompt.
