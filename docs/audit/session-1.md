# Session 1 — Architecture & Data Layer

## Fixed this session
- [C-2] src/app/api/products/batch/route.ts — no try/catch, added MAX_HANDLES=20 guard + 500 handler
- [C-3] src/app/api/products/batch/route.ts — no handle limit (fixed alongside C-2)
- [C-4] src/context/CartContext.tsx + src/hooks/useCart.ts — race condition on first add-to-cart, fixed with pendingCartRef pattern
- [C-5] src/hooks/useCart.ts + src/lib/utils/format.ts — totalAmount fallback hardcoded USD, fixed to use CURRENCY_CODE from constants
- [I-2] src/lib/shopify/products.ts + collections.ts — getProduct() used force-cache with no revalidation, added { next: { revalidate: 3600 } }
- [I-3] src/hooks/useDebounce.ts — stale closure on callback, fixed with callbackRef
- [I-4] src/hooks/useClickOutside.ts — re-registered listeners every render, fixed with handlerRef
- [I-5] 6 UI components + src/lib/utils.ts — wrong cn import path, fixed all + deleted utils.ts
- [I-6] src/lib/utils/cx.ts + is-react-component.ts — dead files, deleted
- [I-7] src/lib/shopify/policies.ts + format.ts — getShopInfo() and formatHandle() exported but never used, removed

## Deferred — fix in final pass
### CRITICAL
- [C-1] src/lib/shopify/collections.ts + src/app/(main)/collections/[handle]/page.tsx — getCollectionWithPagination() returns raw Shopify connection object but products typed as ShopifyProduct[]. Any products.map() throws at runtime. Needs normalization layer like products.ts has.

### IMPORTANT
- [I-1] src/lib/shopify/types.ts + src/app/api/search/predictive/route.ts — ShopifyPredictiveSearchResult missing pages/articles but EMPTY constant includes them
- [I-8] src/lib/shopify/queries.ts + mutations.ts — CART_FIELDS and GET_CART define same GraphQL fields twice, divergence risk
- [I-9] src/lib/shopify/mutations.ts — getCart() is a Server Action used for read-only fetching, works but architecturally wrong
