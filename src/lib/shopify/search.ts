// Search-specific Shopify API functions
import { storefront } from './client';
import { SEARCH_PRODUCTS, PREDICTIVE_SEARCH } from './queries';
import type {
  ShopifyProduct,
  ShopifySearchResult,
  ShopifyPredictiveSearchResult,
} from './types';

interface SearchProductsResponse {
  search: {
    edges: Array<{ node: ShopifyProduct; cursor: string }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
    totalCount: number;
  };
}

interface PredictiveSearchResponse {
  predictiveSearch: ShopifyPredictiveSearchResult;
}

interface SearchProductsOptions {
  first?: number;
  after?: string;
  sortKey?: 'RELEVANCE' | 'PRICE' | 'BEST_SELLING' | 'CREATED';
  reverse?: boolean;
}

/**
 * Search products by query string
 */
export async function searchProducts(
  query: string,
  options: SearchProductsOptions = {}
): Promise<ShopifySearchResult> {
  const {
    first = 20,
    after = null,
    sortKey = 'RELEVANCE',
    reverse = false,
  } = options;

  const response = await storefront<SearchProductsResponse>(SEARCH_PRODUCTS, {
    query,
    first,
    after,
    sortKey,
    reverse,
  });

  return {
    products: response.search.edges.map((edge) => edge.node),
    totalCount: response.search.totalCount,
    pageInfo: response.search.pageInfo,
  };
}

/**
 * Get predictive search suggestions (products, collections, search queries)
 */
export async function predictiveSearch(
  query: string,
  first: number = 10
): Promise<ShopifyPredictiveSearchResult> {
  const response = await storefront<PredictiveSearchResponse>(PREDICTIVE_SEARCH, {
    query,
    first,
  });

  return response.predictiveSearch;
}
