'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface ProductGridProps {
  products: ShopifyProduct[];
  totalCount?: number;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export function ProductGrid({
  products,
  totalCount,
  isLoadingMore = false,
  onLoadMore,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink/60">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Result count */}
      <div className="mb-6 text-sm text-ink/70">
        Showing {products.length}
        {totalCount && ` of ${totalCount}`} products
      </div>

      {/* Asymmetric editorial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product, index) => {
          // Asymmetric rhythm: every 5th and 8th cards span 2 columns
          const spanFull =
            (index + 1) % 8 === 0 || (index + 1) % 5 === 0;
          const rowSpan = (index + 1) % 7 === 0 ? 'lg:row-span-2' : '';

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className={`group block ${spanFull ? 'sm:col-span-2 lg:col-span-1' : ''} ${rowSpan}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                {/* Product image */}
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-100">
                    <span className="text-stone-400 text-center px-4">
                      No image
                    </span>
                  </div>
                )}

                {/* Product status badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {product.availableForSale === false && (
                    <Badge variant="soldOut">Sold out</Badge>
                  )}
                  {product.tags?.includes('New') && (
                    <Badge variant="new">New</Badge>
                  )}
                  {product.tags?.includes('Sale') && (
                    <Badge variant="sale">Sale</Badge>
                  )}
                </div>
              </div>

              {/* Product info */}
              <h3 className="font-display text-base md:text-lg text-ink mb-2 group-hover:text-accent transition-colors">
                {product.title}
              </h3>

              <div className="flex items-baseline gap-2">
                {product.priceRange.minVariantPrice.amount && (
                  <>
                    <span className="font-mono text-sm text-ink">
                      ${parseFloat(
                        product.priceRange.minVariantPrice.amount
                      ).toFixed(0)}
                    </span>
                    {product.priceRange.maxVariantPrice.amount !==
                      product.priceRange.minVariantPrice.amount && (
                      <span className="font-mono text-sm text-ink/50">
                        –${parseFloat(
                          product.priceRange.maxVariantPrice.amount
                        ).toFixed(0)}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Variant count */}
              {product.variants && product.variants.length > 1 && (
                <p className="text-xs text-ink/50 mt-2">
                  {product.variants.length} options
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Load more button */}
      {onLoadMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 border border-ink text-ink font-medium hover:bg-ink hover:text-canvas transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
