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
        mainElement.style.willChange = "transform";
        mainElement.style.transition =
          "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
        mainElement.style.transformOrigin = "top center";
        mainElement.style.transform = "scale(0.98)";
      }
    } else if (isVisible) {
      lenis?.start();
      let styleTimer: NodeJS.Timeout | undefined;
      if (mainElement) {
        mainElement.style.transform = "scale(1)";
        styleTimer = setTimeout(() => {
          mainElement.style.transform = "";
          mainElement.style.willChange = "";
          mainElement.style.transition = "";
          mainElement.style.transformOrigin = "";
          lenis?.resize();
        }, 400);
      }
      setIsClosing(true);
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 150);

      return () => {
        clearTimeout(styleTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, lenis, isVisible]);

  const hasItems = cart && cart.lines.length > 0;

  return (
    <Dialog open={isVisible} onOpenChange={closeCart}>
      <div
        className="w-full fixed top-[var(--header-height)] bottom-0 right-0 max-w-md flex flex-col bg-canvas sm:border-x sm:border-stroke sm:shadow-[-25px_30px_60px_-20px_rgba(0,0,0,0.03)]"
        style={{
          animation: `${isClosing ? "navSlideUp" : "navSlideDown"} 150ms ease-in-out${isClosing ? " forwards" : ""}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-stroke px-site">
          <h2 className="text-3xl font-semibold text-ink tracking-[-0.03em] leading-none translate-y-[2px]">
            Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ""}
          </h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={28} />
          </button>
        </div>

        {/* Free shipping bar */}
        <FreeShippingBar cart={cart} />

        {/* Body — scrollable, includes items + discount + note */}
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

                  {/* Discount + note scroll with items */}
                  <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-stroke -mx-2 px-site">
                    <DiscountInput />
                    <CartNote />
                  </div>
                </>
              );
            })()
          )}
        </div>

        {/* Footer — summary only, always visible */}
        {hasItems && (
          <div className="border-t border-stroke px-site">
            <CartSummary cart={cart} />
          </div>
        )}
      </div>
    </Dialog>
  );
}
