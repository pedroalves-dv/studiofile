# Phase 8 — Engagement Features

---

## Prompt 8.1 — Wishlist

### API route — required before building WishlistDrawer

Client components cannot call server lib functions directly.
Build this route first — it's used by both WishlistDrawer and RecentlyViewed:

**src/app/api/products/batch/route.ts:**

```ts
import { getProduct } from '@/lib/shopify/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handles = searchParams.get('handles')?.split(',').filter(Boolean) ?? []

  if (handles.length === 0) {
    return Response.json([])
  }

  // Fetch in parallel, filter nulls
  const products = await Promise.all(handles.map(h => getProduct(h)))
  return Response.json(products.filter(Boolean))
}
```

This route is shared between WishlistDrawer and RecentlyViewed — do not duplicate.

### Replace the WishlistProvider stub

In Phase 2.1, `src/context/WishlistContext.tsx` was scaffolded as a stub returning `{children}`.
**Replace it entirely** with the full implementation below.

### src/context/WishlistContext.tsx ("use client")

State shape:

```ts
interface WishlistState {
  items: string[]    // product handles
  isOpen: boolean
}
```

**SSR guard on mount** — localStorage does not exist server-side:

```ts
useEffect(() => {
  const stored = localStorage.getItem('sf-wishlist')
  if (stored) {
    try { dispatch({ type: 'LOAD', items: JSON.parse(stored) }) }
    catch {}
  }
}, [])
```

**Persist on every change:**

```ts
useEffect(() => {
  localStorage.setItem('sf-wishlist', JSON.stringify(state.items))
}, [state.items])
```

Actions:

```ts
type WishlistAction =
  | { type: 'LOAD'; items: string[] }
  | { type: 'ADD'; handle: string }
  | { type: 'REMOVE'; handle: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
```

Context value — expose a ref for the wishlist icon button (focus restoration pattern):

```ts
interface WishlistContextValue {
  state: WishlistState
  dispatch: React.Dispatch<WishlistAction>
  wishlistIconRef: React.RefObject<HTMLButtonElement>
}
```

### src/hooks/useWishlist.ts

```ts
export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  const { state, dispatch, wishlistIconRef } = ctx

  return {
    items: state.items,
    isOpen: state.isOpen,
    totalCount: state.items.length,
    wishlistIconRef,

    isWishlisted: (handle: string) => state.items.includes(handle),

    addItem: (handle: string) => dispatch({ type: 'ADD', handle }),
    removeItem: (handle: string) => dispatch({ type: 'REMOVE', handle }),
    toggleItem: (handle: string) => dispatch({
      type: state.items.includes(handle) ? 'REMOVE' : 'ADD',
      handle
    }),
    clearWishlist: () => dispatch({ type: 'CLEAR' }),
    openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
    closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
  }
}
```

### Wire WishlistDrawer into layout and Header

Add `<WishlistDrawer />` to `src/app/layout.tsx` alongside `<CartDrawer />`:

```tsx
{children}
<CartDrawer />
<WishlistDrawer />
```

In `Header.tsx`, wire the wishlist icon button:

```tsx
const { wishlistIconRef, openDrawer, totalCount } = useWishlist()

<button
  ref={wishlistIconRef}
  onClick={openDrawer}
  aria-label={`Open wishlist${totalCount > 0 ? ` — ${totalCount} items` : ''}`}
>
  <Heart size={20} />
  {totalCount > 0 && <span>{totalCount}</span>}
</button>
```

### src/components/wishlist/WishlistButton.tsx

```ts
interface WishlistButtonProps {
  productHandle: string
  className?: string
}
```

```tsx
const { isWishlisted, toggleItem } = useWishlist()
const wishlisted = isWishlisted(productHandle)

function handleToggle(e: React.MouseEvent) {
  e.preventDefault()   // prevent Link navigation if button is inside a card Link
  e.stopPropagation()
  toggleItem(productHandle)
  toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
}
```

- Icon: `Heart` from lucide-react — `fill="currentColor"` if wishlisted, no fill if not
- `aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}`
- CSS keyframe on toggle: `@keyframes wishlistPop { 0% { transform: scale(1) } 50% { transform: scale(1.3) } 100% { transform: scale(1) } }`
  Apply for 300ms on toggle — reset after animation completes

**Placement on ProductCard:**
The ProductCard wrapper needs `position: relative` (add `relative` class to ProductCard's root
element if not already present). Place WishlistButton as an absolute overlay:

```tsx
<div className="relative group">
  {/* product image + details */}
  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
    <WishlistButton productHandle={product.handle} />
  </div>
</div>
```

**Placement on PDP:**
Place alongside (not inside) the Add to Cart button row in the product info panel.

### src/components/wishlist/WishlistDrawer.tsx

Uses the `Dialog` component from Phase 2.3 for focus trap and Escape. Same pattern as CartDrawer.

```tsx
const { isOpen, closeDrawer, wishlistIconRef, items } = useWishlist()
```

**Fetching product data — use the API route, not server lib functions:**

```ts
const [products, setProducts] = useState<ShopifyProduct[]>([])
const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
  if (!isOpen || items.length === 0) { setProducts([]); return }
  setIsLoading(true)
  fetch(`/api/products/batch?handles=${items.join(',')}`)
    .then(r => r.json())
    .then(data => { setProducts(data); setIsLoading(false) })
    .catch(() => setIsLoading(false))
}, [isOpen, items])
```

Structure (same slide-in pattern as CartDrawer):

```tsx
<Dialog isOpen={isOpen} onClose={closeDrawer} triggerRef={wishlistIconRef} ariaLabel="Wishlist">
  <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-canvas shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-stroke">
      <h2 className="text-label">Wishlist {items.length > 0 ? `(${items.length})` : ''}</h2>
      <button onClick={closeDrawer} aria-label="Close wishlist"><X size={20} /></button>
    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {isLoading && <WishlistSkeleton />}
      {!isLoading && items.length === 0 && <WishlistEmpty />}
      {!isLoading && products.map(product => (
        <WishlistItem key={product.handle} product={product} />
      ))}
    </div>
  </div>
</Dialog>
```

**WishlistItem** (inline component or separate file):

```ts
interface WishlistItemProps { product: ShopifyProduct }
```

- Thumbnail: `product.featuredImage`, 60×60
- Title + price
- "Add to Cart" button: adds the **first available variant** to cart

  ```ts
  const firstAvailableVariant = product.variants.edges
    .find(({ node }) => node.availableForSale)?.node
    ?? product.variants.edges[0]?.node  // fallback to first if none available
  ```

  If no variants exist at all: disable the button
- Remove X button: `removeItem(product.handle)`, `aria-label={Remove ${product.title} from wishlist}`

**WishlistEmpty:**

```tsx
<div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
  <Heart size={48} className="text-muted/40" />
  <p className="font-display text-xl">Your wishlist is empty.</p>
  <Button onClick={closeDrawer} asChild>
    <Link href="/shop">Browse Products</Link>
  </Button>
</div>
```

---

## Prompt 8.2 — Recently Viewed & Related Products

### src/hooks/useRecentlyViewed.ts

```ts
export function useRecentlyViewed() {
  const MAX_ITEMS = 6
  const STORAGE_KEY = 'sf-recently-viewed'

  // Read handles from localStorage
  const getHandles = (): string[] => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
    catch { return [] }
  }

  const addProduct = (handle: string) => {
    const current = getHandles()
    const updated = [handle, ...current.filter(h => h !== handle)].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { addProduct, getHandles }
}
```

### PDP tracking component — ProductViewTracker

Add a dedicated client component to the PDP to record views. Name it explicitly:

**src/components/product/ProductViewTracker.tsx ("use client"):**

```tsx
'use client'
import { useEffect } from 'react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

export function ProductViewTracker({ handle }: { handle: string }) {
  const { addProduct } = useRecentlyViewed()
  useEffect(() => {
    addProduct(handle)
  }, [handle])  // runs once on mount per handle
  return null   // renders nothing
}
```

Place in `src/app/products/[handle]/page.tsx` inside the page's JSX:

```tsx
<ProductViewTracker handle={product.handle} />
```

Position doesn't matter — it renders null.

### src/components/product/RecentlyViewed.tsx (client)

```ts
interface RecentlyViewedProps {
  currentHandle: string   // exclude this product from the list
}
```

**Fetching — use the batch API route:**

```ts
const [products, setProducts] = useState<ShopifyProduct[]>([])

useEffect(() => {
  const handles = getHandles()
    .filter(h => h !== currentHandle)  // exclude current product
    .slice(0, 6)

  if (handles.length < 2) return  // only render if ≥ 2 items (after excluding current)

  fetch(`/api/products/batch?handles=${handles.join(',')}`)
    .then(r => r.json())
    .then(setProducts)
    .catch(() => {})
}, [currentHandle])

if (products.length < 2) return null
```

Renders: "Recently Viewed" heading + `<HorizontalScrollRow>` of `ProductCard` components.

**Placement in PDP:** above `RelatedProducts`, below the image gallery strip (Section 3).

### src/components/product/RelatedProducts.tsx

**Replace the stub from Phase 4.4** with the full implementation:

```ts
interface RelatedProductsProps {
  products: ShopifyProduct[]
  currentHandle: string  // exclude from display in case recommendations include current product
}

export function RelatedProducts({ products, currentHandle }: RelatedProductsProps) {
  const filtered = products.filter(p => p.handle !== currentHandle).slice(0, 4)
  if (filtered.length === 0) return null

  return (
    <section>
      <h2 className="font-display text-2xl mb-6">You may also like</h2>
      <HorizontalScrollRow>
        {filtered.map(product => <ProductCard key={product.handle} product={product} />)}
      </HorizontalScrollRow>
    </section>
  )
}
```

### src/components/common/HorizontalScrollRow.tsx

Extract the horizontal scroll container as a reusable component — used by both
`RecentlyViewed` and `RelatedProducts`:

```ts
interface HorizontalScrollRowProps {
  children: React.ReactNode
  className?: string
}
```

Implementation:

```tsx
const scrollRef = useRef<HTMLDivElement>(null)
const [canScrollLeft, setCanScrollLeft] = useState(false)
const [canScrollRight, setCanScrollRight] = useState(true)

function updateScrollState() {
  const el = scrollRef.current
  if (!el) return
  setCanScrollLeft(el.scrollLeft > 0)
  setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
}

useEffect(() => {
  const el = scrollRef.current
  if (!el) return
  updateScrollState()
  el.addEventListener('scroll', updateScrollState, { passive: true })
  return () => el.removeEventListener('scroll', updateScrollState)
}, [])

function scroll(direction: 'left' | 'right') {
  scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' })
}
```

Container styles:

```tsx
<div className="relative">
  {/* Left arrow — desktop only, show only when canScrollLeft */}
  {canScrollLeft && (
    <button
      onClick={() => scroll('left')}
      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 ..."
      aria-label="Scroll left"
    />
  )}

  {/* Scroll container */}
  <div
    ref={scrollRef}
    className="flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    style={{ scrollSnapType: 'x mandatory' }}
  >
    {/* Each child gets scroll-snap-align: start */}
    {React.Children.map(children, child => (
      <div className="flex-none w-[calc(100%/1.5)] md:w-[calc(100%/3.5)] scroll-snap-align-start">
        {child}
      </div>
    ))}
  </div>

  {/* Right arrow */}
  {canScrollRight && (
    <button
      onClick={() => scroll('right')}
      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 ..."
      aria-label="Scroll right"
    />
  )}
</div>
```

Note: `1.5` cards on mobile (shows half of second card as affordance), `3.5` on desktop.
Arrow buttons are `hidden md:flex` — never shown on mobile (touch scrolling is sufficient).

---

 **After Phase 8, verify:**

> - Wishlisting a product on ProductCard and PDP both persist across page refresh
> - WishlistDrawer fetches and displays product data correctly
> - "Add to Cart" in WishlistDrawer adds the first available variant
> - Heart icon fills/unfills correctly and shows pulse animation
> - Viewing 3+ products then visiting a PDP shows Recently Viewed (excluding current product)
> - RelatedProducts stub from Phase 4.4 is replaced and renders correctly
> - Horizontal scroll arrows appear only when there is content to scroll to
> - Wishlist icon in Header shows correct count badge
> - `tsc --noEmit` — zero errors
