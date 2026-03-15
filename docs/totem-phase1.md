Read CLAUDE.md and docs/STATUS.md before starting.

## Goal
Lay the data and cart foundation for the TOTEM configurator. No UI changes to any existing page. Zero TypeScript errors at the end.

---

## Step 1 — Create src/lib/totem-config.ts

Create this file from scratch. It is the single source of truth for all TOTEM product data.

It must export the following typed constants:

**TotemShape**
An array of 8 shapes. Each has: id (string slug), name (display name), price (number, in euros).
Use these values:
- arch / Arch / 28
- dome / Dome / 34
- cylinder / Cylinder / 24
- cone / Cone / 30
- wave / Wave / 32
- sphere / Sphere / 36
- torus / Torus / 38
- prism / Prism / 26

**TotemColor**
An array of 8 colors. Each has: id (string slug), name (display name), hex (CSS hex string).
Use these values:
- chalk / Chalk White / #F2F0EB
- stone / Stone Grey / #B4B2A9
- black / Matte Black / #2C2C2A
- clay / Clay / #C4896A
- sage / Sage / #7A9E7E
- navy / Navy / #1E3A5F
- cream / Warm Cream / #E8E0CF
- terracotta / Terracotta / #B85C38

**TotemFixation**
An array of 3 fixation options. Each has: id, name, price.
- rosette / Rosette / 12
- rail / Rail / 15
- canopy / Canopy / 18

**TotemCable**
An array of 5 cable options. Each has: id, name, price.
- black-textile / Black textile / 8
- white-textile / White textile / 8
- brass / Brass / 14
- copper / Copper / 14
- transparent / Transparent / 8

**TotemPreset**
An array of 4 presets. Each has: id, name, description, pieces (array of { shapeId, colorId }), fixationId, cableId.
Use these:
- studio / The Studio / "A minimal three-piece composition" / [{arch,chalk},{dome,stone},{cylinder,chalk}] / rosette / black-textile
- salon / The Salon / "A five-piece statement piece" / [{dome,chalk},{arch,stone},{dome,black},{wave,chalk},{arch,cream}] / rosette / black-textile
- atelier / The Atelier / "Seven pieces, maximum drama" / [{dome,black},{arch,clay},{wave,stone},{dome,chalk},{arch,black},{wave,clay},{cylinder,chalk}] / rail / black-textile
- duo / The Duo / "Two pieces, compact and refined" / [{arch,chalk},{dome,black}] / rosette / transparent

Export TypeScript interfaces for all of the above (TotemShape, TotemColor, TotemFixation, TotemCable, TotemPreset) and export the arrays as TOTEM_SHAPES, TOTEM_COLORS, TOTEM_FIXATIONS, TOTEM_CABLES, TOTEM_PRESETS.

Also export a helper type:
```ts
export interface TotemPiece {
  uid: string        // unique per piece instance, generated client-side
  shapeId: string
  colorId: string
}
```

And a helper:
```ts
export interface TotemBuildConfig {
  pieces: TotemPiece[]
  fixationId: string
  cableId: string
}
```

And a price calculator:
```ts
export function calcTotemPrice(config: TotemBuildConfig): number
```
That sums shape prices for all pieces + fixation price + cable price. Returns 0 for any unrecognised id.

---

## Step 2 — Extend Shopify types

In src/lib/shopify/types.ts, add an `attributes` field to `ShopifyCartLine`:
```ts
attributes: Array<{ key: string; value: string }>
```

This field already exists in Shopify's API but is not currently fetched. No other type changes.

---

## Step 3 — Extend GraphQL queries and mutations

**src/lib/shopify/mutations.ts**

In the `CART_FIELDS` fragment, add `attributes { key value }` to the line node, inside the `lines(first: 100)` block, at the same level as `id`, `quantity`, `merchandise`, `cost`, `discountAllocations`.

In `CART_LINES_ADD`, change the lines input type comment (if any) — no actual GraphQL change needed here, Shopify's `CartLineInput` already accepts `attributes: [AttributeInput!]`. The mutation string itself does not need to change.

In `CART_CREATE`, same — no mutation string change needed.

**src/lib/shopify/cart.ts**

Extend the `CartLine` interface (local to this file) to accept an optional attributes field:
```ts
interface CartLine {
  merchandiseId: string
  quantity: number
  attributes?: Array<{ key: string; value: string }>
}
```

The `createCart` and `addToCart` functions already pass `lines` to Shopify — because `CartLine` now includes `attributes`, they will pass through automatically. No other logic changes to these functions.

---

## Step 4 — Add addBundle to useCart

In src/hooks/useCart.ts, add a new exported function `addBundle` alongside the existing `addItem`.

Signature:
```ts
addBundle: (config: TotemBuildConfig) => Promise<void>
```

Import `TotemBuildConfig` and `calcTotemPrice` from `@/lib/totem-config`.
Import `TOTEM_SHAPES`, `TOTEM_FIXATIONS`, `TOTEM_CABLES` from `@/lib/totem-config`.

Logic:
1. Generate a build ID: `const buildId = 'build_' + Math.random().toString(36).slice(2, 10)`
2. Build a `lines` array — one entry per piece in `config.pieces`, plus one for the fixation, plus one for the cable. Each line:
   - `merchandiseId`: you will need the actual Shopify variant ID for each module. For now, use a placeholder: read it from an env var `NEXT_PUBLIC_TOTEM_VARIANT_ID` with a fallback of `'TOTEM_VARIANT_PLACEHOLDER'`. Add a comment: `// TODO: replace with per-shape variant IDs once Shopify products are created`
   - `quantity: 1`
   - `attributes`: always include `{ key: '_build_id', value: buildId }`. Per piece also include `{ key: 'Shape', value: shapeName }` and `{ key: 'Color', value: colorName }`. For fixation include `{ key: 'Fixation', value: fixationName }`. For cable include `{ key: 'Cable', value: cableName }`. Look up names from the config arrays.
3. Call `addToCart` or `createCart` exactly as `addItem` does — same pattern, same error handling, same toast messages. Use `toast.success('TOTEM added to cart')` on success.
4. After success, call `openCart()`.
5. Track with Vercel analytics: `track('AddToCart', { productHandle: 'totem', pieces: config.pieces.length })`.

---

## Step 5 — Update CartItem and CartDrawer

**src/lib/shopify/types.ts** — already done in Step 2.

**src/components/cart/CartItem.tsx**

Below the existing product title line, add a small attributes display. After `merchandise.product.title`, check if `line.attributes` has any entries where `key` does not start with `_` (underscore-prefixed keys are internal, never shown to customers). If there are visible attributes, render them as a single line of small muted text:
`Shape · Color · Fixation · Cable` — i.e. join the values of visible attributes with ` · `.

Keep the existing layout intact — this is an additive change only.

**src/components/cart/CartDrawer.tsx**

Read the existing file carefully first. Then make the following change:

Group cart lines by `_build_id` attribute before rendering. Lines that share the same `_build_id` value should be rendered as a single `TotemCartGroup` component (created below). Lines with no `_build_id` attribute render as normal `CartItem` components, unchanged.

Grouping logic:
```ts
const groups: Map<string, ShopifyCartLine[]> = new Map()
const ungrouped: ShopifyCartLine[] = []

for (const line of cart.lines) {
  const buildId = line.attributes?.find(a => a.key === '_build_id')?.value
  if (buildId) {
    const existing = groups.get(buildId) ?? []
    groups.set(buildId, [...existing, line])
  } else {
    ungrouped.push(line)
  }
}
```

Render ungrouped lines first as `<CartItem>`, then render each group as `<TotemCartGroup lines={groupLines} />`.

---

## Step 6 — Create TotemCartGroup component

Create src/components/cart/TotemCartGroup.tsx.

Props: `{ lines: ShopifyCartLine[] }`

This is a `'use client'` component.

UI (collapsed, default state):
- A row with: left side shows "TOTEM" in the existing `font-display` style used elsewhere in the cart, below it a muted summary string built by joining the visible attribute values from the first few lines e.g. "Arch · Dome · Wave + 2 more". Right side shows the summed total price of all lines in the group (sum of `line.cost.totalAmount.amount`), and a small expand chevron button.

UI (expanded, toggled by chevron):
- Below the header row, render each line in the group as a compact sub-row: shape name + color name on the left (from visible attributes), line price on the right. Same border-b treatment as CartItem uses between lines.
- No quantity controls on sub-rows for now — removing individual pieces from a bundle is a future feature. Just display.

Use the same CSS utility classes and spacing patterns as CartItem.tsx — read that file before writing this one.

Use a `useState(false)` for the expanded/collapsed toggle.

The expand icon should be a simple chevron — use `ChevronDown` from `lucide-react`, same as used elsewhere in the project.

---

## Completion checklist

Before finishing:
- Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors required
- Confirm no existing files were changed except: types.ts, mutations.ts, cart.ts, useCart.ts, CartItem.tsx, CartDrawer.tsx
- Confirm three new files exist: src/lib/totem-config.ts, src/components/cart/TotemCartGroup.tsx
- Update docs/STATUS.md
- Commit: `feat: totem phase 1 — config data, cart attributes, bundle add, cart grouping`