# Phase 1 — Foundation

---

## Prompt 1.1 — Project Scaffolding

You are helping me build Studiofile — a premium e-commerce site for a 3D printing and design studio.
Stack: Next.js 15 App Router, TypeScript, Tailwind CSS v3, Shopify Storefront API, Vercel.

Scaffold the complete project structure inside src/:

```text
src/
  app/
    layout.tsx                  ← root layout (fonts, metadata, providers)
    page.tsx                    ← home page (empty shell for now)
    globals.css                 ← Tailwind base + CSS custom properties
    not-found.tsx               ← global 404 page
    error.tsx                   ← global error boundary (must be "use client")
    global-error.tsx            ← root error boundary (must be "use client")
    loading.tsx                 ← root loading skeleton
    shop/
      page.tsx                  ← all products page (empty shell)
      loading.tsx
    collections/
      page.tsx                  ← all collections index (empty shell)
      [handle]/
        page.tsx                ← single collection page (empty shell)
        loading.tsx
    products/
      [handle]/
        page.tsx                ← product detail page (empty shell)
        loading.tsx
    search/
      page.tsx                  ← search results (empty shell)
      loading.tsx
    account/
      login/
        page.tsx
      register/
        page.tsx
      forgot-password/
        page.tsx
      page.tsx                  ← dashboard (empty shell)
      orders/
        page.tsx
    about/
      page.tsx
    contact/
      page.tsx
    policies/
      [handle]/
        page.tsx                ← refund-policy, privacy-policy, terms-of-service
    api/
      contact/
        route.ts                ← contact form handler
  components/
    ui/                         ← Button, Badge, Input, Skeleton, Dialog, Tooltip
    layout/                     ← Header, Footer, PageWrapper, Breadcrumb
    product/                    ← ProductCard, ProductGrid, ProductImage, VariantSelector,
                                   StockIndicator, RelatedProducts, RecentlyViewed, ImageZoom
    cart/                       ← CartDrawer, CartItem, CartSummary, DiscountInput, CartNote,
                                   FreeShippingBar, EmptyCart
    search/                     ← SearchBar, SearchResults, PredictiveSearch, FilterPanel, SortSelect
    account/                    ← AccountDashboard, OrderList, OrderCard
    wishlist/                   ← WishlistButton, WishlistDrawer
    common/                     ← Toast, CookieConsent, LoadingBar, SkeletonCard
  lib/
    shopify/
      client.ts
      queries.ts
      mutations.ts
      types.ts
      products.ts
      collections.ts
      cart.ts
      auth.ts
      search.ts
      policies.ts
    utils/
      format.ts                 ← formatPrice, formatDate, formatHandle, truncate
      cn.ts                     ← className merge utility (clsx + tailwind-merge)
      seo.ts                    ← stub only — built properly in Phase 9
  hooks/
    useCart.ts
    useWishlist.ts
    useScrollLock.ts
    useLocalStorage.ts
    useDebounce.ts
    useMediaQuery.ts
    useRecentlyViewed.ts
    useIsomorphicLayoutEffect.ts ← returns useLayoutEffect client-side, useEffect server-side
  context/
    CartContext.tsx
    WishlistContext.tsx
    ToastContext.tsx             ← built in Phase 2.3, scaffold empty here
docs/                           ← project docs, not served
```

Also create:

- `.env.local.example` with all required environment variables:
  
  ```env
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
  NEXT_PUBLIC_SITE_URL=
  ```

- `next.config.ts` with:
  - `images.remotePatterns` for `cdn.shopify.com`
  - `images.formats: ['image/avif', 'image/webp']`
  - `experimental.viewTransition: true`
  - `async headers()` returning security headers for all routes:

    ```bash
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    ```

  - `async redirects()` returning:
  
    ```bash
    /home → / (301)
    /shop/all → /shop (301)
    ```

- `tailwind.config.ts` with content paths configured

- `middleware.ts` — empty shell for now, will protect `/account/*` routes in Phase 7

- `public/robots.txt` — allow all crawlers, reference `/sitemap.xml`

Install these packages:

```bash
npm install clsx tailwind-merge gsap @vercel/analytics @vercel/speed-insights lucide-react
```

Use TypeScript throughout. No placeholder data — just structure and empty shells.
All empty page/component files should export a default function returning `null` so the project compiles.

After scaffolding, run `tsc --noEmit` and confirm zero TypeScript errors.

---

## Prompt 1.2 — Shopify Types, Client & Server Actions

Build the complete Shopify Storefront API layer in `src/lib/shopify/`.

### client.ts

A typed fetch wrapper:

- `storefront<T>(query: string, variables?: Record<string, unknown>, options?: StorefrontOptions): Promise<T>` function
- Uses `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` + `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `StorefrontOptions` extends Next.js fetch options: `{ cache?: RequestCache, next?: { revalidate?: number | false, tags?: string[] } }`
- Throws a typed `ShopifyError` on non-200 or `errors` array in response body
- Logs full error details in development only (`process.env.NODE_ENV === 'development'`)

### types.ts

Define and export all interfaces:

**Products:**

```ts
ShopifyProduct {
  id, handle, title, description, descriptionHtml,
  featuredImage: ShopifyImage,
  images: { edges: { node: ShopifyImage }[] },
  priceRange: { minVariantPrice: MoneyV2, maxVariantPrice: MoneyV2 },
  compareAtPriceRange: { minVariantPrice: MoneyV2, maxVariantPrice: MoneyV2 },
  variants: { edges: { node: ShopifyProductVariant }[] },
  tags: string[],
  productType: string,
  availableForSale: boolean,
  totalInventory: number,
  vendor: string
}

ShopifyProductVariant {
  id, title, availableForSale,
  quantityAvailable: number,
  selectedOptions: { name: string, value: string }[],
  price: MoneyV2,
  compareAtPrice: MoneyV2 | null,
  image: ShopifyImage | null
}
```

**Collections:**

```ts
ShopifyCollection {
  id, handle, title, description, descriptionHtml,
  image: ShopifyImage | null,
  products: { edges: { node: ShopifyProduct }[], pageInfo: ShopifyPageInfo },
  seo: { title: string | null, description: string | null }
}
```

**Cart:**

```ts
ShopifyCart {
  id, checkoutUrl,
  totalQuantity: number,
  cost: { subtotalAmount: MoneyV2, totalAmount: MoneyV2, totalTaxAmount: MoneyV2 | null },
  lines: { edges: { node: ShopifyCartLine }[] },
  discountCodes: { code: string, applicable: boolean }[],
  note: string | null
}

ShopifyCartLine {
  id, quantity,
  merchandise: { id: string, title: string, product: Pick<ShopifyProduct, 'id'|'handle'|'title'|'featuredImage'>, price: MoneyV2, selectedOptions: { name: string, value: string }[] },
  cost: { totalAmount: MoneyV2 },
  discountAllocations: { discountedAmount: MoneyV2 }[]
}
```

**Shared:**

```ts
ShopifyImage { url: string, altText: string | null, width: number | null, height: number | null }
MoneyV2 { amount: string, currencyCode: string }
ShopifyPageInfo { hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string, endCursor: string }
```

**Customer & Auth:**

```ts
ShopifyCustomer {
  id, firstName, lastName, email, phone,
  orders: { edges: { node: ShopifyOrder }[] },
  defaultAddress: ShopifyAddress | null,
  addresses: { edges: { node: ShopifyAddress }[] }
}

ShopifyOrder {
  id, orderNumber: number, name: string, processedAt: string,
  fulfillmentStatus: string, financialStatus: string,
  currentTotalPrice: MoneyV2,
  lineItems: { edges: { node: { title: string, quantity: number, variant: { image: ShopifyImage | null, price: MoneyV2 } | null } }[] }
}

ShopifyAddress {
  id, firstName, lastName, address1, address2,
  city, province, country, zip, phone
}
```

**Policies:**

```ts
ShopifyPolicy { id, handle, title, body, url }
```

**Search:**

```ts
// ProductFilter maps to Shopify's productFilters input — array of filter objects.
// Each filter object has ONE of the following keys (mutually exclusive):
// available, price { min, max }, productType, productVendor, tag, variantOption { name, value }
ProductFilter {
  available?: boolean
  price?: { min?: number, max?: number }
  productType?: string
  productVendor?: string
  tag?: string
  variantOption?: { name: string, value: string }
}

ShopifySearchResult {
  products: ShopifyProduct[],
  pageInfo: ShopifyPageInfo,
  totalCount: number          // mapped from products.edges.length or a separate count field
}

// Shopify predictive search returns products, collections, queries, pages, articles.
// pages and articles included for completeness even if not used immediately.
ShopifyPredictiveSearchResult {
  products: Pick<ShopifyProduct, 'id'|'handle'|'title'|'featuredImage'|'priceRange'>[],
  collections: Pick<ShopifyCollection, 'id'|'handle'|'title'|'image'>[],
  queries: { text: string, styledText: string }[],
  pages: { id: string, title: string, handle: string }[],
  articles: { id: string, title: string, handle: string }[]
}

SearchOptions {
  first?: number
  after?: string
  sortKey?: 'RELEVANCE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING'
  reverse?: boolean
  filters?: ProductFilter[]
}
```

**Utilities:**

```ts
ApiResponse<T> { data: T | null, errors?: { message: string }[] }
ShopifyError extends Error { status?: number, errors?: { message: string }[] }
```

### queries.ts

GraphQL query strings (as `const` template literals):

**Products:**

- `GET_PRODUCT_BY_HANDLE` — full fields: all variants with `quantityAvailable`, all images, `compareAtPrice`, `descriptionHtml`, `tags`, `productType`, `totalInventory`, `vendor`
- `GET_PRODUCTS` — paginated: `first`, `after` cursor, `sortKey`, `reverse`, `query` string filter. Does NOT include `productFilters` — that is handled by `SEARCH_PRODUCTS`.
- `GET_PRODUCT_RECOMMENDATIONS` — `productId` → returns array of products (id, handle, title, featuredImage, priceRange, availableForSale)
- `GET_ALL_PRODUCT_HANDLES` — id and handle only, for sitemap generation

**Collections:**

- `GET_COLLECTION_BY_HANDLE` — full collection fields + products (paginated, `first`, `after`)
- `GET_COLLECTIONS` — all collections: id, handle, title, image, description, product count

**Cart:**

- `GET_CART` — full cart including lines with merchandise details, costs, discountCodes, note

**Search:**

- `SEARCH_PRODUCTS` — uses Shopify `search` query with `query`, `first`, `after`, `sortKey`, `productFilters` (maps from `ProductFilter[]`)
- `PREDICTIVE_SEARCH` — uses `predictiveSearch` query returning products, collections, queries, pages, articles

**Policies:**

- `GET_SHOP_POLICIES` — `shop { privacyPolicy, refundPolicy, termsOfService, shippingPolicy }` — each with `id, handle, title, body, url`

**Shop:**

- `GET_SHOP_INFO` — `shop { name, primaryDomain { url }, shipsToCountries }`

### mutations.ts

GraphQL mutation strings:

**Cart:**

```graphql
CART_CREATE
CART_LINES_ADD
CART_LINES_UPDATE
CART_LINES_REMOVE
CART_DISCOUNT_CODES_UPDATE    ← also used to remove codes (pass empty array [])
CART_NOTE_UPDATE
```

**Customer:**

```graphql
CUSTOMER_ACCESS_TOKEN_CREATE
CUSTOMER_ACCESS_TOKEN_DELETE
CUSTOMER_CREATE
CUSTOMER_RECOVER
CUSTOMER_RESET
CUSTOMER_UPDATE
CUSTOMER_ADDRESS_CREATE
CUSTOMER_ADDRESS_UPDATE
CUSTOMER_ADDRESS_DELETE
```

### lib/shopify/products.ts

Server functions (not Server Actions — these run at build/request time, not from client form submissions):

```ts
getProduct(handle: string): Promise<ShopifyProduct | null>
getProducts(options: {
  first?: number
  after?: string
  sortKey?: string
  reverse?: boolean
  query?: string
  collectionHandle?: string    // if provided, fetches via GET_COLLECTION_BY_HANDLE
}): Promise<{ products: ShopifyProduct[], pageInfo: ShopifyPageInfo }>
getProductRecommendations(productId: string): Promise<ShopifyProduct[]>
getAllProductHandles(): Promise<{ id: string, handle: string }[]>
```

### lib/shopify/collections.ts

```ts
getCollection(handle: string): Promise<ShopifyCollection | null>
getCollections(): Promise<ShopifyCollection[]>
```

### lib/shopify/cart.ts

Next.js Server Actions (`"use server"` at top of file).
cartId is always passed from the client — never read from cookies here.
Client persists cartId in localStorage and passes it into every action.

```ts
createCart(lines: { merchandiseId: string, quantity: number }[]): Promise<ShopifyCart>
addToCart(cartId: string, lines: { merchandiseId: string, quantity: number }[]): Promise<ShopifyCart>
updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart>
removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart>
applyDiscountCode(cartId: string, code: string): Promise<ShopifyCart>
removeDiscountCode(cartId: string): Promise<ShopifyCart>  // calls CART_DISCOUNT_CODES_UPDATE with discountCodes: []
updateCartNote(cartId: string, note: string): Promise<ShopifyCart>
getCart(cartId: string): Promise<ShopifyCart | null>
```

### lib/shopify/auth.ts

Server Actions (`"use server"`). Uses `cookies()` from `next/headers`.

```ts
customerLogin(email: string, password: string): Promise<{ success: boolean, error?: string }>
  // Calls CUSTOMER_ACCESS_TOKEN_CREATE
  // On success: sets 'sf-customer-token' httpOnly cookie, sameSite: 'lax', path: '/', maxAge: 60*60*24*30

customerLogout(): Promise<void>
  // Calls CUSTOMER_ACCESS_TOKEN_DELETE with current token
  // Clears 'sf-customer-token' cookie
  // Redirects to /

customerRegister(firstName: string, lastName: string, email: string, password: string): Promise<{ success: boolean, error?: string, customer?: ShopifyCustomer }>
  // Calls CUSTOMER_CREATE, then auto-calls customerLogin on success

getCustomer(token: string): Promise<ShopifyCustomer | null>
  // Fetches customer + 10 most recent orders

sendPasswordReset(email: string): Promise<{ success: boolean }>
  // Calls CUSTOMER_RECOVER — always returns success: true (security: don't leak email existence)

getCustomerToken(): Promise<string | null>
  // Reads 'sf-customer-token' cookie via cookies() — server-side only
```

### lib/shopify/search.ts

```ts
searchProducts(query: string, options?: SearchOptions): Promise<ShopifySearchResult>
predictiveSearch(query: string): Promise<ShopifyPredictiveSearchResult>
```

### lib/shopify/policies.ts

```ts
getShopPolicies(): Promise<{
  privacyPolicy: ShopifyPolicy | null
  refundPolicy: ShopifyPolicy | null
  termsOfService: ShopifyPolicy | null
  shippingPolicy: ShopifyPolicy | null
}>
```

### lib/utils/format.ts

```ts
formatPrice(amount: string, currencyCode: string): string
  // → "€120.00" — use Intl.NumberFormat with currency style

formatDate(dateString: string): string
  // → "March 7, 2026" — use Intl.DateTimeFormat, locale 'en-GB'

formatHandle(str: string): string
  // → "my-product-handle" — lowercase, spaces to hyphens, strip non-alphanumeric

truncate(str: string, length: number): string
  // Trim to length, append "…" if truncated

isOnSale(price: MoneyV2, compareAtPrice?: MoneyV2 | null): boolean
  // true if compareAtPrice exists and parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

getDiscountPercent(price: MoneyV2, compareAtPrice: MoneyV2): number
  // Returns integer percent, e.g. 25 (not 0.25)
```

### lib/utils/cn.ts

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]): string { return twMerge(clsx(inputs)) }
```

### lib/utils/seo.ts

Stub only — returns empty object. Will be fully implemented in Phase 9.

```ts
export const DEFAULT_METADATA = {}
export function buildProductMetadata() { return {} }
export function buildCollectionMetadata() { return {} }
```

### hooks/useIsomorphicLayoutEffect.ts

```ts
import { useEffect, useLayoutEffect } from 'react'
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
```

---

After completing both prompts, run:

```bash
tsc --noEmit
```

Zero errors required before moving to Phase 2.
