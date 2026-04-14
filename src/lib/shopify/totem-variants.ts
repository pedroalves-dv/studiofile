// Server-side module: fetches Totem variant GIDs from Shopify by product tag.
// Never import this file in client components — use /api/totem-variants instead.
import { storefront } from "./client";

const GET_PRODUCTS_BY_TAG = `
  query GetTotemProductsByTag($query: String!) {
    products(first: 50, query: $query) {
      edges {
        node {
          handle
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
              }
            }
          }
        }
      }
    }
  }
`;

export type TotemVariantInfo = { id: string; available: boolean };

interface TotemProductsResponse {
  products: {
    edges: Array<{
      node: {
        handle: string;
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              availableForSale: boolean;
              quantityAvailable: number | null; // null when inventory tracking is disabled
            };
          }>;
        };
      };
    }>;
  };
}

function normalizeVariantTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-") // "Blue / Smooth" → "blue-smooth"
    .replace(/\s+/g, "-"); // handle any remaining spaces
}

/**
 * Fetches all products matching a Shopify tag and returns a map of
 * "{handle}-{normalizedVariantTitle}" -> { id, available }.
 * Returns {} on any error so a Shopify hiccup never crashes the cart.
 */
async function fetchVariantMapByTag(
  tag: string,
): Promise<Record<string, TotemVariantInfo>> {
  try {
    const response = await storefront<TotemProductsResponse>(
      GET_PRODUCTS_BY_TAG,
      { query: `tag:${tag}` },
      { next: { revalidate: 3600 } },
    );

    const map: Record<string, TotemVariantInfo> = {};
    for (const { node: product } of response.products.edges) {
      for (const { node: variant } of product.variants.edges) {
        const key = `${product.handle}-${normalizeVariantTitle(variant.title)}`;
        map[key] = {
          id: variant.id,
          available: variant.availableForSale,
        };
      }
    }
    if (
      Object.keys(map).length === 0 &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        `[totem-variants] No variants found for tag "${tag}". ` +
          `Check that Shopify products are tagged correctly and have the expected handles/variant titles.`,
      );
      console.log(
        "[totem-variants] Sample variant titles:",
        response.products.edges[0]?.node.variants.edges.map(
          (e) => e.node.title,
        ),
      );
    }
    return map;
  } catch (error) {
    console.error(`[totem-variants] Failed to fetch tag "${tag}":`, error);
    return {};
  }
}

/**
 * Returns a combined variant map for all totem-shape and totem-fixture products.
 * Key: "{handle}-{normalizedVariantTitle}" (e.g. "arch-blue", "rosette-chalk")
 * Value: { id: Shopify variant GID, available: boolean }
 */
export async function getShapeAndFixtureVariantMap(): Promise<
  Record<string, TotemVariantInfo>
> {
  const [shapes, fixtures] = await Promise.all([
    fetchVariantMapByTag("totem-shape"),
    fetchVariantMapByTag("totem-fixture"),
  ]);
  return { ...shapes, ...fixtures };
}

/**
 * Returns a variant map for all totem-cable products.
 * Key: "{normalizedVariantTitle}" (e.g. "black-textile", "brass")
 * Value: { id: Shopify variant GID, available: boolean }
 */
export async function getCableVariantMap(): Promise<
  Record<string, TotemVariantInfo>
> {
  try {
    const response = await storefront<TotemProductsResponse>(
      GET_PRODUCTS_BY_TAG,
      { query: "tag:totem-cable" },
      { next: { revalidate: 3600 } },
    );

    const map: Record<string, TotemVariantInfo> = {};
    for (const { node: product } of response.products.edges) {
      for (const { node: variant } of product.variants.edges) {
        map[normalizeVariantTitle(variant.title)] = {
          id: variant.id,
          available: variant.availableForSale,
        };
      }
    }
    return map;
  } catch (error) {
    console.error("[totem-variants] Failed to fetch totem-cable:", error);
    return {};
  }
}
