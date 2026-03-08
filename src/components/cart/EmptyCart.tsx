'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';

export function EmptyCart() {
  const { closeCart } = useCart();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-12">
      <ShoppingBag size={48} className="text-muted opacity-40" />
      <div>
        <p className="font-display text-xl">Your cart is empty.</p>
        <p className="text-label text-muted mt-1">Add something beautiful.</p>
      </div>
      <Button onClick={closeCart} asChild>
        <Link href="/shop">Start Shopping</Link>
      </Button>
    </div>
  );
}
