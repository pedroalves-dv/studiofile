Read the following files before doing anything else:
- CLAUDE.md
- docs/STATUS.md
- src/components/product/TotemConfigurator.tsx
- src/lib/totem-config.ts
- src/components/cart/TotemCartGroup.tsx

Before editing any file: read it first. Use subagents for any task that requires reading files to gather information before acting.

Scope: Only create or edit the files listed below. Do not touch any other file.

When done:
- Run: PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check — zero errors
- Update docs/STATUS.md — mark TOTEM Phase 3 done
- Tell me what was built and anything deferred or unclear

---

## Goal
Redesign the TotemConfigurator layout around a compound viewer, add a presets tab, add orientation flip per piece, and polish TotemCartGroup. The SVG shape files do not exist yet — use CSS placeholder blocks as stand-ins. Phase 4 will wire in real SVGs.

---

## 1 — Update TotemPiece type

In src/lib/totem-config.ts, add a `flipped` boolean to the TotemPiece interface:

interface TotemPiece {
  uid: string
  shapeId: string
  colorId: string
  flipped: boolean   // ← add this, default false
}

Update TOTEM_PRESETS so each piece object includes `flipped: false`.

calcTotemPrice does not need to change — flipped has no price impact.

---

## 2 — Restructure TotemConfigurator layout

Replace the current two-column layout entirely. The new layout has three sections stacked vertically on mobile, and arranged as described below on desktop.

### Section A — The Compound Viewer

This is the centrepiece of the configurator. It is a single bordered element (border border-stroke) containing two halves side by side on desktop, stacked on mobile.

**Left half — Visual stack**

A vertical column of shape placeholder blocks, one per piece, top to bottom matching the pieces array order.

Each block:
- Width: 80px, centered horizontally in the column
- Height varies by shape:
  - arch: 52px, dome: 44px, cylinder: 64px, cone: 56px, wave: 44px, sphere: 44px, torus: 28px, prism: 52px
- Background: the piece's color hex from TOTEM_COLORS
- border-radius: 4px (slight rounding to look like a physical object, exception to the zero-radius rule)
- 4px gap between blocks
- When flipped: apply `transform: scaleY(-1)` to the block
- When selected: ring-2 ring-ink
- Clicking a block sets selectedUid to that piece's uid
- Drag to reorder: implement HTML5 drag and drop on the blocks. onDragStart sets a dragged uid in local state. onDragOver prevents default. onDrop swaps the dragged piece with the target piece in the pieces array.

If pieces is empty: show a vertical dashed line (w-0.5 border-l-2 border-dashed border-stroke h-40) centered in the column, representing an empty cable drop.

**Right half — Named list with options**

A vertical list, one row per piece, always visible.

Each row:
- Shape name: font-mono text-sm
- Color name: font-mono text-xs text-muted
- ▲ ▼ arrow buttons (ChevronUp / ChevronDown from lucide-react), disabled at bounds
- Flip button: RotateCcw icon from lucide-react, aria-label="Flip shape", toggles flipped boolean for that piece
- Trash2 delete button
- Clicking the row sets selectedUid

When a piece is selected (selectedUid matches), render the color swatches inline at the bottom of the compound viewer element, spanning full width, below both halves. 8 swatches, w-7 h-7 each, ring-1 ring-ink on selected color. Clicking updates that piece's color.

**Mobile behaviour:**
- Left half (visual stack) stacks on top, full width, blocks centered
- Right half (list) below it, full width
- Color swatches still appear at bottom when a piece is selected
- The compound viewer as a whole is full width

---

### Section B — System selectors + Price + Add to Cart

Below the compound viewer. Same as current implementation:
- Fixation dropdown
- Cable dropdown
- Live price (calcTotemPrice)
- Add to Cart button (disabled when pieces.length === 0 || isAdding)
- On successful add: setPieces([]), setSelectedUid(null), setMode('build') — reset to empty state

---

### Section C — Shape catalog with mode tabs

Below Section B. Two tabs at the top:

[ Build your own ]  [ Ready-made ]

Tab styling: font-mono text-xs uppercase tracking-wider. Active: border-b-2 border-ink text-ink. Inactive: text-muted.

**Build your own tab:**
Same shape catalog grid as current — 8 cards, 2 cols mobile / 3 cols desktop. Each card adds a piece with flipped: false as default.

**Ready-made tab:**
Grid of preset cards, 1 col mobile / 2 col desktop. Each card:
- Preset name: font-display text-lg
- Preset description: font-mono text-xs text-muted
- Mini visual preview: a row of small colored squares (w-3 h-3 each) representing the pieces in order, using color hex values
- Price: calcTotemPrice with preset data
- "Use this" button (secondary style)

On clicking "Use this":
- Map preset.pieces to TotemPiece[] with generated uids and flipped: false
- Set pieces, fixationId, cableId from preset
- Set selectedUid to null
- Switch mode to 'build' so customer sees the stack immediately

---

## 3 — Polish TotemCartGroup

In src/components/cart/TotemCartGroup.tsx, read the current file fully before editing.

**Collapsed state:**
- "TOTEM" in font-display uppercase text-lg
- Price right-aligned font-mono text-sm
- ChevronDown icon (rotates when expanded)
- Summary line 1: shape names joined with ' · ', max 3 shown then "+ N more"
- Summary line 2: fixation name + cable name from visible attributes

Build summary by reading line.attributes — filter out keys starting with '_'. Shape lines have a 'Shape' attribute, fixation line has 'Fixation', cable line has 'Cable'.

**Expanded state:**
Sub-rows, pl-4 indent, text-xs font-mono:
- Shape lines: shape name · color name (left), line price (right)
- Fixation line: fixation name (left), price (right)
- Cable line: cable name (left), price (right)
- py-2 border-b border-stroke last:border-b-0

At the bottom of the expanded group: a small "Remove bundle" text button that calls removeItem for each line id in the group. text-xs text-muted hover:text-error.

---

## 4 — Verification

- type-check passes with zero errors
- /products/totem renders the new compound viewer layout
- Adding shapes shows colored placeholder blocks in the visual stack
- Clicking a block or list row selects that piece, color swatches appear
- Changing color updates the block color immediately
- Flip button applies scaleY(-1) to the block
- Drag and drop reorders blocks in the visual stack
- ▲▼ arrows in the list also reorder
- Presets tab shows 4 preset cards, clicking "Use this" populates the stack
- Add to Cart resets the configurator to empty state after success
- TotemCartGroup collapsed and expanded states display correctly
- Normal cart items still work alongside TOTEM groups