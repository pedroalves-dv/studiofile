# TOTEM OOS Polish — Design Spec

**Date:** 2026-03-28
**Scope:** `src/components/product/TotemConfigurator.tsx` only (no other files modified)

---

## Context

Three UX gaps in the TOTEM configurator's OOS handling:

1. **Presets ignore OOS** — Preset cards can be applied even when one or more of their pieces, their fixture color, or their cable is out of stock. The add-to-cart guard catches it later, but the user has no upfront signal.
2. **Viewer whitespace deselects unexpectedly** — The viewer container has a catch-all `onClick` that clears selection on any non-interactive click. This makes the interaction feel fragile; clicking empty space loses your selected piece.
3. **OOS color swatches lack feedback** — Unavailable colors are visually dimmed (`opacity-30`) but have no cursor feedback (`cursor-not-allowed` is invisible due to `pointer-events-none`) and no tooltip explaining why they're unclickable.

---

## Change 1 — Preset OOS Locking

### Availability check

Add a `isPresetAvailable(preset: TotemPreset): boolean` helper inside the component (where `variantMap` is in scope):

```typescript
function isPresetAvailable(preset: TotemPreset): boolean {
  if (!variantMap) return true; // optimistic while loading
  return (
    preset.pieces.every((p) => isColorAvailableForShape(p.shapeId, p.colorId)) &&
    isfixtureColorAvailable(preset.fixtureId, TOTEM_COLORS[0].id) &&
    isCableAvailable(preset.cableId)
  );
}
```

**Why `TOTEM_COLORS[0].id` for fixture?** `applyPreset()` always calls `setfixtureColorId(TOTEM_COLORS[0].id)` (line 465) — presets reset fixture color to "beige". So that is the effective fixture color for any preset.

### UI changes in the preset card

Compute `const presetAvailable = isPresetAvailable(preset)` inside the `.map()`.

When `!presetAvailable`:
- Apply `opacity-60` to the entire card `<div>` (matches the visual weight of disabled shape/fixture buttons)
- Show an `"Out of stock"` text span below the price (small, `text-xs text-muted`)
- Replace the "Use" `<button>` with a disabled variant:
  - Outer `<div className="cursor-not-allowed">` (receives pointer events since child is `pointer-events-none`)
  - Wrapped in `<Tooltip content="Out of stock" position="top">`
  - Inner `<button disabled className="... opacity-50 pointer-events-none">Use</button>`

When `presetAvailable`: no changes — existing button and card render as-is.

---

## Change 2 — Viewer Whitespace Click

### Remove the catch-all onClick

**Line 519** — remove `onClick={() => setSelectedElement(null)}` from the viewer `<div ref={viewerRef}>`.

### Add useClickOutside

Import `useClickOutside` from `@/hooks/useClickOutside` (already exists, not yet used in this file).

Add after existing hooks/effects:

```typescript
const clearSelection = useCallback(() => setSelectedElement(null), []);
useClickOutside(viewerRef, clearSelection);
```

**Behavior after change:**
- Click on whitespace inside viewer → nothing (no deselect)
- Click on a shape → toggle selection (unchanged, shape uses stopPropagation + toggle)
- Click on another shape → selects it (unchanged)
- Click anywhere outside the viewer (page header, scrollable content, etc.) → deselects

`viewerRef` spans the full viewer container (both visual panel and list/action panel), so neither panel triggers deselection on internal clicks.

**Note on event type:** `useClickOutside` listens to `mousedown`, not `click`. This is consistent with how the account dropdown uses it in `Header.tsx`. The drag system uses separate touch listeners and is unaffected.

---

## Change 3 — OOS Color Swatch Tooltip + Cursor

### Root cause

`pointer-events-none` on the swatch element makes the element transparent to pointer events — mouse events (including hover) pass through to the parent. This means:
- `cursor-not-allowed` on the swatch itself is never applied (no pointer events reach it)
- A `<Tooltip>` wrapper cannot fire `group-hover` because the tooltip wrapper div receives the events, not the styled child

### Fix — two-layer wrapper for OOS swatches

```tsx
// OOS color swatch
<div className="cursor-not-allowed">           {/* layer 1: receives hover, shows not-allowed cursor */}
  <Tooltip content="Out of stock" position="top">  {/* layer 2: tooltip fires on hover of this group */}
    <div
      className={cn(
        /* existing swatch classes */,
        "opacity-40 pointer-events-none"           {/* dimmed, click-blocked */}
      )}
      style={{ backgroundColor: color.hex }}
    />
  </Tooltip>
</div>

// Available color swatch (unchanged)
<div
  className={cn(/* existing swatch classes */)}
  onClick={handleColorClick}
  style={{ backgroundColor: color.hex }}
/>
```

- `opacity-40` (up from `opacity-30`) — slightly more legible while still clearly disabled
- `pointer-events-none` remains on the swatch button — no click action possible
- `cursor-not-allowed` on the outer div — pointer events pass through child, outer div gets them, cursor applies correctly
- `Tooltip` fires via the pointer events on the outer div layer

This pattern is applied to **both** the fixture color picker and the piece color picker (both use the same `colorAvailable` flag logic).

---

## Critical Files

- `src/components/product/TotemConfigurator.tsx` — only file modified
- `src/hooks/useClickOutside.ts` — imported (not modified)
- `src/components/ui/Tooltip.tsx` — already imported in configurator (not modified)
- `src/lib/totem-config.ts` — read for `TOTEM_COLORS[0].id` and `TotemPreset` type (not modified)

---

## Verification

1. **Preset OOS:** Set `available: false` on a variant used by a preset in the mock variant map (or rely on real Shopify data). Confirm: card is greyed out, "Use" button is disabled, Tooltip appears on hover. Confirm: available presets are unaffected.
2. **Viewer whitespace:** Select a shape. Click on empty white space in the viewer → selection persists. Click anywhere outside the viewer (e.g., above the header, on page margin) → selection clears.
3. **OOS color cursor:** Hover over an OOS color swatch. Confirm: `cursor-not-allowed` visible. Tooltip saying "Out of stock" appears. Clicking does nothing.
4. **Type-check:** `npm run type-check` — zero errors.
