// Policies-specific Shopify API functions
import { storefront } from './client';
import { GET_SHOP_POLICIES, GET_SHOP_INFO, GET_LOCALIZATION } from './queries';
import type { ShopifyPolicy, ShopifyShop, LocalizationCountry } from './types';

interface PoliciesResponse {
  shop: {
    privacyPolicy: ShopifyPolicy | null;
    refundPolicy: ShopifyPolicy | null;
    termsOfService: ShopifyPolicy | null;
    shippingPolicy: ShopifyPolicy | null;
  };
}

interface ShopInfoResponse {
  shop: ShopifyShop;
}

/**
 * Fetch all shop policies
 */
export async function getShopPolicies(): Promise<{
  privacy: ShopifyPolicy | null;
  refund: ShopifyPolicy | null;
  terms: ShopifyPolicy | null;
  shipping: ShopifyPolicy | null;
}> {
  const response = await storefront<PoliciesResponse>(
    GET_SHOP_POLICIES,
    {},
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );

  return {
    privacy: response.shop.privacyPolicy,
    refund: response.shop.refundPolicy,
    terms: response.shop.termsOfService,
    shipping: response.shop.shippingPolicy,
  };
}

/**
 * Fetch a specific policy by handle
 */
export async function getPolicyByHandle(
  handle: 'privacy-policy' | 'refund-policy' | 'terms-of-service' | 'shipping-policy'
): Promise<ShopifyPolicy | null> {
  const policies = await getShopPolicies();

  switch (handle) {
    case 'privacy-policy':
      return policies.privacy;
    case 'refund-policy':
      return policies.refund;
    case 'terms-of-service':
      return policies.terms;
    case 'shipping-policy':
      return policies.shipping;
    default:
      return null;
  }
}

/**
 * Fetch shop general information
 */
export async function getShopInfo(): Promise<ShopifyShop> {
  const response = await storefront<ShopInfoResponse>(
    GET_SHOP_INFO,
    {},
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );

  return response.shop;
}

interface LocalizationResponse {
  localization: {
    availableCountries: LocalizationCountry[];
  };
}

/**
 * Fetch available countries and provinces for localization
 */
export async function getLocalization(): Promise<LocalizationCountry[]> {
  const data = await storefront<LocalizationResponse>(
    GET_LOCALIZATION,
    {},
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );
  return data.localization.availableCountries;
}
