import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ProductGrid } from "@/components/product/ProductGrid";

interface SearchResultsProps {
  products: ShopifyProduct[];
  query: string;
  totalCount?: number;
}

export function SearchResults({
  products,
  query,
  totalCount,
}: SearchResultsProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center space-y-6">
        <p className="text-3xl text-ink">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="text-sm text-muted max-w-sm mx-auto">
          Try a different search term, or browse our collections below.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/products"
            className="text-label text-muted hover:text-ink transition-colors underline"
          >
            Shop All
          </Link>
          <Link
            href="/collections"
            className="text-label text-muted hover:text-ink transition-colors underline"
          >
            View Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-label text-muted mb-6">
        {totalCount ?? products.length}{" "}
        {(totalCount ?? products.length) === 1 ? "result" : "results"} for
        &ldquo;{query}&rdquo;
      </p>
      <ProductGrid products={products} showCount={false} />
    </div>
  );
}
