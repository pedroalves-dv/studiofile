'use client';

import { X } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { useCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { TotemCartGroup } from './TotemCartGroup';
import { CartSummary } from './CartSummary';
import { DiscountInput } from './DiscountInput';
import { CartNote } from './CartNote';
import { FreeShippingBar } from './FreeShippingBar';
import { EmptyCart } from './EmptyCart';
import type { ShopifyCartLine } from '@/lib/shopify/types';

export function CartDrawer() {
  const { cart, isOpen, closeCart } = useCart();

  return (
    <Dialog open={isOpen} onOpenChange={() => closeCart()}>
      <div
        className="fixed inset-y-0 right-0 w-full max-w-md flex flex-col bg-canvas shadow-2xl"
        style={{ animation: 'slideInRight 150ms ease-in-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stroke">
          <h2 className="text-ink font-display uppercase tracking-tight text-2xl">
            Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ''}
          </h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free shipping bar */}
        <FreeShippingBar cart={cart} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.lines.length === 0 ? (
            <EmptyCart />
          ) : (() => {
            const groups = new Map<string, ShopifyCartLine[]>();
            const ungrouped: ShopifyCartLine[] = [];
            for (const line of cart.lines) {
              const buildId = line.attributes.find((a) => a.key === '_build_id')?.value;
              if (buildId) {
                groups.set(buildId, [...(groups.get(buildId) ?? []), line]);
              } else {
                ungrouped.push(line);
              }
            }
            return (
              <>
                {ungrouped.map((line) => <CartItem key={line.id} line={line} />)}
                {Array.from(groups.entries()).map(([buildId, groupLines]) => (
                  <TotemCartGroup key={buildId} lines={groupLines} />
                ))}
              </>
            );
          })()}
        </div>

        {/* Footer — sticky */}
        {cart && cart.lines.length > 0 && (
          <div className="border-t border-stroke px-6 py-4 flex flex-col gap-4">
            <DiscountInput />
            <CartNote />
            <CartSummary cart={cart} />
          </div>
        )}
      </div>
    </Dialog>
  );
}
