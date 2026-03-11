'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';

export function EmptyCart() {
  const { closeCart } = useCart();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center pb-24">
      <ShoppingBag size={48} className="text-light" />
      <div className='py-4'>
        <p className="font-display uppercase tracking-[-1px] text-6xl">Your cart is empty.</p>
        <p className="font-mono text-light mt-4">Add something beautiful.</p>
      </div>
      <Button onClick={closeCart} asChild>
        <Link href="/shop">Start Shopping</Link>
      </Button>
    </div>
  );
}
