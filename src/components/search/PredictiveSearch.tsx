'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Search } from 'lucide-react';
import type { ShopifyPredictiveSearchResult } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';

interface PredictiveSearchProps {
  query: string;
  results: ShopifyPredictiveSearchResult;
  isFetching: boolean;
  activeIndex: number;
  onSelect: (href: string) => void;
  onSeeAll: () => void;
}

export function PredictiveSearch({
  query,
  results,
  isFetching,
  activeIndex,
  onSelect,
  onSeeAll,
}: PredictiveSearchProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { products, collections, queries } = results;

  // Build flat navigable item list to map activeIndex → href (products → collections → queries)
  const items: { href: string }[] = [
    ...products.slice(0, 5).map((p) => ({ href: `/products/${p.handle}` })),
    ...collections.slice(0, 3).map((c) => ({ href: `/collections/${c.handle}` })),
    ...queries.slice(0, 3).map((q) => ({ href: `/search?q=${encodeURIComponent(q.text)}` })),
  ];

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelectorAll('[data-item]')[activeIndex] as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Select on Enter when item is keyboard-highlighted
  useEffect(() => {
    if (activeIndex < 0 || activeIndex >= items.length) return;
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onSelect(items[activeIndex].href);
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [activeIndex, items, onSelect]);

  const hasResults = products.length > 0 || collections.length > 0 || queries.length > 0;

  // Mutable counter so each section contributes sequential indices
  let runningIndex = -1;
  const nextIdx = () => {
    runningIndex += 1;
    return runningIndex;
  };

  return (
    <div
      id="predictive-search-results"
      ref={listRef}
      role="listbox"
      aria-label="Search suggestions"
      className="absolute top-full left-0 right-0 bg-canvas border border-border border-t-0 z-50 shadow-xl max-h-[70vh] overflow-y-auto"
    >
      {isFetching ? (
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton className="w-12 h-12 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasResults ? (
        <p className="p-6 text-sm text-muted">
          No results for &ldquo;<span className="text-ink font-medium">{query}</span>&rdquo;
        </p>
      ) : (
        <>
          {/* Products */}
          {products.length > 0 && (
            <div>
              <p className="text-label text-muted px-6 pt-5 pb-2">Products</p>
              {products.slice(0, 5).map((product) => {
                const idx = nextIdx();
                const price = product.priceRange.minVariantPrice;
                return (
                  <button
                    key={product.id}
                    id={`result-${idx}`}
                    data-item
                    role="option"
                    aria-selected={activeIndex === idx}
                    onClick={() => onSelect(`/products/${product.handle}`)}
                    className={cn(
                      'flex items-center gap-4 w-full px-6 py-3 text-left transition-colors',
                      activeIndex === idx ? 'bg-canvas' : 'hover:bg-canvas'
                    )}
                  >
                    <div className="flex-shrink-0 w-12 h-12 relative bg-stone-100 overflow-hidden">
                      {product.featuredImage && (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{product.title}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {formatPrice(price.amount, price.currencyCode)}
                      </p>
                    </div>
                    <ArrowRight size={14} className="flex-shrink-0 text-muted" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Collections */}
          {collections.length > 0 && (
            <div className="border-t border-border">
              <p className="text-label text-muted px-6 pt-5 pb-2">Collections</p>
              {collections.slice(0, 3).map((collection) => {
                const idx = nextIdx();
                return (
                  <button
                    key={collection.id}
                    id={`result-${idx}`}
                    data-item
                    role="option"
                    aria-selected={activeIndex === idx}
                    onClick={() => onSelect(`/collections/${collection.handle}`)}
                    className={cn(
                      'flex items-center gap-4 w-full px-6 py-3 text-left transition-colors',
                      activeIndex === idx ? 'bg-canvas' : 'hover:bg-canvas'
                    )}
                  >
                    <div className="flex-shrink-0 w-12 h-12 relative bg-stone-100 overflow-hidden">
                      {collection.image && (
                        <Image
                          src={collection.image.url}
                          alt={collection.image.altText || collection.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <p className="text-sm text-ink">{collection.title}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Suggested searches */}
          {queries.length > 0 && (
            <div className="border-t border-border">
              {queries.slice(0, 3).map((q) => {
                const idx = nextIdx();
                return (
                  <button
                    key={q.text}
                    id={`result-${idx}`}
                    data-item
                    role="option"
                    aria-selected={activeIndex === idx}
                    onClick={() => onSelect(`/search?q=${encodeURIComponent(q.text)}`)}
                    className={cn(
                      'flex items-center gap-3 w-full px-6 py-3 text-left transition-colors',
                      activeIndex === idx ? 'bg-canvas' : 'hover:bg-canvas'
                    )}
                  >
                    <Search size={14} className="flex-shrink-0 text-muted" />
                    <span className="text-sm text-ink">{q.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* See all */}
          <div className="border-t border-border p-4">
            <button
              onClick={onSeeAll}
              className="w-full flex items-center justify-center gap-2 text-label text-muted hover:text-ink transition-colors py-1"
            >
              See all results for &ldquo;{query}&rdquo;
              <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
