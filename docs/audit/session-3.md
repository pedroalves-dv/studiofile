# Session 3 — Totem Configurator

## Fixed this session
- [I-2] src/components/cart/TotemCartGroup.tsx — JSON.parse failure on malformed _pieces_config bypassed per-line fallback, user permanently stuck on Edit
- [I-3] src/components/cart/TotemCartGroup.tsx:99-105 — localStorage written before removeBundleItems resolves (also Session 2 [I-1])

## Deferred — fix in final pass
### IMPORTANT
- [I-1] src/components/product/TotemConfigurator.tsx — configAvailable optimistically true while variantMap loading, Add to Cart button enabled before stock known. Fix: add variantMapLoading boolean, include in disabled condition.

### MINOR
- [M-1] src/components/product/TotemConfigurator.tsx — AbortController signal never passed to variant-map fetch(), leaks on unmount
- [M-2] src/components/product/TotemConfigurator.tsx — isPresetAvailable hardcodes "beige" instead of TOTEM_COLORS[0].id
- [M-3] src/components/cart/TotemCartGroup.tsx:229 — ArrowButton "Remove bundle" and "Edit" missing rounded-md
- [M-4] src/lib/virtual-products.ts — "From €72" doesn't match actual minimum price (€48). Needs product decision before changing.
- [M-5] src/lib/totem-config.ts — stale comment about "temporary color mappings" referencing old color names (chalk, stone, clay)
- [M-6] src/lib/totem-config.ts — rail fixation placeholder comment unresolved, verify price/height before launch
- [M-7] src/hooks/useCart.ts (addTotemToCart) — localStorage config not cleared after successful add. Intentional or not? Product decision needed before fixing.
- [M-8] src/components/product/TotemConfigurator.tsx — catalogLoading skeleton hardcodes TOTEM_SHAPES.length (2), causes layout jump when more shapes added
