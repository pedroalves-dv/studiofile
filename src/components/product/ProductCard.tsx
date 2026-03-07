import Link from 'next/link';
import Image from 'next/image';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { formatPrice, isOnSale, getDiscountPercent } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, compareAtPriceRange, availableForSale } =
    product;

  const price = priceRange.minVariantPrice;
  const compareAtPrice = compareAtPriceRange.minVariantPrice;
  const onSale = compareAtPrice ? isOnSale(price, compareAtPrice) : false;
  const discountPercent =
    onSale && compareAtPrice ? getDiscountPercent(price, compareAtPrice) : 0;

  return (
    <Link
      href={`/products/${handle}`}
      className="group block"
      style={{ viewTransitionName: `product-card-${handle}` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-50 aspect-[3/4] mb-4">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
            <span className="text-label text-muted">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {!availableForSale && <Badge variant="soldOut">Sold out</Badge>}
          {onSale && availableForSale && (
            <Badge variant="sale">−{discountPercent}%</Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-display text-lg leading-tight group-hover:text-muted transition-colors">
          {title}
        </h3>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-ink">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {onSale && compareAtPrice && (
            <span className="font-mono text-xs text-muted line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
