// Shopify Storefront API client with typed fetch wrapper
import { ApiResponse, ShopifyError } from './types';

const SHOPIFY_ENDPOINT = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_ENDPOINT || !ACCESS_TOKEN) {
  throw new Error(
    'Missing Shopify environment variables. Ensure NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN are set.'
  );
}

interface FetchOptions extends RequestInit {
  cache?: 'no-store' | 'force-cache' | 'no-cache' | 'reload';
  next?: { revalidate?: number | false; tags?: string[] };
}

/**
 * Typed fetch wrapper for Shopify Storefront API
 * Handles GraphQL queries and mutations with proper error handling
 * Supports Next.js fetch options (cache, revalidate, tags)
 */
export async function storefront<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  try {
    const response = await fetch(SHOPIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: options?.cache || 'force-cache',
      next: options?.next,
    });

    if (!response.ok) {
      const error = new ShopifyError(
        `Shopify API Error: ${response.statusText}`,
        response.status
      );
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Shopify API Request Failed:', {
          status: response.status,
          statusText: response.statusText,
          query,
          variables,
        });
      }

      throw error;
    }

    const data = (await response.json()) as ApiResponse<T>;

    // Check for GraphQL errors
    if (data.errors && data.errors.length > 0) {
      const error = new ShopifyError(
        `GraphQL Error: ${data.errors[0].message}`,
        undefined,
        data.errors
      );

      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL Errors:', {
          errors: data.errors,
          query,
          variables,
        });
      }

      throw error;
    }

    if (!data.data) {
      const error = new ShopifyError('No data returned from Shopify API');

      if (process.env.NODE_ENV === 'development') {
        console.error('Empty response from Shopify API:', { query, variables });
      }

      throw error;
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ShopifyError) {
      throw error;
    }

    const shopifyError = new ShopifyError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined
    );

    if (process.env.NODE_ENV === 'development') {
      console.error('Shopify API Error:', error);
    }

    throw shopifyError;
  }
}
