"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Heart } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";
import type { ShopifyProduct } from "@/lib/shopify/types";

function WishlistSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-16 h-16 bg-stone-100 flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-stone-100 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface WishlistItemProps {
  product: ShopifyProduct;
  onClose: () => void;
}

function WishlistItem({ product, onClose }: WishlistItemProps) {
  const { removeItem } = useWishlist();
  const { addItem } = useCart();
  const price = product.priceRange.minVariantPrice;

  const firstAvailableVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Thumbnail */}
      <Link
        href={`/products/${product.handle}`}
        onClick={onClose}
        className="flex-shrink-0"
      >
        <div className="w-16 h-16 bg-stone-50 relative overflow-hidden">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-stone-100" />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.handle}`} onClick={onClose}>
          <p className="text-sm leading-tight hover:text-muted transition-colors truncate">
            {product.title}
          </p>
        </Link>
        <p className="text-xs text-muted mt-1">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
        <button
          onClick={() =>
            firstAvailableVariant && addItem(firstAvailableVariant.id, 1)
          }
          disabled={!firstAvailableVariant}
          className="mt-2 text-label text-ink hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(product.handle)}
        aria-label={`Remove ${product.title} from wishlist`}
        className="flex-shrink-0 p-1 hover:text-accent transition-colors self-start"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function WishlistDrawer() {
  const { isOpen, closeDrawer, items } = useWishlist();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setProducts([]);
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
  }, [isOpen, items]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeDrawer();
      }}
    >
      <div
        className="fixed inset-y-0 right-0 w-full max-w-md flex flex-col bg-canvas shadow-2xl"
        style={{ animation: "slideInRight 350ms ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="tracking-tight text-2xl">
            Wishlist {items.length > 0 ? `(${items.length})` : ""}
          </h2>
          <button onClick={closeDrawer} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && <WishlistSkeleton />}

          {!isLoading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-12 text-center pb-24">
              <Heart size={48} className="text-light" />
              <p className="tracking-[-1px] text-6xl">
                Your wishlist is empty.
              </p>
              <Button onClick={closeDrawer} asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </div>
          )}

          {!isLoading &&
            products.map((product) => (
              <WishlistItem
                key={product.handle}
                product={product}
                onClose={closeDrawer}
              />
            ))}
        </div>
      </div>
    </Dialog>
  );
}
