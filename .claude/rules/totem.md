# TOTEM Configurator Architecture

- **Concept**: Modular lamp stacking. Lines grouped by `_build_id`.
- **Edit Flow**: Reconstruct pieces from attributes -> write to localStorage -> navigate to `/products/totem`.
- **Virtual Product**: Totem is the ONLY virtual product; no Shopify record.
- **Data Flow**: Catalog from `/api/totem-catalog`. Variant map from `/api/totem-variants`.

## Implementation Details

- **Grouping**: Cart lines for one build share a `_build_id`.
- **Rendering**: `CartDrawer` must group by `_build_id` into a `TotemCartGroup`.
- **Presets**: TS constants in `totem-config.ts`, NOT Shopify products.
