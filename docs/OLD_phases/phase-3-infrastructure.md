# Phase 3 — Infrastructure

---

## Prompt 3.1 — Loading, Error & Not Found States

Build all Next.js App Router boundary files and the shared `SkeletonCard` component.

### components/common/SkeletonCard.tsx

This component is used across all loading states. Build it first.

A product card skeleton that matches the dimensions of `ProductCard` to prevent layout shift:

- Aspect ratio container for the image area (portrait, ~4:5 ratio)
- Two lines below for title and price
- Use the `Skeleton` component from `components/ui/Skeleton.tsx`
- Accept a `className` prop for grid placement overrides

```tsx
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Skeleton className="w-full aspect-[4/5]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
```

### app/loading.tsx

Root-level loading state. Structure should match the home page layout to avoid shift:

- Header height shimmer (`h-16 w-full` Skeleton — matches fixed header)
- Hero area: full-viewport-height Skeleton
- Row of 4 `SkeletonCard` components below

Keep styling minimal — this is a functional component, not a design piece.

### app/not-found.tsx

Structure:

- Large "404" display text — Cormorant Garamond, very large, low-opacity (ghost effect)
- "Page not found." heading
- One-line description
- Two CTAs using the `Button` component: "Back to Home" (`href="/"`) + "Shop All" (`href="/shop"`)
- Center-aligned, generous vertical padding

Do not over-specify sizes or spacing — apply `section-padding` and `container-narrow` and let
the design tokens handle the rest. You will adjust visually in the browser.

### app/error.tsx

Must be `"use client"`.

Props: `error: Error & { digest?: string }`, `reset: () => void`

- Log `error` to console in development only: `if (process.env.NODE_ENV === 'development') console.error(error)`
- Render a centered message with a "Try again" Button that calls `reset()`
- Also render a "Back to Home" link
- Keep markup minimal — use `section-padding container-narrow`

### app/global-error.tsx

Must be `"use client"`.

**Critical:** This replaces the entire root layout including `<html>` and `<body>`.
It must render its own `<html lang="en"><body>...</body></html>` — do not assume any
layout wrapper exists.

Props: `error: Error & { digest?: string }`, `reset: () => void`

Render a minimal inline-styled page (no Tailwind classes — those may not load):

```tsx
export default function GlobalError({ reset }: { error: Error, reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center',
                     justifyContent: 'center', minHeight: '100vh', margin: 0,
                     backgroundColor: '#FAF7F2', color: '#1A1917' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <button onClick={reset} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem',
                                           background: '#1A1917', color: '#FAF7F2',
                                           border: 'none', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
```

### app/shop/loading.tsx and app/collections/[handle]/loading.tsx

These are identical in structure — a grid of `SkeletonCard` components with a heading skeleton above.

Structure:

- Heading area: one wide Skeleton for a collection banner/title
- Product grid: 8 `SkeletonCard` components in a CSS grid matching the real product grid layout
  (2 cols mobile, 3 cols tablet, 4 cols desktop)

Use `container-wide section-padding`.

### app/products/[handle]/loading.tsx

Must match the two-column PDP layout to avoid shift:

- Left column (~55% width): tall image Skeleton (portrait aspect ratio matching the main product image)
- Right column (~45% width): stacked Skeletons for title, price, variant pills row, and button

Use `grid grid-cols-1 md:grid-cols-2 gap-12` to match the real PDP layout.

### app/search/loading.tsx

Structure:

- Search input Skeleton at the top
- Row of filter Skeletons below
- Grid of 6 `SkeletonCard` components

---

## Prompt 3.2 — Favicon, Web Manifest & Dynamic OG Images

### app/icon.tsx and app/apple-icon.tsx

Dynamic favicons using Next.js `ImageResponse`.

**Critical — font loading in ImageResponse:**
`next/font/google` does NOT work inside `ImageResponse`. Fonts must be fetched as raw
`ArrayBuffer` using `fetch()`:

```ts
const font = await fetch(
  new URL('https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQAllznqWeGA.woff2')
).then(res => res.arrayBuffer())
```

Then pass to `ImageResponse` options:

```ts
new ImageResponse(jsx, {
  width: 32,
  height: 32,
  fonts: [{ name: 'Cormorant Garamond', data: font, style: 'normal' }]
})
```

**app/icon.tsx:**

```ts
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  // fetch font, return ImageResponse with "S" monogram
  // Dark background (#1A1917), canvas-colored letter (#FAF7F2), Cormorant Garamond
}
```

**app/apple-icon.tsx:**
Same design, `size = { width: 180, height: 180 }`.

### public/manifest.json

```json
{
  "name": "Studiofile",
  "short_name": "Studiofile",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF7F2",
  "theme_color": "#1A1917",
  "icons": [
    { "src": "/icon.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Wire up in app/layout.tsx** via the metadata export — do NOT use a manual `<link>` tag,
App Router handles this automatically:

```ts
export const metadata: Metadata = {
  // ...existing metadata...
  manifest: '/manifest.json',
}
```

### app/opengraph-image.tsx

Default site-level OG image. Required exports:

```ts
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Studiofile — Premium 3D-Printed Objects'
```

Design: warm canvas background (`#FAF7F2`), large `STUDIOFILE` wordmark centered, thin horizontal
rule, tagline below. Load Cormorant Garamond via `fetch()` as shown above.

Keep the layout simple — you'll refine the visual design later.

### app/products/[handle]/opengraph-image.tsx

Required exports:

```ts
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Product image'  // overridden dynamically below
```

Implementation:

```ts
export default async function ProductOGImage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle)
  if (!product) {
    // Fall back to default site OG — redirect to root opengraph-image
    return new ImageResponse(/* default design */, { width: 1200, height: 630 })
  }
  // Layout: product title + price on left, product featuredImage on right (60% width)
  // Load font via fetch()
}
```

The image URL for `<img>` inside `ImageResponse` must be an absolute URL. Use:

```ts
src={product.featuredImage.url}  // Shopify CDN URLs are absolute — this works directly
```

### app/collections/[handle]/opengraph-image.tsx

Same pattern as product OG image:

```ts
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function CollectionOGImage({ params }: { params: { handle: string } }) {
  const collection = await getCollection(params.handle)
  if (!collection) return /* default fallback */
  // Collection title overlaid on collection image, or title-only if no image
}
```

---

**After Phase 3, verify:**

> - `npm run build` — confirm no build errors (OG image routes and icon routes are build-time)
> - Visit `/` with network throttling — confirm loading skeletons appear before content
> - Check browser tab for favicon
> - Verify OG image at `localhost:3000/opengraph-image` directly in browser
