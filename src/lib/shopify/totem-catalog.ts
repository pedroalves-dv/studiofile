// Server-side module: fetches Totem catalog (shapes, fixtures, cables) from Shopify.
// Never import this file in client components — use /api/totem-catalog instead.
import { storefront } from './client';
import {
  TOTEM_SHAPES,
  TOTEM_FIXTURES,
  TOTEM_CABLES,
  CABLE_HEX_MAP,
  type TotemShape,
  type TotemFixture,
  type TotemCable,
} from '../totem-config';
import type { ShopifyMetafield } from './types';

/* ── GraphQL queries ── */

const GET_TOTEM_COLLECTION = `
  query GetTotemCollection($handle: String!) {
    collection(handle: $handle) {
      products(first: 50) {
        edges {
          node {
            handle
            title
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            metafield(namespace: "descriptors", key: "height") {
              value
            }
          }
        }
      }
    }
  }
`;

const GET_TOTEM_CABLES = `
  query GetTotemCables($query: String!) {
    products(first: 10, query: $query) {
      edges {
        node {
          variants(first: 20) {
            edges {
              node {
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ── Response types ── */

interface CollectionResponse {
  collection: {
    products: {
      edges: Array<{
        node: {
          handle: string;
          title: string;
          priceRange: {
            minVariantPrice: { amount: string; currencyCode: string };
          };
          metafield: ShopifyMetafield | null;
        };
      }>;
    };
  } | null;
}

interface CablesResponse {
  products: {
    edges: Array<{
      node: {
        variants: {
          edges: Array<{
            node: {
              title: string;
              price: { amount: string; currencyCode: string };
            };
          }>;
        };
      };
    }>;
  };
}

/* ── Helpers ── */

function normalizeVariantTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}

function safeParseFloat(value: string | undefined | null, fallback: number): number {
  const n = parseFloat(value ?? '');
  return isNaN(n) ? fallback : n;
}

/* ── Exports ── */

/**
 * Fetches all products in the totem-shapes collection.
 * Falls back to TOTEM_SHAPES on any error or empty result.
 */
export async function getTotemShapes(): Promise<TotemShape[]> {
  try {
    const response = await storefront<CollectionResponse>(
      GET_TOTEM_COLLECTION,
      { handle: 'totem-shapes' },
      { next: { revalidate: 3600 } },
    );

    if (!response.collection) return TOTEM_SHAPES;

    const mapped = response.collection.products.edges.map(({ node }) => {
      const fallbackHeight = TOTEM_SHAPES.find((s) => s.id === node.handle)?.height ?? 44;
      return {
        id:     node.handle,
        name:   node.title,
        price:  safeParseFloat(node.priceRange.minVariantPrice.amount, 0),
        height: safeParseFloat(node.metafield?.value, fallbackHeight),
      };
    });

    if (mapped.length === 0 && process.env.NODE_ENV !== 'production') {
      console.warn('[totem-catalog] totem-shapes collection is empty or missing. Using hardcoded fallback.');
    }
    return mapped.length > 0 ? mapped : TOTEM_SHAPES;
  } catch (error) {
    console.error('[totem-catalog] Failed to fetch totem-shapes:', error);
    return TOTEM_SHAPES;
  }
}

/**
 * Fetches all products in the totem-fixtures collection.
 * Falls back to TOTEM_FIXTURES on any error or empty result.
 */
export async function getTotemFixtures(): Promise<TotemFixture[]> {
  try {
    const response = await storefront<CollectionResponse>(
      GET_TOTEM_COLLECTION,
      { handle: 'totem-fixtures' },
      { next: { revalidate: 3600 } },
    );

    if (!response.collection) return TOTEM_FIXTURES;

    const mapped = response.collection.products.edges.map(({ node }) => {
      const fallbackHeight = TOTEM_FIXTURES.find((f) => f.id === node.handle)?.height ?? 24;
      return {
        id:     node.handle,
        name:   node.title,
        price:  safeParseFloat(node.priceRange.minVariantPrice.amount, 0),
        height: safeParseFloat(node.metafield?.value, fallbackHeight),
      };
    });

    if (mapped.length === 0 && process.env.NODE_ENV !== 'production') {
      console.warn('[totem-catalog] totem-fixtures collection is empty or missing. Using hardcoded fallback.');
    }
    return mapped.length > 0 ? mapped : TOTEM_FIXTURES;
  } catch (error) {
    console.error('[totem-catalog] Failed to fetch totem-fixtures:', error);
    return TOTEM_FIXTURES;
  }
}

/**
 * Fetches cable variants from products tagged totem-cable.
 * Hex values are looked up from CABLE_HEX_MAP by normalized variant title.
 * Falls back to TOTEM_CABLES on any error or empty result.
 */
export async function getTotemCables(): Promise<TotemCable[]> {
  try {
    const response = await storefront<CablesResponse>(
      GET_TOTEM_CABLES,
      { query: 'tag:totem-cable' },
      { next: { revalidate: 3600 } },
    );

    const cables: TotemCable[] = [];
    for (const { node: product } of response.products.edges) {
      for (const { node: variant } of product.variants.edges) {
        const id = normalizeVariantTitle(variant.title);
        cables.push({
          id,
          name:  variant.title,
          price: safeParseFloat(variant.price.amount, 0),
          hex:   CABLE_HEX_MAP[id] ?? '#D0D0D0',
        });
      }
    }

    if (cables.length === 0 && process.env.NODE_ENV !== 'production') {
      console.warn('[totem-catalog] No products tagged totem-cable found. Using hardcoded fallback.');
    }
    return cables.length > 0 ? cables : TOTEM_CABLES;
  } catch (error) {
    console.error('[totem-catalog] Failed to fetch totem-cable:', error);
    return TOTEM_CABLES;
  }
}
