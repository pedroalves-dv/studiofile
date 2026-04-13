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
import type { WishlistItem } from "@/context/WishlistContext";
import type { ShopifyProduct } from "@/lib/shopify/types";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-4 py-4 border-b border-stroke animate-pulse"
        >
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

interface WishlistItemRowProps {
  product: ShopifyProduct;
  item: WishlistItem;
  onClose: () => void;
}

function WishlistItemRow({ product, item, onClose }: WishlistItemRowProps) {
  const { removeItem } = useWishlist();
  const { addItem } = useCart();
  const price = product.priceRange.minVariantPrice;
  const hasVariant = !!item.variantId;

  return (
    <div className="flex gap-4 p-2 border border-stroke rounded-lg mb-2">
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
      <div className="flex flex-1 flex-col justify-between">
        <Link href={`/products/${product.handle}`} onClick={onClose}>
          <p className="text-2xl font-semibold tracking-tighter leading-none text-ink truncate">
            {product.title}
          </p>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-muted">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          {hasVariant && item.selectedOptions && item.selectedOptions.length > 0 && (
            <>
              <span className="text-xs text-muted">·</span>
              <p className="text-xs text-muted">
                {item.selectedOptions.map((o) => o.value).join(" / ")}
              </p>
            </>
          )}
        </div>

        {/* CTA */}
        {hasVariant ? (
          <Button
            variant="primary"
            size="md"
            className="mt-2 rounded-lg self-start"
            onClick={() => item.variantId && addItem(item.variantId, 1)}
          >
            Add to Cart
          </Button>
        ) : (
          <Button
            asChild
            variant="secondary"
            size="md"
            className="mt-2 rounded-lg border-stroke self-start"
          >
            <Link href={`/products/${product.handle}`} onClick={onClose}>
              Add Options
            </Link>
          </Button>
        )}
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
    const handles = items.map((i) => i.handle).join(",");
    fetch(`/api/products/batch?handles=${handles}`)
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
        <div className="flex-1 overflow-y-auto py-2 px-2" data-lenis-prevent>
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
            products.map((product) => {
              const item = items.find((i) => i.handle === product.handle);
              if (!item) return null;
              return (
                <WishlistItemRow
                  key={product.handle}
                  product={product}
                  item={item}
                  onClose={closeDrawer}
                />
              );
            })}
        </div>
      </div>
    </Dialog>
  );
}
