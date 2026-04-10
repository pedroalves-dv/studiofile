# Shopify & Auth Architecture

- **API**: Storefront API 2026 (GraphQL). No SDK. Use custom fetch wrapper.
- **Caching**: Queries use `{ next: { revalidate: 3600 } }`, Cart & Auth use `{ cache: 'no-store' }`.
- **Auth**: `customerLogout` does NOT redirect (handled client-side).
- **Server Actions**: Cart and Auth are Server Actions. Never wrap `redirect()` in try/catch.
- **Client/Server**: Pages are Server Components. No `'use client'` on pages.
