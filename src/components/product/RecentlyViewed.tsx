"use client";

import { useEffect, useState } from "react";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { HorizontalScrollRow } from "@/components/common/HorizontalScrollRow";
import { ProductCard } from "./ProductCard";

interface RecentlyViewedProps {
  currentHandle: string; // exclude this product from the list
}

export function RecentlyViewed({ currentHandle }: RecentlyViewedProps) {
  const { getHandles } = useRecentlyViewed();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    const handles = getHandles()
      .filter((h) => h !== currentHandle) // exclude current product
      .slice(0, 6);

    if (handles.length < 2) return; // only render if ≥ 2 items (after excluding current)

    fetch(`/api/products/batch?handles=${handles.join(",")}`)
      .then((r) => r.json())
      .then(setProducts)
      .catch((err) => console.error('[RecentlyViewed]', err));
  }, [currentHandle]);

  if (products.length < 2) return null;

  return (
    <section className="border-t border-border section-padding">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl tracking-tight mb-10">
          Recently Viewed
        </h2>
        <HorizontalScrollRow>
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
