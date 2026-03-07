# Phase 5 — Search & Discovery

---

## Prompt 5.1 — Search & Predictive Search

### app/api/search/predictive/route.ts

**Build this first.** Client components cannot call server lib functions directly.
Predictive search needs an API route:

```ts
import { predictiveSearch } from '@/lib/shopify/search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return Response.json({ products: [], collections: [], queries: [], pages: [], articles: [] })
  }

  try {
    const results = await predictiveSearch(query)
    return Response.json(results)
  } catch (error) {
    console.error('Predictive search error:', error)
    return Response.json({ products: [], collections: [], queries: [], pages: [], articles: [] })
  }
}
```

### hooks/useClickOutside.ts

This hook is used by `PredictiveSearch` but was not in the Phase 1 scaffold. Build it now:

```ts
import { useEffect, RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
```

### app/search/page.tsx

Server Component. Reads `searchParams`.

```ts
export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const q = searchParams.q
  // Template in layout.tsx adds " — Studiofile" automatically
  return { title: q ? `Search: ${q}` : 'Search' }
}
```

Data fetching — reuse `SORT_MAP` and `parseFilters` from Phase 4.3.
Extract these into a shared utility file `lib/utils/params.ts` so both Phase 4 and Phase 5 import
from the same place rather than duplicating:

```ts
// lib/utils/params.ts
export const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  PRICE_ASC:    { sortKey: 'PRICE',        reverse: false },
  PRICE_DESC:   { sortKey: 'PRICE',        reverse: true  },
  BEST_SELLING: { sortKey: 'BEST_SELLING', reverse: false },
  CREATED_AT:   { sortKey: 'CREATED_AT',   reverse: true  },
  TITLE:        { sortKey: 'TITLE',        reverse: false },
}

export function parseFilters(filterParams: string | string[] | undefined): ProductFilter[] {
  const params = Array.isArray(filterParams) ? filterParams
    : filterParams ? [filterParams] : []
  return params.map(f => {
    if (f === 'available')     return { available: true }
    if (f.startsWith('type:')) return { productType: f.slice(5) }
    if (f.startsWith('tag:'))  return { tag: f.slice(4) }
    return {}
  }).filter(f => Object.keys(f).length > 0)
}
```

> Also update Phase 4.3 files to import from `lib/utils/params.ts` instead of inline definitions.

Page logic:
```ts
const q = searchParams.q as string | undefined
const sort = SORT_MAP[searchParams.sort as string] ?? SORT_MAP.BEST_SELLING
const filters = parseFilters(searchParams.filter)

// No query: show search prompt + featured collections
if (!q) {
  const collections = await getCollections()
  return <SearchPrompt collections={collections} />
}

// With query: fetch results
const results = await searchProducts(q, {
  first: 24,
  after: searchParams.cursor as string | undefined,
  sortKey: sort.sortKey,
  reverse: sort.reverse,
  filters,
})
```

Render with query:
- `SearchResults` (result count heading)
- `SortSelect` + `FilterPanel` (imported from Phase 4.3 — no duplication needed)
- `ProductGrid`
- "Load more" pagination (same cursor pattern as Phase 4.3)

`SearchPrompt` component (inline in search page or separate file):
- "What are you looking for?" heading
- Large search input that focuses on mount (`autoFocus`)
- "Browse Collections" section below showing collection cards

### components/search/SearchBar.tsx (client)

```ts
interface SearchBarProps {
  autoFocus?: boolean
  onClose?: () => void   // called when Escape pressed or result selected
  placeholder?: string
}
```

State:
- `query` — controlled input value
- `isOpen` — whether predictive dropdown is visible
- `isFetching` — loading state

Debounce: use `useDebounce(query, 300)` — hook already in Phase 1 scaffold.

Fetching predictive results — call the API route, not the lib function directly:
```ts
useEffect(() => {
  if (debouncedQuery.length < 2) { setResults(null); return }
  setIsFetching(true)
  fetch(`/api/search/predictive?q=${encodeURIComponent(debouncedQuery)}`)
    .then(r => r.json())
    .then(data => { setResults(data); setIsFetching(false) })
    .catch(() => setIsFetching(false))
}, [debouncedQuery])
```

Keyboard handling on the input:
- `Enter`: navigate to `/search?q=${query}`, call `onClose()`
- `Escape`: clear query, call `onClose()`
- `ArrowDown`: move focus into the predictive dropdown (set `activeIndex` state)

ARIA on the input:
```tsx
<input
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-controls="predictive-search-results"
  aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
  aria-label="Search products"
  type="search"
  autoComplete="off"
/>
```

### components/search/PredictiveSearch.tsx (client)

Rendered inside `SearchBar` when `isOpen && results`.

```ts
interface PredictiveSearchProps {
  results: ShopifyPredictiveSearchResult
  query: string
  activeIndex: number
  onSelect: () => void   // close dropdown + navigate
  isFetching: boolean
}
```

ARIA structure — required for keyboard navigation to be accessible:
```tsx
<ul
  id="predictive-search-results"
  role="listbox"
  aria-label="Search suggestions"
>
  {/* each item: */}
  <li
    id={`result-${index}`}
    role="option"
    aria-selected={activeIndex === index}
  >
    ...
  </li>
</ul>
```

Sections:
1. **Products** (up to 5 from `results.products`): thumbnail + name + `formatPrice(price)`
   → navigate to `/products/[handle]` on click/Enter
2. **Collections** (up to 3 from `results.collections`): name only
   → navigate to `/collections/[handle]`
3. **Suggested searches** (from `results.queries`): these are Shopify-suggested search terms
   (the `queries[].text` field) — render as clickable text items that populate the search input
   and navigate to `/search?q=[text]`
   - Note: `results.queries` may be empty — omit this section if so

Loading state: skeleton rows (3 rows, matching item height).
Empty state (results returned but all arrays empty): `"No results for '{query}'"`.

`useClickOutside` on the wrapper ref → close dropdown.

Keyboard navigation:
- `ArrowDown` / `ArrowUp`: update `activeIndex` in parent `SearchBar` (passed as prop)
- `Enter` on highlighted item: navigate to that item's URL
- Index flows across all sections (products + collections + queries are one flat list for
  keyboard purposes — compute a flat `allItems` array with their URLs)

"See all results" link at bottom:
```tsx
<Link href={`/search?q=${encodeURIComponent(query)}`} onClick={onSelect}>
  See all results for "{query}"
</Link>
```

### components/search/SearchResults.tsx

This is a thin presentational wrapper — do NOT duplicate `ProductGrid` logic.

```tsx
interface SearchResultsProps {
  products: ShopifyProduct[]
  query: string
  totalCount?: number
}

export function SearchResults({ products, query, totalCount }: SearchResultsProps) {
  if (products.length === 0) {
    return (
      <div>
        <p>No results found for "{query}".</p>
        {/* Link to /collections as a fallback */}
      </div>
    )
  }
  return (
    <div>
      <p className="text-label text-muted mb-6">
        {totalCount ?? products.length} results for "{query}"
      </p>
      <ProductGrid products={products} />
    </div>
  )
}
```

### Header integration — modifying components/layout/Header.tsx

The search overlay was described vaguely in Phase 2.2. Make these specific changes to `Header.tsx`:

Add state: `const [isSearchOpen, setIsSearchOpen] = useState(false)`

Search icon button: `onClick={() => setIsSearchOpen(true)}`

Add a search overlay element after the header nav:
```tsx
{isSearchOpen && (
  <div className="fixed inset-0 z-[60] bg-canvas/95 backdrop-blur-sm flex flex-col">
    <div className="container-wide pt-6">
      <div className="flex items-center gap-4">
        <SearchBar
          autoFocus
          onClose={() => setIsSearchOpen(false)}
          placeholder="Search products..."
        />
        <button
          onClick={() => setIsSearchOpen(false)}
          aria-label="Close search"
        >
          <X size={20} />  {/* lucide-react */}
        </button>
      </div>
    </div>
  </div>
)}
```

Use `useScrollLock` (Phase 1 scaffold) when overlay is open.

---

> **After Phase 5, verify:**
> - `/api/search/predictive?q=test` returns JSON in the browser
> - Predictive dropdown appears in header on typing
> - Arrow keys cycle through results without focus leaving the dropdown
> - Enter on a result navigates correctly
> - `/search?q=lamp` renders results with count
> - `/search` (no query) shows the search prompt + collections
> - `tsc --noEmit` — zero errors