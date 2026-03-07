# Phase 6 — Cart & Checkout

---

## Prompt 6.1 — Cart Context & State

### Replace the CartProvider stub

In Phase 2.1, `src/context/CartContext.tsx` was scaffolded as a stub returning `{children}`.
**Replace it entirely** with the full implementation below.

### src/context/CartContext.tsx ("use client")

State shape:

```ts
interface CartState {
  cartId: string | null
  cart: ShopifyCart | null
  isOpen: boolean
  isLoading: boolean
}
```

Actions:

```ts
type CartAction =
  | { type: 'SET_CART'; cart: ShopifyCart }
  | { type: 'SET_CART_ID'; cartId: string }
  | { type: 'CLEAR_CART' }           // clears both cart and cartId (stale/expired)
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_LOADING'; loading: boolean }
```

**On mount — SSR guard required.** localStorage does not exist server-side:

```ts
useEffect(() => {
  const stored = localStorage.getItem('sf-cart-id')
  if (!stored) return

  // Fetch cart to verify it still exists (Shopify carts expire after ~10 days)
  getCart(stored).then(cart => {
    if (cart) {
      dispatch({ type: 'SET_CART_ID', cartId: stored })
      dispatch({ type: 'SET_CART', cart })
    } else {
      // Cart expired or invalid — clear localStorage
      localStorage.removeItem('sf-cart-id')
      dispatch({ type: 'CLEAR_CART' })
    }
  })
}, [])
```

**Persist cartId** to localStorage whenever `SET_CART_ID` is dispatched:

```ts
// In reducer or via useEffect watching state.cartId:
useEffect(() => {
  if (state.cartId) {
    localStorage.setItem('sf-cart-id', state.cartId)
  }
}, [state.cartId])
```

Context value — expose a ref for the cart icon button (used for focus restoration):

```ts
interface CartContextValue {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  cartIconRef: React.RefObject<HTMLButtonElement>  // set by Header's cart icon button
}
```

### src/hooks/useCart.ts

Wraps `useContext(CartContext)`. All cart operations live here.

```ts
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  const { state, dispatch, cartIconRef } = ctx

  return {
    cart: state.cart,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    totalQuantity: state.cart?.totalQuantity ?? 0,
    totalAmount: state.cart?.cost.totalAmount ?? null,  // MoneyV2 | null

    openCart:  () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    cartIconRef,

    // Add item — must handle first-ever add (no cartId yet)
    addItem: async (variantId: string, quantity: number) => {
      dispatch({ type: 'SET_LOADING', loading: true })
      try {
        let cart: ShopifyCart
        if (!state.cartId) {
          // First item: create a new cart
          cart = await createCart([{ merchandiseId: variantId, quantity }])
          dispatch({ type: 'SET_CART_ID', cartId: cart.id })
        } else {
          cart = await addToCart(state.cartId, [{ merchandiseId: variantId, quantity }])
        }
        dispatch({ type: 'SET_CART', cart })
        dispatch({ type: 'OPEN_CART' })
        toast.success('Added to cart')
      } catch (err) {
        toast.error('Failed to add item')
      } finally {
        dispatch({ type: 'SET_LOADING', loading: false })
      }
    },

    // Update item — quantity 0 means remove
    updateItem: async (lineId: string, quantity: number) => {
      if (!state.cartId) return
      dispatch({ type: 'SET_LOADING', loading: true })
      try {
        const cart = quantity === 0
          ? await removeFromCart(state.cartId, lineId)
          : await updateCartLine(state.cartId, lineId, quantity)
        dispatch({ type: 'SET_CART', cart })
      } catch (err) {
        toast.error('Failed to update cart')
      } finally {
        dispatch({ type: 'SET_LOADING', loading: false })
      }
    },

    removeItem: async (lineId: string) => {
      if (!state.cartId) return
      dispatch({ type: 'SET_LOADING', loading: true })
      try {
        const cart = await removeFromCart(state.cartId, lineId)
        dispatch({ type: 'SET_CART', cart })
        toast.success('Item removed')
      } catch {
        toast.error('Failed to remove item')
      } finally {
        dispatch({ type: 'SET_LOADING', loading: false })
      }
    },

    // Discount — Shopify does NOT throw on invalid codes.
    // It returns discountCodes[].applicable: false — check this explicitly.
    applyDiscount: async (code: string) => {
      if (!state.cartId) return
      dispatch({ type: 'SET_LOADING', loading: true })
      try {
        const cart = await applyDiscountCode(state.cartId, code)
        dispatch({ type: 'SET_CART', cart })
        // Check if code was actually accepted
        const applied = cart.discountCodes.find(d => d.code === code)
        if (applied?.applicable) {
          toast.success(`Discount "${code}" applied`)
        } else {
          toast.error(`Discount code "${code}" is not valid`)
        }
      } catch {
        toast.error('Failed to apply discount')
      } finally {
        dispatch({ type: 'SET_LOADING', loading: false })
      }
    },

    removeDiscount: async () => {
      if (!state.cartId) return
      const cart = await removeDiscountCode(state.cartId)
      dispatch({ type: 'SET_CART', cart })
    },

    updateNote: async (note: string) => {
      if (!state.cartId) return
      const cart = await updateCartNote(state.cartId, note)
      dispatch({ type: 'SET_CART', cart })
    },

    // Match against merchandise.id (the variant ID), not line.id
    isItemInCart: (variantId: string): boolean => {
      return state.cart?.lines.edges.some(
        ({ node }) => node.merchandise.id === variantId
      ) ?? false
    },

    getItemQuantity: (variantId: string): number => {
      const line = state.cart?.lines.edges.find(
        ({ node }) => node.merchandise.id === variantId
      )
      return line?.node.quantity ?? 0
    },
  }
}
```

---

## Prompt 6.2 — Cart Drawer UI

### Wire CartDrawer into the layout

Add `<CartDrawer />` to `src/app/layout.tsx` inside `CartProvider`, after `{children}`:

```tsx
<CartProvider>
  <WishlistProvider>
    ...
    {children}
    <CartDrawer />     {/* ← add this */}
    <CookieConsent />
    <Toaster />
    ...
  </WishlistProvider>
</CartProvider>
```

### Wire cart icon ref in Header

The `CartDrawer` needs to return focus to the cart icon button when closed.
In `Header.tsx`, attach the ref from CartContext to the cart icon button:

```tsx
const { cartIconRef, openCart, totalQuantity } = useCart()

<button
  ref={cartIconRef}
  onClick={openCart}
  aria-label={`Open cart${totalQuantity > 0 ? ` — ${totalQuantity} items` : ''}`}
>
  <ShoppingBag size={20} />
  {totalQuantity > 0 && <span>{totalQuantity}</span>}
</button>
```

### components/cart/CartDrawer.tsx

Use the `Dialog` component from Phase 2.3 for focus trap and Escape handling — do not
reimplement focus trap logic. `Dialog` accepts `triggerRef` for focus restoration.

```tsx
const { cart, isOpen, closeCart, cartIconRef } = useCart()
```

Structure:

```tsx
<Dialog isOpen={isOpen} onClose={closeCart} triggerRef={cartIconRef} ariaLabel="Shopping cart">
  <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-canvas shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-stroke">
      <h2 className="text-label">Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ''}</h2>
      <button onClick={closeCart} aria-label="Close cart"><X size={20} /></button>
    </div>

    {/* Free shipping bar */}
    <FreeShippingBar cart={cart} />

    {/* Body */}
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {!cart || cart.lines.edges.length === 0
        ? <EmptyCart />
        : cart.lines.edges.map(({ node }) => <CartItem key={node.id} line={node} />)
      }
    </div>

    {/* Footer — sticky */}
    {cart && cart.lines.edges.length > 0 && (
      <div className="border-t border-stroke px-6 py-4 flex flex-col gap-4">
        <DiscountInput />
        <CartNote />
        <CartSummary cart={cart} />
      </div>
    )}
  </div>
</Dialog>
```

Backdrop: handled by `Dialog` component. `useScrollLock` while `isOpen`.

Slide-in animation — CSS only (GSAP is Phase 10):

```css
/* In globals.css */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
```

Apply `animation: slideInRight 350ms ease-out` to the drawer panel when open.

### FREE_SHIPPING_THRESHOLD constant

Define in a constants file, not hardcoded:

```ts

// src/lib/constants.ts
export const FREE_SHIPPING_THRESHOLD = 150  // amount in store currency
export const CURRENCY_CODE = 'EUR'          // match your Shopify store currency
```

### components/cart/FreeShippingBar.tsx

```ts
interface FreeShippingBarProps {
  cart: ShopifyCart | null
}
```

```ts
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

const subtotal = parseFloat(cart?.cost.subtotalAmount.amount ?? '0')
const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
const currencyCode = cart?.cost.subtotalAmount.currencyCode ?? CURRENCY_CODE
```

- Progress bar: `width: ${progress}%`, CSS transition on width
- Text: `remaining > 0`
  → `"You're ${formatPrice(remaining.toString(), currencyCode)} away from free shipping"`
  → `"Free shipping unlocked! 🎉"` when `remaining === 0`
- Hide entirely if cart is null or empty

### components/cart/CartItem.tsx

```ts
interface CartItemProps {
  line: ShopifyCartLine
}
```

- Thumbnail: `next/image`, 60×60, `line.merchandise.image` (may be null — show placeholder)
- Product title: `line.merchandise.product.title`
- Variant name: `line.merchandise.title` (skip if it's "Default Title" — Shopify default for
  single-variant products: `line.merchandise.title !== 'Default Title'`)
- Unit price: `formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)`
- Line total: `formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)`

Quantity stepper with debounce:

```ts
const [localQuantity, setLocalQuantity] = useState(line.quantity)
const debouncedQuantity = useDebounce(localQuantity, 500)

useEffect(() => {
  if (debouncedQuantity !== line.quantity) {
    updateItem(line.id, debouncedQuantity)
  }
}, [debouncedQuantity])
```

- `−` button: `onClick={() => setLocalQuantity(q => Math.max(0, q - 1))}`
  (going to 0 triggers `removeItem` via `updateItem`)
- `+` button: no upper limit enforced here (stock check is on PDP)
- Remove button: `onClick={() => removeItem(line.id)}`, `aria-label={Remove ${line.merchandise.product.title}}`
- Out-of-stock warning: if `line.merchandise.availableForSale === false` — render muted warning text

### components/cart/DiscountInput.tsx

State: `isExpanded`, `code`, `isLoading`, `error`

```tsx
const { cart, applyDiscount, removeDiscount } = useCart()
const activeCode = cart?.discountCodes.find(d => d.applicable)
```

- If `activeCode` exists: show applied code + savings + X button to remove
  - Savings amount: sum `cart.lines.edges[].node.discountAllocations[].discountedAmount`
- If not: collapsible input row — "Have a discount code?" toggle → reveals input + Apply button
- Apply: call `applyDiscount(code)`, clear input on success
- Error display is handled by `toast.error` in `useCart` — no separate inline error needed here

### components/cart/CartNote.tsx

State: `isExpanded`, `note` (initialised from `cart?.note ?? ''`)

- "Add order note" toggle → reveals `<textarea>`
- Auto-save on blur: `onBlur={() => updateNote(note)}`
- Placeholder: `"Special instructions, custom dimensions, or delivery notes..."`
- Character limit display: `{note.length}/500`

### components/cart/CartSummary.tsx

```ts
interface CartSummaryProps {
  cart: ShopifyCart
}
```

```tsx
const subtotal = cart.cost.subtotalAmount
const total = cart.cost.totalAmount
const hasDiscount = cart.discountCodes.some(d => d.applicable)
```

Layout:

- Subtotal row: label + `formatPrice(subtotal.amount, subtotal.currencyCode)`
- Discount row (only if `hasDiscount`): "Discount" in success color + savings amount
- "Taxes and shipping calculated at checkout" — `text-label text-muted`
- Checkout button: primary Button, full width, `href={cart.checkoutUrl}` — renders as `<a>` tag,
  opens in **same tab** (`target` unset). Shopify checkout handles return URL.
- "Continue Shopping" — ghost/link style, `onClick={closeCart}`

### components/cart/EmptyCart.tsx

```tsx
const { closeCart } = useCart()

return (
  <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-12">
    <ShoppingBag size={48} className="text-muted/40" />
    <div>
      <p className="font-display text-xl">Your cart is empty.</p>
      <p className="text-label text-muted mt-1">Add something beautiful.</p>
    </div>
    <Button onClick={closeCart} asChild>
      <Link href="/shop">Start Shopping</Link>
    </Button>
  </div>
)
```

---

**After Phase 6, verify:**

> - Adding first item creates a new cart (no existing cartId) and opens drawer
> - Adding subsequent items appends to existing cart
> - Quantity stepper debounces — rapid clicks only fire one API call
> - Invalid discount code shows error toast, does not update cart display
> - Valid discount code shows savings in CartSummary
> - Cart icon in header shows correct item count
> - Closing drawer returns focus to cart icon button
> - Refreshing page rehydrates cart from localStorage cartId
> - Cart with expired/deleted cartId clears localStorage and starts fresh
> - `tsc --noEmit` — zero errors
