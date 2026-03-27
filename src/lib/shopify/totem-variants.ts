// Server-side module: fetches Totem variant GIDs from Shopify by product tag.
// Never import this file in client components — use /api/totem-variants instead.
import { storefront } from './client';

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
              }
            }
          }
        }
      }
    }
  }
`;

interface TotemProductsResponse {
  products: {
    edges: Array<{
      node: {
        handle: string;
        variants: {
          edges: Array<{
            node: { id: string; title: string };
          }>;
        };
      };
    }>;
  };
}

function normalizeVariantTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Fetches all products matching a Shopify tag and returns a map of
 * "{handle}-{normalizedVariantTitle}" -> variant GID.
 * Returns {} on any error so a Shopify hiccup never crashes the cart.
 */
async function fetchVariantMapByTag(tag: string): Promise<Record<string, string>> {
  try {
    const response = await storefront<TotemProductsResponse>(
      GET_PRODUCTS_BY_TAG,
      { query: `tag:${tag}` },
      { next: { revalidate: 3600 } }
    );

    const map: Record<string, string> = {};
    for (const { node: product } of response.products.edges) {
      for (const { node: variant } of product.variants.edges) {
        const key = `${product.handle}-${normalizeVariantTitle(variant.title)}`;
        map[key] = variant.id;
      }
    }
    return map;
  } catch (error) {
    console.error(`[totem-variants] Failed to fetch tag "${tag}":`, error);
    return {};
  }
}

/**
 * Returns a combined variant map for all totem-shape and totem-fixation products.
 * Key: "{handle}-{normalizedVariantTitle}" (e.g. "arch-blue", "rosette-chalk")
 * Value: Shopify variant GID
 */
export async function getShapeAndFixationVariantMap(): Promise<Record<string, string>> {
  const [shapes, fixations] = await Promise.all([
    fetchVariantMapByTag('totem-shape'),
    fetchVariantMapByTag('totem-fixation'),
  ]);
  return { ...shapes, ...fixations };
}

/**
 * Returns a variant map for all totem-cable products.
 * Key: "{normalizedVariantTitle}" (e.g. "black-textile", "brass")
 * Value: Shopify variant GID
 */
export async function getCableVariantMap(): Promise<Record<string, string>> {
  try {
    const response = await storefront<TotemProductsResponse>(
      GET_PRODUCTS_BY_TAG,
      { query: 'tag:totem-cable' },
      { next: { revalidate: 3600 } }
    );

    const map: Record<string, string> = {};
    for (const { node: product } of response.products.edges) {
      for (const { node: variant } of product.variants.edges) {
        map[normalizeVariantTitle(variant.title)] = variant.id;
      }
    }
    return map;
  } catch (error) {
    console.error('[totem-variants] Failed to fetch totem-cable:', error);
    return {};
  }
}
