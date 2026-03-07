'use server';

// Authentication-specific Shopify API Server Actions
import { cookies } from 'next/headers';
import { storefront } from './client';
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  CUSTOMER_RECOVER,
  CUSTOMER_RESET,
  CUSTOMER_UPDATE,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
} from './mutations';
import type { ShopifyCustomer, ShopifyAddress } from './types';

const COOKIE_NAME = 'sf-customer-token';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

interface AccessTokenResponse {
  customerAccessTokenCreate: {
    customerAccessToken: {
      accessToken: string;
      expiresAt: string;
    } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CustomerCreateResponse {
  customerCreate: {
    customer: ShopifyCustomer | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CustomerRecoverResponse {
  customerRecover: {
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CustomerResetResponse {
  customerReset: {
    customer: ShopifyCustomer | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CustomerUpdateResponse {
  customerUpdate: {
    customer: ShopifyCustomer | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface AddressCreateResponse {
  customerAddressCreate: {
    customerAddress: ShopifyAddress | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface AddressUpdateResponse {
  customerAddressUpdate: {
    customerAddress: ShopifyAddress | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface AddressDeleteResponse {
  customerAddressDelete: {
    deletedAddressId: string;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

/**
 * Login customer with email and password
 * Sets httpOnly cookie with access token
 */
export async function customerLogin(
  email: string,
  password: string
): Promise<ShopifyCustomer | null> {
  const response = await storefront<AccessTokenResponse>(
    CUSTOMER_ACCESS_TOKEN_CREATE,
    {
      input: {
        email,
        password,
      },
    }
  );

  const tokenData = response.customerAccessTokenCreate.customerAccessToken;

  if (!tokenData || response.customerAccessTokenCreate.userErrors.length > 0) {
    throw new Error(
      response.customerAccessTokenCreate.userErrors[0]?.message ||
        'Failed to login'
    );
  }

  // Set cookie with access token
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, tokenData.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  // Fetch customer data to return
  const customer = await getCustomer(tokenData.accessToken);
  return customer;
}

/**
 * Logout customer by clearing cookie
 */
export async function customerLogout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    // Delete token on Shopify side (optional but recommended)
    try {
      await storefront(CUSTOMER_ACCESS_TOKEN_DELETE, {
        accessToken: token,
      });
    } catch {
      // Ignore errors from Shopify side deletion
    }
  }

  // Clear cookie
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Create new customer account
 */
export async function customerRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<ShopifyCustomer> {
  const response = await storefront<CustomerCreateResponse>(CUSTOMER_CREATE, {
    input: {
      firstName,
      lastName,
      email,
      password,
    },
  });

  if (!response.customerCreate.customer || response.customerCreate.userErrors.length > 0) {
    throw new Error(
      response.customerCreate.userErrors[0]?.message || 'Failed to create account'
    );
  }

  // Auto-login after registration
  await customerLogin(email, password);

  return response.customerCreate.customer;
}

/**
 * Get customer from Shopify using access token
 */
export async function getCustomer(
  accessToken: string
): Promise<ShopifyCustomer | null> {
  try {
    // This requires a custom query - using a basic approach
    // In production, you'd want a dedicated GET_CUSTOMER query
    const query = `
      query getCustomer($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          id
          firstName
          lastName
          email
          phone
          orders(first: 10) {
            edges {
              node {
                id
                orderNumber
                name
                processedAt
                fulfillmentStatus
                financialStatus
                currentTotalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 5) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      originalTotalPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          defaultAddress {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            country
            zip
          }
          addresses(first: 5) {
            edges {
              node {
                id
                firstName
                lastName
                address1
                address2
                city
                province
                country
                zip
              }
            }
          }
        }
      }
    `;

    const response = await storefront<{
      customer: ShopifyCustomer | null;
    }>(query, {
      accessToken,
    });

    return response.customer || null;
  } catch {
    return null;
  }
}

/**
 * Get customer token from cookies (server-side only)
 */
export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const response = await storefront<CustomerRecoverResponse>(CUSTOMER_RECOVER, {
    email,
  });

  if (response.customerRecover.userErrors.length > 0) {
    throw new Error(response.customerRecover.userErrors[0]?.message || 'Failed to send reset');
  }
}

/**
 * Reset customer password with token
 */
export async function resetPassword(
  id: string,
  password: string,
  token: string
): Promise<ShopifyCustomer> {
  const response = await storefront<CustomerResetResponse>(CUSTOMER_RESET, {
    id,
    input: {
      password,
      resetToken: token,
    },
  });

  if (!response.customerReset.customer || response.customerReset.userErrors.length > 0) {
    throw new Error(response.customerReset.userErrors[0]?.message || 'Failed to reset password');
  }

  return response.customerReset.customer;
}

/**
 * Update customer profile
 */
export async function updateCustomerProfile(
  accessToken: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string
): Promise<ShopifyCustomer> {
  const response = await storefront<CustomerUpdateResponse>(CUSTOMER_UPDATE, {
    customerAccessToken: accessToken,
    customer: {
      firstName,
      lastName,
      email,
      phone,
    },
  });

  if (!response.customerUpdate.customer || response.customerUpdate.userErrors.length > 0) {
    throw new Error(
      response.customerUpdate.userErrors[0]?.message || 'Failed to update profile'
    );
  }

  return response.customerUpdate.customer;
}

/**
 * Create customer address
 */
export async function createCustomerAddress(
  accessToken: string,
  address: Omit<ShopifyAddress, 'id'>
): Promise<ShopifyAddress> {
  const response = await storefront<AddressCreateResponse>(
    CUSTOMER_ADDRESS_CREATE,
    {
      customerAccessToken: accessToken,
      address,
    }
  );

  if (!response.customerAddressCreate.customerAddress) {
    throw new Error(response.customerAddressCreate.userErrors[0]?.message || 'Failed to create address');
  }

  return response.customerAddressCreate.customerAddress;
}

/**
 * Update customer address
 */
export async function updateCustomerAddress(
  accessToken: string,
  id: string,
  address: Omit<ShopifyAddress, 'id'>
): Promise<ShopifyAddress> {
  const response = await storefront<AddressUpdateResponse>(
    CUSTOMER_ADDRESS_UPDATE,
    {
      customerAccessToken: accessToken,
      id,
      address,
    }
  );

  if (!response.customerAddressUpdate.customerAddress) {
    throw new Error(response.customerAddressUpdate.userErrors[0]?.message || 'Failed to update address');
  }

  return response.customerAddressUpdate.customerAddress;
}

/**
 * Delete customer address
 */
export async function deleteCustomerAddress(
  accessToken: string,
  id: string
): Promise<void> {
  const response = await storefront<AddressDeleteResponse>(
    CUSTOMER_ADDRESS_DELETE,
    {
      customerAccessToken: accessToken,
      id,
    }
  );

  if (response.customerAddressDelete.userErrors.length > 0) {
    throw new Error(response.customerAddressDelete.userErrors[0]?.message || 'Failed to delete address');
  }
}
