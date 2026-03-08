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
