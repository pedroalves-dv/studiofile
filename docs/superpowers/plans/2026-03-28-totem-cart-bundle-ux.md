# TOTEM Cart Bundle UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix TOTEM bundle removal (batch + single API call), add inline confirmation, and add an Edit button that pre-loads the configurator and removes the old bundle in one shot.

**Architecture:** `removeFromCart` in `cart.ts` already accepts an array via the GraphQL mutation — just the TypeScript wrapper needs updating. A new `removeBundleItems` hook function handles all lines in one call. Hidden underscore-prefixed attributes (`_shape_id`, `_color_id`, etc.) stored at add-time let the Edit button reconstruct the full `TotemBuildConfig` without any name-matching fragility.

**Tech Stack:** Next.js 15 App Router, TypeScript, Shopify Storefront API (GraphQL), React, `useLocalStorage` hook

---

## Files Modified

| File | Change |
|------|--------|
| `src/lib/shopify/cart.ts` | `removeFromCart` signature: `lineId: string` → `lineIds: string[]` |
| `src/hooks/useCart.ts` | Fix 2 call-sites; add `removeBundleItems`; add hidden attrs in `addTotemToCart` |
| `src/components/cart/TotemCartGroup.tsx` | Full rewrite: inline confirmation, Edit button, use `removeBundleItems` |

---

## Task 1: Update `removeFromCart` to accept an array of line IDs

**Files:**
- Modify: `src/lib/shopify/cart.ts:139-153`

The `CART_LINES_REMOVE` GraphQL mutation already takes `lineIds: [ID!]!`. The wrapper just needs its TypeScript signature updated.

- [ ] **Step 1: Update the function signature and body**

Replace the existing `removeFromCart` function (lines 139–153):

```typescript
export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const response = await storefront<CartRemoveResponse>(CART_LINES_REMOVE, {
    cartId,
    lineIds,
  });

  if (response.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.cartLinesRemove.userErrors[0].message);
  }

  return normalizeCart(response.cartLinesRemove.cart);
}
```

- [ ] **Step 2: Verify the file looks correct**

Run: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check 2>&1 | head -30`

Expected: TypeScript errors from the two call-sites in `useCart.ts` that still pass a single string — confirms the signature change registered. Fix those in Task 2.

---

## Task 2: Update `useCart.ts` — fix call-sites, add `removeBundleItems`, add hidden attributes

**Files:**
- Modify: `src/hooks/useCart.ts`

Three changes in one file: fix both `removeFromCart` call-sites (now need an array), add `removeBundleItems`, and attach hidden ID attributes in `addTotemToCart`.

- [ ] **Step 1: Fix `updateItem` call-site (line ~70)**

Replace:
```typescript
updatedCart = await removeFromCart(state.cartId, lineId);
```
With:
```typescript
updatedCart = await removeFromCart(state.cartId, [lineId]);
```

- [ ] **Step 2: Fix `removeItem` call-site (line ~86)**

Replace:
```typescript
const updatedCart = await removeFromCart(state.cartId, lineId);
```
With:
```typescript
const updatedCart = await removeFromCart(state.cartId, [lineId]);
```

- [ ] **Step 3: Add `removeBundleItems` after the existing `removeItem` function**

Insert after the closing `};` of `removeItem` (~line 94):

```typescript
const removeBundleItems = async (lineIds: string[]) => {
  if (!state.cartId) return;
  dispatch({ type: "SET_LOADING", loading: true });
  try {
    const updatedCart = await removeFromCart(state.cartId, lineIds);
    dispatch({ type: "SET_CART", cart: updatedCart });
    toast.success("Bundle removed");
  } catch {
    toast.error("Could not remove bundle. Please try again.");
    throw;
  } finally {
    dispatch({ type: "SET_LOADING", loading: false });
  }
};
```

Note: re-throws after showing the toast so callers (Edit flow) know when to abort navigation.

- [ ] **Step 4: Add `removeBundleItems` to the return object**

In the `return { ... }` at the bottom of `useCart`, add `removeBundleItems` alongside the other exports:

```typescript
return {
  cart,
  isOpen,
  isLoading,
  totalQuantity,
  totalAmount,
  cartIconRef,
  openCart,
  closeCart,
  addItem,
  updateItem,
  removeItem,
  removeBundleItems,
  applyDiscount,
  removeDiscount,
  updateNote,
  isItemInCart,
  getItemQuantity,
  addTotemToCart,
};
```

- [ ] **Step 5: Add hidden ID attributes to shape lines in `addTotemToCart`**

Inside the `for (const piece of config.pieces)` loop, replace the existing `lines.push(...)` call with:

```typescript
lines.push({
  merchandiseId: variant.id,
  quantity: 1,
  attributes: [
    { key: "_build_id", value: buildId },
    {
      key: "_build_label",
      value: `Custom Totem · ${shape?.name ?? piece.shapeId} — ${color?.name ?? piece.colorId}`,
    },
    { key: "Part", value: "Shape" },
    { key: "_shape_id", value: piece.shapeId },
    { key: "_color_id", value: piece.colorId },
    { key: "_flipped", value: String(piece.flipped) },
  ],
});
```

- [ ] **Step 6: Add hidden ID attributes to the fixation line**

Replace the existing fixation `lines.push(...)` call:

```typescript
lines.push({
  merchandiseId: fixationVariant.id,
  quantity: 1,
  attributes: [
    { key: "_build_id", value: buildId },
    {
      key: "_build_label",
      value: `Custom Totem · ${fixation?.name ?? config.fixationId} — ${fixationColorName}`,
    },
    { key: "Part", value: "Fixation" },
    { key: "_fixation_id", value: config.fixationId },
    { key: "_fixation_color_id", value: config.fixationColorId },
  ],
});
```

- [ ] **Step 7: Add hidden ID attribute to the cable line**

Replace the existing cable `lines.push(...)` call:

```typescript
lines.push({
  merchandiseId: cableVariant.id,
  quantity: 1,
  attributes: [
    { key: "_build_id", value: buildId },
    {
      key: "_build_label",
      value: `Custom Totem · ${cable?.name ?? config.cableId} Cable`,
    },
    { key: "Part", value: "Cable" },
    { key: "_cable_id", value: config.cableId },
  ],
});
```

- [ ] **Step 8: Type-check**

Run: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check 2>&1 | head -30`

Expected: zero errors (both call-sites fixed, new function typechecks cleanly).

- [ ] **Step 9: Commit**

```bash
cd /home/jira/Desktop/studiofile && git add src/lib/shopify/cart.ts src/hooks/useCart.ts && git commit -m "feat: batch bundle removal — single Shopify API call for all lines"
```

---

## Task 3: Rewrite `TotemCartGroup.tsx` — confirmation + Edit button

**Files:**
- Modify: `src/components/cart/TotemCartGroup.tsx`

Replace the entire file with the version below. Key changes from the original:
- `removeItem` → `removeBundleItems` + `closeCart` from `useCart`
- `useRouter` added for navigation
- `attr()` helper replaces inline `line.attributes.find(...)` calls
- `confirming` + `isEditing` states added
- `confirmRemove()` replaces `removeBundle()`
- `handleEdit()` reconstructs config, writes localStorage, removes bundle, navigates
- Expanded actions section: either inline confirm UI or two buttons (Remove / Edit)

- [ ] **Step 1: Replace the full file**

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/common/Toast";
import { cn } from "@/lib/utils/cn";
import type { ShopifyCartLine } from "@/lib/shopify/types";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { generateUid } from "@/lib/utils/uid";
import type { TotemPiece } from "@/lib/totem-config";

interface TotemCartGroupProps {
  lines: ShopifyCartLine[];
}

function getLineLabel(line: ShopifyCartLine): {
  primary: string;
  secondary?: string;
} {
  const part = line.attributes.find((a) => a.key === "Part")?.value;
  const productTitle = line.merchandise.product.title;
  const variantTitle = line.merchandise.title;
  if (part === "Shape" || part === "Fixation") {
    return { primary: productTitle, secondary: variantTitle };
  }
  return { primary: productTitle };
}

function lineAttr(line: ShopifyCartLine, key: string): string | undefined {
  return line.attributes.find((a) => a.key === key)?.value;
}

export function TotemCartGroup({ lines }: TotemCartGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { removeBundleItems, closeCart } = useCart();
  const router = useRouter();
  const toast = useToast();

  const busy = isRemoving || isEditing;

  const totalAmount = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "EUR";

  const shapeNames = lines
    .filter((l) => lineAttr(l, "Part") === "Shape")
    .map((l) => `${l.merchandise.product.title} · ${l.merchandise.title}`);

  const LIMIT = 3;
  const overflow = shapeNames.length - LIMIT;
  const shapeSummary =
    overflow > 0
      ? `${shapeNames.slice(0, LIMIT).join(", ")} +${overflow} more`
      : shapeNames.join(", ");

  const fixationLine = lines.find((l) => lineAttr(l, "Part") === "Fixation");
  const cableLine = lines.find((l) => lineAttr(l, "Part") === "Cable");
  const fixationName = fixationLine
    ? `${fixationLine.merchandise.product.title} · ${fixationLine.merchandise.title}`
    : undefined;
  const cableName = cableLine?.merchandise.product.title;
  const systemSummary = [fixationName, cableName].filter(Boolean).join(" · ");

  async function confirmRemove() {
    setIsRemoving(true);
    try {
      await removeBundleItems(lines.map((l) => l.id));
    } catch {
      // error already toasted inside removeBundleItems
    } finally {
      setIsRemoving(false);
      setConfirming(false);
    }
  }

  async function handleEdit() {
    setIsEditing(true);
    try {
      const shapeLines = lines.filter((l) => lineAttr(l, "Part") === "Shape");
      const fixLine = lines.find((l) => lineAttr(l, "Part") === "Fixation");
      const cabLine = lines.find((l) => lineAttr(l, "Part") === "Cable");

      if (
        shapeLines.some(
          (l) => !lineAttr(l, "_shape_id") || !lineAttr(l, "_color_id"),
        ) ||
        !fixLine ||
        !lineAttr(fixLine, "_fixation_id") ||
        !lineAttr(fixLine, "_fixation_color_id") ||
        !cabLine ||
        !lineAttr(cabLine, "_cable_id")
      ) {
        toast.error("Could not reconstruct config. Please build a new TOTEM.");
        return;
      }

      const pieces: TotemPiece[] = shapeLines.map((l) => ({
        uid: generateUid(),
        shapeId: lineAttr(l, "_shape_id")!,
        colorId: lineAttr(l, "_color_id")!,
        flipped: lineAttr(l, "_flipped") === "true",
      }));

      localStorage.setItem("sf-totem-pieces", JSON.stringify(pieces));
      localStorage.setItem(
        "sf-totem-fixation",
        JSON.stringify(lineAttr(fixLine!, "_fixation_id")),
      );
      localStorage.setItem(
        "sf-totem-fixation-color",
        JSON.stringify(lineAttr(fixLine!, "_fixation_color_id")),
      );
      localStorage.setItem(
        "sf-totem-cable",
        JSON.stringify(lineAttr(cabLine!, "_cable_id")),
      );

      await removeBundleItems(lines.map((l) => l.id));
      closeCart();
      router.push("/products/totem");
    } catch {
      toast.error("Could not edit bundle. Please try again.");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <div className="py-4 border-b border-stroke last:border-b-0">
      {/* Collapsed header — full-width button */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse TOTEM bundle" : "Expand TOTEM bundle"}
        className="w-full flex items-start justify-between gap-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold tracking-tighter text-3xl leading-none text-ink">
            TOTEM
          </p>
          <p className="mt-2 tracking-tight text-ink text-base leading-none text-ink">
            Custom Modular Lamp
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-3xl tracking-tighter text-ink">
            {formatPrice(totalAmount.toFixed(2), currencyCode)}
          </span>
          <ChevronDown
            size={24}
            className={cn(
              "text-muted transition-transform duration-150",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expanded sub-rows */}
      {expanded && (
        <div className="mt-3">
          {lines.map((line) => {
            const { primary, secondary } = getLineLabel(line);
            return (
              <div
                key={line.id}
                className="flex items-center justify-between py-2 border-b border-stroke last:border-b-0"
              >
                <p className="text-xs text-muted">
                  {primary}
                  {secondary && ` · ${secondary}`}
                </p>
                <span className="text-xs text-muted ml-4 flex-shrink-0">
                  {formatPrice(
                    line.cost.totalAmount.amount,
                    line.cost.totalAmount.currencyCode,
                  )}
                </span>
              </div>
            );
          })}

          {/* Actions */}
          <div className="mt-2">
            {confirming ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted">Remove this bundle?</span>
                <button
                  type="button"
                  onClick={confirmRemove}
                  disabled={busy}
                  className="text-sm text-error underline-offset-2 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isRemoving ? "Removing…" : "Yes, remove"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={busy}
                  className="text-sm text-muted underline-offset-2 hover:underline disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <ArrowButton
                  type="button"
                  label="Remove bundle"
                  disabled={busy}
                  onClick={() => setConfirming(true)}
                  className="w-fit px-8 py-2.5 rounded-md bg-white text-ink text-sm font-medium tracking-[-0.04em] border border-ink flex justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <ArrowButton
                  type="button"
                  label={isEditing ? "Loading…" : "Edit"}
                  disabled={busy}
                  onClick={handleEdit}
                  className="w-fit px-8 py-2.5 rounded-md bg-white text-ink text-sm font-medium tracking-[-0.04em] border border-ink flex justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check 2>&1 | head -40`

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
cd /home/jira/Desktop/studiofile && git add src/components/cart/TotemCartGroup.tsx && git commit -m "feat: TOTEM cart — inline confirmation, batch remove, Edit button"
```

---

## Verification

1. Add a TOTEM bundle (2+ pieces) to cart via the configurator
2. Open the cart drawer → expand the TOTEM group
3. Click **"Remove bundle"** → inline "Remove this bundle? / Yes, remove / Cancel" appears — no removal yet
4. Click **"Cancel"** → returns to normal two-button state
5. Click **"Remove bundle"** → **"Yes, remove"** → bundle disappears in a single update, one **"Bundle removed"** toast, no lag, no stacked toasts
6. Add another bundle → open cart → expand → click **"Edit"**
7. Cart closes, browser navigates to `/products/totem`, configurator opens pre-loaded with the exact shapes/colors/fixation/cable from the cart bundle. Bundle is gone from cart.
8. Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors
