'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroContent() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display uppercase text-6xl md:text-7xl leading-none text-ink mb-6">
        Objects made to last.
      </h1>
      <p className="font-serif text-4xl text-muted mb-8 max-w-md">
        Modular, functional home decor and furniture crafted through the magic of 3D printing.
        Designed in Paris, made to order.
      </p>
      <div className="flex gap-4 flex-wrap">
        <Link href="/shop">
          <Button variant="primary">Shop All</Button>
        </Link>
        <Link href="/collections">
          <Button variant="ghost">View Collections</Button>
        </Link>
      </div>
    </div>
  );
}
