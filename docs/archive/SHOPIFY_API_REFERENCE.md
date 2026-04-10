# Shopify Storefront API Layer — Complete Implementation

Complete, production-ready Shopify integration with typed GraphQL queries, mutations, and server functions.

## Architecture Overview

```
src/lib/shopify/
├── client.ts           ← Typed fetch wrapper (storefront function)
├── types.ts            ← Complete TypeScript interfaces
├── queries.ts          ← GraphQL queries (products, collections, cart, search, policies)
├── mutations.ts        ← GraphQL mutations (cart, customer, auth)
├── products.ts         ← Product server functions
├── collections.ts      ← Collection server functions
├── cart.ts             ← Cart Server Actions
├── auth.ts             ← Auth Server Actions + cookie handling
├── search.ts           ← Search and predictive search
└── policies.ts         ← Shop policies and info

src/lib/utils/
├── format.ts           ← Price, date, handle formatting + discount utilities
└── cn.ts               ← className merge with Tailwind conflict resolution
```

## Key Features

✅ **Fully Typed** — All responses, mutations, and function parameters typed  
✅ **Server Actions** — Cart and auth use Next.js Server Actions ("use server")  
✅ **Error Handling** — Custom ShopifyError class with GraphQL error parsing  
✅ **Development Logging** — Errors logged in dev, silent in production  
✅ **Next.js Fetch Options** — Supports cache, revalidate, tags for ISR/PPR  
✅ **Cookie Management** — httpOnly, secure customer auth tokens  
✅ **Pagination Support** — Cursor-based pagination with pageInfo  
✅ **Fragments** — GraphQL fragments for DRY query definitions  
✅ **No Placeholder Data** — All functions fully implemented

---

## Client (`client.ts`)

### `storefront<T>(query, variables?, options?): Promise<T>`

Typed fetch wrapper for Shopify Storefront API. Handles GraphQL, errors, and logging.

**Parameters:**
- `query` — GraphQL query/mutation string
- `variables` — Query variable values (optional)
- `options` — Next.js fetch options (optional)
  - `cache` — 'force-cache' | 'no-store' (default: 'force-cache')
  - `next.revalidate` — ISR time in seconds
  - `next.tags` — Cache tags for on-demand revalidation

**Example:**
```typescript
const product = await storefront<ProductResponse>(GET_PRODUCT_BY_HANDLE, {
  handle: 'my-product'
});
```

**Error Handling:**
- Throws `ShopifyError` on non-200 responses
- Throws `ShopifyError` if GraphQL errors in response
- Logs full error details in development only

---

## Types (`types.ts`)

Complete TypeScript interfaces for all Shopify API responses:

### Core Types

**MoneyV2** — Price object with amount and currencyCode

**ShopifyImage** — Image with url, altText, width, height

**ShopifyProductVariant** — Product variant with options, price, compareAtPrice, stock

**ShopifyProduct** — Full product with:
- All variants  
- Images (featured + gallery)  
- Price ranges (regular & compare-at)  
- Stock info  
- Tags, vendor, type  

**ShopifyCollection** — Collection with:
- Products (paginated)  
- Description  
- SEO data

**ShopifyCart** — Shopping cart with:
- Cart lines  
- Costs (subtotal, total, tax, discount)  
- Discount codes  
- Note

**ShopifyCustomer** — Customer with:
- Profile (name, email, phone)  
- Orders  
- Default & all addresses

**ShopifyOrder** — Order details with line items and financial/fulfillment status

**ShopifyPolicy** — Shop policies (privacy, refund, terms, shipping)

**ShopifyShop** — Shop info (name, domain, ship-to countries)

**ShopifySearchResult** — Search results with products, total count, pageInfo

**ShopifyPredictiveSearchResult** — Autocomplete suggestions (products, collections, queries)

**ApiResponse<T>** — Generic wrapper for GraphQL responses

**ShopifyError** — Custom error class with statusCode and errors[]

---

## Queries (`queries.ts`)

GraphQL queries with fragments for reusable fields.

### Products

**GET_PRODUCT_BY_HANDLE(handle)** → ProductResponse  
Fetch single product with all details and variants

**GET_PRODUCTS(first, after, sortKey, reverse, query)** → ProductsResponse  
Fetch paginated products with optional filtering/sorting

**GET_PRODUCT_RECOMMENDATIONS(productId)** → ProductRecommendationsResponse  
Fetch recommended products

**GET_ALL_PRODUCT_HANDLES(first, after)** → ProductHandlesResponse  
Fetch only id/handle for sitemap generation

### Collections

**GET_COLLECTION_BY_HANDLE(handle, first, after)** → CollectionResponse  
Fetch collection with contained products (paginated)

**GET_COLLECTIONS(first, after)** → CollectionsResponse  
Fetch all collections for navigation

### Cart

**GET_CART(cartId)** → CartResponse  
Fetch complete cart with lines and costs

### Search

**SEARCH_PRODUCTS(query, first, after, sortKey, reverse)** → SearchResponse  
Full-text search with pagination

**PREDICTIVE_SEARCH(query, first)** → PredictiveSearchResponse  
Autocomplete suggestions

### Shop

**GET_SHOP_POLICIES()** → PoliciesResponse  
Fetch all policy pages (privacy, refund, terms, shipping)

**GET_SHOP_INFO()** → ShopInfoResponse  
Fetch shop name, domain, countries

---

## Mutations (`mutations.ts`)

GraphQL mutations with error handling.

### Cart Mutations

**CART_CREATE(input)** → CartCreateResponse  
Create new shopping cart

**CART_LINES_ADD(cartId, lines)** → CartResponse  
Add items to cart

**CART_LINES_UPDATE(cartId, lines)** → CartLineUpdateResponse  
Update quantities (pass quantity: 0 to remove)

**CART_LINES_REMOVE(cartId, lineIds)** → CartRemoveResponse  
Remove specific items

**CART_DISCOUNT_CODES_UPDATE(cartId, discountCodes)** → DiscountCodesResponse  
Apply/remove discount codes

**CART_NOTE_UPDATE(cartId, note)** → NoteUpdateResponse  
Add note to cart

### Customer Mutations

**CUSTOMER_ACCESS_TOKEN_CREATE(email, password)** → AccessTokenResponse  
Login - returns access token

**CUSTOMER_ACCESS_TOKEN_DELETE(accessToken)** → DeleteResponse  
Logout - revoke token

**CUSTOMER_CREATE(firstName, lastName, email, password)** → CustomerCreateResponse  
Register new customer account

**CUSTOMER_RECOVER(email)** → RecoverResponse  
Send password reset email

**CUSTOMER_RESET(id, password, resetToken)** → CustomerResetResponse  
Complete password reset

**CUSTOMER_UPDATE(accessToken, customer)** → CustomerUpdateResponse  
Update profile (name, email, phone)

### Customer Address Mutations

**CUSTOMER_ADDRESS_CREATE(accessToken, address)** → AddressCreateResponse  
Add address to customer

**CUSTOMER_ADDRESS_UPDATE(accessToken, id, address)** → AddressUpdateResponse  
Update existing address

**CUSTOMER_ADDRESS_DELETE(accessToken, id)** → AddressDeleteResponse  
Delete address

---

## Products (`src/lib/shopify/products.ts`)

Server functions for product operations.

### `getProduct(handle): Promise<ShopifyProduct | null>`
Fetch single product by handle

### `getProducts(options): Promise<ProductsConnection>`
Fetch paginated products with optional:
- `first` (default: 20)
- `after` — cursor for pagination
- `sortKey` — 'TITLE', 'PRICE', 'BEST_SELLING', 'CREATED', 'RELEVANCE'
- `reverse` — sort descending
- `query` — filter by text

**Example:**
```typescript
const products = await getProducts({
  first: 10,
  sortKey: 'BEST_SELLING',
  query: 'furniture'
});
```

### `getProductRecommendations(productId): Promise<ShopifyProduct[]>`
Fetch related products

### `getAllProductHandles(): Promise<Array<{ id, handle }>>`
Fetch all product handles for sitemap  
Automatically handles pagination

---

## Collections (`src/lib/shopify/collections.ts`)

### `getCollection(handle): Promise<ShopifyCollection | null>`
Fetch collection by handle with first 20 products

### `getCollectionWithPagination(handle, first?, after?): Promise<ShopifyCollection | null>`
Fetch collection with custom pagination

### `getCollections(): Promise<ShopifyCollection[]>`
Fetch all collections (up to 250)

---

## Cart (`src/lib/shopify/cart.ts`) — Server Actions

All functions use "use server" — call from client components via actions.

### `createCart(lines?): Promise<ShopifyCart>`
Create new cart, optionally with initial items

### `addToCart(cartId, lines): Promise<ShopifyCart>`
Add items to cart

**Example:**
```typescript
const cart = await addToCart(cartId, [
  { merchandiseId: 'gid://...', quantity: 1 }
]);
```

### `updateCartLine(cartId, lineId, quantity): Promise<ShopifyCart>`
Update item quantity (0 removes item)

### `removeFromCart(cartId, lineId): Promise<ShopifyCart>`
Remove item from cart

### `applyDiscountCode(cartId, code): Promise<ShopifyCart>`
Apply discount code

### `removeDiscountCode(cartId): Promise<ShopifyCart>`
Remove all discounts

### `updateCartNote(cartId, note): Promise<ShopifyCart>`
Add note to cart

### `getCart(cartId): Promise<ShopifyCart | null>`
Fetch current cart

---

## Auth (`src/lib/shopify/auth.ts`) — Server Actions

Customer authentication with httpOnly cookie storage.

### `customerLogin(email, password): Promise<ShopifyCustomer>`
Login customer
- Exchanges credentials for access token
- Sets httpOnly cookie 'sf-customer-token' (30-day expiry)
- Returns customer object

**Example:**
```typescript
try {
  const customer = await customerLogin(email, password);
  // Redirects user to dashboard
} catch (error) {
  // Invalid credentials
}
```

### `customerLogout(): Promise<void>`
Logout customer
- Revokes token on Shopify
- Clears httpOnly cookie

### `customerRegister(firstName, lastName, email, password): Promise<ShopifyCustomer>`
Create new account
- Validates email not in use
- Auto-logs in after registration

### `getCustomer(accessToken): Promise<ShopifyCustomer | null>`
Fetch customer profile using token
- Includes orders and addresses
- Returns null if token invalid

### `getCustomerToken(): Promise<string | null>`
Read token from cookies (server-side only)

**Example:**
```typescript
const token = await getCustomerToken();
if (token) {
  const customer = await getCustomer(token);
}
```

### `sendPasswordReset(email): Promise<void>`
Send password reset email

### `resetPassword(id, password, token): Promise<ShopifyCustomer>`
Complete password reset with token from email link

### `updateCustomerProfile(accessToken, firstName?, lastName?, email?, phone?): Promise<ShopifyCustomer>`
Update profile information

### `createCustomerAddress(accessToken, address): Promise<ShopifyAddress>`
Add address to customer

### `updateCustomerAddress(accessToken, id, address): Promise<ShopifyAddress>`
Update existing address

### `deleteCustomerAddress(accessToken, id): Promise<void>`
Remove address

---

## Search (`src/lib/shopify/search.ts`)

### `searchProducts(query, options?): Promise<ShopifySearchResult>`
Full-text product search with pagination

Options:
- `first` (default: 20)
- `after` — cursor
- `sortKey` — 'RELEVANCE', 'PRICE', 'BEST_SELLING', 'CREATED'
- `reverse` — sort descending

**Returns:**
```typescript
{
  products: ShopifyProduct[],
  totalCount: number,
  pageInfo: { hasNextPage, hasPreviousPage, startCursor, endCursor }
}
```

**Example:**
```typescript
const results = await searchProducts('wooden chair', {
  first: 10,
  sortKey: 'RELEVANCE'
});
```

### `predictiveSearch(query, first?): Promise<ShopifyPredictiveSearchResult>`
Autocomplete suggestions

Returns:
- `products` — Matching products
- `collections` — Matching collections
- `queries` — Common search queries

**Example:**
```typescript
const suggestions = await predictiveSearch('wood', 5);
// Shows top 5 products/collections matching "wood"
```

---

## Policies (`src/lib/shopify/policies.ts`)

### `getShopPolicies(): Promise<{ privacy, refund, terms, shipping }>`
Fetch all policy pages

### `getPolicyByHandle(handle): Promise<ShopifyPolicy | null>`
Fetch individual policy

Handles:
- 'privacy-policy'
- 'refund-policy'
- 'terms-of-service'
- 'shipping-policy'

### `getShopInfo(): Promise<ShopifyShop>`
Fetch shop metadata (name, domain, ship-to countries)

---

## Format Utilities (`src/lib/utils/format.ts`)

### `formatPrice(amount, currencyCode): string`
Format price as currency

**Example:**
```typescript
formatPrice("120.00", "USD") → "$120.00"
formatPrice("120.00", "EUR") → "€120.00"
```

### `formatDate(dateString): string`
Format ISO date string

**Example:**
```typescript
formatDate("2026-03-07T00:00:00Z") → "March 7, 2026"
```

### `formatHandle(string): string`
Convert string to URL-safe handle (kebab-case)

**Example:**
```typescript
formatHandle("My Product Name") → "my-product-name"
```

### `truncate(string, length): string`
Truncate text with ellipsis

**Example:**
```typescript
truncate("Hello world", 5) → "Hello..."
```

### `isOnSale(price, compareAtPrice?): boolean`
Check if product has a sale price

### `getDiscountPercent(price, compareAtPrice): number`
Calculate discount percentage

**Example:**
```typescript
getDiscountPercent({ amount: "100" }, { amount: "150" }) → 33 // 33% off
```

---

## Class Name Utilities (`src/lib/utils/cn.ts`)

### `cn(...inputs): string`
Merge class names with Tailwind CSS conflict resolution

**Example:**
```typescript
cn('px-4 py-2', isActive && 'bg-blue-500')
cn('px-2', 'px-4') → 'px-4' // rightmost Tailwind class wins
```

---

## Usage Examples

### Fetch a Product
```typescript
import { getProduct } from '@/lib/shopify/products';

const product = await getProduct('my-cool-chair');
// ShopifyProduct with all variants, images, prices
```

### Add to Cart (Client Action)
```typescript
'use client';
import { addToCart } from '@/lib/shopify/cart';

async function handleAddToCart(variantId: string) {
  const cart = await addToCart(cartId, [
    { merchandiseId: variantId, quantity: 1 }
  ]);
  // Update UI with cart
}
```

### Login Customer (API Route)
```typescript
import { customerLogin } from '@/lib/shopify/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  try {
    const customer = await customerLogin(email, password);
    return Response.json({ customer });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 401 });
  }
}
```

### Search Products (Server Component)
```typescript
import { searchProducts } from '@/lib/shopify/search';

export default async function SearchPage({ searchParams }) {
  const results = await searchProducts(searchParams.q, { first: 20 });
  
  return (
    <div>
      Found {results.totalCount} products
      {/* Render results */}
    </div>
  );
}
```

---

## Error Handling

Custom `ShopifyError` class:

```typescript
export class ShopifyError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Array<{ message: string }>
  ) {
    super(message);
    this.name = 'ShopifyError';
  }
}
```

Catch and handle:
```typescript
try {
  const product = await getProduct('invalid-handle');
} catch (error) {
  if (error instanceof ShopifyError) {
    console.error(error.message);
    if (error.errors) {
      console.error(error.errors);
    }
  }
}
```

---

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token_here
```

---

## Next Steps

1. **Connect to Shopify**
   - Create Shopify store
   - Generate Storefront API credentials
   - Add to `.env.local`

2. **Build Pages**
   - Use `getProduct()` in product detail page
   - Use `getProducts()` in shop page
   - Use `getCollections()` in navigation

3. **Implement Cart**
   - Wrap app with CartProvider context
   - Call cart actions from client components

4. **Add Authentication**
   - Build login/register forms
   - Call `customerLogin()` on form submit
   - Store customer context from cookies

5. **Search & Discovery**
   - Implement search box with `searchProducts()`
   - Add predictive search with `predictiveSearch()`

---

**Status:** ✅ Complete & Production-Ready  
**Build:** ✅ Passing  
**Types:** ✅ Full TypeScript coverage  
**Errors:** ✅ Custom error handling  
**Performance:** ✅ ISR/PPR support with Next.js fetch options
