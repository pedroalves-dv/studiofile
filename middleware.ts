// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ACCOUNT_PATHS = [
  "/account/login",
  "/account/register",
  "/account/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Soft-launch: redirect root to landing page REMOVE ON LAUNCH
  // ===================================
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/coming-soon", request.url));
  // }

  // ===================================

  if (!pathname.startsWith("/account")) return NextResponse.next();
  if (PUBLIC_ACCOUNT_PATHS.some((p) => pathname.startsWith(p)))
    return NextResponse.next();

  const token = request.cookies.get("sf-customer-token")?.value;

  if (!token) {
    const loginUrl = new URL("/account/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

//  REMOVE ON LAUNCH
// ===================================

export const config = {
  matcher: ["/", "/account/:path*"],
};

//  UNCOMMENT
// ===================================

// export const config = {
//   matcher: ['/account/:path*'],
// }
