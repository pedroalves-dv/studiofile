"use client";

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
    <div className="flex flex-col gap-2 pt-2 pb-4">
      {/* Subtotal */}
      {hasDiscount && savings > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-base text-muted">Subtotal</span>
          <span className="text-base">
            {formatPrice(subtotal.amount, subtotal.currencyCode)}
          </span>
        </div>
      )}

      {/* Discount row */}
      {hasDiscount && savings > 0 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-success">Discount</span>
          <span className="text-sm text-success">
            -{formatPrice(savings.toString(), subtotal.currencyCode)}
          </span>
        </div>
      )}

      {/* Taxes & shipping note */}
      <p className="text-xs sm:text-sm tracking-normal text-light px-2">
        Taxes and shipping calculated at checkout
      </p>

      {/* Total */}
      <div className="flex items-center justify-between pt-3.5 border-t border-stroke -mx-site px-7">
        <span className="text-3xl tracking-tighter font-semibold">Total</span>
        <span className="text-3xl tracking-tighter font-semibold">
          {formatPrice(total.amount, total.currencyCode)}
        </span>
      </div>

      {/* Checkout button */}
      <div className="flex justify-center px-2">
        <ArrowButton
          href={cart.checkoutUrl}
          label="Checkout"
          className="w-full py-2.5 sm:py-3 bg-ink text-white text-lg font-medium rounded-lg border border-ink flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Continue shopping */}
      <div className="flex justify-center px-2">
        <ArrowButton
          onClick={closeCart}
          label="Continue Shopping"
          className="w-full py-2.5 sm:py-3 bg-white text-ink text-lg font-medium tracking-tighter rounded-lg border border-ink disabled:opacity-50"
        />
      </div>
    </div>
  );
}
