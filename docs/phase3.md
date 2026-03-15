Read CLAUDE.md and docs/STATUS.md before starting.

## Goal
Add the preset gallery mode to the configurator, build the visual preview pane, and polish the TotemCartGroup cart card. Zero TypeScript errors at the end.

---

## Step 1 — Read existing files first

Before writing anything, read these files in full:
- src/components/product/TotemConfigurator.tsx
- src/components/cart/TotemCartGroup.tsx
- src/lib/totem-config.ts
- src/app/globals.css

---

## Step 2 — Add mode tabs to the configurator

Add a `mode` state to `TotemConfigurator`:
```ts
type ConfigMode = 'build' | 'presets'
const [mode, setMode] = useState<ConfigMode>('build')
```

Add a tab bar at the top of the RIGHT pane (not the left pane):
[ Build your own ]  [ Ready-made ]

Both tabs: font-mono text-xs uppercase tracking-wider. Active tab: border-b-2 border-ink. Inactive: text-muted, no border.

When mode === 'build': show the existing shape catalog grid.
When mode === 'presets': show the preset gallery (see Step 3).

The left pane (stack, color picker, system selectors, price, add to cart) is always visible regardless of mode.

---

## Step 3 — Preset gallery

Import `TOTEM_PRESETS` from '@/lib/totem-config'.

When mode === 'presets', render a grid of preset cards (1 col mobile, 2 col desktop):

Each card:
- Preset name in font-display text-lg
- Preset description in font-mono text-xs text-muted
- A mini visual preview — a vertical stack of small colored squares (one per piece, 12×12 each, stacked with 2px gap, max 7 shown, overflow indicated with "+N more" label)
- Price in font-mono text-sm — `€${calcTotemPrice({ pieces: preset.pieces.map((p, i) => ({ uid: String(i), shapeId: p.shapeId, colorId: p.colorId })), fixationId: preset.fixationId, cableId: preset.cableId })}`
- A "Use this" button (secondary variant or a styled text button)

On clicking "Use this" for a preset:
1. Map `preset.pieces` to `LocalPiece[]` with generated uids
2. Set `pieces` to the new array
3. Set `fixationId` to `preset.fixationId`
4. Set `cableId` to `preset.cableId`
5. Set `selectedUid` to null
6. Switch mode back to 'build' (so customer sees their stack and can customise)

The mode switch to 'build' allows natural continuation — the preset populates the stack and the customer can immediately tweak it. No confirmation step needed.

---

## Step 4 — Visual preview pane (optional column on wide screens)

On desktop (lg and above), add a third column between the left stack pane and right catalog pane, showing a live visual representation of the lamp:
┌──────────┬────────────────┬──────────────────┐
│  Stack   │  Visual        │  Shape Catalog   │
│  (left)  │  Preview       │  (right)         │
│          │  (center)      │                  │
└──────────┴────────────────┴──────────────────┘

On mobile and tablet (below lg): hide the preview column entirely. The grid stays 2-column.

**The visual preview:**

A vertical stack of colored rectangular blocks, centered horizontally, one block per piece. Bottom to top order (same as reading the lamp from base to top).

Each block:
- Width: 40px
- Height: varies by shape — use a simple lookup:
  - arch: 56px, dome: 48px, cylinder: 40px, cone: 52px, wave: 44px, sphere: 48px, torus: 32px, prism: 44px
- Background: the piece's color hex from TOTEM_COLORS
- 2px gap between blocks
- No border radius (consistent with design system)
- The selected piece gets a 2px ring (ring-1 ring-ink) around its block

The preview should be vertically centered in the column with a minimum height that accommodates the maximum realistic stack (say 10 pieces × 56px + gaps = ~600px). Use `min-h-[600px] flex flex-col-reverse items-center justify-start gap-0.5`.

Note: `flex-col-reverse` because we append pieces to the bottom of the lamp but React array order is top-first, so reversing the flex direction renders array[0] at the top visually.

If `pieces.length === 0`: show a vertical dashed line (border-l-2 border-dashed border-stroke, height 200px) centered in the column, representing an empty ceiling cable.

---

## Step 5 — Polish TotemCartGroup

Read the current `src/components/cart/TotemCartGroup.tsx` before editing.

**Collapsed state** (default):
┌────────────────────────────────────────────────┐
│  TOTEM                         €XX.XX      ❯   │
│  Arch · Dome · Wave + 2 more                   │
│  Chalk · Rosette · Black textile               │
└────────────────────────────────────────────────┘

- "TOTEM" in font-display uppercase tracking-tight text-lg
- Price right-aligned in font-mono text-sm
- ChevronRight icon (rotates 90° to ChevronDown when expanded)
- Line 2: shape names joined with ' · ', truncated if >3 pieces with "+ N more"
- Line 3: system summary — fixation name + cable name from visible (non-underscore) attributes

Build the summary strings by reading `line.attributes` for visible keys (keys not starting with `_`):
- Shape names come from lines where a 'Shape' attribute exists
- Fixation comes from the line where a 'Fixation' attribute exists
- Cable comes from the line where a 'Cable' attribute exists

**Expanded state:**

Each line in the group renders as a sub-row:
Arch                    Chalk          €28.00
Dome                    Stone          €34.00
Rosette (fixation)                     €12.00
Black textile (cable)                  €8.00

- Shape/fixation/cable name from visible attributes (left), color from visible attribute (center), line price (right)
- `text-xs font-mono` throughout
- `py-2 border-b border-stroke last:border-b-0`
- Subtle `pl-4` indent on sub-rows to visually nest under the header

No quantity controls, no remove button — the entire bundle is removed as one unit (future feature). Add a small "Remove" text link at the bottom of the expanded group that removes all lines sharing the `_build_id`. Use `useCart().removeItem()` called for each line id in the group.

---

## Step 6 — Smooth add-to-cart feedback

In `TotemConfigurator`, after a successful `addBundle()` call:
1. Clear the pieces array — `setPieces([])`
2. Reset `selectedUid` to null
3. Set mode back to 'build'
4. The cart drawer opens automatically (handled by `addBundle` → `openCart` inside `useCart`)

This gives a clean "order placed, start fresh" feeling after adding to cart.

---

## Completion checklist

- Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors required
- Confirm: mode tabs switch between shape catalog and preset gallery
- Confirm: clicking a preset populates the stack and switches to build mode
- Confirm: visual preview updates live as shapes are added/reordered/recolored
- Confirm: TotemCartGroup collapsed view shows correct shape/color/system summary
- Confirm: TotemCartGroup expanded view shows individual lines with correct attributes
- Confirm: Remove link in expanded group removes all bundle lines
- Confirm: After adding to cart, configurator resets to empty state
- Update docs/STATUS.md — mark TOTEM Phase 3 done
- Commit: `feat: totem phase 3 — presets, visual preview, cart group polish`