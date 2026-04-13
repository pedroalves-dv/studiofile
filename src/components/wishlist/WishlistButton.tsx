"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/components/common/Toast";
import type { WishlistItem } from "@/context/WishlistContext";

interface WishlistButtonProps {
  productHandle: string;
  variantId?: string;
  selectedOptions?: WishlistItem["selectedOptions"];
  className?: string;
  iconSize?: number;
  strokeWidth?: number;
}

export function WishlistButton({
  productHandle,
  variantId,
  selectedOptions,
  className = "",
  iconSize = 18,
  strokeWidth = 2,
}: WishlistButtonProps) {
  const { items, isWishlisted, toggleItem } = useWishlist();
  const { success } = useToast();
  const [animate, setAnimate] = useState(false);
  const wishlisted = isWishlisted(productHandle);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault(); // prevent Link navigation if button is inside a card Link
    e.stopPropagation();
    const existing = items.find((i) => i.handle === productHandle);
    const isUpgrade = existing && variantId && existing.variantId !== variantId;
    const toastMsg = isUpgrade
      ? "Wishlist updated"
      : existing
        ? "Removed from wishlist"
        : "Added to wishlist";
    toggleItem(productHandle, variantId, selectedOptions);
    success(toastMsg);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  }

  return (
    <>
      <style>{`
        @keyframes wishlistPop {
          0% { transform: scale(1) }
          50% { transform: scale(1.3) }
          100% { transform: scale(1) }
        }
        .wishlist-pop { animation: wishlistPop 300ms ease-in-out; }
      `}</style>
      <button
        onClick={handleToggle}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`p-2 bg-transparent transition-colors ${animate ? "wishlist-pop" : ""} ${className}`}
      >
        <Heart
          size={iconSize}
          strokeWidth={strokeWidth}
          fill={wishlisted ? "currentColor" : "none"}
          className={wishlisted ? "text-ink" : "text-ink"}
        />
      </button>
    </>
  );
}
