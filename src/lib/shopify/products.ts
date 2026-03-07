// Product-specific Shopify API functions
import { storefront } from './client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_RECOMMENDATIONS,
  GET_ALL_PRODUCT_HANDLES,
} from './queries';
import type { ShopifyProduct } from './types';

interface GetProductsOptions {
  first?: number;
  after?: string;
  sortKey?: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED' | 'RELEVANCE';
  reverse?: boolean;
  query?: string;
}

interface ProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct; cursor: string }>;
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
  };
}

interface ProductResponse {
  productByHandle: ShopifyProduct | null;
}

interface ProductRecommendationsResponse {
  productRecommendations: ShopifyProduct[];
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

  return response.productByHandle;
}

/**
 * Fetch multiple products with pagination and filtering
 */
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductsResponse['products']> {
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

  return response.products;
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

  return response.productRecommendations;
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
