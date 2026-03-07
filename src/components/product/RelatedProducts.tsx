'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  products: ShopifyProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="section-padding border-t border-border">
      <div className="container-wide">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            You may also like
          </h2>
          {/* Desktop scroll arrows */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-2 border border-border hover:border-ink transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-2 border border-border hover:border-ink transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-12 md:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
        >
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: 'clamp(240px, 28vw, 320px)', scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
