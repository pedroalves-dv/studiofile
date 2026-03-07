# Phase 9 — Analytics & SEO

---

## Prompt 9.1 — Analytics, Structured Data & SEO

### Analytics — verify, then extend

`@vercel/analytics` and `@vercel/speed-insights` are already installed and wired into `layout.tsx`
from Phase 2.1. No additional setup needed for pageview tracking on Vercel deployments.

**Add e-commerce event tracking** — this was missing from earlier phases.
Import `track` from `@vercel/analytics` and call it at the right points:

In `src/hooks/useCart.ts`, inside `addItem` on success:
```ts
import { track } from '@vercel/analytics'

// After successful addToCart / createCart:
track('AddToCart', {
  productHandle: variantId,  // best available identifier at this point
  quantity,
})
```

In `src/app/products/[handle]/page.tsx`, add a client component tracker (same pattern as
`ProductViewTracker` from Phase 8):

**src/components/product/ProductViewEvent.tsx ("use client"):**

```tsx
'use client'
import { useEffect } from 'react'
import { track } from '@vercel/analytics'

export function ProductViewEvent({ handle, title }: { handle: string; title: string }) {
  useEffect(() => {
    track('ProductView', { handle, title })
  }, [handle])
  return null
}
```

Place `<ProductViewEvent handle={product.handle} title={product.title} />` in the PDP page.

### src/lib/utils/seo.ts — replace the stub

This file has been a stub since Phase 1. **Replace it entirely.**

```ts
import type { Metadata } from 'next'
import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types'
import { truncate } from '@/lib/utils/format'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studiofile.com'  // fallback prevents build crash if env var missing
const TWITTER_HANDLE = '@studiofile'

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s — Studiofile',
    default: 'Studiofile — Premium 3D-Printed Objects',
  },
  description: 'Modular, functional home decor and furniture. Designed in Paris, printed to order.',
  robots: { index: true, follow: true },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
}

export function buildProductMetadata(product: ShopifyProduct): Metadata {
  const description = truncate(product.description, 155)
  const canonical = `${SITE_URL}/products/${product.handle}`

  // featuredImage may be null — handle gracefully
  const images = product.featuredImage
    ? [{
        url: product.featuredImage.url,
        width: product.featuredImage.width ?? 1200,
        height: product.featuredImage.height ?? 630,
        alt: product.featuredImage.altText ?? product.title,
      }]
    : []

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description,
      url: canonical,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: images.map(i => i.url),
    },
  }
}

export function buildCollectionMetadata(collection: ShopifyCollection): Metadata {
  const description = truncate(collection.description || collection.title, 155)
  const canonical = `${SITE_URL}/collections/${collection.handle}`

  // collection.image may be null
  const images = collection.image
    ? [{
        url: collection.image.url,
        width: collection.image.width ?? 1200,
        height: collection.image.height ?? 630,
        alt: collection.image.altText ?? collection.title,
      }]
    : []

  return {
    title: collection.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: collection.title,
      description,
      url: canonical,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.title,
      description,
    },
  }
}
```

### Update src/app/layout.tsx — replace partial metadata

In Phase 2.1, `layout.tsx` exported a partial `metadata` object. **Replace it** with:

```ts
import { DEFAULT_METADATA } from '@/lib/utils/seo'

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  manifest: '/manifest.json',  // from Phase 3.2
}
```

### Pages that need generateMetadata updated

These pages called `buildProductMetadata` / `buildCollectionMetadata` when they were stubs.
Now that the real implementations exist, verify each page's `generateMetadata` is wired correctly:

- `src/app/products/[handle]/page.tsx` → `buildProductMetadata(product)`
  Also add canonical: verify `alternates.canonical` includes the handle
- `src/app/collections/[handle]/page.tsx` → `buildCollectionMetadata(collection)`
- `src/app/shop/page.tsx` → add:
  
  ```ts
  return {
    title: 'Shop',
    description: 'Browse all products.',
    alternates: { canonical: `${SITE_URL}/shop` },
    // Note: do NOT include cursor param in canonical — paginated pages should not be indexed
  }
  ```

- `src/app/collections/page.tsx` → add canonical: `${SITE_URL}/collections`
- `src/app/about/page.tsx` → add canonical: `${SITE_URL}/about`
- `src/app/contact/page.tsx` → add canonical: `${SITE_URL}/contact`
- `src/app/search/page.tsx` → add `robots: { index: false, follow: true }` — search result pages
  should not be indexed

### JSON-LD in src/app/layout.tsx

Add two JSON-LD scripts to the root layout's `<body>`. These are static — no data fetching needed.

**WebSite schema:**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Studiofile',
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        // {search_term_string} must be this LITERAL string in the output — it is a URL template,
        // not a JavaScript variable. Use a regular string, not a template literal here.
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  }}
/>
```

**Organization schema:**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Studiofile',
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      sameAs: [
        'https://instagram.com/studiofile',   // update to real handle before launch
        'https://pinterest.com/studiofile',   // update to real handle before launch
      ],
    }),
  }}
/>
```

Import `SITE_URL` from `src/lib/utils/seo.ts` or redeclare the constant — do not hardcode inline.

### Update Product JSON-LD on PDP

In Phase 4.4, the Product JSON-LD was built with placeholder structure. Now that real data and
`seo.ts` are complete, verify the JSON-LD in `src/app/products/[handle]/page.tsx` uses:

- `product.vendor` for brand name
- `product.variants.edges[0].node.price` for the offer price (first/default variant)
- Correct `availability` URL:

  ```ts
  availability: product.availableForSale
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock'
  ```

- `priceCurrency` from the variant's `price.currencyCode`

### src/app/robots.ts — replace static file

Delete `public/robots.txt` (created in Phase 1.1) and replace with a dynamic `src/app/robots.ts`
for App Router consistency:

```ts
import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studiofile.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

### src/app/sitemap.ts — verify from Phase 4.5

Confirm the sitemap from Phase 4.5 is complete and includes:

- All static routes with correct `changeFrequency` and `priority`
- All product handles from `getAllProductHandles()`
- All collection handles from `getCollections()`

Canonical note: sitemap URLs must match the canonical URLs in `generateMetadata`. If they
diverge, Google will flag the inconsistency. Verify both use the same URL structure.

### next.config.ts — verify redirects

Redirects were specified in the corrected Phase 1.1. **Verify they already exist** — do not
add them again:

```ts
async redirects() {
  return [
    { source: '/home',     destination: '/',     permanent: true },
    { source: '/shop/all', destination: '/shop', permanent: true },
  ]
}
```

If they are missing, add them now.

---

 **After Phase 9, verify:**

> - `https://your-site/sitemap.xml` — all products and collections listed
> - `https://your-site/robots.txt` — correct disallow rules, sitemap URL
> - Product page `<head>` contains correct `og:image`, `og:title`, canonical
> - Search page has `noindex` robots meta
> - JSON-LD visible in page source for root layout (WebSite + Organization)
> - JSON-LD visible in product page source (Product schema)
> - Vercel Analytics dashboard shows events after adding to cart
> - `tsc --noEmit` — zero errors
