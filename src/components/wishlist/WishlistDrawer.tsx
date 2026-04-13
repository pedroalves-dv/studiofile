"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Heart } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useLenis } from "@/components/common/SmoothScroll";
import { formatPrice } from "@/lib/utils/format";
import type { ShopifyProduct } from "@/lib/shopify/types";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 py-4 border-b border-stroke animate-pulse">
          <div className="w-24 aspect-square bg-stone-100 flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-stone-100 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

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
    <div className="flex gap-4 py-4 border-b border-stroke last:border-b-0">
      {/* Thumbnail */}
      <Link
        href={`/products/${product.handle}`}
        onClick={onClose}
        className="flex-shrink-0"
      >
        <div className="w-24 aspect-square bg-stone-100 relative overflow-hidden">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-stone-200" />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.handle}`} onClick={onClose}>
          <p className="text-2xl font-semibold tracking-tighter leading-none text-ink truncate">
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
        className="flex-shrink-0 p-1 text-muted hover:text-error transition-colors self-start"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

export function WishlistDrawer() {
  const { isOpen, closeDrawer, items } = useWishlist();
  const lenis = useLenis();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Mirror CartDrawer: lenis stop/start + slide animation states
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible) {
      lenis?.start();
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, lenis, isVisible]);

  // Fetch product data when drawer opens
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
    <Dialog open={isVisible} onOpenChange={closeDrawer}>
      <div
        className="w-full fixed top-[var(--header-height)] bottom-0 right-0 max-w-md flex flex-col bg-canvas sm:border-x sm:border-stroke sm:shadow-[-25px_30px_60px_-20px_rgba(0,0,0,0.03)]"
        style={{
          animation: `${isClosing ? "navSlideUp" : "navSlideDown"} 150ms ease-in-out${isClosing ? " forwards" : ""}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-stroke px-site">
          <h2 className="text-3xl font-semibold text-ink tracking-[-0.03em] leading-none translate-y-[2px]">
            Wishlist {items.length > 0 ? `(${items.length})` : ""}
          </h2>
          <button onClick={closeDrawer} aria-label="Close wishlist">
            <X size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 px-site" data-lenis-prevent>
          {isLoading && <WishlistSkeleton />}

          {!isLoading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-8 text-center pb-24">
              <Heart size={48} className="text-light" strokeWidth={1.5} />
              <p className="tracking-[-1px] text-5xl">
                Your wishlist is empty.
              </p>
              <Button onClick={closeDrawer} asChild>
                <Link href="/products">Browse Products</Link>
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
