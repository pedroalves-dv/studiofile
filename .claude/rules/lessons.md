# Lessons & Correction History

- Whenever a mistake is corrected, record the pattern here.
- Rule: Avoid [Previous Mistake X] by doing [Solution Y].
- Example: Avoid forgetting to add `{ cache: 'no-store' }` to auth-related fetches by always checking the "Auth" section of the Shopify rules before writing auth code.

## Mobile Viewport — Never use JS to lock viewport height

**Mistake**: Setting `--svh-100` via inline `<script>` and a resize listener to lock `window.innerHeight` into a CSS variable, then using that variable for all viewport-height layout.

**Why it failed**: If the page loaded with browser chrome hidden, the lock captured the large viewport. When scrolling triggered chrome to appear, Lenis detected the real (smaller) viewport — but CSS layout was still sized to the locked (larger) value. This caused a double-layout shift on scroll, the opposite of what was intended.

**Solution**: Use the native CSS viewport units the browser provides. See @.claude/rules/mobile.md for the full ruleset. Never reach for JavaScript to solve a problem the browser already solves with `dvh`/`svh`.

## Mobile Scroll — `dvh` on layout-contributing heights causes Lenis jumps

**Mistake**: Using `dvh` (or `window.innerHeight`) for `min-height` sections, image-block heights, and content containers that sit inside a Lenis-scrolled page.

**Why it failed**: As the user scrolls and browser chrome hides, `dvh` increases. Any element with a `dvh`-based height grows — cumulatively this can add 400–600 px to the page mid-scroll. Lenis loses sync with the new page height and visibly jumps sections. Separately, a content container using `dvh` inside a `svh`-capped sticky parent overflows it, making `justify-center` mis-center the content.

**Solution**:
- Use `svh` for all `min-height` section utilities and image-block heights. `svh` is stable (never changes with chrome).
- Content containers inside a `svh`-height sticky parent should use `h-full`, not a viewport-unit class.
- Use CSS `calc()` with `svh` for font sizes that depend on viewport height (e.g. `.hero-stack-fit`). Never use `window.innerHeight` for font sizing — it changes and causes jumps.
