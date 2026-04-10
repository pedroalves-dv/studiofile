# docs/IDEAS.md — Creative & Future Roadmap

## Typographically Perfect Hero Text (SVG Approach)

Concept: Switch from standard <h1> to SVG <text> with textLength and lengthAdjust="spacing".
Why: Ensures the word "TOTEM" perfectly fits the container width across all screen sizes without font metric math or glyph distortion.

Implementation Strategy:

- Context: Moves from HTML layout to SVG rendering.
- Animation: Needs to adapt motion/react from CSS transforms to SVG transforms.

```JavaScript
<svg viewBox={`0 0 ${available} ${fontSize}`} width={available} height={fontSize}>
  <text
    textLength={available}
    lengthAdjust="spacing"
    fontFamily="Noka"
    font-size={fontSize}
    y={fontSize * 0.85} // baseline offset
  >
    TOTEM
  </text>
</svg>
```

## Advanced Parallax & Motion

- Concept: Migrate Hero Parallax from hardcoded 400dvh pixel ranges to dynamic viewport calculations.
- Use useScroll from motion/react.
- Target: Calculate target and offset based on the actual ref of the section to prevent breaking on mobile or screen resize.

## Interactive Design "Quirks"

- Cursor Effects: Custom cursor that morphs into a 3D "wireframe" when hovering over configurator elements.
- Scroll-Triggered Color Shift: Background canvas color subtly morphs based on the most common color in the current TOTEM stack.
- View Transitions: Use the native View Transitions API for seamless navigation between the /shop grid and the /products/[handle] detail page.