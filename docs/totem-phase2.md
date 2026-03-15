Read CLAUDE.md and docs/STATUS.md before starting.

## Goal
Build the TOTEM configurator UI at /products/totem. When the product handle is 'totem', the standard PDP layout is replaced entirely by TotemConfigurator. Zero TypeScript errors at the end.

---

## Step 1 — Read existing files first

Before writing anything, read these files in full:
- src/app/products/[handle]/page.tsx
- src/lib/totem-config.ts
- src/hooks/useCart.ts
- src/components/cart/CartDrawer.tsx
- src/components/cart/TotemCartGroup.tsx
- src/lib/shopify/types.ts
- src/app/globals.css
- tailwind.config.ts

---

## Step 2 — Create TotemConfigurator

Create src/components/product/TotemConfigurator.tsx as a 'use client' component.

### State
```ts
// One piece instance in the stack
interface LocalPiece {
  uid: string          // generated client-side: crypto.randomUUID() or Math.random().toString(36)
  shapeId: string
  colorId: string
}
```

Component state:
- `pieces: LocalPiece[]` — the lamp stack, top to bottom
- `selectedUid: string | null` — which piece is selected (shows color picker)
- `fixationId: string` — default to first fixation in TOTEM_FIXATIONS
- `cableId: string` — default to first cable in TOTEM_CABLES
- `isAdding: boolean` — cart loading state

Import from '@/lib/totem-config':
- `TOTEM_SHAPES`, `TOTEM_COLORS`, `TOTEM_FIXATIONS`, `TOTEM_CABLES`
- `calcTotemPrice`, `TotemBuildConfig`

Import `useCart` from '@/hooks/useCart' and call `addBundle`.

---

### Layout

Two-column grid on desktop, stacked on mobile:
┌─────────────────┬──────────────────────────────┐
│  LEFT PANE      │  RIGHT PANE                  │
│  The Stack      │  Shape Catalog               │
│  (your lamp)    │  (click shapes to add)       │
└─────────────────┴──────────────────────────────┘

**Left pane — the stack**

- Heading: "Your lamp" with piece count in muted text
- If pieces is empty: show a centered placeholder — "Add shapes from the right →" in muted mono text
- Each piece in the stack renders as a row with:
  - A color swatch (16×16 square, background = color hex)
  - Shape name (font-mono text-sm)
  - Price (font-mono text-xs text-muted)
  - ▲ / ▼ arrow buttons to reorder (disabled at top/bottom respectively). Use ChevronUp / ChevronDown from lucide-react. aria-label="Move piece up" / "Move piece down".
  - Trash2 icon button to remove the piece. aria-label="Remove piece".
  - The entire row is clickable — clicking it sets `selectedUid` to this piece's uid (makes it 'selected').
- Selected piece: add a `ring-1 ring-ink` outline to the row. Show the color picker directly below it (not in a modal).

**Color picker (appears under selected piece)**

- A grid of color swatches from TOTEM_COLORS — 8 swatches, each 28×28, with a 1px ring on the selected color.
- Clicking a swatch calls `setColorForPiece(uid, colorId)`.
- No label text needed — the color hex is the visual.

**System selectors (below the stack)**

Two dropdowns, each with a label:
- Fixation: `<select>` mapped from TOTEM_FIXATIONS — shows `${fixation.name} — €${fixation.price}`
- Cable: `<select>` mapped from TOTEM_CABLES — shows `${cable.name} — €${cable.price}`

Both use `font-mono text-sm`.

**Price + Add to Cart (bottom of left pane)**

- Live total: `calcTotemPrice({ pieces: pieces.map(p => ({...p, uid: p.uid})), fixationId, cableId })` formatted as `€X` in font-mono text-2xl.
- Subtext: `"${pieces.length} piece${pieces.length === 1 ? '' : 's'} · ${fixationName} · ${cableName}"` in text-label text-muted.
- Add to Cart button: full-width, primary. Disabled when `pieces.length === 0` or `isAdding`. Label: "Add to cart" / "Out of stock" is not relevant here — pieces always in stock for now.
- On click: build a `TotemBuildConfig` from current state and call `await addBundle(config)`. Set `isAdding` before, clear after.

---

**Right pane — shape catalog**

- Heading: "Add shapes" in font-display uppercase.
- A grid of shape cards (2 cols on mobile, 3 cols on desktop, or just 2-col uniform).
- Each card:
  - Shape name in font-mono text-sm uppercase
  - Price in font-mono text-xs text-muted
  - A visual placeholder (square div, aspect-square, bg-stone-100) — no real images yet
  - Clicking the card calls `addShape(shapeId)` which appends a new LocalPiece to `pieces` with a generated uid, the shapeId, and the first color ('chalk') as default.
  - The card has a `+` icon (Plus from lucide-react) in the corner, aria-label="Add {shapeName}".
  - Hover: `border-ink` (the card has `border border-stroke` at rest).

---

### Helper functions (inside the component)
```ts
function addShape(shapeId: string) {
  const uid = Math.random().toString(36).slice(2, 10)
  setPieces(prev => [...prev, { uid, shapeId, colorId: 'chalk' }])
}

function removeShape(uid: string) {
  setPieces(prev => prev.filter(p => p.uid !== uid))
  if (selectedUid === uid) setSelectedUid(null)
}

function setColorForPiece(uid: string, colorId: string) {
  setPieces(prev => prev.map(p => p.uid === uid ? { ...p, colorId } : p))
}

function moveUp(uid: string) {
  setPieces(prev => {
    const i = prev.findIndex(p => p.uid === uid)
    if (i <= 0) return prev
    const next = [...prev]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    return next
  })
}

function moveDown(uid: string) {
  setPieces(prev => {
    const i = prev.findIndex(p => p.uid === uid)
    if (i >= prev.length - 1) return prev
    const next = [...prev]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    return next
  })
}
```

---

### Styling notes

- Follow the existing design system: font-mono for prices/labels, font-display for headings, ink/canvas/stroke/muted tokens.
- No rounded corners (borderRadius: DEFAULT: 0px in tailwind.config.ts).
- Use the `cn()` utility from '@/lib/utils/cn'.
- The component should feel architectural — not airy. Tight spacing.

---

## Step 3 — Wire into the product page

In src/app/products/[handle]/page.tsx:

Read the file in full before editing.

Add this conditional at the top of the page's JSX (after the JSON-LD script), before the normal product layout sections:
```tsx
import { TotemConfigurator } from '@/components/product/TotemConfigurator'

// Inside the component, before the normal layout:
if (handle === 'totem') {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductViewTracker handle={product.handle} />
      <ProductViewEvent handle={product.handle} title={product.title} />
      <div className="container-wide py-8 md:py-16">
        <TotemConfigurator />
      </div>
    </>
  )
}
```

The rest of the standard PDP layout (ImageGalleryWithZoomClient, ProductInfoPanel, description, gallery, recently viewed, related) only renders for non-totem handles.

---

## Step 4 — Add NEXT_PUBLIC_TOTEM_VARIANT_ID to env

In .env.local.example, add:
TOTEM configurator — replace with real Shopify variant ID after products are created
NEXT_PUBLIC_TOTEM_VARIANT_ID=TOTEM_VARIANT_PLACEHOLDER

---

## Completion checklist

- Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors required
- Confirm: visiting /products/totem shows the configurator, not the standard PDP
- Confirm: adding shapes updates the live price
- Confirm: reorder ▲▼ works
- Confirm: color picker appears on piece selection and updates the swatch
- Confirm: clicking Add to Cart (with pieces) calls addBundle and opens the cart drawer with a TotemCartGroup card
- Update docs/STATUS.md — mark TOTEM Phase 2 done
- Commit: `feat: totem phase 2 — configurator UI`