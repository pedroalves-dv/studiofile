# TOTEM OOS Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish three OOS UX gaps in the TOTEM configurator: preset locking, viewer whitespace click, and color swatch tooltip.

**Architecture:** All changes are isolated to `src/components/product/TotemConfigurator.tsx`. No new files. Three independent changes applied in sequence — each is a self-contained commit.

**Tech Stack:** React (client component), Tailwind CSS, existing `useClickOutside` hook, existing `Tooltip` component.

---

## File Map

| File | Role | Change |
|------|------|--------|
| `src/components/product/TotemConfigurator.tsx` | Main configurator component | All three changes |
| `src/hooks/useClickOutside.ts` | Click-outside hook | Import only (not modified) |
| `src/components/ui/Tooltip.tsx` | Tooltip component | Import already present (not modified) |
| `src/lib/totem-config.ts` | Preset/color constants and types | Import `TotemPreset` type only (not modified) |

---

## Task 1 — OOS Color Swatch: Tooltip + Cursor

**File:** `src/components/product/TotemConfigurator.tsx`

The color swatch for OOS colors currently has `pointer-events-none` directly on the `<button>`, which silently swallows hover. The fix wraps OOS swatches in a two-layer structure so the cursor and Tooltip fire correctly.

- [ ] **Step 1: Locate the color palette render block**

  Find this block (around line 1019–1047):

  ```tsx
  {TOTEM_COLORS.map((c) => {
    const colorAvailable = fixtureSelected
      ? isfixtureColorAvailable(fixtureId, c.id)
      : selectedPiece
        ? isColorAvailableForShape(selectedPiece.shapeId, c.id)
        : true;
    return (
      <button
        key={c.id}
        type="button"
        aria-label={c.name}
        aria-disabled={!colorAvailable}
        onClick={(e) => {
          e.stopPropagation();
          if (colorAvailable) applyColor(c.id);
        }}
        className={cn(
          "w-7 h-7 transition-all",
          activeColorId === c.id
            ? "ring-1 ring-ink ring-offset-1"
            : colorAvailable
              ? "ring-1 ring-transparent hover:ring-stroke"
              : "ring-1 ring-transparent",
          !colorAvailable &&
            "opacity-30 cursor-not-allowed pointer-events-none",
        )}
        style={{ backgroundColor: c.hex }}
      />
    );
  })}
  ```

- [ ] **Step 2: Replace with the two-layer OOS structure**

  Replace the entire `return (...)` inside the `.map()` with:

  ```tsx
  if (colorAvailable) {
    return (
      <button
        key={c.id}
        type="button"
        aria-label={c.name}
        onClick={(e) => {
          e.stopPropagation();
          applyColor(c.id);
        }}
        className={cn(
          "w-7 h-7 transition-all",
          activeColorId === c.id
            ? "ring-1 ring-ink ring-offset-1"
            : "ring-1 ring-transparent hover:ring-stroke",
        )}
        style={{ backgroundColor: c.hex }}
      />
    );
  }
  return (
    <div key={c.id} className="cursor-not-allowed">
      <Tooltip content="Out of stock" position="top">
        <button
          type="button"
          aria-label={c.name}
          aria-disabled
          className="w-7 h-7 ring-1 ring-transparent opacity-40 pointer-events-none"
          style={{ backgroundColor: c.hex }}
        />
      </Tooltip>
    </div>
  );
  ```

  **Why this works:** `pointer-events-none` on the inner `<button>` makes mouse events pass through to the outer `<div>`. The outer `<div>` receives the hover → `cursor-not-allowed` applies correctly + Tooltip's `group-hover` fires. Clicks are still blocked by `pointer-events-none` on the button.

- [ ] **Step 3: Run type-check**

  ```bash
  PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
  ```

  Expected: zero errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/product/TotemConfigurator.tsx
  git commit -m "feat: add OOS tooltip and cursor-not-allowed to color swatches"
  ```

---

## Task 2 — Viewer Whitespace: Click Outside to Deselect

**File:** `src/components/product/TotemConfigurator.tsx`

Remove the catch-all `onClick` from the viewer container (whitespace clicks no longer deselect). Replace with `useClickOutside` so clicking _outside_ the viewer still deselects.

- [ ] **Step 1: Add the `useClickOutside` import**

  Find the existing hook imports near the top of the file (around line 21):

  ```typescript
  import { useMediaQuery } from "@/hooks/useMediaQuery";
  ```

  Add the new import directly after it:

  ```typescript
  import { useMediaQuery } from "@/hooks/useMediaQuery";
  import { useClickOutside } from "@/hooks/useClickOutside";
  ```

- [ ] **Step 2: Add the `clearSelection` callback and hook call**

  Find the comment `/* ── Touch drag-to-reorder ── */` (around line 259). Add the following two lines just before it:

  ```typescript
  const clearSelection = useCallback(() => setSelectedElement(null), []);
  useClickOutside(viewerRef, clearSelection);

  /* ── Touch drag-to-reorder ── */
  ```

  **Why `useCallback`:** `useClickOutside` has `[ref, handler]` as deps. Without memoisation, a new function reference on every render would re-attach the event listener on every render. `setSelectedElement` from `useState` is stable, so the empty deps array `[]` is correct.

- [ ] **Step 3: Remove the `onClick` from the viewer div**

  Find the viewer container div (around line 516–519):

  ```tsx
  <div
    ref={viewerRef}
    className="relative bg-white border border-ink rounded-md col-span-2 cursor-default sm:sticky sm:top-[calc(2*(var(--header-height)))] flex flex-col h-[480px] sm:h-[680px] mb-6"
    onClick={() => setSelectedElement(null)}
  >
  ```

  Remove the `onClick` prop:

  ```tsx
  <div
    ref={viewerRef}
    className="relative bg-white border border-ink rounded-md col-span-2 cursor-default sm:sticky sm:top-[calc(2*(var(--header-height)))] flex flex-col h-[480px] sm:h-[680px] mb-6"
  >
  ```

- [ ] **Step 4: Run type-check**

  ```bash
  PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
  ```

  Expected: zero errors.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/product/TotemConfigurator.tsx
  git commit -m "fix: clicking viewer whitespace no longer deselects — use click-outside instead"
  ```

---

## Task 3 — Preset OOS Locking

**File:** `src/components/product/TotemConfigurator.tsx`

Add an availability check for presets and disable/grey-out unavailable preset cards.

- [ ] **Step 1: Import `TotemPreset` type**

  Find the import block from `@/lib/totem-config` (around line 23–35):

  ```typescript
  import {
    TOTEM_SHAPES,
    TOTEM_COLORS,
    TOTEM_fixtureS,
    TOTEM_CABLES,
    TOTEM_PRESETS,
    COLOR_MAP,
    calcTotemPrice,
    type TotemShape,
    type Totemfixture,
    type TotemCable,
    type TotemPiece,
  } from "@/lib/totem-config";
  ```

  Add `type TotemPreset` to the list:

  ```typescript
  import {
    TOTEM_SHAPES,
    TOTEM_COLORS,
    TOTEM_fixtureS,
    TOTEM_CABLES,
    TOTEM_PRESETS,
    COLOR_MAP,
    calcTotemPrice,
    type TotemShape,
    type Totemfixture,
    type TotemCable,
    type TotemPiece,
    type TotemPreset,
  } from "@/lib/totem-config";
  ```

- [ ] **Step 2: Add the `isPresetAvailable` helper**

  Find the end of the availability helpers block (around line 252–257):

  ```typescript
  function isfixtureFullyUnavailable(fxId: string): boolean {
    if (!variantMap) return false;
    return TOTEM_COLORS.every(
      (c) => !variantMap.shapes[`${fxId}-${c.id}`]?.available,
    );
  }
  ```

  Add the new helper immediately after:

  ```typescript
  function isPresetAvailable(preset: TotemPreset): boolean {
    if (!variantMap) return true; // optimistic while loading
    return (
      preset.pieces.every((p) =>
        isColorAvailableForShape(p.shapeId, p.colorId),
      ) &&
      isfixtureColorAvailable(preset.fixtureId, TOTEM_COLORS[0].id) &&
      isCableAvailable(preset.cableId)
    );
  }
  ```

  **Why `TOTEM_COLORS[0].id`:** `applyPreset()` always calls `setfixtureColorId(TOTEM_COLORS[0].id)` (i.e., `"beige"`). The preset has no stored fixture color, so `"beige"` is the effective fixture color after applying any preset.

- [ ] **Step 3: Update the preset card render**

  Find the preset card map block (around line 1134–1180):

  ```tsx
  {TOTEM_PRESETS.map((preset) => {
    const presetPrice = presetPrices.get(preset.id) ?? 0;
    return (
      <div
        key={preset.id}
        className="bg-white border border-stroke rounded-md flex flex-col gap-3 p-4"
      >
        <div>
          <h3 className="font-bold tracking-tight text-lg">
            {preset.name}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {preset.description}
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {preset.pieces.map((p, i) => {
            const color = COLOR_MAP.get(p.colorId);
            return (
              <span
                key={i}
                className="w-3 h-3 inline-block"
                style={{
                  backgroundColor: color?.hex ?? "#F2F0EB",
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-sm">€{presetPrice}</p>
          <button
            type="button"
            onClick={() => {
              if (pieces.length > 0) {
                setPendingPresetId(preset.id);
              } else {
                applyPreset(preset.id);
              }
            }}
            className="text-sm border border-ink px-3 py-1.5 hover:bg-lighter transition-colors rounded-md"
          >
            Use
          </button>
        </div>
      </div>
    );
  ```

  Replace with:

  ```tsx
  {TOTEM_PRESETS.map((preset) => {
    const presetPrice = presetPrices.get(preset.id) ?? 0;
    const presetAvailable = isPresetAvailable(preset);
    return (
      <div
        key={preset.id}
        className={cn(
          "bg-white border border-stroke rounded-md flex flex-col gap-3 p-4",
          !presetAvailable && "opacity-60",
        )}
      >
        <div>
          <h3 className="font-bold tracking-tight text-lg">
            {preset.name}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {preset.description}
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {preset.pieces.map((p, i) => {
            const color = COLOR_MAP.get(p.colorId);
            return (
              <span
                key={i}
                className="w-3 h-3 inline-block"
                style={{
                  backgroundColor: color?.hex ?? "#F2F0EB",
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <p className="text-sm">€{presetPrice}</p>
            {!presetAvailable && (
              <span className="text-xs text-muted">Out of stock</span>
            )}
          </div>
          {presetAvailable ? (
            <button
              type="button"
              onClick={() => {
                if (pieces.length > 0) {
                  setPendingPresetId(preset.id);
                } else {
                  applyPreset(preset.id);
                }
              }}
              className="text-sm border border-ink px-3 py-1.5 hover:bg-lighter transition-colors rounded-md"
            >
              Use
            </button>
          ) : (
            <div className="cursor-not-allowed">
              <Tooltip content="Out of stock" position="top">
                <button
                  type="button"
                  disabled
                  className="text-sm border border-ink px-3 py-1.5 rounded-md opacity-50 pointer-events-none"
                >
                  Use
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    );
  ```

- [ ] **Step 4: Run type-check**

  ```bash
  PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check
  ```

  Expected: zero errors.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/product/TotemConfigurator.tsx
  git commit -m "feat: disable OOS preset cards with tooltip and greyed-out state"
  ```

---

## Final Verification Checklist

- [ ] **Color swatches:** Hover over an OOS swatch → `cursor-not-allowed` appears + "Out of stock" tooltip fires. Clicking does nothing. Available swatches unchanged.
- [ ] **Viewer whitespace:** Select a piece. Click on empty white space inside the viewer → piece stays selected. Click anywhere outside the viewer (page header, below the configurator, etc.) → selection clears.
- [ ] **Preset cards:** If a preset has an OOS piece/cable/fixture color → card is greyed out (`opacity-60`), "Out of stock" label appears below price, "Use" button is disabled + shows "Out of stock" tooltip on hover. Available presets are unaffected.
- [ ] **Type-check:** `npm run type-check` → zero errors.
