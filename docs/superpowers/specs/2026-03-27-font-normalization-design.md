# Font Normalization — Design Spec

**Date:** 2026-03-27
**Status:** Approved

---

## Context

During development, multiple font utility classes were applied inline across components — `font-body` (Geist Sans), `font-mono` (also Geist Sans, mapped in globals.css), and `font-serif` (Instrument Serif). Now that `font-body` is set as the default on the `body` element in `globals.css`, all of these inline applications are redundant and add noise.

The intended typographic system going forward is:
- **Geist Sans** — everything, inherited from `body` default, no class needed
- **Noka (`font-display`)** — product animations and prominent headings only, applied explicitly

---

## Goal

Strip all redundant font classes from every component so that `font-display` is the only font class that appears in component code. This makes intent unmistakable and cuts significant class noise.

---

## Scope

### Remove

| Class | Instances | Action |
|---|---|---|
| `font-mono` | ~110 | Remove — already mapped to Geist Sans, falls back to body default |
| `font-body` | ~180 | Remove — redundant, body default already set in globals.css |
| `font-serif` | 3 | Remove — `Process.tsx` only; normalize to body |

### Keep untouched

| Class | Instances | Reason |
|---|---|---|
| `font-display` | ~65 | Intentional Noka usage — product titles, section headings, animations |

### Out of scope

- Experimental font tokens in `tailwind.config.ts` (`font-tasa`, `font-hubot`, etc.) — left for future decision
- `globals.css` font variable definitions — not touched
- Any `font-display` instance — not audited in this pass

---

## Files Affected

High-volume files (10+ instances):

- `src/components/product/TotemConfigurator.tsx` — ~35 instances
- `src/app/(main)/account/(protected)/addresses/AddressManager.tsx` — ~23 instances
- `src/components/home/LandingParallaxImages.tsx` — ~8 instances
- `src/components/home/LandingSignup.tsx` — ~9 instances
- `src/app/(main)/about/page.tsx` — ~12 instances
- `src/app/(landing)/coming-soon/page.tsx` — ~6 instances

All other files have 1–5 instances each. Full list derivable by grepping for `font-mono`, `font-body`, `font-serif` across `src/`.

---

## Approach

Pure class removal. No font mapping changes. No visual change (all three removed classes already resolve to Geist Sans at runtime, or to a font the user is deliberately dropping). This is a code-only cleanup.

Implementation should use grep to locate every instance, then remove the class from the `className` string. Where the removed class is the only class on a `className` prop, the prop can be cleaned up accordingly (e.g. `className="font-body"` → no `className`, or merged with existing classes).

---

## Verification

1. Run `PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run type-check` — zero errors
2. Grep for `font-mono`, `font-body`, `font-serif` across `src/` — zero results
3. Grep for `font-display` — results should match pre-change count (~65), none added or removed
4. Visual spot-check: product card, cart drawer, account page, contact form — all should render in Geist Sans as before
