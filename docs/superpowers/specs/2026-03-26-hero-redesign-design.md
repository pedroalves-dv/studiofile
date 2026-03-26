# Hero Redesign — Sticky Columns

**Date:** 2026-03-26
**Status:** Approved

---

## Problem

The current hero is a single-viewport section with a static 3-column color background (light/lighter/light) behind the TOTEM title animation. It doesn't scroll, doesn't show images, and doesn't take advantage of the cinematic potential of the section.

## Goal

Transform the hero into a tall, scroll-driven section where:
- Placeholder image columns fill the background and scroll naturally with the page
- The TOTEM title stays visually centered (sticky) as the images scroll behind it
- Mobile and small viewports are unaffected — no extra scroll burden

---

## Design Decisions

| Question | Decision |
|----------|----------|
| Sticky mechanism | Pure CSS `position: sticky` — no JS |
| TOTEM title backing | Bare — letters sit directly over images |
| Column count | 0 on mobile/sm · 2 on md+ · 3 on xl+ |
| Column gap | Flush — no gap |
| Column rhythm | Staggered — each column offset vertically |
| Image height | `h-dvh` (one full viewport per image) |

---

## Architecture

Only `src/app/(main)/page.tsx` changes. The `Hero()` function is rewritten. `HeroContent.tsx` is untouched.

**Important:** The existing `<section>` has `overflow-hidden w-full section-centered` classes which must be removed. The new `<section>` uses `relative w-full min-h-dvh md:h-[300dvh]` — no `overflow-hidden` on the section itself (see Implementation Notes).

### Section structure

```
<section> (relative, w-full, min-h-dvh · md:h-[300dvh])
  │
  ├── <div> (absolute inset-0, hidden md:flex, overflow-hidden)   ← columns wrapper
  │     ├── Column 1 — flex-1, flex-col, no offset
  │     │     ├── <div h-dvh bg-light />      ← placeholder image 1
  │     │     ├── <div h-dvh bg-lighter />    ← placeholder image 2
  │     │     └── <div h-dvh bg-light />      ← placeholder image 3
  │     ├── Column 2 — flex-1, flex-col, pt-[50dvh]
  │     │     ├── <div h-dvh bg-lighter />
  │     │     ├── <div h-dvh bg-light />
  │     │     └── <div h-dvh bg-lighter />
  │     └── Column 3 — hidden xl:flex, flex-1, flex-col, pt-[100dvh]
  │           ├── <div h-dvh bg-light />
  │           ├── <div h-dvh bg-lighter />
  │           └── <div h-dvh bg-light />
  │
  ├── <div> (absolute inset-0 md:hidden bg-light)   ← mobile fallback background
  │
  └── <div> (sticky top-0 z-10)   ← in normal flow; sticky is unconditional (see note)
        └── <HeroContent />       ← unchanged, centers itself via section-centered
```

### Color assignment

Each column alternates `bg-light` / `bg-lighter` to provide subtle visual variety. Both are existing tokens: `bg-light` = `#b4b0ac`, `bg-lighter` = `#eeeeee`. Columns start on opposite values so adjacent columns never share the same shade at their visible boundary.

### Sticky mechanic

The sticky wrapper is in **normal document flow** (not absolute). The section's explicit `h-[300dvh]` gives the sticky element room to stick:

- Sticky element height ≈ `calc(100dvh − var(--header-height))` (driven by `HeroContent`'s `section-centered`)
- Sticky range ≈ `300dvh − calc(100dvh − header-height)` ≈ 200dvh+ of scroll where TOTEM is pinned
- After that range, the sticky releases and the TOTEM scrolls off the top as `ProductSpotlight` enters from below

On mobile/sm, `position: sticky` is applied but never activates meaningfully — the section is only `min-h-dvh` (≈1 viewport), equal to the sticky element height, so there is no scroll range for sticking. This is intentional and harmless; conditionalising the class to `md:sticky` is unnecessary complexity.

### Stagger mechanic

Columns are offset via `padding-top` on their container `<div>`:

| Column | Tailwind class | Offset |
| ------ | ------------- | ------ |
| 1 | `md:flex` | none |
| 2 | `md:flex` (visible md+) | `pt-[50dvh]` |
| 3 | `xl:flex` (hidden below xl) | `pt-[100dvh]` |

**Overflow clipping:** The columns wrapper is `absolute inset-0` with `overflow-hidden`. This clips the wrapper at the section's `300dvh` boundary:

- Column 2 total content height: `3 × 100dvh + 50dvh = 350dvh` → 50dvh clipped at bottom
- Column 3 total content height: `3 × 100dvh + 100dvh = 400dvh` → 100dvh clipped at bottom

The clipped portions are the tail end of the last image in each staggered column. They are never visible during the scroll range anyway (the sticky element un-sticks before the section ends), so no content is lost. **3 images per column is the correct count:** the scroll window is ~200dvh, Column 1 needs 2 images to fill it with 1 in reserve; Columns 2 and 3 have their first image partially in view at scroll=0 (due to stagger), so 3 images apiece provides full visual coverage across the entire scroll range.

### Mobile behavior

On mobile/sm, all columns are `hidden`. The `absolute inset-0 md:hidden bg-light` div provides a solid background. The section is `min-h-dvh`. The sticky wrapper and `HeroContent` behave as a normal centered section — identical to the previous design.

---

## Files

| File | Change |
|------|--------|
| `src/app/(main)/page.tsx` | Rewrite `Hero()` function only |
| `src/components/home/HeroContent.tsx` | **No changes** |
| `src/app/globals.css` | **No changes** |
| `tailwind.config.ts` | **No changes** |

---

## Implementation Notes

- **Do not** add `overflow-hidden` to the `<section>` — this would break `position: sticky` by making the section the scroll boundary. The `overflow-hidden` belongs on the `absolute inset-0` columns wrapper only.
- **Remove** the existing `overflow-hidden` and `section-centered` classes from the current `<section>` tag during the rewrite.
- The inner `sticky top-0` wrapper has no explicit height — it expands to fit `HeroContent`'s `section-centered` content, which uses `min-height: calc(100dvh - var(--header-height))`. This correctly accounts for the fixed header overlay.
- Column placeholder `<div>` elements are `h-dvh w-full` with a background color. Future `next/image` fills will replace them without structural changes.
- `HeroContent`'s existing animation (two-phase TOTEM letter fall + spring) is fully preserved.

---

## Verification

1. Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run dev` and open `http://localhost:3000`
2. **Desktop xl (≥1280px):** Scroll slowly through the home page — TOTEM should stay centered while 3 staggered columns of placeholder images scroll behind it
3. **Sticky release:** Scroll to approximately 200dvh past the hero top — the TOTEM title should start scrolling off the top of the viewport (not disappear suddenly), and `ProductSpotlight` should enter from below
4. **md (768–1279px):** Resize to tablet — verify 2 columns visible, 3rd column hidden, sticky behavior preserved
5. **Mobile (<768px):** Resize to mobile — verify all columns hidden, hero shows a single `bg-light` background at normal viewport height, no extra scroll
6. Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors
