// src/app/(main)/products/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify/products";
import { SITE_URL } from "@/lib/utils/seo";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SortSelect } from "@/components/search/SortSelect";
import { ProductsFilters } from "@/components/products/ProductsFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shop",
    description:
      "Browse all products from Studiofile — premium Paris 3D studio objects.",
    alternates: { canonical: `${SITE_URL}/products` },
  };
}

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type SortKey = "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED" | "RELEVANCE";

const SORT_MAP: Record<string, { sortKey: SortKey; reverse: boolean }> = {
  BEST_SELLING: { sortKey: "BEST_SELLING", reverse: false },
  PRICE_ASC: { sortKey: "PRICE", reverse: false },
  PRICE_DESC: { sortKey: "PRICE", reverse: true },
  CREATED: { sortKey: "CREATED", reverse: false },
  TITLE: { sortKey: "TITLE", reverse: false },
};

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

async function ShopContent({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const sortParam = (params.sort as string) || "BEST_SELLING";
  const { sortKey, reverse } = SORT_MAP[sortParam] ?? SORT_MAP.BEST_SELLING;

  // Build Shopify query string from active filters
  const queryParts: string[] = [];
  if (params.type) queryParts.push(`product_type:${params.type}`);
  if (params.availability === "in-stock")
    queryParts.push("available_for_sale:true");
  if (params.availability === "on-sale") queryParts.push("tag:Sale");

  let products: import("@/lib/shopify/types").ShopifyProduct[] = [];
  let error = false;

  try {
    const result = await getProducts({
      first: 24,
      after: (params.cursor as string) || undefined,
      sortKey,
      reverse,
      query: queryParts.length ? queryParts.join(" AND ") : undefined,
    });
    products = result.edges.map((edge) => edge.node);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    error = true;
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink/60 mb-2">
          Unable to load products at this time.
        </p>
        <p className="text-sm text-muted">Please try again later.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink/60 mb-2">No products found.</p>
        <p className="text-sm text-muted">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-label text-muted mb-6">{products.length} products</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const breadcrumbs = [{ label: "Products", href: "/products" }];

  return (
    <div className="px-site page-pt page-pb">
      {/* <Breadcrumb items={breadcrumbs} /> */}

      {/* Editorial header */}
      <header className="">
        <h1 className="text-7xl sm:text-9xl font-medium tracking-[-0.07em] leading-[0.9] mb-4 -ml-[5px]">
          Products
        </h1>
      </header>

      {/* Controls: filter toggles (left) + sort (right) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <Suspense fallback={null}>
          <ProductsFilters />
        </Suspense>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      {/* Product grid */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
