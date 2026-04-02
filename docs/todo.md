# Concerns

1. CSS variables as your single source of truth. You're already doing this well with --header-height. Never hardcode pixel values in JS — always read from CSS variables like you're now doing in the snap hook. When you redesign the header, one CSS change propagates everywhere.
2. Keep hooks small and single-purpose. useScrollSnap, useReducedMotion — each does one thing. This is exactly right. Claude Code can find, understand, and modify a 30-line hook trivially. It struggles with 300-line components that do five things.
3. data-\* attributes as your JS/CSS interface. Using data-snap instead of class names or refs to communicate between CSS and JS behavior is a clean industry pattern. Extend it — data-parallax, data-animate-in, etc. It keeps your markup semantic and your behavior discoverable.
4. The one real risk in your current stack is your Hero component — 400dvh with hardcoded pixel inputRange values for parallax. Those numbers will break the moment section heights change. Before launch, those ranges should be calculated dynamically from element positions, not hardcoded. Flag that for later.
   The stack and patterns you have are genuinely solid. The tape-and-string risk on this project isn't architectural — it's content-related (hardcoded values, magic numbers). Keep those out and you'll be fine.

## Backup Ideas Worth trying at some point

### HeroContent.tsx

- Approach 2: SVG <text textLength> (typographically correct)
  SVG has a W3C-standard attribute designed exactly for this: textLength tells the browser to fit text into an exact pixel width. With lengthAdjust="spacing", it adjusts inter-character spacing (no glyph distortion). With spacingAndGlyphs, it also stretches glyphs.

Pixel-perfect, browser-native — the SVG renderer handles all ink bounds internally
No canvas, no JS measurement, no font metric math
Zero glyph distortion (with lengthAdjust="spacing")
Trade-off: moves from HTML <h1> to SVG <text> — changes the rendering context, requires rethinking how motion animates the letters (SVG transforms vs CSS transforms)

<svg viewBox={`0 0 ${available} ${fontSize}`} width={available} height={fontSize}>
<text
textLength={available}
lengthAdjust="spacing"
font-family="Noka"
font-size={fontSize}
y={fontSize \* 0.85} // baseline offset

>

    TOTEM

  </text>
</svg>
