"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
// ❌ Remove: import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useLenis } from "@/components/common/SmoothScroll";
import { formatPrice } from "@/lib/utils/format";
import type { WishlistItem } from "@/context/WishlistContext";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ArrowButton } from "@/components/ui/ArrowButton";

// ─── Skeleton ──────────────────────────────────────────────────────────────────

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

// ─── Item ──────────────────────────────────────────────────────────────────────

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
          {hasVariant &&
            item.selectedOptions &&
            item.selectedOptions.length > 0 && (
              <>
                <span className="text-xs text-muted">·</span>
                <p className="text-xs text-muted">
                  {item.selectedOptions.map((o) => o.value).join(" / ")}
                </p>
              </>
            )}
        </div>
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

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      setIsVisible(true);
      setIsClosing(false);
      // ✅ Set loading immediately on open so the first render shows the
      // skeleton rather than a blank frame — this fixes the flash
      setIsLoading(items.length > 0);
    } else if (isVisible) {
      lenis?.start();
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, lenis, isVisible, items.length]);

  // ✅ Scroll lock + Escape — mirrors CartDrawer, replaces Dialog
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeDrawer]);

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

  if (!isVisible) return null;

  return (
    <>
      {/* ✅ Desktop-only backdrop for click-outside — mirrors CartDrawer */}
      <div
        className="hidden sm:block fixed inset-0 z-40"
        onClick={closeDrawer}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="w-full fixed top-[var(--header-height)] bottom-0 right-0 max-w-md flex flex-col bg-canvas sm:border-x sm:border-stroke sm:shadow-[-25px_30px_60px_-20px_rgba(0,0,0,0.03)] z-50"
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
            <div className="flex flex-col h-full px-site">
              <div className="py-6">
                <p className="text-6xl sm:text-7xl font-medium tracking-[-0.06em] leading-[0.9]">
                  Your wishlist is empty
                </p>
              </div>
              <ArrowButton
                href="/products"
                label="Browse products"
                className="w-fit px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.03em] rounded-lg border border-ink disabled:opacity-50"
              />
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
    </>
  );
}
