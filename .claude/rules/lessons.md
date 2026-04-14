# Lessons & Correction History

- Whenever a mistake is corrected, record the pattern here.
- Rule: Avoid [Previous Mistake X] by doing [Solution Y].
- Example: Avoid forgetting to add `{ cache: 'no-store' }` to auth-related fetches by always checking the "Auth" section of the Shopify rules before writing auth code.

## Mobile Viewport — Never use JS to lock viewport height

**Mistake**: Setting `--svh-100` via inline `<script>` and a resize listener to lock `window.innerHeight` into a CSS variable, then using that variable for all viewport-height layout.

**Why it failed**: If the page loaded with browser chrome hidden, the lock captured the large viewport. When scrolling triggered chrome to appear, Lenis detected the real (smaller) viewport — but CSS layout was still sized to the locked (larger) value. This caused a double-layout shift on scroll, the opposite of what was intended.

**Solution**: Use the native CSS viewport units the browser provides. See @.claude/rules/mobile.md for the full ruleset. Never reach for JavaScript to solve a problem the browser already solves with `dvh`/`svh`.
