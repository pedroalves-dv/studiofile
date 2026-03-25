/**
 * Maps totem-config string IDs to Shopify variant GIDs.
 * Format: "gid://shopify/ProductVariant/{numeric_id}"
 *
 * Replace all VARIANT_PLACEHOLDER values with real IDs before launch.
 * Each shape is a separate Shopify product; each color is a variant on it.
 *
 * How to find variant GIDs:
 *   Shopify Admin > Products > [shape product] > a variant > copy numeric ID
 *   from the URL, then prefix: "gid://shopify/ProductVariant/{id}"
 *   Or via Admin API: GET /admin/api/2024-01/products/{id}/variants.json
 */

/** key: "{shapeId}-{colorId}" -> Shopify variant GID */
export const SHAPE_COLOR_VARIANT_MAP: Record<string, string> = {
  "arch-chalk":           "VARIANT_PLACEHOLDER",
  "arch-stone":           "VARIANT_PLACEHOLDER",
  "arch-black":           "VARIANT_PLACEHOLDER",
  "arch-clay":            "VARIANT_PLACEHOLDER",
  "arch-sage":            "VARIANT_PLACEHOLDER",
  "arch-navy":            "VARIANT_PLACEHOLDER",
  "arch-cream":           "VARIANT_PLACEHOLDER",
  "arch-terracotta":      "VARIANT_PLACEHOLDER",

  "dome-chalk":           "VARIANT_PLACEHOLDER",
  "dome-stone":           "VARIANT_PLACEHOLDER",
  "dome-black":           "VARIANT_PLACEHOLDER",
  "dome-clay":            "VARIANT_PLACEHOLDER",
  "dome-sage":            "VARIANT_PLACEHOLDER",
  "dome-navy":            "VARIANT_PLACEHOLDER",
  "dome-cream":           "VARIANT_PLACEHOLDER",
  "dome-terracotta":      "VARIANT_PLACEHOLDER",

  "cylinder-chalk":       "VARIANT_PLACEHOLDER",
  "cylinder-stone":       "VARIANT_PLACEHOLDER",
  "cylinder-black":       "VARIANT_PLACEHOLDER",
  "cylinder-clay":        "VARIANT_PLACEHOLDER",
  "cylinder-sage":        "VARIANT_PLACEHOLDER",
  "cylinder-navy":        "VARIANT_PLACEHOLDER",
  "cylinder-cream":       "VARIANT_PLACEHOLDER",
  "cylinder-terracotta":  "VARIANT_PLACEHOLDER",

  "cone-chalk":           "VARIANT_PLACEHOLDER",
  "cone-stone":           "VARIANT_PLACEHOLDER",
  "cone-black":           "VARIANT_PLACEHOLDER",
  "cone-clay":            "VARIANT_PLACEHOLDER",
  "cone-sage":            "VARIANT_PLACEHOLDER",
  "cone-navy":            "VARIANT_PLACEHOLDER",
  "cone-cream":           "VARIANT_PLACEHOLDER",
  "cone-terracotta":      "VARIANT_PLACEHOLDER",

  "wave-chalk":           "VARIANT_PLACEHOLDER",
  "wave-stone":           "VARIANT_PLACEHOLDER",
  "wave-black":           "VARIANT_PLACEHOLDER",
  "wave-clay":            "VARIANT_PLACEHOLDER",
  "wave-sage":            "VARIANT_PLACEHOLDER",
  "wave-navy":            "VARIANT_PLACEHOLDER",
  "wave-cream":           "VARIANT_PLACEHOLDER",
  "wave-terracotta":      "VARIANT_PLACEHOLDER",

  "sphere-chalk":         "VARIANT_PLACEHOLDER",
  "sphere-stone":         "VARIANT_PLACEHOLDER",
  "sphere-black":         "VARIANT_PLACEHOLDER",
  "sphere-clay":          "VARIANT_PLACEHOLDER",
  "sphere-sage":          "VARIANT_PLACEHOLDER",
  "sphere-navy":          "VARIANT_PLACEHOLDER",
  "sphere-cream":         "VARIANT_PLACEHOLDER",
  "sphere-terracotta":    "VARIANT_PLACEHOLDER",

  "torus-chalk":          "VARIANT_PLACEHOLDER",
  "torus-stone":          "VARIANT_PLACEHOLDER",
  "torus-black":          "VARIANT_PLACEHOLDER",
  "torus-clay":           "VARIANT_PLACEHOLDER",
  "torus-sage":           "VARIANT_PLACEHOLDER",
  "torus-navy":           "VARIANT_PLACEHOLDER",
  "torus-cream":          "VARIANT_PLACEHOLDER",
  "torus-terracotta":     "VARIANT_PLACEHOLDER",

  "prism-chalk":          "VARIANT_PLACEHOLDER",
  "prism-stone":          "VARIANT_PLACEHOLDER",
  "prism-black":          "VARIANT_PLACEHOLDER",
  "prism-clay":           "VARIANT_PLACEHOLDER",
  "prism-sage":           "VARIANT_PLACEHOLDER",
  "prism-navy":           "VARIANT_PLACEHOLDER",
  "prism-cream":          "VARIANT_PLACEHOLDER",
  "prism-terracotta":     "VARIANT_PLACEHOLDER",
};

/** fixation ID -> Shopify variant GID */
export const FIXATION_VARIANT_MAP: Record<string, string> = {
  rosette: "VARIANT_PLACEHOLDER",
  rail:    "VARIANT_PLACEHOLDER",
  canopy:  "VARIANT_PLACEHOLDER",
};

/** cable ID -> Shopify variant GID */
export const CABLE_VARIANT_MAP: Record<string, string> = {
  "black-textile": "VARIANT_PLACEHOLDER",
  "white-textile": "VARIANT_PLACEHOLDER",
  brass:           "VARIANT_PLACEHOLDER",
  copper:          "VARIANT_PLACEHOLDER",
  transparent:     "VARIANT_PLACEHOLDER",
};
