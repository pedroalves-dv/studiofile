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
    <section className="border-t border-border section-padding">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl tracking-tight mb-10">
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
