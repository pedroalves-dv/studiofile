# TOTEM Cart Bundle UX — Design Spec

**Date:** 2026-03-28
**Status:** Approved

---

## Context

The TOTEM configurator adds multiple Shopify cart lines per build (one per shape piece, one fixture, one cable), grouped by a `_build_id` line attribute and rendered together as a `TotemCartGroup` in the cart drawer.

Three UX problems need fixing:

1. **Slow removal** — `removeBundle()` loops `removeItem()` one line at a time: N sequential API calls, N state updates, N "Item removed" toasts. Feels laggy for bundles with 3+ pieces.
2. **No confirmation** — "Remove bundle" fires immediately with no safeguard.
3. **No edit path** — users cannot go back and modify a bundle once it's in the cart.

---

## Changes

### 1. Batch removal — `src/lib/shopify/cart.ts`

Change `removeFromCart` signature from `(cartId, lineId: string)` to `(cartId, lineIds: string[])`.

The `CART_LINES_REMOVE` mutation already accepts `lineIds: [ID!]!`, so this is a one-line wrapper change. All lines are removed in a single GraphQL call — one network request, one normalized cart returned, one state update.

Update the one internal call-site in `useCart.ts` (`updateItem`) to pass `[lineId]`.

### 2. `removeBundleItems` — `src/hooks/useCart.ts`

Add a new exported function:

```ts
removeBundleItems(lineIds: string[]): Promise<void>
```

- Calls `removeFromCart(cartId, lineIds)` once
- Dispatches `SET_CART` once
- Shows one `toast.success("Bundle removed")` — no per-item toast

### 3. Hidden ID attributes — `src/hooks/useCart.ts` (`addTotemToCart`)

Add hidden (underscore-prefixed) attributes to each line so the config can be reconstructed later:

| Line type | New attributes |
|-----------|---------------|
| Shape | `_shape_id`, `_color_id`, `_flipped` |
| fixture | `_fixture_id`, `_fixture_color_id` |
| Cable | `_cable_id` |

Shopify treats underscore-prefixed attributes as hidden (not shown on order receipts).

### 4. Confirmation + Edit — `src/components/cart/TotemCartGroup.tsx`

**State additions:**
- `confirming: boolean` — toggles inline remove confirmation
- `isEditing: boolean` — loading state for the Edit button

**Remove confirmation flow:**
- Default: "Remove bundle" button + "Edit" button (side by side)
- After clicking "Remove bundle": replaced inline with "Are you sure?" text + "Yes, remove" + "Cancel"
- "Yes, remove" → calls `removeBundleItems(lines.map(l => l.id))`
- "Cancel" → `setConfirming(false)`

**Edit button flow:**
1. Read `_shape_id`, `_color_id`, `_flipped` from each Shape line → build `TotemPiece[]` (generate fresh `uid` per piece with `generateUid()`)
2. Read `_fixture_id`, `_fixture_color_id` from the fixture line
3. Read `_cable_id` from the Cable line
4. Write to localStorage: `sf-totem-pieces`, `sf-totem-fixture`, `sf-totem-fixture-color`, `sf-totem-cable`
5. Call `removeBundleItems(lines.map(l => l.id))` — single API call
6. Call `closeCart()`
7. `router.push('/products/totem')`

If any required attribute is missing (edge case), show `toast.error("Could not reconstruct config.")` and abort.

---

## Files Modified

| File | Change |
|------|--------|
| `src/lib/shopify/cart.ts` | `removeFromCart` accepts `lineIds: string[]` |
| `src/hooks/useCart.ts` | Update `updateItem` call-site; add `removeBundleItems`; add hidden attrs in `addTotemToCart` |
| `src/components/cart/TotemCartGroup.tsx` | Inline confirmation; Edit button with localStorage pre-load + navigate |

---

## Verification

1. Add a TOTEM bundle (2+ pieces) to cart
2. Expand the cart group → click "Remove bundle" → confirm inline confirmation appears
3. Click "Yes, remove" → bundle disappears in one update, single "Bundle removed" toast, no lag
4. Add another bundle → click "Edit" → cart closes, configurator opens pre-loaded with that exact config, bundle is gone from cart
5. Run `npm run type-check` — zero errors
