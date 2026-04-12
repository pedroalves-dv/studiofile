# Standards

1. CSS variables as your single source of truth. You're already doing this well with --header-height. Never hardcode pixel values in JS — always read from CSS variables like you're now doing in the snap hook. When you redesign the header, one CSS change propagates everywhere.
2. Keep hooks small and single-purpose. useScrollSnap, useReducedMotion — each does one thing. This is exactly right. Claude Code can find, understand, and modify a 30-line hook trivially. It struggles with 300-line components that do five things.
3. data-\* attributes as your JS/CSS interface. Extend it — data-parallax, data-animate-in, etc. It keeps your markup semantic and your behavior discoverable.
