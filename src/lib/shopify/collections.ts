// Collection-specific Shopify API functions
import { storefront } from './client';
import { GET_COLLECTION_BY_HANDLE, GET_COLLECTIONS } from './queries';
import type { ShopifyCollection, ShopifyProduct } from './types';

// Raw shape of the Shopify API response — products come back as a connection object
interface ShopifyCollectionRaw extends Omit<ShopifyCollection, 'products'> {
  products: {
    edges: Array<{ node: ShopifyProduct }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
}

interface CollectionResponse {
  collectionByHandle: ShopifyCollectionRaw | null;
}

interface CollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection; cursor: string }>;
    pageInfo: { hasNextPage: boolean };
  };
}

function normalizeCollection(raw: ShopifyCollectionRaw): ShopifyCollection {
  return {
    ...raw,
    products: raw.products.edges.map((e) => e.node),
  };
}

/**
 * Fetch a single collection by handle with products
 */
export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const response = await storefront<CollectionResponse>(
    GET_COLLECTION_BY_HANDLE,
    { handle, first: 20, after: null },
    { next: { revalidate: 3600 } }
  );

  const raw = response.collectionByHandle;
  return raw ? normalizeCollection(raw) : null;
}

/**
 * Fetch a collection with pagination
 */
export async function getCollectionWithPagination(
  handle: string,
  first: number = 20,
  after?: string
): Promise<ShopifyCollection | null> {
  const response = await storefront<CollectionResponse>(
    GET_COLLECTION_BY_HANDLE,
    { handle, first, after: after || null },
    { next: { revalidate: 3600 } }
  );

  const raw = response.collectionByHandle;
  return raw ? normalizeCollection(raw) : null;
}

/**
 * Fetch all collections
 */
export async function getCollections(): Promise<ShopifyCollection[]> {
  const response = await storefront<CollectionsResponse>(
    GET_COLLECTIONS,
    { first: 250, after: null },
    { next: { revalidate: 3600 } }
  );

  return response.collections.edges.map((edge) => edge.node);
}
