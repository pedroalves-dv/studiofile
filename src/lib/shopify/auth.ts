'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { storefront } from './client'
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  CUSTOMER_RECOVER,
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
        { accessToken: token },
        { cache: 'no-store' }
      )
    } catch {}
  }

  ;(await cookies()).delete(TOKEN_COOKIE)

  // redirect() throws a special NEXT_REDIRECT error — must NOT be inside a try/catch.
  redirect('/')
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

    // Auto-login after successful registration
    return customerLogin(email, password)
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
