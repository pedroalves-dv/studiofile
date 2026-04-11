import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts } from "@/lib/shopify/search";
import { getCollections } from "@/lib/shopify/collections";
import { SORT_MAP } from "@/lib/utils/params";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { SortSelect } from "@/components/search/SortSelect";
import { FilterPanel } from "@/components/search/FilterPanel";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    filter?: string | string[];
    cursor?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    description: q
      ? `Search results for "${q}" on Studiofile.`
      : "Search the Studiofile collection.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, sort, filter, cursor } = await searchParams;

  const sortEntry = SORT_MAP[sort as string] ?? {
    sortKey: "RELEVANCE",
    reverse: false,
  };
  const sortKey = sortEntry.sortKey as
    | "RELEVANCE"
    | "PRICE"
    | "BEST_SELLING"
    | "CREATED";
  const reverse = sortEntry.reverse;

  const filterParams = filter
    ? Array.isArray(filter)
      ? filter
      : [filter]
    : [];

  // Build Shopify query string (append filter clauses)
  const filterClauses = filterParams
    .map((f) => {
      if (f === "availability:in-stock") return "available_for_sale:true";
      if (f.startsWith("type:")) return `product_type:${f.slice(5)}`;
      if (f.startsWith("tag:")) return `tag:${f.slice(4)}`;
      return null;
    })
    .filter(Boolean) as string[];

  const fullQuery = q ? [q, ...filterClauses].join(" AND ") : "";

  // Fetch data in parallel only when a query exists
  const [searchResult, collections] = await Promise.all([
    fullQuery
      ? searchProducts(fullQuery, {
          first: 24,
          after: cursor,
          sortKey,
          reverse,
        })
      : Promise.resolve(null),
    !q ? getCollections() : Promise.resolve([]),
  ]);

  const hasQuery = Boolean(q?.trim());

  return (
    <div>
      <section>
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl tracking-tight mb-6">
            {hasQuery ? (
              <>
                Search results for{" "}
                <span className="italic text-muted">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              "Search"
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
                  className="group border border-stroke p-6 hover:border-ink transition-colors"
                >
                  <p className="text-xl group-hover:text-accent transition-colors">
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
              {/* Sort row */}
              <div className="flex items-center justify-end mb-8">
                <SortSelect />
              </div>

              <SearchResults
                products={searchResult.products}
                query={q!}
                totalCount={searchResult.totalCount}
              />

              {/* Load more — URL-based cursor pagination */}
              {searchResult.pageInfo.hasNextPage &&
                searchResult.pageInfo.endCursor && (
                  <div className="mt-16 flex flex-col items-center gap-3">
                    <Link
                      href={`/search?q=${encodeURIComponent(q!)}${sort ? `&sort=${sort}` : ""}${filterParams.map((f) => `&filter=${encodeURIComponent(f)}`).join("")}&cursor=${searchResult.pageInfo.endCursor}`}
                      className="inline-flex items-center justify-center px-8 py-3 border border-ink text-label text-ink hover:bg-ink hover:text-canvas transition-colors"
                    >
                      Load more
                    </Link>
                    <p className="text-label text-muted">
                      Showing {searchResult.products.length} of{" "}
                      {searchResult.totalCount}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
