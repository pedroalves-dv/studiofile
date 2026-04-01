# Concerns

1. CSS variables as your single source of truth. You're already doing this well with --header-height. Never hardcode pixel values in JS — always read from CSS variables like you're now doing in the snap hook. When you redesign the header, one CSS change propagates everywhere.
2. Keep hooks small and single-purpose. useScrollSnap, useReducedMotion — each does one thing. This is exactly right. Claude Code can find, understand, and modify a 30-line hook trivially. It struggles with 300-line components that do five things.
3. data-\* attributes as your JS/CSS interface. Using data-snap instead of class names or refs to communicate between CSS and JS behavior is a clean industry pattern. Extend it — data-parallax, data-animate-in, etc. It keeps your markup semantic and your behavior discoverable.
4. The one real risk in your current stack is your Hero component — 400dvh with hardcoded pixel inputRange values for parallax. Those numbers will break the moment section heights change. Before launch, those ranges should be calculated dynamically from element positions, not hardcoded. Flag that for later.
   The stack and patterns you have are genuinely solid. The tape-and-string risk on this project isn't architectural — it's content-related (hardcoded values, magic numbers). Keep those out and you'll be fine.

## Jumbled TODO items list

-
