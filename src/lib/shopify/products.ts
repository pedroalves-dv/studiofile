// Product-specific Shopify API functions
import { storefront } from './client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_RECOMMENDATIONS,
  GET_ALL_PRODUCT_HANDLES,
} from './queries';
import type { ShopifyProduct, ShopifyImage, ShopifyProductVariant } from './types';

// Raw wire shape: images and variants come back as edge/node connections
interface RawShopifyProduct extends Omit<ShopifyProduct, 'images' | 'variants'> {
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: { edges: Array<{ node: ShopifyProductVariant }> };
}

function normalizeProduct(raw: RawShopifyProduct): ShopifyProduct {
  return {
    ...raw,
    images: raw.images.edges.map((e) => e.node),
    variants: raw.variants.edges.map((e) => e.node),
  };
}

interface GetProductsOptions {
  first?: number;
  after?: string;
  sortKey?: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED' | 'RELEVANCE';
  reverse?: boolean;
  query?: string;
}

interface NormalizedProductsConnection {
  edges: Array<{ node: ShopifyProduct; cursor: string }>;
  pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
}

interface ProductsResponse {
  products: {
    edges: Array<{ node: RawShopifyProduct; cursor: string }>;
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
  };
}

interface ProductResponse {
  productByHandle: RawShopifyProduct | null;
}

interface ProductRecommendationsResponse {
  productRecommendations: RawShopifyProduct[];
}

interface ProductHandlesResponse {
  products: {
    edges: Array<{ node: { id: string; handle: string }; cursor: string }>;
    pageInfo: { hasNextPage: boolean };
  };
}

/**
 * Fetch a single product by handle with full details and variants
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const response = await storefront<ProductResponse>(GET_PRODUCT_BY_HANDLE, {
    handle,
  });

  const raw = response.productByHandle;
  return raw ? normalizeProduct(raw) : null;
}

/**
 * Fetch multiple products with pagination and filtering
 */
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<NormalizedProductsConnection> {
  const {
    first = 20,
    after = null,
    sortKey = 'BEST_SELLING',
    reverse = false,
    query = '',
  } = options;

  const response = await storefront<ProductsResponse>(GET_PRODUCTS, {
    first,
    after,
    sortKey,
    reverse,
    query: query || undefined,
  });

  const raw = response.products;
  return {
    ...raw,
    edges: raw.edges.map((edge) => ({ ...edge, node: normalizeProduct(edge.node) })),
  };
}

/**
 * Fetch product recommendations for a given product
 */
export async function getProductRecommendations(
  productId: string
): Promise<ShopifyProduct[]> {
  const response = await storefront<ProductRecommendationsResponse>(
    GET_PRODUCT_RECOMMENDATIONS,
    { productId }
  );

  return response.productRecommendations.map(normalizeProduct);
}

/**
 * Fetch all product handles for sitemap generation
 * Handles pagination automatically
 */
export async function getAllProductHandles(
  first: number = 250
): Promise<Array<{ id: string; handle: string }>> {
  const handles: Array<{ id: string; handle: string }> = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const response = await storefront<ProductHandlesResponse>(
      GET_ALL_PRODUCT_HANDLES,
      {
        first,
        after,
      },
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    handles.push(
      ...response.products.edges.map((edge) => ({
        id: edge.node.id,
        handle: edge.node.handle,
      }))
    );

    hasNextPage = response.products.pageInfo.hasNextPage;
    if (hasNextPage && response.products.edges.length > 0) {
      after = response.products.edges[response.products.edges.length - 1].cursor;
    }
  }

  return handles;
}
