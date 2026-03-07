# Phase 7 — Customer Auth

---

## Prompt 7.1 — Auth Flow & Protected Routes

### middleware.ts

Replace the empty shell from Phase 1.1 with the full implementation.

Protected routes: all `/account/*` **except**:
- `/account/login`
- `/account/register`
- `/account/forgot-password`  ← must be excluded or logged-out users hit a redirect loop

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ACCOUNT_PATHS = [
  '/account/login',
  '/account/register',
  '/account/forgot-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/account')) return NextResponse.next()
  if (PUBLIC_ACCOUNT_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  const token = request.cookies.get('sf-customer-token')?.value

  if (!token) {
    const loginUrl = new URL('/account/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}
```

Note: middleware cannot validate the token with Shopify (no API call possible here).
It only checks for presence. If the token is expired, the account page handles it — see below.

### lib/shopify/auth.ts — complete the implementation

This file was scaffolded in Phase 1.2. Replace stubs with full implementations.
All functions use `"use server"` at the top of the file.

```ts
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { storefront } from './client'
import { ... } from './mutations'
```

**Cookie config — define once at top of file:**
```ts
const TOKEN_COOKIE = 'sf-customer-token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,  // 30 days
}
```

**customerLogin:**
```ts
export async function customerLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const { data, errors } = await storefront(CUSTOMER_ACCESS_TOKEN_CREATE, {
    input: { email, password }
  })

  const token = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken
  const userErrors = data?.customerAccessTokenCreate?.customerUserErrors

  if (errors?.length || userErrors?.length) {
    return { success: false, error: userErrors?.[0]?.message ?? 'Login failed' }
  }

  if (!token) return { success: false, error: 'Login failed' }

  ;(await cookies()).set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
  return { success: true }
}
```

**customerLogout:**
```ts
export async function customerLogout(): Promise<void> {
  const token = await getCustomerToken()

  if (token) {
    // Best-effort revoke — don't let failure block the logout
    try {
      await storefront(CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken: token })
    } catch {}
  }

  ;(await cookies()).delete(TOKEN_COOKIE)

  // redirect() throws a special NEXT_REDIRECT error — it must NOT be inside a try/catch.
  // It is called here, outside any try/catch block, so it works correctly.
  redirect('/')
}
```

**customerRegister:**
```ts
export async function customerRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const { data, errors } = await storefront(CUSTOMER_CREATE, {
    input: { firstName, lastName, email, password }
  })

  const userErrors = data?.customerCreate?.customerUserErrors
  if (errors?.length || userErrors?.length) {
    return { success: false, error: userErrors?.[0]?.message ?? 'Registration failed' }
  }

  // Auto-login after successful registration
  // customerLogin sets the cookie — call the function directly (both are server functions)
  const loginResult = await customerLogin(email, password)
  return loginResult
}
```

**getCustomer:**
```ts
export async function getCustomer(token: string): Promise<ShopifyCustomer | null> {
  try {
    const { data } = await storefront(GET_CUSTOMER, {
      customerAccessToken: token
    })
    return data?.customer ?? null
  } catch {
    return null
  }
}
```

**sendPasswordReset:**
```ts
export async function sendPasswordReset(
  email: string
): Promise<{ success: boolean }> {
  // Always returns success: true — never reveal whether email exists (security)
  try {
    await storefront(CUSTOMER_RECOVER, { email })
  } catch {}
  return { success: true }
}
```

**getCustomerToken:**
```ts
export async function getCustomerToken(): Promise<string | null> {
  return (await cookies()).get(TOKEN_COOKIE)?.value ?? null
}
```

### app/account/login/page.tsx

```ts
export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Login' }
}
```

Server Component shell. Extract `LoginForm` as a `"use client"` component.

**Reading the `?next` redirect param:**
```ts
// In the page (Server Component):
export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const nextPath = searchParams.next ?? '/account'
  return <LoginForm nextPath={nextPath} />
}
```

**LoginForm:**
```ts
interface LoginFormProps { nextPath: string }
```

Use `useTransition` to call `customerLogin`:
```ts
const [isPending, startTransition] = useTransition()
const router = useRouter()

function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  startTransition(async () => {
    const result = await customerLogin(email, password)
    if (result.success) {
      router.push(nextPath)   // redirect to intended page
    } else {
      setError(result.error ?? 'Login failed')
    }
  })
}
```

Fields: Email, Password. Error message displayed inline above the submit button.
"Forgot password?" link → `/account/forgot-password`.
"Don't have an account?" link → `/account/register`.

### app/account/register/page.tsx

```ts
export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Create Account' }
}
```

`"use client"` RegisterForm:
- Fields: First Name, Last Name, Email, Password, Confirm Password
- Client validation before calling server action:
  - Password min 8 characters
  - Passwords match
- On success: `router.push('/account')`
- Error displayed inline

### app/account/forgot-password/page.tsx

```ts
export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Reset Password' }
}
```

`"use client"` ForgotPasswordForm:
- Email field only
- On submit: calls `sendPasswordReset(email)`
- Always shows success message regardless of result:
  `"If an account exists for this email, you'll receive a reset link shortly."`
- No error state exposed (security best practice — don't reveal whether email exists)

### app/account/page.tsx

Server Component. Handles both missing token and expired token:

```ts
export default async function AccountPage() {
  const token = await getCustomerToken()

  if (!token) {
    // Middleware should catch this, but handle defensively
    redirect('/account/login')
  }

  const customer = await getCustomer(token)

  if (!customer) {
    // Token exists but is expired/invalid — clear it and redirect
    // Call customerLogout which deletes the cookie, but we can't use redirect() inside
    // a try/catch in the Server Action. Instead, delete cookie directly here:
    ;(await cookies()).delete('sf-customer-token')
    redirect('/account/login')
  }

  const recentOrders = customer.orders.edges.slice(0, 3).map(e => e.node)
  // ...render
}
```

Layout:
- `"Hello, {customer.firstName}."` in display font
- Account nav tabs: Overview, Orders — **do not include Settings** (no settings page in scaffold)
- Recent orders: last 3, using `OrderCard` component
- "View all orders" link → `/account/orders`
- Logout form (see below)

**Logout button — must use a form with Server Action:**
```tsx
// Do NOT use onClick calling a server action — that pattern is unreliable in App Router.
// Use a form with action= instead:
<form action={customerLogout}>
  <button type="submit" aria-label="Sign out">
    Sign out
  </button>
</form>
```

```ts
export async function generateMetadata(): Promise<Metadata> {
  return { title: 'My Account' }
}
```

### app/account/orders/page.tsx

```ts
export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Orders' }
}
```

```ts
const token = await getCustomerToken()
if (!token) redirect('/account/login')
const customer = await getCustomer(token)
if (!customer) redirect('/account/login')

const orders = customer.orders.edges.map(e => e.node)
```

Render: all orders using `OrderCard`. Empty state if `orders.length === 0`.

### components/account/OrderCard.tsx

Define this component here — it was referenced but never built or scaffolded:

```ts
interface OrderCardProps {
  order: ShopifyOrder
}
```

Fields to display:
- Order number: `order.name` (Shopify order name, e.g. `#1001`)
- Date: `formatDate(order.processedAt)`
- Fulfillment status badge — use `Badge` component, variant based on status:

```ts
// Shopify fulfillmentStatus values:
const FULFILLMENT_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  FULFILLED:           { label: 'Fulfilled',          variant: 'default' },
  UNFULFILLED:         { label: 'Processing',         variant: 'new' },
  PARTIALLY_FULFILLED: { label: 'Partially Shipped',  variant: 'featured' },
  RESTOCKED:           { label: 'Refunded',           variant: 'soldOut' },
  PENDING_FULFILLMENT: { label: 'Pending',            variant: 'default' },
  OPEN:                { label: 'Open',               variant: 'new' },
  IN_PROGRESS:         { label: 'In Progress',        variant: 'featured' },
}
const statusInfo = FULFILLMENT_STATUS_MAP[order.fulfillmentStatus]
  ?? { label: order.fulfillmentStatus, variant: 'default' }
```

- Total: `formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)`
- "View order" link: `order.statusUrl` — this is an external Shopify order status URL.
  **Note:** `statusUrl` must be added to the `ShopifyOrder` type in `lib/shopify/types.ts`
  and fetched in `GET_CUSTOMER` query if not already included.

```ts
// Update ShopifyOrder in types.ts to include:
statusUrl: string
```

---

> **After Phase 7, verify:**
> - Logged-out visit to `/account` redirects to `/account/login?next=/account`
> - After login, redirects to `/account` (the `next` param)
> - Logged-out visit to `/account/forgot-password` does NOT redirect (it's a public route)
> - Login with wrong password shows inline error, does not redirect
> - Logout clears cookie and redirects to `/`
> - Expired token (manually delete cookie value but keep key) redirects to login
> - Order status badges render correctly for FULFILLED and UNFULFILLED states
> - `tsc --noEmit` — zero errors