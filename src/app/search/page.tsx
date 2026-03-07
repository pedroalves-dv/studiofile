import type { Metadata } from 'next';
import Link from 'next/link';
import { searchProducts } from '@/lib/shopify/search';
import { getCollections } from '@/lib/shopify/collections';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { SortSelect } from '@/components/search/SortSelect';
import { FilterPanel } from '@/components/search/FilterPanel';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    filter?: string | string[];
    cursor?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: q ? `Search results for "${q}" on Studiofile.` : 'Search the Studiofile collection.',
    robots: { index: false, follow: true },
  };
}

// Map URL sort param → API sort key + reverse flag
function parseSortParam(sort?: string): {
  sortKey: 'RELEVANCE' | 'PRICE' | 'BEST_SELLING' | 'CREATED';
  reverse: boolean;
} {
  switch (sort) {
    case 'PRICE_ASC':   return { sortKey: 'PRICE', reverse: false };
    case 'PRICE_DESC':  return { sortKey: 'PRICE', reverse: true };
    case 'BEST_SELLING': return { sortKey: 'BEST_SELLING', reverse: false };
    case 'CREATED':     return { sortKey: 'CREATED', reverse: false };
    default:            return { sortKey: 'RELEVANCE', reverse: false };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, sort, filter, cursor } = await searchParams;

  const filterParams = filter ? (Array.isArray(filter) ? filter : [filter]) : [];
  const { sortKey, reverse } = parseSortParam(sort);

  // Build Shopify query string (append filter clauses)
  const filterClauses = filterParams
    .map((f) => {
      if (f === 'availability:in-stock') return 'available_for_sale:true';
      if (f.startsWith('type:')) return `product_type:${f.slice(5)}`;
      if (f.startsWith('tag:')) return `tag:${f.slice(4)}`;
      return null;
    })
    .filter(Boolean) as string[];

  const fullQuery = q ? [q, ...filterClauses].join(' AND ') : '';

  // Fetch data in parallel only when a query exists
  const [searchResult, collections] = await Promise.all([
    fullQuery
      ? searchProducts(fullQuery, { first: 24, after: cursor, sortKey, reverse })
      : Promise.resolve(null),
    !q ? getCollections() : Promise.resolve([]),
  ]);

  const hasQuery = Boolean(q?.trim());

  return (
    <main id="main-content" className="section-padding">
      <div className="container-wide">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-6">
            {hasQuery ? (
              <>
                Search results for{' '}
                <span className="italic text-muted">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              'Search'
            )}
          </h1>

          {/* Search bar (client island) */}
          <div className="max-w-xl">
            <SearchBar />
          </div>
        </div>

        {/* ── No query state ── */}
        {!hasQuery && (
          <div className="mt-12">
            <p className="text-label text-muted mb-8">Browse Collections</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group border border-border p-6 hover:border-ink transition-colors"
                >
                  <p className="font-display text-xl group-hover:text-accent transition-colors">
                    {collection.title}
                  </p>
                  {collection.description && (
                    <p className="text-sm text-muted mt-2 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Results state ── */}
        {hasQuery && searchResult && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mt-2">
            {/* Sidebar filters */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <FilterPanel />
            </aside>

            {/* Main results */}
            <div className="flex-1 min-w-0">
              {/* Sort + count row */}
              <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                <p className="text-label text-muted">
                  {searchResult.totalCount}{' '}
                  {searchResult.totalCount === 1 ? 'result' : 'results'}
                </p>
                <SortSelect />
              </div>

              <SearchResults
                query={q!}
                initialProducts={searchResult.products}
                pageInfo={searchResult.pageInfo}
                totalCount={searchResult.totalCount}
                sort={sort ?? 'RELEVANCE'}
                filterParams={filterParams}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
