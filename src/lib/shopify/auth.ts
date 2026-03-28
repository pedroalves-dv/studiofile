'use server'

import { cookies } from 'next/headers'
import { storefront } from './client'
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  CUSTOMER_RECOVER,
  CUSTOMER_UPDATE,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
} from './mutations'
import { GET_CUSTOMER } from './queries'
import type { ShopifyCustomer } from './types'

const TOKEN_COOKIE = 'sf-customer-token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
}

// Response shape types (local — not exported)
interface AccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken: {
      accessToken: string
      expiresAt: string
    } | null
    customerUserErrors: Array<{ field: string[]; message: string }>
  }
}

interface CustomerCreateResponse {
  customerCreate: {
    customer: { id: string } | null
    customerUserErrors: Array<{ field: string[]; message: string }>
  }
}

interface GetCustomerResponse {
  customer: ShopifyCustomer | null
}

export async function customerLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await storefront<AccessTokenCreateResponse>(
      CUSTOMER_ACCESS_TOKEN_CREATE,
      { input: { email, password } },
      { cache: 'no-store' }
    )

    const token = data.customerAccessTokenCreate?.customerAccessToken?.accessToken
    const userErrors = data.customerAccessTokenCreate?.customerUserErrors

    if (userErrors?.length) {
      return { success: false, error: userErrors[0].message }
    }

    if (!token) return { success: false, error: 'Login failed' }

    ;(await cookies()).set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
    return { success: true }
  } catch {
    return { success: false, error: 'Login failed' }
  }
}

export async function customerLogout(): Promise<void> {
  const token = await getCustomerToken()

  if (token) {
    // Best-effort revoke — don't let failure block the logout
    try {
      await storefront(
        CUSTOMER_ACCESS_TOKEN_DELETE,
        { customerAccessToken: token },
        { cache: 'no-store' }
      )
    } catch {}
  }

  ;(await cookies()).delete(TOKEN_COOKIE)
}

export async function customerRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await storefront<CustomerCreateResponse>(
      CUSTOMER_CREATE,
      { input: { firstName, lastName, email, password } },
      { cache: 'no-store' }
    )

    const userErrors = data.customerCreate?.customerUserErrors
    if (userErrors?.length) {
      return { success: false, error: userErrors[0].message }
    }

    if (!data.customerCreate?.customer) {
      return { success: false, error: 'Registration failed' }
    }

    // Auto-login: inline token creation to stay within this action's cookie context
    const loginData = await storefront<AccessTokenCreateResponse>(
      CUSTOMER_ACCESS_TOKEN_CREATE,
      { input: { email, password } },
      { cache: 'no-store' }
    )

    const token = loginData.customerAccessTokenCreate?.customerAccessToken?.accessToken
    if (token) {
      ;(await cookies()).set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Registration failed' }
  }
}

export async function getCustomer(token: string): Promise<ShopifyCustomer | null> {
  try {
    const data = await storefront<GetCustomerResponse>(
      GET_CUSTOMER,
      { customerAccessToken: token },
      { cache: 'no-store' }
    )
    return data.customer ?? null
  } catch {
    return null
  }
}

export async function getCustomerToken(): Promise<string | null> {
  return (await cookies()).get(TOKEN_COOKIE)?.value ?? null
}

export async function sendPasswordReset(
  email: string
): Promise<{ success: boolean }> {
  // Always returns success: true — never reveal whether email exists (security)
  try {
    await storefront(CUSTOMER_RECOVER, { email }, { cache: 'no-store' })
  } catch {}
  return { success: true }
}

interface CustomerUpdateResponse {
  customerUpdate: {
    customer: { id: string } | null
    customerUserErrors: Array<{ field: string[]; message: string }>
  }
}

export async function customerUpdateProfile(
  firstName: string,
  lastName: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getCustomerToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    const data = await storefront<CustomerUpdateResponse>(
      CUSTOMER_UPDATE,
      { customerAccessToken: token, customer: { firstName, lastName, email } },
      { cache: 'no-store' }
    )

    const userErrors = data.customerUpdate?.customerUserErrors
    if (userErrors?.length) {
      return { success: false, error: userErrors[0].message }
    }

    if (!data.customerUpdate?.customer) {
      return { success: false, error: 'Update failed' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Update failed' }
  }
}

export async function customerUpdatePassword(
  currentEmail: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getCustomerToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    // Verify current password before allowing the change
    const verifyData = await storefront<AccessTokenCreateResponse>(
      CUSTOMER_ACCESS_TOKEN_CREATE,
      { input: { email: currentEmail, password: currentPassword } },
      { cache: 'no-store' }
    )

    const verifyErrors = verifyData.customerAccessTokenCreate?.customerUserErrors
    const verifyToken = verifyData.customerAccessTokenCreate?.customerAccessToken?.accessToken

    if (verifyErrors?.length || !verifyToken) {
      return { success: false, error: 'Current password is incorrect' }
    }

    const data = await storefront<CustomerUpdateResponse>(
      CUSTOMER_UPDATE,
      { customerAccessToken: token, customer: { password: newPassword } },
      { cache: 'no-store' }
    )

    const userErrors = data.customerUpdate?.customerUserErrors
    if (userErrors?.length) {
      return { success: false, error: userErrors[0].message }
    }

    if (!data.customerUpdate?.customer) {
      return { success: false, error: 'Password update failed' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Password update failed' }
  }
}

// Address input — fields accepted by Shopify's CustomerAddressInput
export interface AddressInput {
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  zip?: string
  country?: string
  phone?: string
}

interface CustomerAddressCreateResponse {
  customerAddressCreate: {
    customerAddress: { id: string } | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface CustomerAddressUpdateResponse {
  customerAddressUpdate: {
    customerAddress: { id: string } | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface CustomerAddressDeleteResponse {
  customerAddressDelete: {
    deletedCustomerAddressId: string | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

interface CustomerDefaultAddressUpdateResponse {
  customerDefaultAddressUpdate: {
    customer: { id: string } | null
    userErrors: Array<{ field: string[]; message: string }>
  }
}

type AddressActionResult = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

function mapUserErrors(
  userErrors: Array<{ field: string[] | null; message: string }>
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const err of userErrors) {
    const key = err.field?.[err.field.length - 1]
    if (key && !out[key]) out[key] = err.message
  }
  return out
}

export async function customerAddressCreate(
  address: AddressInput
): Promise<AddressActionResult> {
  try {
    const token = await getCustomerToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    const data = await storefront<CustomerAddressCreateResponse>(
      CUSTOMER_ADDRESS_CREATE,
      { customerAccessToken: token, address },
      { cache: 'no-store' }
    )

    const userErrors = data.customerAddressCreate?.userErrors
    if (userErrors?.length) {
      const fieldErrors = mapUserErrors(userErrors)
      return {
        success: false,
        error: userErrors[0].message,
        fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
      }
    }

    if (!data.customerAddressCreate?.customerAddress) {
      return { success: false, error: 'Failed to create address' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to create address' }
  }
}

export async function customerAddressUpdate(
  addressId: string,
  address: AddressInput
): Promise<AddressActionResult> {
  try {
    const token = await getCustomerToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    const data = await storefront<CustomerAddressUpdateResponse>(
      CUSTOMER_ADDRESS_UPDATE,
      { customerAccessToken: token, id: addressId, address },
      { cache: 'no-store' }
    )

    const userErrors = data.customerAddressUpdate?.userErrors
    if (userErrors?.length) {
      const fieldErrors = mapUserErrors(userErrors)
      return {
        success: false,
        error: userErrors[0].message,
        fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
      }
    }

    if (!data.customerAddressUpdate?.customerAddress) {
      return { success: false, error: 'Failed to update address' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update address' }
  }
}

export async function customerAddressDelete(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getCustomerToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    const data = await storefront<CustomerAddressDeleteResponse>(
      CUSTOMER_ADDRESS_DELETE,
      { customerAccessToken: token, id: addressId },
      { cache: 'no-store' }
    )

    const userErrors = data.customerAddressDelete?.userErrors
    if (userErrors?.length) {
      return { success: false, error: userErrors[0].message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete address' }
  }
}

export async function customerDefaultAddressUpdate(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getCustomerToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    const data = await storefront<CustomerDefaultAddressUpdateResponse>(
      CUSTOMER_DEFAULT_ADDRESS_UPDATE,
      { customerAccessToken: token, addressId },
      { cache: 'no-store' }
    )

    const userErrors = data.customerDefaultAddressUpdate?.userErrors
    if (userErrors?.length) {
      return { success: false, error: userErrors[0].message }
    }

    if (!data.customerDefaultAddressUpdate?.customer) {
      return { success: false, error: 'Failed to update default address' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update default address' }
  }
}
