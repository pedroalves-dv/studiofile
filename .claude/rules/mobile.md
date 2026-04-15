# Mobile Layout Ruleset

## The Viewport Unit Hierarchy

Three CSS units exist specifically to handle mobile browser chrome (address bar + bottom toolbar) appearing and hiding:

| Unit | Measures | Use for |
|---|---|---|
| `100dvh` | Current actual viewport (dynamic) | **Section containers** — they breathe naturally |
| `100svh` | Smallest possible viewport (chrome always visible) | **Content inside sections** — never clipped |
| `100lvh` | Largest possible viewport (chrome always hidden) | Rarely useful directly |

**The golden rule:**
- Outer shell / section → `svh` for min-heights (stable, no Lenis jumps)
- Inner content / sticky panels → `svh` (never clipped)
- `dvh` only for isolated, non-layout-shifting elements (e.g. exact-height sticky panels that don't affect page total height)

> **Warning**: Using `dvh` on `min-height` sections or image-block heights causes the page to grow mid-scroll as browser chrome hides. This desyncs Lenis and causes visible section jumps. Always prefer `svh` for layout-contributing heights.

## Established Utility Classes

| Class | Value | Purpose |
|---|---|---|
| `.section-h` | `height: calc(100dvh - var(--header-height))` | Full-height section (desktop only — avoid on mobile scroll flow) |
| `.section-min-h` | `min-height: calc(100svh - var(--header-height))` | Min-height section, content can grow — `svh` keeps page height stable |
| `.section-centered` | `min-height: calc(100svh - var(--header-height))` | Content centering — always fits |
| `.sticky-hero-h` | `height: calc(100svh - var(--header-height))` | Hero sticky panel — never clipped |
| `.sticky-gallery-h` | `height: calc(100svh - var(--header-height) - (2 * var(--page-pt)))` | Product gallery sticky |
| `.h-screen-safe` | `height: 100svh` | Full-viewport image blocks — `svh` prevents layout shifts |
| `.pb-safe` | `padding-bottom: max(env(safe-area-inset-bottom, 0px), 1rem)` | Home indicator clearance only |

## Rules

1. **Never use JavaScript to read or lock `window.innerHeight`** for layout purposes. The browser's native CSS units handle this correctly and without the mismatch risk.

2. **`env(safe-area-inset-bottom)` covers the home indicator only (~34px)**. It does NOT cover the browser toolbar. `svh` handles toolbar clearance automatically — do not add extra padding for it.

3. **Fixed overlays (modals, drawers, mobile nav)** should use `position: fixed; top: X; bottom: 0` — the browser stretches and tracks the real viewport bottom automatically. Do not use `min-height` or `section-min-h` on overlays.

4. **`overflow-y: auto`** on any overlay that uses `fixed bottom-0` — graceful scrollable fallback if content is taller than the viewport.

5. **`viewportFit: "cover"`** is set in `layout.tsx` and must stay — it enables `env(safe-area-inset-*)` to work on notched iPhones.

## What NOT to do

- Do not use `100vh` anywhere — it equals `lvh` and ignores the bottom toolbar on iOS Chrome.
- Do not set `--svh-100` or any custom viewport height variable from JavaScript.
- Do not use `max(env(safe-area-inset-bottom), 80px)` or any hardcoded large value — 80px is a hack that doesn't generalize.
- Do not filter resize events by "width only" to protect a JS-locked value — if there's no JS lock, this guard is irrelevant.
