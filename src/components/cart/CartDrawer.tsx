"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
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
    const mainElement = document.getElementById("main-content");

    if (isOpen) {
      lenis?.stop();
      setIsVisible(true);
      setIsClosing(false);
      if (mainElement) {
        // Create depth via scale and brightness, NOT blur
        mainElement.style.transform = "scale(0.98)";
        mainElement.style.filter = "brightness(0.7)";
        mainElement.style.transition = "all 0.15s ease-in-out";
        mainElement.style.overflow = "hidden";
      }
    } else if (isVisible) {
      lenis?.start();
      if (mainElement) {
        mainElement.style.transform = "scale(1)";
        mainElement.style.filter = "none";
      }
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, lenis, isVisible]);

  return (
    <Dialog open={isVisible} onOpenChange={closeCart}>
      <div
        className="w-full fixed top-[var(--header-height)] bottom-0 right-0 max-w-md flex flex-col bg-canvas sm:border-x sm:border-stroke"
        style={{
          animation: `${isClosing ? "slideOutRight" : "slideInRight"} 150ms ease-in-out${isClosing ? " forwards" : ""}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-stroke px-5">
          <h2 className="text-3xl font-semibold text-ink tracking-[-0.03em] leading-none translate-y-[2px]">
            Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ""}
          </h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={28} />
          </button>
        </div>

        {/* Free shipping bar */}
        <FreeShippingBar cart={cart} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 px-5" data-lenis-prevent>
          {!cart || cart.lines.length === 0 ? (
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
                </>
              );
            })()
          )}
        </div>

        {/* Footer — sticky */}
        {cart && cart.lines.length > 0 && (
          <div className="border-t border-stroke px-5 py-4 flex flex-col gap-4">
            <DiscountInput />
            <CartNote />
            <CartSummary cart={cart} />
          </div>
        )}
      </div>
    </Dialog>
  );
}
