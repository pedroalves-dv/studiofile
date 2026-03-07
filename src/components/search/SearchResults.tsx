'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ShopifyProduct, ShopifyPageInfo } from '@/lib/shopify/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/common/SkeletonCard';

interface SearchResultsProps {
  query: string;
  initialProducts: ShopifyProduct[];
  pageInfo: ShopifyPageInfo;
  totalCount: number;
  sort: string;
  filterParams: string[];
}

export function SearchResults({
  query,
  initialProducts,
  pageInfo,
  totalCount,
  sort,
  filterParams,
}: SearchResultsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [currentPageInfo, setCurrentPageInfo] = useState<ShopifyPageInfo>(pageInfo);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (!currentPageInfo.hasNextPage || !currentPageInfo.endCursor) return;
    setIsLoadingMore(true);

    try {
      const params = new URLSearchParams();
      params.set('q', query);
      params.set('cursor', currentPageInfo.endCursor);
      if (sort && sort !== 'RELEVANCE') params.set('sort', sort);
      filterParams.forEach((f) => params.append('filter', f));

      const res = await fetch(`/api/search/products?${params.toString()}`);
      const data = await res.json();

      setProducts((prev) => [...prev, ...data.products]);
      setCurrentPageInfo(data.pageInfo);
    } catch {
      // fail silently
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!query) return null;

  // Zero results
  if (products.length === 0) {
    return (
      <div className="py-16 text-center space-y-6">
        <p className="font-display text-3xl text-ink">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="text-sm text-muted max-w-sm mx-auto">
          Try a different search term, or browse our collections below.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/shop" className="text-label text-muted hover:text-ink transition-colors underline">
            Shop All
          </Link>
          <Link href="/collections" className="text-label text-muted hover:text-ink transition-colors underline">
            View Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Result count */}
      <p className="text-label text-muted mb-8">
        Showing {products.length} of {totalCount}{' '}
        {totalCount === 1 ? 'result' : 'results'} for &ldquo;
        <span className="text-ink">{query}</span>&rdquo;
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {isLoadingMore &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Load more */}
      {currentPageInfo.hasNextPage && (
        <div className="mt-16 flex flex-col items-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            isLoading={isLoadingMore}
            onClick={handleLoadMore}
          >
            Load more
          </Button>
          <p className="text-label text-muted">
            Showing {products.length} of {totalCount}
          </p>
        </div>
      )}
    </div>
  );
}
