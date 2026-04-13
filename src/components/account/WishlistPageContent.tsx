"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import type { WishlistItem } from "@/context/WishlistContext";
import type { ShopifyProduct } from "@/lib/shopify/types";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full sm:w-72 border border-stroke rounded-lg overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-square bg-stone-100" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-stone-100 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/4" />
            <div className="h-9 bg-stone-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface WishlistCardProps {
  product: ShopifyProduct;
  item: WishlistItem;
}

function WishlistCard({ product, item }: WishlistCardProps) {
  const { removeItem } = useWishlist();
  const { addItem } = useCart();
  const price = product.priceRange.minVariantPrice;
  const hasVariant = !!item.variantId;

  return (
    <div className="relative w-full sm:w-72 border border-stroke rounded-lg overflow-hidden flex flex-col">
      {/* Remove */}
      <button
        onClick={() => removeItem(product.handle)}
        aria-label={`Remove ${product.title} from wishlist`}
        className="absolute top-3 right-3 z-10 p-1.5 bg-canvas/80 hover:bg-canvas rounded-full text-muted hover:text-error transition-colors"
      >
        <X size={14} strokeWidth={2} />
      </button>

      {/* Image */}
      <Link href={`/products/${product.handle}`}>
        <div className="w-full aspect-square bg-stone-50 relative overflow-hidden">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, 288px"
            />
          ) : (
            <div className="w-full h-full bg-stone-100" />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/products/${product.handle}`}>
          <p className="font-medium tracking-[-0.04em] text-lg leading-tight hover:text-muted transition-colors line-clamp-2">
            {product.title}
          </p>
        </Link>

        <p className="text-sm text-muted">
          {formatPrice(price.amount, price.currencyCode)}
        </p>

        {/* Selected options */}
        {hasVariant && item.selectedOptions && item.selectedOptions.length > 0 && (
          <p className="text-xs text-muted">
            {item.selectedOptions.map((o) => o.value).join(" / ")}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          {hasVariant ? (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => item.variantId && addItem(item.variantId, 1)}
              className="rounded-lg"
            >
              Add to Cart
            </Button>
          ) : (
            <Button variant="secondary" size="md" fullWidth asChild className="rounded-lg">
              <Link href={`/products/${product.handle}`}>Add Options</Link>
            </Button>
          )}
        </div>
      </div>
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
    const handles = items.map((i) => i.handle).join(",");
    fetch(`/api/products/batch?handles=${handles}`)
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
        <div className="flex flex-wrap gap-4">
          {products.map((product) => {
            const item = items.find((i) => i.handle === product.handle);
            if (!item) return null;
            return (
              <WishlistCard key={product.handle} product={product} item={item} />
            );
          })}
        </div>
      )}
    </section>
  );
}
