// src/components/cart/CartDrawer.tsx
"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
// ❌ Remove: import { Dialog } from "@/components/ui/Dialog";
import { useCart } from "@/hooks/useCart";
import { useLenis } from "@/components/common/SmoothScroll";
import { CartItem } from "./CartItem";
import { TotemCartGroup } from "./TotemCartGroup";
import { CartSummary } from "./CartSummary";
import { DiscountInput } from "./DiscountInput";
import { CartNote } from "./CartNote";
import { FreeShippingBar } from "./FreeShippingBar";
import { EmptyCart } from "./EmptyCart";
import type { ShopifyCartLine } from "@/lib/shopify/types";

export function CartDrawer() {
  const { cart, isOpen, closeCart } = useCart();
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible) {
      lenis?.start();
      setIsClosing(true);
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(closeTimer);
    }
  }, [isOpen, lenis, isVisible]);

  // ✅ Scroll lock + Escape key — replaces Dialog
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const hasItems = cart && cart.lines.length > 0;

  if (!isVisible) return null;

  return (
    <>
      {/* ✅ Desktop-only backdrop — invisible, just catches outside clicks */}
      <div className="hidden sm:block fixed inset-0 z-40" onClick={closeCart} />

      {/* Drawer — z-50 sits above the backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        className="w-full fixed top-[var(--header-height)] bottom-0 right-0 max-w-md flex flex-col bg-canvas sm:border-x sm:border-stroke sm:shadow-[-25px_30px_60px_-20px_rgba(0,0,0,0.03)] z-50"
        style={{
          animation: `${isClosing ? "navSlideUp" : "navSlideDown"} 150ms ease-in-out${isClosing ? " forwards" : ""}`,
        }}
      >
        {/* ✅ Everything below here is identical to your original */}
        <div className="flex items-center justify-between py-4 border-b border-stroke px-site">
          <h2 className="text-3xl font-semibold text-ink tracking-[-0.03em] leading-none translate-y-[2px]">
            Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ""}
          </h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={28} />
          </button>
        </div>

        <FreeShippingBar cart={cart} />

        <div className="flex-1 overflow-y-auto py-2 px-2" data-lenis-prevent>
          {!hasItems ? (
            <EmptyCart />
          ) : (
            (() => {
              const groups = new Map<string, ShopifyCartLine[]>();
              const ungrouped: ShopifyCartLine[] = [];
              for (const line of cart.lines) {
                const buildId = line.attributes.find(
                  (a) => a.key === "_build_id",
                )?.value;
                if (buildId) {
                  groups.set(buildId, [...(groups.get(buildId) ?? []), line]);
                } else {
                  ungrouped.push(line);
                }
              }
              return (
                <>
                  {ungrouped.map((line) => (
                    <CartItem key={line.id} line={line} />
                  ))}
                  {Array.from(groups.entries()).map(([buildId, groupLines]) => (
                    <TotemCartGroup key={buildId} lines={groupLines} />
                  ))}
                  <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-stroke -mx-2 px-site">
                    <DiscountInput />
                    <CartNote />
                  </div>
                </>
              );
            })()
          )}
        </div>

        {hasItems && (
          <div className="border-t border-stroke px-2">
            <CartSummary cart={cart} />
          </div>
        )}
      </div>
    </>
  );
}
