"use client";

import type { ShopifyProduct } from "@/lib/shopify/types";
import { HorizontalScrollRow } from "@/components/common/HorizontalScrollRow";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  products: ShopifyProduct[];
  currentHandle: string; // exclude from display in case recommendations include current product
}

export function RelatedProducts({
  products,
  currentHandle,
}: RelatedProductsProps) {
  const filtered = products
    .filter((p) => p.handle !== currentHandle)
    .slice(0, 4);
  if (filtered.length === 0) return null;

  return (
    <section className="px-site py-32">
      <div className="">
        <h2 className="text-6xl md:text-8xl tracking-[-0.07em] text-end">
          You may also like
        </h2>
        <HorizontalScrollRow>
          {filtered.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
