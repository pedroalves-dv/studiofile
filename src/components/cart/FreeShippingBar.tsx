'use client';

import { FREE_SHIPPING_THRESHOLD, CURRENCY_CODE } from '@/lib/constants';
import { formatPrice } from '@/lib/utils/format';
import type { ShopifyCart } from '@/lib/shopify/types';

interface FreeShippingBarProps {
  cart: ShopifyCart | null;
}

export function FreeShippingBar({ cart }: FreeShippingBarProps) {
  if (!cart || cart.lines.length === 0) return null;

  const subtotal = parseFloat(cart.cost.subtotalAmount.amount ?? '0');
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const currencyCode = cart.cost.subtotalAmount.currencyCode ?? CURRENCY_CODE;

  return (
    <div className="px-6 py-3 border-b border-border">
      <p className="text-label text-muted mb-2">
        {remaining > 0
          ? `You're ${formatPrice(remaining.toString(), currencyCode)} away from free shipping`
          : 'Free shipping unlocked! 🎉'}
      </p>
      <div className="h-0.5 bg-stone-200 w-full">
        <div
          className="h-full bg-success transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
