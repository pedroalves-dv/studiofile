"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import type { ShopifyCart } from "@/lib/shopify/types";

interface CartSummaryProps {
  cart: ShopifyCart;
}

export function CartSummary({ cart }: CartSummaryProps) {
  const { closeCart } = useCart();
  const subtotal = cart.cost.subtotalAmount;
  const total = cart.cost.totalAmount;
  const hasDiscount = cart.discountCodes.some((d) => d.applicable);

  const savings = hasDiscount
    ? cart.lines.reduce((sum, line) => {
        return (
          sum +
          line.discountAllocations.reduce(
            (s, da) => s + parseFloat(da.discountedAmount.amount),
            0,
          )
        );
      }, 0)
    : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Subtotal</span>
        <span className="text-sm">
          {formatPrice(subtotal.amount, subtotal.currencyCode)}
        </span>
      </div>

      {/* Discount row */}
      {hasDiscount && savings > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-success">Discount</span>
          <span className="text-sm text-success">
            -{formatPrice(savings.toString(), subtotal.currencyCode)}
          </span>
        </div>
      )}

      {/* Taxes & shipping note */}
      <p className="text-label text-muted">
        Taxes and shipping calculated at checkout
      </p>

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm font-medium">Total</span>
        <span className="text-sm font-medium">
          {formatPrice(total.amount, total.currencyCode)}
        </span>
      </div>

      {/* Checkout button */}
      <Button asChild fullWidth>
        <a href={cart.checkoutUrl}>Checkout</a>
      </Button>

      {/* Continue shopping */}
      <button
        onClick={closeCart}
        className="text-label text-muted hover:text-ink transition-colors text-center"
      >
        Continue Shopping
      </button>
    </div>
  );
}
