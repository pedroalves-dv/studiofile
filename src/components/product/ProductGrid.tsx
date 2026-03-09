'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface ProductGridProps {
  products: ShopifyProduct[];
  totalCount?: number;
  showCount?: boolean;
}

export function ProductGrid({ products, totalCount, showCount = true }: ProductGridProps) {

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
      {showCount && (
        <div className="mb-6 text-sm text-ink/70">
          {totalCount && totalCount > products.length
            ? `Showing ${products.length} of ${totalCount} products`
            : `Showing ${products.length} products`}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group block"
            data-product-card
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                  <span className="text-label text-muted">No image</span>
                </div>
              )}

              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {!product.availableForSale && <Badge variant="soldOut">Sold out</Badge>}
                {product.tags?.includes('New') && <Badge variant="new">New</Badge>}
                {product.tags?.includes('Sale') && <Badge variant="sale">Sale</Badge>}
              </div>
            </div>

            <h3 className="font-display text-base md:text-lg text-ink mb-2 group-hover:text-muted transition-colors">
              {product.title}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm text-ink">
                {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}{' '}
                {product.priceRange.minVariantPrice.currencyCode}
              </span>
              {product.priceRange.maxVariantPrice.amount !==
                product.priceRange.minVariantPrice.amount && (
                <span className="font-mono text-sm text-ink/50">
                  –{parseFloat(product.priceRange.maxVariantPrice.amount).toFixed(0)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
