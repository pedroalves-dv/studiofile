"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";

import type { ShopifyCart } from "@/lib/shopify/types";
import { ArrowButton } from "@/components/ui/ArrowButton";

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
        <span className="text-base text-muted">Subtotal</span>
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
      <p className="text-sm text-light">
        Taxes and shipping calculated at checkout
      </p>

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-3xl tracking-tighter font-semibold">Total</span>
        <span className="text-3xl tracking-tighter font-semibold">
          {formatPrice(total.amount, total.currencyCode)}
        </span>
      </div>

      {/* Checkout button */}
      <div className="flex justify-center">
        <ArrowButton
          href={cart.checkoutUrl}
          label="Checkout"
          className="w-full px-6 py-2 bg-ink text-white text-base font-medium tracking-[-0.04em] rounded-md border border-ink flex justify-center disabled:opacity-50"
        />
      </div>

      {/* Continue shopping */}
      <div className="flex justify-center">
        <ArrowButton
          onClick={closeCart}
          label="Continue Shopping"
          className="w-full px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md border border-ink disabled:opacity-50"
        />
      </div>
    </div>
  );
}
