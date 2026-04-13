"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import type { ShopifyProduct } from "@/lib/shopify/types";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-stroke border border-stroke">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-6 p-6 animate-pulse">
          <div className="w-24 h-24 bg-stone-100 flex-shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-stone-100 rounded w-2/3" />
            <div className="h-3 bg-stone-100 rounded w-1/4" />
            <div className="h-3 bg-stone-100 rounded w-1/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface WishlistItemProps {
  product: ShopifyProduct;
}

function WishlistItem({ product }: WishlistItemProps) {
  const { removeItem } = useWishlist();
  const { addItem } = useCart();
  const price = product.priceRange.minVariantPrice;
  const firstAvailableVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  return (
    <div className="flex gap-6 p-6">
      {/* Thumbnail */}
      <Link href={`/products/${product.handle}`} className="flex-shrink-0">
        <div className="w-32 h-32 bg-stone-50 relative overflow-hidden">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-stone-100" />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.handle}`}>
          <p className="font-medium tracking-[-0.05em] text-4xl leading-tight hover:text-muted transition-colors">
            {product.title}
          </p>
        </Link>
        <p className="text-lg text-muted mt-1">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
        <Button
          variant="secondary"
          size="md"
          onClick={() =>
            firstAvailableVariant && addItem(firstAvailableVariant.id, 1)
          }
          disabled={!firstAvailableVariant}
          className="mt-3 rounded-lg"
        >
          Add to Cart
        </Button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(product.handle)}
        aria-label={`Remove ${product.title} from wishlist`}
        className="flex flex-shrink-0 p-1 hover:text-accent transition-colors self-start justify-start"
      >
        <X size={20} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

export function WishlistPageContent() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`/api/products/batch?handles=${items.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [items]);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="tracking-[-0.055em] font-medium text-4xl md:text-6xl text-ink">
          Wishlist
          {items.length > 0 && (
            <span className="text-muted ml-3 text-3xl md:text-5xl font-normal">
              ({items.length})
            </span>
          )}
        </h2>
      </div>

      {isLoading && <WishlistSkeleton />}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-8 py-24 text-center border border-stroke rounded-lg">
          <Heart size={40} className="text-light" strokeWidth={1.5} />
          <p className="text-sm text-muted">Your wishlist is empty.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="flex flex-col divide-y divide-stroke border border-stroke rounded-lg">
          {products.map((product) => (
            <WishlistItem key={product.handle} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
