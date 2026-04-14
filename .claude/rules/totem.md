# TOTEM

TOTEM is a modular lamp, offered in ready-made presets (made by us) or as a custom build made by the user in the totem configurator.

These TOTEM lamps are not single products in Shopify, we make a bundle or single products to sell them.

The singles products are the **Shapes**, **Fixtures**, and **Cables**.

- **Shapes**: come with color options and texture options.
- **Fixtures**: come with color options and texture options.
- **Cables**: come with style options.

We sell the bundles through the TOTEM page/configurator, as well as the single products (shapes, fixtures, cables) through their respective single product pages.

## TOTEM Configurator Architecture

- **Concept**: Modular lamp stacking. Lines grouped by `_build_id`.
- **Edit Flow**: Reconstruct pieces from attributes -> write to localStorage -> navigate to `/products/totem`.
- **Virtual Product**: Totem is the ONLY virtual product; no Shopify record.
- **Data Flow**: Catalog from `/api/totem-catalog`. Variant map from `/api/totem-variants`.

## Implementation Details

- **Grouping**: Cart lines for one build share a `_build_id`.
- **Rendering**: `CartDrawer` must group by `_build_id` into a `TotemCartGroup`.
- **Presets**: TS constants in `totem-config.ts`, NOT Shopify products.

## Recent Updates

totem-config.ts

Added TotemTexture interface + TOTEM_TEXTURES constant (smooth, fuzzy)
Added textureId: string to TotemPiece and fixtureTextureId: string to TotemBuildConfig
Added textureId/fixtureTextureId to all 4 preset objects (defaulting to "smooth")
TotemConfigurator.tsx

Imports TOTEM_TEXTURES
New fixtureTextureId localStorage state
Migration useEffect that patches old localStorage pieces missing textureId
activeTextureId derived value (parallel to activeColorId)
All 5 availability helpers now take textureId and build the correct 3-part key
addShape finds the first available color+texture combo
applyTexture + setTextureForPiece functions
applyPreset / handleAddToCart / totalPrice / configAvailable all pass texture through
Texture toggle UI (Smooth / Fuzzy buttons) in the bottom picker panel
useCart.ts

Shape key: ${shapeId}-${colorId}-${textureId} (was -${colorId} only)
Fixture key: ${fixtureId}-${fixtureColorId}-${fixtureTextureId} (same fix)
\_texture_id and \_fixture_texture_id cart attributes added
\_pieces_config snapshot now includes textureId per piece
TotemCartGroup.tsx

Both reconstruction paths (snapshot + fallback per-line) default textureId to "smooth" for old cart items
sf-totem-fixture-texture restored to localStorage on edit
